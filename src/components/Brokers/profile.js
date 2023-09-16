import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "../../img/Avatar.jpg";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { editBroker, getBrokerOnId, getCurrency, handleApiError } from "../../api/api";
import { MenuItem, Select } from "@mui/material";
function Profile() {

  const [broker,setBroker]=useState({
    id:'',
    userName:'',
    alias:'',
    contactNumber:'',
    isActive:'',
    email:'',
    maxCommision:'',
    maxShare:'',
    officeEmail:'',
    officePhone:'',
    extn:'',
    roleId:2,
    residentialAddress:'',
    permanentAddress:'',
    tmsPassword:'',
    currencyId:0,
    phoneBill:'',
    whatsAppNumber:'',
    updatedOn:'',
    createdOn:'',
    accountDetails:[]
  });
  const [init,setinit]=useState({});
  const [account,setAccount]= useState([{
    id:'',
    bankName:'',
    ownerName:'',
    ifsc:'',
    pan:'',
    brokerId:'',
    isPrimary:true,
    updatedOn:''
  }])
  const [currency,setCurrency]= useState([]);

  const [others,setOthers]=useState({
    exchangeRate:'0'
  })
  const userId= sessionStorage.getItem("UserId");
  useEffect(()=>{
    
    let currencyData=[];

    //get currency list
    getCurrency()
    .then((res)=>{
      if(res.status===200){
        setCurrency(res.data);
        currencyData=res.data;
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })

    // get broker details
    if(userId>0){
      getBrokerOnId(userId)
      .then((res)=>{
        if(res.status===200){
          setBroker(res.data);
          setAccount(res.data?.accountDetails);
          setinit(res.data);
          const exchangeRate = currencyData.filter(x=>x.id===res.data?.currencyId);
          if(exchangeRate?.length>0){
            setOthers((prev)=>{
              return {...prev, exchangeRate:exchangeRate[0].exchangeRate}
            })
          }
        }
      })
      .catch((err)=>{
        handleApiError(err);
      })
    }

  },[userId]);


  const handleChange=(e)=>{
    let fname= e.target.name;
    let value= e.target.value;
    setBroker((state) => {
      return { ...state, [fname]: value };
    });
    if(fname==='currencyId'){
      let updatedExchangeRate= currency?.filter(x=>x.id===value)[0]?.exchangeRate
      setOthers((prev)=>{
        return {...prev, exchangeRate:updatedExchangeRate}
      })
    }
  }

  const handleAccount=(e,index)=>{
    let fname= e.target.name;
    let fValue=e.target.value;
    let additionalAccounts=[...account];
    additionalAccounts[index][fname]=fValue;
    setAccount(()=>{return additionalAccounts});
    setBroker((b)=>{
      return {
        ...b,accountDetails:additionalAccounts
      }
    })
  }

  const handleNewAccount=()=>{
    setAccount((prevAcnt)=>{
      return [...prevAcnt,
        {
          id:'',
          bankName:'',
          ownerName:'',
          ifsc:'',
          pan:'',
          brokerId:userId,
          isPrimary:false
        }
      ]
    })
  }

  const removeBank=(index)=>{
    console.log(index)
    let acnt=[...account]
    acnt.splice(index,1)
    setAccount(acnt)
    setBroker((prevState)=>{
      return {...prevState,accountDetails:acnt}
    })
  }

  const handleSave=()=>{
    const payload = [];
    Object.keys(broker).forEach((e) => {
      if (broker[e] !== init[e]) {
            payload.push({
              path: `/${e}`,
              op: "replace",
              value: broker[e]
            });
          
        }
      });
    console.log(payload)
    if(payload?.length>0){
      editBroker(broker.id,payload)
      .then((res)=>{
        console.log(res)
        if(res.status===200 && res.data===true){
          alert('Profile Updated')
          setinit(broker)
        }
      })
      .catch((err)=>{
        handleApiError(err);
    });
  }
}

  const handlePasswordChange=()=>{
    console.log('pass change')
  }

  return (
    <>
      <div className="profile PageLayout">
        <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "90%",
            fontSize: "20px",
          }}
        >
          Profile
        </h1>
        <br />
        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          {" "}
          Personal Details{" "}
        </h2>
        <div className="BrokerContactInfo1">
          <div className="info">
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Name"
              name="userName"
              value={broker.userName}
              onChange={handleChange}
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Contact Number"
              name="contactNumber"
              value={broker.contactNumber}
              onChange={handleChange}
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Whatsapp Number (if different)"
              name="whatsAppNumber"
              value={broker.whatsAppNumber}
              onChange={handleChange}
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="email"
              label="Email Address"
              name="email"
              value={broker.email}
              InputProps={{readOnly:true}}
            />{" "}
            <br />
          </div>
          <div>
            <Box
              component="img"
              sx={{
                height: 250,
                width: 250,
              }}
              alt="The house from the offer."
              src={Avatar}
            />
          </div>
        </div>
        <TextField
          size="small"
          sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
          type="text"
          label="Permanent Address"
          name="permanentAddress"
          value={broker.permanentAddress}
          onChange={handleChange}
        />
        <TextField
          size="small"
          sx={{ height: "50px", width: "90%", mr: "10%", mb: "2%" }}
          type="text"
          label="Residence Address"
          name="residentialAddress"
          value={broker.residentialAddress}
          onChange={handleChange}
        />
        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          {" "}
          Company Contact Details{" "}
        </h2>

        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="text"
          label="Alias Name"
          name="alias"
          value={broker.alias}
          onChange={handleChange}
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "3%", mb: "1%" }}
          type="text"
          label="OFS Contact Number"
          name="contact"
          InputProps={{readOnly:true}}
        />
        <TextField
          size="small"
          sx={{ height: "50px", width: "15%", mr: "3%", mb: "1%" }}
          type="text"
          label="Extension"
          name="extn"
          value={broker.extn}
          onChange={handleChange}
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="text"
          label="Cell Number"
          name="officePhone"
          value={broker.officePhone}
          onChange={handleChange}
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="email"
          label="Email Address"
          name="officeEmail"
          value={broker.officeEmail}
          onChange={handleChange}
        />

        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          {" "}BankInfo
          Bank Account Details{" "}
        </h2>
        <div className="BankDetails">
          {account ? account.map((acnt,index)=>{
            return (
          <div className="BankInfo" key={index}>
            <Button 
            variant="contained"
            color="error" 
            onClick={()=>removeBank(index)}>X</Button>

            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="Name of Bank"
              name="bankName"
              value={acnt.bankName}
              onChange={(e)=>handleAccount(e,index)}
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "3%", mb: "1%" }}
              type="text"
              label="Account Holder's Name"
              name="ownerName"
              value={acnt.ownerName}
              onChange={(e)=>handleAccount(e,index)}
            />

            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="Account Number"
              name="id"
              value={acnt.id}
              onChange={(e)=>handleAccount(e,index)}
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="IFSC Code"
              name="ifsc"
              value={acnt.ifsc}
              onChange={(e)=>handleAccount(e,index)}
            />

            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="PAN Number associated with account"
              name="pan"
              value={acnt.pan}
              onChange={(e)=>handleAccount(e,index)}
            />
          </div>)}
            ): <></> }
          <div className="AddButton">
            <Button
              variant="contained"
              color="success"
              size="large"
              endIcon={<AddIcon />}
              sx={{ mb: "3%", width: "50%" }}
              onClick={handleNewAccount}
            >
              Add
            </Button>
            <p fontSize="14px">Add another Bank Account</p>
          </div>
        </div>

        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          Miscellaneous Details{" "}
        </h2>

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
          type="text"
          label="Phone Bill(USD)"
          name="phoneBill"
          value={broker.phoneBill}
          onChange={handleChange}
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
          type="text"
          label="Commission %"
          name="maxCommision"
          value={broker.maxCommision}
          onChange={handleChange}
        />

        <Select
        name="currencyId"
        value={broker.currencyId}
        onChange={handleChange}>

            <MenuItem value='0' disabled>
              <em>Select Currency</em>
            </MenuItem>
            {currency.map((cur, index)=>{
              return(
                <MenuItem key={index} value={cur.id}>{cur.currencyName}</MenuItem>
              )
            })}
        </Select>

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "10%", mb: "1%" }}
          type="text"
          label="Exchange Rate"
          name="exchangeRate"
          value={others.exchangeRate}
          InputProps={{readOnly:true}}
        />
        <br />

        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "20%", mb: "1%", mr: "40%" }}
          onClick={handleSave}
        >
          Save Changes
        </Button>

        {/* <Button
          variant="contained"
          color="inherit"
          sx={{ width: "20%", mb: "1%", mr:"0%" }}        >
          Edit Profile
        </Button> */}

        <Button
          variant="contained"
          color="info"
          sx={{ width: "20%", mb: "1%", mr: "10%" }}
          onClick={handlePasswordChange}
        >
          Change Password
        </Button>
      </div>
    </>
  );
}
export default Profile;
