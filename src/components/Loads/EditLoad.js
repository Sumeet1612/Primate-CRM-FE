import { useEffect, useState } from "react";
import { getLoadOnId, handleApiError  } from "../../api/api";
import { useParams } from "react-router";

function EditLoad() {
  const [data, setData] = useState({
    loadNumber: "",
    shipperName: "",
    pickupLocation: "",
    deliveryLocation: "",
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
    margin: "",
    invoiceDate: "",
    paymentDate: "",
    brokerName: "",
    brokerId:"",
    createdOn:"",
    additionalBroker: [],
  });
  const {id}= useParams();

  useEffect(() => {
    getLoadOnId(id)
    .then((res)=>{
      if(res.status===200){
      setData((state) => {
        return { ...state, ...res.data };
      });
    }
    })
    .catch((err)=>{
      handleApiError(err);
    })

  }, [id]);

  const handleSubmit = () => {
    console.log(data);
  };
  const handleEdit=(event)=>{
    console.log(event.target.value)
  }

  return (
    <div className="PageLayout">
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
        value={data.createdOn.toString().slice(0,10)}
        readOnly
      />

      <input
        type="date"
        placeholder="Pickup Date"
        name="pickupDate"
        value={data.pickupDate.toString().slice(0,10)}
        readOnly
      />

      <input
        type="date"
        placeholder="Delivery Date"
        name="deliveryDate"
        value={data.deliveryDate.toString().slice(0,10)}
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
        value={data.carrierContact}
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
        value={data.margin}
        readOnly
      />

      <input
        type="date"
        placeholder="Invoicing  Date"
        name="invoiceDate"
        value={data.invoiceDate ? data.invoiceDate : ""}
        onChange={handleEdit}
      />

      <input
        type="date"
        placeholder="Payment  Date"
        name="paymentDate"
        value={data.paymentDate}
        onChange={handleEdit}
      />

      <input
        type="text"
        placeholder="Broker"
        name="broker"
        value={data.brokerName}
        readOnly
      />

      {data.additionalBroker ? (
        data.additionalBroker.map((d, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                name="sharedWithName"
                value={d.brokerName}
                readOnly
              />
              <input
                type="text"
                name="sharedWithPercentage"
                value={d.sharedPercentage}
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
