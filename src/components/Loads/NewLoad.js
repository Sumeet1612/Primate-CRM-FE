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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as dayjs from "dayjs";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import { showNotification } from "../../api/Notification";

function NewLoad() {
  const [sendData, setSendData] = useState({
    loadNumber: "",
    shipperId: "0",
    loadDescription: "",
    bookingDate: new Date(),
    shipperRate: '',
    carrierRate: '',
    netMargin: "",
    brokerId: "",
    selfRate:'',
  });
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loggedInBroker, setloggedInBroker]=useState({userName:'XXX'});
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


  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;
    if(feildName === "shipperRate" || feildName === "carrierRate"){
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

  const handleSubmit = () => {
    //validate no field can be left blank
    let validationError = false;
    setValidationError({isError:false, errorField:""})

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
    

    //if successfull validation call api to create load
    if(!validationError){
      createLoad(sendData)
        .then((res) => {
          if (res.status === 200) {
            if(res.data?.validationMessage ==='Load already exists with the same Load Number'){
              showNotification('Load already exists with the same Load Number. LoadNumber cannot be duplicate',"error")
            }
            else if (res.data?.loadCreated) {
              setSendData({
                loadNumber: "",
                shipperId: "",
                loadDescription: "",
                shipperRate: '',
                carrierRate: '',
                netMargin: "",
                brokerId: "",
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
          <br/>
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
