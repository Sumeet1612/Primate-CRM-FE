import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { callLogin, editBroker, handleApiError, sendOtp, validateOtp } from "../../api/api";
import LinearProgress from "@mui/material/LinearProgress";
import { showNotification } from "../../api/Notification";

function PasswordChangeModal(props){

    const [form,setForm]= useState({
        email:props.email,
        password:'',
        newPassword:'',
        confirmNewPassword:'',
        otp:''
    })

    const [obj,setObj]=useState({
        otpSent:false,
        loading:false
    })

    const ValidateAndGenrateOtp=()=>{
        setObj((prev)=>{
            return {...prev, loading:true}
        })
        let validationError=false;
        Object.keys(form).every(val=>{
            if(form[val]==="" && val!=="otp"){
                showNotification(`${val} cannot be empty`,"error")
                validationError=true;
                return false;
            }
            return true;
        })
        if(!validationError){
            if(form?.newPassword?.length < 8){
                showNotification("Password should be atleast 8 character long","error");
                setObj((prev)=>{
                    return {...prev, loading:false}
                })
                return;
            }
            if(form.newPassword!==form.confirmNewPassword){
                showNotification("Password And Confirm Password Does Not Matches. Please re-try!!","error")
                setObj((prev)=>{
                    return {...prev, loading:false}
                })
                return;
            }
            
            validateCurrentPassword()
            .then((res)=>{
                if(res.status===200 && res.data?.id !== -1){
                    sendOtp(form.email)
                    .then((otpRes)=>{
                        if(otpRes.status===200 && otpRes.data?.message===`OTP Sent Successfully to brokerId: ${props.brokerId}`){
                            setObj((prev)=>{
                                return {...prev,otpSent:true}
                            })
                        }
                        else{
                            showNotification("OTP Service failure. Please retry or contact Admin","error")
                        }
                        setObj((prev)=>{
                            return {...prev, loading:false}
                    })
                    })
                    .catch((otpErr)=>{
                        handleApiError(otpErr);
                        setObj((prev)=>{
                            return {...prev, loading:false}
                    })
                    })
                }
                else{
                    showNotification("Incorrect Credential !!","error")
                }
            })
            .catch((err)=>{
                handleApiError(err);
                setObj((prev)=>{
                    return {...prev, loading:false}
            })
            })
        }
    }

    const ValidateAndChange=()=>{
        const payload=[{
            path:"/password",
            op:"replace",
            value:form.newPassword
        }]
        setObj((prev)=>{
            return {...prev, loading:true}
        })

        validateOtp(form.email,form.otp)
        .then((res)=>{
            if(res.status===200 && res.data?.message===`Validation successfull for brokerId: ${props.brokerId}`){
                //validation successfull hence calling broker patch API to update password

                editBroker(props.brokerId,payload)
                .then((brokerRes)=>{
                    if(brokerRes.status===200){
                        showNotification("Password Changed!!")
                        props.dialog();
                    }
                    setObj((prev)=>{
                        return {...prev, loading:false}
                    })
                })
                .catch((brokerErr)=>{
                    handleApiError(brokerErr)
                    setObj((prev)=>{
                        return {...prev, loading:false}
                    })
                })
            }
            else{
                showNotification("Incorrect OTP","error")
                setObj((prev)=>{
                    return {...prev, loading:false}
                })
            }
        })
        .catch((err)=>{
            handleApiError(err);
            setObj((prev)=>{
                return {...prev, loading:false}
            })
        })
    }

    const validateCurrentPassword=()=>{
        var loginData={
            email: form.email,
            password: form.password
          }
          return callLogin(loginData);
    }

    const handleChange=(e)=>{
        let fname= e.target.name;
        let value= e.target.value;
        setForm((prev)=>{return {...prev,[fname]:value}});
    }

    return(
        <div>
        <h3>Reset Password</h3>
        <br/>
        {obj.loading? <LinearProgress/>:<></>}
        <br/>
        <TextField
        required
        sx={{ height: "70px", width: "70%" }}
        InputLabelProps={{ style: { fontSize: 15 } }}
        type="text"
        id="passChg_emailId"
        label="Enter your Email"
        name="passChg_emailId"
        value={props.email}
        disabled
      />
      <br/>
       <TextField
        required
        sx={{ height: "70px", width: "70%" }}
        InputLabelProps={{ style: { fontSize: 15 } }}
        type="password"
        id="password"
        label="Enter your Current Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        disabled={obj.otpSent}
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
        disabled={obj.otpSent}
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
        disabled={obj.otpSent}
      />
      <br/>
        <Button
          variant="contained"
          color="info"
          sx={{ width: "40%", mb: "1%", mr: "5%", mt:"2%" }}
          onClick={ValidateAndGenrateOtp}
          disabled={obj.loading}
        >
          Generate OTP
        </Button>

        {obj.otpSent && 
            <TextField
            required
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="otp"
            label="Enter OTP from Email"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            disabled={obj.loading}
            />
        }

      <br/>
    {obj.otpSent &&
        <Button
          variant="contained"
          color="info"
          sx={{ width: "80%", mb: "1%", mr: "5%", mt:"2%" }}
          onClick={ValidateAndChange}
          disabled={obj.loading}
        >
          Validate OTP & Save Changes
        </Button>
    }

      </div>
    )
}

export default PasswordChangeModal;