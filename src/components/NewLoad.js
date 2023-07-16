import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    carrierPhone: "",
    carrierEmail: "",
    shipperRate: 0,
    carrierRate: 0,
    netMargin: "",
    invoicingDate: "",
    paymentDate: "",
    broker: "",
    sharedWith: [],
  });

  const handleMultipleBrokers = (e,index) => {
    let value = e.target.value;
    let feildName = e.target.name;
    const updatedBrokers=[...additionalBrokers]
    updatedBrokers[index][feildName]=value;
    setAdditionalBrokers(()=>{
      return updatedBrokers;
    })
    setSendData((prevState)=>{
      return {...prevState,sharedWith:additionalBrokers}
    })
  };

  const history = useNavigate();

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
    setAdditionalBrokers((state)=>{
      let x= [...state]
      x.pop()
      return x;
    })
  };

  const manageBrokers = () => {
    setAdditionalBrokers((state)=>{
      return [...state, {
        sharedWithName:"",
        sharedWithPercentage:""
      }]
    })
  };

  const handleSubmit = () => {
    console.log("button clicked");
    console.log(sendData);
    localStorage.setItem("sendData", JSON.stringify(sendData));
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
      carrierPhone: "",
      carrierEmail: "",
      shipperRate: 0,
      carrierRate: 0,
      netMargin: "",
      invoicingDate: "",
      paymentDate: "",
      broker: "",
      sharedWith: [],
    });
    history("/edit");
  };

  return (
    <div>
      <h1>Add Info for a New Load</h1>
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
        name="broker"
        value={sendData.broker}
        onChange={handleChange}
      />

      {additionalBrokers ? (
        additionalBrokers.map((ab,index) => {
          return (
            <div key={index}>
              <select name="sharedWithName" onChange={(e)=>handleMultipleBrokers(e,index)}>
                <option vaue="none">Please select Broker</option>
                <option value="Sahil" >Sahil</option>
                <option value="Sumeet">Sumeet</option>
              </select>
              <input
                type="text"
                placeholder="sharedPercentage"
                name="sharedWithPercentage"
                onChange={(e)=>handleMultipleBrokers(e,index)}
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
        name="carrierPhone"
        value={sendData.carrierPhone}
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
    </div>
  );
}
export default NewLoad;
