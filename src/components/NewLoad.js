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

  const handleMultipleBrokers = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;
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
  const [additionalBrokers, setAdditionalBrokers] = useState(0);

  const undoBroker = () => {
    setAdditionalBrokers((ab) => {
      return ab - 1;
    });
  };

  const manageBrokers = () => {
    setAdditionalBrokers((ab) => {
      return ab + 1;
    });
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
        Array.from(Array(additionalBrokers)).map((c, index) => {
          return (
            <>
              <select name="sharedWith" onChnage={handleMultipleBrokers}>
                <option value="Sahil">Sahil</option>
                <option value="Sumeet">Sumeet</option>
              </select>
              <input
                type="text"
                placeholder="sharedPercentage"
                name="sharedWith_Percentage"
                onChnage={handleMultipleBrokers}
              />
              <button onClick={undoBroker}> x </button>
              <br />
            </>
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
