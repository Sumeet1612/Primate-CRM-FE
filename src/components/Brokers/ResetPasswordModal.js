import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";
import { handleApiError, resetPassword, sendOtp } from "../../api/api";
import { showNotification } from "../../api/Notification";

function ResetPasswordModal(props){
    const [form,setForm]=useState({
        email:'',
        newPassword:'',
        confirmNewPassword:'',
        otp:'',
        otpSent:false,
        loading:false,
        userId:''
    })

    const handleChange=(e)=>{
        let fname= e.target.name;
        let value= e.target.value;
        setForm((prev)=>{return {...prev,[fname]:value}});
    }

    const handleSendOtp=()=>{
        setForm((prev)=>{
            return {...prev, loading:true}
        });

        sendOtp(form.email)
        .then((res)=>{
            if(res.status===200){
                if(res.data?.message==='User does not exists OR is not Active'){
                    showNotification("User does not exists OR Is not Active","error");
                }
                else if(res.data?.message==='Some issue occurred. Please retry again'){
                    showNotification('Error while sending OTP',"error");
                }
                else{
                    setForm((prev)=>{
                        return {...prev, userId:res.data?.message.toString().substring(35), otpSent:true}
                    })
                }
            }
            setForm((prev)=>{
                return {...prev, loading:false}
            });
        })
        .catch((err)=>{
            setForm((prev)=>{
                return {...prev, loading:false}
            });
            handleApiError(err);
        })
    }

    const validateOtpAndSavePassword=()=>{ 
        setForm((prev)=>{
            return {...prev, loading:true}
        });

        if(form.password?.length < 8){
            showNotification("Password should be atleast 8 character long","error");
            setForm((prev)=>{
                return {...prev, loading:false}
            }); 
            return;
        }

        if(form.newPassword!==form.confirmNewPassword){
            showNotification("Password and NewPassword does not matches","error");
            setForm((prev)=>{
                return {...prev, loading:false}
            }); 
            return;
        }

        const postData={
            email:form.email,
            password:form.newPassword,
            otp:form.otp,
            userId:form.userId
        }

        resetPassword(postData)
        .then((res)=>{
            if(res.status===200){
                if(res.data?.message==="Invalid OTP"){
                    showNotification("OTP Expired or Invalid OTP. Please retry","warning");
                }
                else if(res.data?.message==="Password Updated Successfully"){
                    showNotification("Password Changed. Please login to proceed!!");
                    props.closeDialog();
                }
            }
            else{
                showNotification("Oops !! Something went wrong...","error")
            }
            setForm((prev)=>{
                return {...prev, loading:false}
            });
        })
        .catch((err)=>{
            setForm((prev)=>{
                return {...prev, loading:false}
            });
            handleApiError(err);
        })
    }

    return(
        <div>
            <h2>Reset Password</h2>

            <div hidden={!form.loading}>
                <LinearProgress/>
            </div>
            <br/>
            <TextField
                required
                sx={{ height: "70px", width: "70%" }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                type="email"
                id="email"
                label="Enter your Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={form.otpSent}
            />

            <Button
            variant="contained"
            color="info"
            sx={{ width: "100%", mb: "1%", mr: "5%", mt:"2%" }}
            onClick={handleSendOtp}
            disabled={form.otpSent || form.loading}
            > 
                Validate & Send OTP 
            </Button>

            <div hidden={!form.otpSent}>
            <TextField
                required
                sx={{ height: "70px", width: "45%", mr: "2%", mb:"1%",mt:"3%" }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                type="text"
                id="otp"
                label="Enter Email OTP"
                name="otp"
                value={form.otp}
                onChange={handleChange}
            />
            <br/>
            <TextField
                required
                sx={{ height: "70px", width: "45%", mr: "2%", mb:"1%" }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                type="password"
                id="newPassword"
                label="Enter New Password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
            />
            <TextField
                required
                sx={{ height: "70px", width: "45%" }}
                InputLabelProps={{ style: { fontSize: 15 } }}
                type="password"
                id="confirmNewPassword"
                label="Confirm New Password"
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
            />
            <br/>

            <Button
            variant="contained"
            color="info"
            sx={{ width: "100%", mb: "1%", mr: "5%", mt:"2%" }}
            onClick={validateOtpAndSavePassword}
            disabled={form.loading}
            > 
                Validate & Save Changes 
            </Button>
            </div>
        </div>
    )
}

export default ResetPasswordModal;