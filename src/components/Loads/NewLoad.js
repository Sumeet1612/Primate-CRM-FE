import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import { createLoad, getAllShippers, handleApiError, loadActiveBrokers } from "../../api/api";

function NewLoad() {
  const [sendData, setSendData] = useState({
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
    shipperRate: 0,
    carrierRate: 0,
    netMargin: "",
    invoicingDate: "",
    paymentDate: "",
    brokerId: "",
    additionalBroker: [],
  });
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [brokerName, setBrokerName] = useState("XXX");
  const [isLoading, setIsLoading]=useState(false);

  const history = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("UserId")) {
      setIsLoading(true)

      //load shippers in dropdown
      getAllShippers()
      .then((res)=>{
        setShippers(res.data);
      })
      .catch((err)=>{
        handleApiError(err)
      });

      //load all active brokers in drowndown fro additional broker names
      loadActiveBrokers()
        .then((res) => {
          setAvailableBrokers(res.data);
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err);
          handleApiError(err);
        });
      
        //auto set current loggedIn user as the load creater
        setSendData((state) => {
          return { ...state, brokerId: sessionStorage.getItem("UserId") };
        });
    }
  }, []);

  useEffect(() => {
    if (availableBrokers.length > 0) {
      setBrokerName(() => {
        return availableBrokers.filter(
          (x) => x.id === parseInt(sessionStorage.getItem("UserId"))
        )[0].userName;
      });
    }
  }, [availableBrokers]);

  const handleMultipleBrokers = (e, index) => {
    let value = e.target.value;
    let feildName = e.target.name;
    const updatedBrokers = [...additionalBrokers];
    updatedBrokers[index][feildName] = value;
    setAdditionalBrokers(() => {
      return updatedBrokers;
    });
    setSendData((prevState) => {
      return { ...prevState, additionalBroker: additionalBrokers };
    });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;
    setSendData((state) => {
      return { ...state, [feildName]: value };
    });

    if (feildName === "shipperRate" || feildName === "carrierRate") {
      setSendData((state) => {
        let netMarginValue = state.shipperRate - state.carrierRate;
        return { ...state, netMargin: netMarginValue };
      });
    }
  };
  const [additionalBrokers, setAdditionalBrokers] = useState([]);

  const undoBroker = () => {
    setAdditionalBrokers((state) => {
      let x = [...state];
      x.pop();
      return x;
    });
  };

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
    console.log(sendData);
    createLoad(sendData)
      .then((res) => {
        if (res.status === 200) {
          if(res.data?.additionalBrokersCreated && res.data?.loadCreated){
          alert("Load created successfully");
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
            shipperRate: 0,
            carrierRate: 0,
            netMargin: "",
            invoicingDate: "",
            paymentDate: "",
            brokerId: "",
            additionalBroker: [],
          });
          history("/Primate-CRM-FE/");
        }
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  return (
    <div className="PageLayout">
      <h1>Add Info for a New Load</h1>
      { isLoading ? <LinearProgress/> :<div>
      <TextField id="outlined-basic"
        type="text"
        label="Enter Load Number"
        name="loadNumber"
        value={sendData.loadNumber}
        onChange={handleChange}
      />

      <select name="shipperId" onChange={handleChange}>
      <option value='0'>Select Shipper</option>
        {shippers.map(s=>{
          return(
            <option key={s.id} value= {s.id}>{s.shipperName}</option>
          )
        })}
      </select>

      <TextField id="outlined-basic"
        type="text"
        label="Enter Pickup Location"
        name="pickupLocation"
        value={sendData.pickupLocation}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Enter Delivery Location"
        name="deliveryLocation"
        value={sendData.deliveryLocation}
        onChange={handleChange}
      />
      <input
        type="date"
        label="Booking  Date"
        name="bookingDate"
        value={sendData.bookingDate}
        onChange={handleChange}
      />
      <input
        type="date"
        label="Pickup Date"
        name="pickupDate"
        value={sendData.pickupDate}
        onChange={handleChange}
      />
      <input
        type="date"
        label="Delivery Date"
        name="deliveryDate"
        value={sendData.deliveryDate}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Load Description"
        name="loadDescription"
        value={sendData.loadDescription}
        onChange={handleChange}
      />

      <TextField id="outlined-basic"
        type="text"
        label="Broker"
        name="brokerId"
        value={brokerName}
        readOnly
      />

      {additionalBrokers ? (
        additionalBrokers.map((ab, index) => {
          return (
            <div key={index}>
              <select
                name="brokerId"
                onChange={(e) => handleMultipleBrokers(e, index)}
              >
                <option value="">Select an option</option>
                {availableBrokers.map((ab) => {
                  return (
                    <option key={ab.id} value={ab.id}>
                      {ab.userName}
                    </option>
                  );
                })}
              </select>
              <TextField id="outlined-basic"
                type="text"
                label="sharedPercentage"
                name="sharedPercentage"
                onChange={(e) => handleMultipleBrokers(e, index)}
              />
              <button onClick={undoBroker}> x </button>
              <br />
            </div>
          );
        })
      ) : (
        <br />
      )}
      <button onClick={manageBrokers}>Add Broker</button>
      <TextField id="outlined-basic"
        type="text"
        label="Carrier MC Number"
        name="carrierMC"
        value={sendData.carrierMC}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Carrier Name"
        name="carrierName"
        value={sendData.carrierName}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Carrier POC"
        name="carrierPOC"
        value={sendData.carrierPOC}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Carrier Phone Number"
        name="carrierContact"
        value={sendData.carrierContact}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="email"
        label="Carrier Email Address"
        name="carrierEmail"
        value={sendData.carrierEmail}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Shipper Rate"
        name="shipperRate"
        value={sendData.shipperRate}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Carrier Rate"
        name="carrierRate"
        value={sendData.carrierRate}
        onChange={handleChange}
      />
      <TextField id="outlined-basic"
        type="text"
        label="Net Margin"
        name="netMargin"
        value={sendData.netMargin}
        readOnly
      />

      <button onClick={handleSubmit}> Submit From </button>
      </div>}
    </div>
  );
}
export default NewLoad;
