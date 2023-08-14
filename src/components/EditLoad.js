import { useEffect, useState } from "react";

function EditLoad() {
  const [data, setData] = useState({
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
  useEffect(() => {
    setData((state) => {
      let storedData = JSON.parse(localStorage.getItem("sendData"));
      return { ...state, ...storedData };
    });
  }, []);

  const handleSubmit = () => {
    console.log(data);
  };

  return (
    <div>
      <h1>Edit Info for a New Load</h1>
      <input
        type="text"
        placeholder="Enter Load Number"
        name="loadNumber"
        value={data.loadNumber}
        readOnly
      />

      <input
        type="text"
        placeholder="Enter Shipper Name"
        name="shipperName"
        value={data.shipperName}
        readOnly
      />

      <input
        type="text"
        placeholder="Enter Pickup Location"
        name="pickupLocation"
        value={data.pickupLocation}
        readOnly
      />

      <input
        type="text"
        placeholder="Enter Delivery Location"
        name="deliveryLocation"
        value={data.deliveryLocation}
        readOnly
      />

      <input
        type="date"
        placeholder="Booking  Date"
        name="bookingDate"
        value={data.bookingDate}
        readOnly
      />

      <input
        type="date"
        placeholder="Pickup Date"
        name="pickupDate"
        value={data.pickupDate}
        readOnly
      />

      <input
        type="date"
        placeholder="Delivery Date"
        name="deliveryDate"
        value={data.deliveryDate}
        readOnly
      />

      <input
        type="text"
        placeholder="Load Description"
        name="loadDescription"
        value={data.loadDescription}
        readOnly
      />

      <input
        type="text"
        placeholder="Carrier MC Number"
        name="carrierMC"
        value={data.carrierMC}
        readOnly
      />

      <input
        type="text"
        placeholder="Carrier Name"
        name="carrierName"
        value={data.carrierName}
        readOnly
      />

      <input
        type="text"
        placeholder="Carrier POC"
        name="carrierPOC"
        value={data.carrierPOC}
        readOnly
      />

      <input
        type="text"
        placeholder="Carrier Phone Number"
        name="carrierPhone"
        value={data.carrierPhone}
        readOnly
      />

      <input
        type="email"
        placeholder="Carrier Email Address"
        name="carrierEmail"
        value={data.carrierEmail}
        readOnly
      />

      <input
        type="text"
        placeholder="Shipper Rate"
        name="shipperRate"
        value={data.shipperRate}
        readOnly
      />

      <input
        type="text"
        placeholder="Carrier Rate"
        name="carrierRate"
        value={data.carrierRate}
        readOnly
      />

      <input
        type="text"
        placeholder="Net Margin"
        name="netMargin"
        value={data.netMargin}
        readOnly
      />

      <input
        type="date"
        placeholder="Invoicing  Date"
        name="invoicingDate"
        value={data.invoicingDate}
      />

      <input
        type="date"
        placeholder="Payment  Date"
        name="paymentDate"
        value={data.paymentDate}
      />

      <input
        type="text"
        placeholder="Broker"
        name="broker"
        value={data.broker}
      />

      {data.sharedWith ? (
        data.sharedWith.map((d, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                name="sharedWithName"
                value={d.sharedWithName}
                readOnly
              />
              <input
                type="text"
                name="sharedWithPercentage"
                value={d.sharedWithPercentage}
                readOnly
              />
            </div>
          );
        })
      ) : (
        <br />
      )}

      <button onClick={handleSubmit}> Submit From </button>
    </div>
  );
}
export default EditLoad;
