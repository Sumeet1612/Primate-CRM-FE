import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import {
  createLoad,
  getAllShippersForBroker,
  handleApiError,
  loadActiveBrokers,
} from "../../api/api";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as dayjs from "dayjs";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import { showNotification } from "../../api/Notification";

function NewLoad() {
const disableAdditionalBroker= process.env.REACT_APP_DISABLE_ADDITIONAL_BROKER ==="Disable"?true:false;
  const [sendData, setSendData] = useState({
    loadNumber: "",
    shipperId: "0",
    loadDescription: "",
    pickupLocation: "",
    deliveryLocation: "",
    bookingDate: "",
    pickupDate: "",
    deliveryDate: "",
    carrierMC: "",
    carrierName: "",
    carrierPOC: "",
    carrierContact: "",
    carrierEmail: "",
    shipperRate: '',
    carrierRate: '',
    netMargin: "",
    brokerId: "",
    selfRate:'',
    additionalBroker: [],
  });
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loggedInBroker, setloggedInBroker]=useState({userName:'XXX'});
  const [additionalBrokers, setAdditionalBrokers] = useState([]);
  const history=useNavigate();
  const [message, setMessage]=useState({
    isLoading:false,
    maxShareError:'',
    disabled:false
  })

  const [validationError, setValidationError] = useState({
    isError:false,
    errorField:''
  });
  const dateFields=['bookingDate','pickupDate','deliveryDate']

  useEffect(() => {
    const userId= loggedInUserId();
    const userRole= loggedInUserRole();
    if(isNaN(userId) || isNaN(userRole)){
      history("/login")
      return;
    }
    if (userId) {
      setMessage((prev)=>{
        return {...prev, isLoading:true}
      })

      //load shippers in dropdown
      getAllShippersForBroker(userId)
        .then((res) => {
          if(res.status===200){
            setShippers(res.data);
          }
        })
        .catch((err) => {
          handleApiError(err);
        });

      //load all active brokers in drowndown for additional broker names
      loadActiveBrokers()
        .then((res) => {
          if(res.status===200){
            setAvailableBrokers(res.data);
          }
          setMessage((prev)=>{
            return {...prev, isLoading:false}
          })
        })
        .catch((err) => {
          handleApiError(err);
        });

      //auto set current loggedIn user as the load creater
      setSendData((state) => {
        return { ...state, brokerId: userId };
      });
    }
  }, [history]);

  useEffect(() => {
    if (availableBrokers.length > 0) {
      //get current loggedIn user detail
      let loggedInUserDetail= availableBrokers.filter((x) => x.id === loggedInUserId())[0];

      setloggedInBroker(() => {
        return loggedInUserDetail;
      });

      //set self rate = max commission by default. Is shared will be recalculated
      setSendData((prev)=>{
        return {...prev, selfRate:loggedInUserDetail?.maxCommision}
      })
    }
  }, [availableBrokers]);

  const handleMultipleBrokers = (e, index) => {
    let value = e.target.value;
    let feildName = e.target.name;
    const updatedBrokers = [...additionalBrokers];
    updatedBrokers[index][feildName] = value;
    let sum=0;
    updatedBrokers.forEach(element => {
      if(element.sharedPercentage > 0){
        sum+= +element.sharedPercentage;
        if(sum>loggedInBroker.maxCommision){
          setMessage((prev)=>{
            return {...prev, maxShareError:'You cannot share more than your commission', disabled:true}
          })
        }
        else{
          setMessage((prev)=>{
            return {...prev, maxShareError:'', disabled:false}
          })
        }
      }
    });
    setAdditionalBrokers(() => {
      return updatedBrokers;
    });
    setSendData((prevState) => {
      return { ...prevState, additionalBroker: additionalBrokers, selfRate:loggedInBroker.maxCommision-sum };
    });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;
    if(feildName === "shipperRate" || feildName === "carrierRate" || feildName==="carrierMC"){
      if(isNaN(value)){
        showNotification("Only Numbers are allowed","warning")
        return;
      }
    }
    setSendData((state) => {
      return { ...state, [feildName]: value };
    });

    if (feildName === "shipperRate" || feildName === "carrierRate") {
      setSendData((state) => {
        let netMarginValue = +state.shipperRate - +state.carrierRate;
        return { ...state, netMargin: Number(netMarginValue.toFixed(2)) };
      });
    }
  };
  

  const undoBroker = (index) => {
    let sum=0;
    let arr = [...additionalBrokers];
    arr.splice(index, 1);
    arr.forEach(x=>{
      sum+= +x.sharedPercentage
    })
    if(sum <= loggedInBroker.maxCommision){
      setMessage((prev)=>{
        return {...prev, maxShareError:'', disabled:false}
      })
    }
    setAdditionalBrokers(arr);
    setSendData((prevState) => {
      return { ...prevState, additionalBroker: arr, selfRate:loggedInBroker.maxCommision-sum };
    });
  };

  //TODO: Can be removed.
  const manageBrokers = () => {
    setAdditionalBrokers((state) => {
      return [
        ...state,
        {
          brokerId: "",
          sharedPercentage: "",
        },
      ];
    });
  };

  const handleSubmit = () => {
    //validate no field can be left blank
    let validationError = false;
    setValidationError({isError:false, errorField:""})
    if(sendData['pickupDate'] > sendData['deliveryDate']){
      showNotification("Pickup Date cannot be after Delivery Date","error")
      setValidationError({isError:true, errorField:'pickupDate'})
      validationError=true;
    }

    if(sendData['loadNumber']===""){
      showNotification("Load Number cannot be left blank","error")
      setValidationError({isError:true, errorField:'loadNumber'})
      validationError=true;
    }
    if(sendData['shipperRate']===""){
      showNotification("Shipper Rate cannot be empty","error")
      setValidationError({isError:true, errorField:'shipperRate'})
      validationError=true;
    }
    if(sendData['carrierRate']===""){
      showNotification("Carrier Rate cannot be empty","error")
      setValidationError({isError:true, errorField:'carrierRate'})
      validationError=true;
    }
    if(sendData['shipperId']==="0"){
      showNotification("Cannot create load with Shipper","error")
      setValidationError({isError:true, errorField:'shipperId'})
      validationError=true;
    }
    
    //TODO: Can be removed, if additional broker is removed from requirement:
    if(sendData.additionalBroker.length>0){
      sendData.additionalBroker.forEach(ab=>{
        Object.keys(ab).every(k=>{
          if(ab[k]===''){
            validationError=true;
            return false;
          }
          return true;
        })
      })
    }

    //if successfull validation call api to create load
    if(!validationError){
      createLoad(sendData)
        .then((res) => {
          if (res.status === 200) {
            if(res.data?.validationMessage ==='Load already exists with the same Load Number'){
              showNotification('Load already exists with the same Load Number. LoadNumber cannot be duplicate',"error")
            }
            else if (res.data?.loadCreated) {
              if(res.data?.additionalBrokersCreated){
                showNotification("Load created successfully");
              }
              else{
                showNotification('Load is created without Brokerage Share');
              }
              setSendData({
                loadNumber: "",
                shipperId: "",
                pickupLocation: "",
                deliveryLocation: "",
                bookingDate: "",
                pickupDate: "",
                deliveryDate: "",
                loadDescription: "",
                carrierMC: "",
                carrierName: "",
                carrierPOC: "",
                carrierContact: "",
                carrierEmail: "",
                shipperRate: '',
                carrierRate: '',
                netMargin: "",
                brokerId: "",
                additionalBroker: [],
              });
              history("/");
            }
          }
        })
        .catch((err) => {
          handleApiError(err);
        });
    }
    else{
      showNotification('Please complete the form to create your Load',"warning")
    }
  };

  const AdditionalBrokerHTML=()=>{
    return (<>
    {disableAdditionalBroker? <>
      <Button
        variant="contained"
        color="success"
        onClick={manageBrokers}
        endIcon={<AddIcon />}
        sx={{ width: "10%", mb:"1%" }}
      >
        Add
      </Button>
      <br/>
      <i
        style={{
          marginLeft: "15px",
          fontSize: "15px",
          wordWrap: "break-word",
        }}
      >
        Click the button to add Additional Broker (if other than you) and share Commission Percentage
      </i>
      <br />

      {additionalBrokers ? (<div>
        {additionalBrokers.map((additionalBroker, index) => {
          return (
            <div key={index}>
              <Select
                sx={{ height: "55px", width: "20%", mr: "4.5%", mb:"1%"}}
                name="brokerId"
                value={additionalBroker.brokerId}
                onChange={(e) => handleMultipleBrokers(e, index)}
              >
                <MenuItem value="">Select an option</MenuItem>
                {availableBrokers.map((availableBroker) => {
                  return (
                    <MenuItem
                      key={availableBroker.id}
                      value={availableBroker.id}
                    >
                      {availableBroker.brokerAlias}
                    </MenuItem>
                  );
                })}
              </Select>
              <TextField
                required
                sx={{ height: "70px", width: "20%", mr: "3%", mb:"1%" }}
                type="text"
                id="sharedPercentage"
                label="Shared Percentage"
                name="sharedPercentage"
                value={additionalBroker.sharedPercentage}
                onChange={(e) => handleMultipleBrokers(e, index)}
              />
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  undoBroker(index);
                }}
              >
                {" "}
                X{" "}
              </Button>
              <br />
            </div>
          );
        })}
        <h6 color="Red">{message.maxShareError}</h6>
        </div>
      ) : (
        <br />
      )}
      </>:<></>}
      <br/>
    </>)
   
  }

  return (
    <div className="PageLayout">
      <h1
        style={{
          color: "#fff",
          backgroundColor: "#00b7aa",
          marginBottom: "2%",
          padding: "2%",
          width: "86%",
          fontSize: "20px",
        }}
      >
        Add a New Load
      </h1>
      {message.isLoading ? (
        <LinearProgress />
      ) : (
        <div>
          <TextField
            error={validationError.errorField==="loadNumber"? true:false}
            required  
            sx={{ height: "70px", width: "20%", mr: "5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="loadNumber"
            label="Enter Load Number"
            name="loadNumber"
            value={sendData.loadNumber}
            onChange={handleChange}
          />

          <Select
            name="shipperId"
            error={validationError.errorField==="shipperId"? true:false}
            sx={{ height: "55px", width: "30%", mr: "5%", mb:"1%" , 
              color:validationError.errorField==="shipperId"?'red':'black'}}
            value={sendData.shipperId}
            onChange={handleChange}
            id='shipperId'
          >
            <MenuItem value="0" disabled>Select Shipper</MenuItem>
            {shippers.map((s) => {
              return (
                <MenuItem key={s.id} value={s.id}>
                  {s.shipperName}
                </MenuItem>
              );
            })}
          </Select>
          
          <TextField
            required
            sx={{ height: "70px", width: "30%", mr: "10%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="loadDescription"
            label="Load Description"
            name="loadDescription"
            value={sendData.loadDescription}
            onChange={handleChange}
          />
          <br />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="pickupLocation"
            label="Enter Pickup City, State"
            name="pickupLocation"
            value={sendData.pickupLocation}
            onChange={handleChange}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="deliveryLocation"
            label="Enter Delivery City, State"
            name="deliveryLocation"
            value={sendData.deliveryLocation}
            onChange={handleChange}
          />
          <br />

          <DatePicker
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb:"1%" }}
            id="bookingDate"
            label="Booking Date"
            name="bookingDate"
            value={sendData.bookingDate ? dayjs(sendData.bookingDate) : null}
            onChange={(date) => {
              setSendData((prev) => {
                return {
                  ...prev,
                  bookingDate: dayjs(date).format("MM/DD/YYYY"),
                };
              });
            }}
          />

          <DatePicker
          error={validationError.errorField==="pickupDate"? true:false}
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb:"1%" }}
            id="pickupDate"
            name="pickupDate"
            label="Pickup Date"
            value={sendData.pickupDate ? dayjs(sendData.pickupDate) : null}
            onChange={(date) => {
              setSendData((prev) => {
                return {
                  ...prev,
                  pickupDate: dayjs(date).format("MM/DD/YYYY"),
                };
              });
            }}
          />

          <DatePicker
            sx={{ height: "70px", width: "27%", mr: "10%", mb:"1%" }}
            id="deliveryDate"
            label="Delivery Date"
            name="deliveryDate"
            value={sendData.deliveryDate ? dayjs(sendData.deliveryDate) : null}
            onChange={(date) => {
              setSendData((prev) => {
                return {
                  ...prev,
                  deliveryDate: dayjs(date).format("MM/DD/YYYY"),
                };
              });
            }}
          />
          <br />
          {validationError.isError && dateFields.find(x=>x===validationError.errorField) ? 
          <p style={{color:'red'}}>{validationError.errorField
            .replace(/([a-z])([A-Z])/g, '$1 $2') 
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
            .replace(/^./, str => str.toUpperCase())} canot be empty</p>: <></>}
          <br/>

          <TextField
            sx={{ height: "70px", width: "20%", mr: "3%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="broker"
            label="Broker"
            name="brokerId"
            value={loggedInBroker?.userName}
            readOnly
          />

{AdditionalBrokerHTML()}
          <TextField
            sx={{ height: "70px", width: "20%", mr: "5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierMC"
            label="Carrier MC Number"
            name="carrierMC"
            value={sendData.carrierMC}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "70px", width: "30%", mr: "5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierName"
            label="Carrier Name"
            name="carrierName"
            value={sendData.carrierName}
            onChange={handleChange}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierPOC"
            label="Carrier POC"
            name="carrierPOC"
            value={sendData.carrierPOC}
            onChange={handleChange}
          />
          <br />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierContact"
            label="Carrier Phone Number"
            name="carrierContact"
            value={sendData.carrierContact}
            onChange={handleChange}
          />

          <TextField
            sx={{ height: "70px", width: "55%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="email"
            id="carrierEmail"
            label="Carrier Email Address"
            name="carrierEmail"
            value={sendData.carrierEmail}
            onChange={handleChange}
          />
          <br />

          <TextField
            required
            error={validationError.errorField==="shipperRate"? true:false}
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="shipperRate"
            label="Shipper Rate"
            name="shipperRate"
            value={sendData.shipperRate}
            onChange={handleChange}
          />

          <TextField
            required
            error={validationError.errorField==="carrierRate"? true:false}
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierRate"
            label="Carrier Rate"
            name="carrierRate"
            value={sendData.carrierRate}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb:"1%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="netmargin"
            label="Net Margin"
            name="netMargin"
            value={sendData.netMargin}
            readOnly
          />
          <br />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "10%", ml: "40%" }}
            disabled={message.disabled}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
export default NewLoad;
