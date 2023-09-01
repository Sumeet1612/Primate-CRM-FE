import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import { createLoad, handleApiError, loadActiveBrokers } from "../../api/api";

function NewLoad() {
  const [sendData, setSendData] = useState({
    loadNumber: "",
    shipperName: "",
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
  const [brokerName, setBrokerName] = useState("XXX");
  const [isLoading, setIsLoading]=useState(false);

  const history = useNavigate();
  useEffect(() => {    
    console.log("start test");
    if (sessionStorage.getItem("UserId")) {
      setIsLoading(true)
      loadActiveBrokers()
        .then((res) => {
          setAvailableBrokers(res.data);
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err);
          handleApiError(err);
        });
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
        console.log(res);
        if (res.status === 200) {
          if(res.data?.additionalBrokersCreated && res.data?.loadCreated){
          alert("Load created successfully");
          setSendData({
            loadNumber: "",
            shipperName: "",
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
      <input
        type="text"
        placeholder="Enter Load Number"
        name="loadNumber"
        value={sendData.loadNumber}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Enter Shipper Name"
        name="shipperName"
        value={sendData.shipperName}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Enter Pickup Location"
        name="pickupLocation"
        value={sendData.pickupLocation}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Enter Delivery Location"
        name="deliveryLocation"
        value={sendData.deliveryLocation}
        onChange={handleChange}
      />
      <input
        type="date"
        placeholder="Booking  Date"
        name="bookingDate"
        value={sendData.bookingDate}
        onChange={handleChange}
      />
      <input
        type="date"
        placeholder="Pickup Date"
        name="pickupDate"
        value={sendData.pickupDate}
        onChange={handleChange}
      />
      <input
        type="date"
        placeholder="Delivery Date"
        name="deliveryDate"
        value={sendData.deliveryDate}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Load Description"
        name="loadDescription"
        value={sendData.loadDescription}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Broker"
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
              <input
                type="text"
                placeholder="sharedPercentage"
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
      <input
        type="text"
        placeholder="Carrier MC Number"
        name="carrierMC"
        value={sendData.carrierMC}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Carrier Name"
        name="carrierName"
        value={sendData.carrierName}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Carrier POC"
        name="carrierPOC"
        value={sendData.carrierPOC}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Carrier Phone Number"
        name="carrierContact"
        value={sendData.carrierContact}
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="Carrier Email Address"
        name="carrierEmail"
        value={sendData.carrierEmail}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Shipper Rate"
        name="shipperRate"
        value={sendData.shipperRate}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Carrier Rate"
        name="carrierRate"
        value={sendData.carrierRate}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Net Margin"
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
