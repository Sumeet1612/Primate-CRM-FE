import { useEffect, useState } from "react";
import { editLoad, getLoadOnId, handleApiError  } from "../../api/api";
import { useParams } from "react-router";
import LinearProgress from '@mui/material/LinearProgress';

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
    brokerName: "",
    brokerId:"",
    createdOn:"",
    additionalBroker: [],
  });
  const [isEditable,setIsEditable]= useState(true);
  const [isLoading,setIsLoading]= useState(false);
  const [init,setInit]= useState([]);

  const {id}= useParams();

  useEffect(() => {
    setIsLoading(true);
    getLoadOnId(id)
    .then((res)=>{
      if(res.status===200){
      setData((state) => {
        return { ...state, ...res.data };
      });

      setInit(res.data);

      if(res.data?.paymentStatusId !==1){
        setIsEditable(false);
      }
      else{
        setIsEditable(true)
      }
      setIsLoading(false)
    }
    })
    .catch((err)=>{
      handleApiError(err);
      setIsLoading(false)
    })
  }, [id,isEditable]);

  const handleSubmit = () => {
    const payload=[];
    Object.keys(data).forEach(e=>{
      if(data[e]!==init[e]){
        payload.push(
          {
            "path": `/${e}`,
            "op": "replace",
            "value": `${data[e]}`
          }
        )
      }
    })
    console.log(payload)

    editLoad(init.loadNumber,payload)
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      handleApiError(err);
    })
  };

  const handlePayment=()=>{
    let payload=[
      {
        "path": "/paymentStatusId",
        "op": "replace",
        "value": 2
      }
    ]
    console.log(payload);

    editLoad(init.loadNumber,payload)
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      handleApiError(err);
    });

    setIsEditable(false);
  }

  const handleEdit=(e)=>{
    let value = e.target.value;
    let feildName = e.target.name;
    setData((state) => {
      return { ...state, [feildName]: value };
    });

    if (feildName === "shipperRate" || feildName === "carrierRate") {
      setData((state) => {
        let netMarginValue = state.shipperRate - state.carrierRate;
        return { ...state, margin: netMarginValue };
      });
    }
  }

  return (
    <div className="PageLayout">
      <h1>Edit Info for a New Load</h1>
      { isLoading ? <LinearProgress/> :<div>

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
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Enter Delivery Location"
        name="deliveryLocation"
        value={data.deliveryLocation}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="date"
        placeholder="Booking  Date"
        name="createdOn"
        value={data.createdOn.toString().slice(0,10)}
        readOnly
      />

      <input
        type="date"
        placeholder="Pickup Date"
        name="pickupDate"
        value={data.pickupDate.toString().slice(0,10)}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="date"
        placeholder="Delivery Date"
        name="deliveryDate"
        value={data.deliveryDate.toString().slice(0,10)}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Load Description"
        name="loadDescription"
        value={data.loadDescription}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Carrier MC Number"
        name="carrierMC"
        value={data.carrierMC}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Carrier Name"
        name="carrierName"
        value={data.carrierName}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Carrier POC"
        name="carrierPOC"
        value={data.carrierPOC}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Carrier Phone Number"
        name="carrierContact"
        value={data.carrierContact}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="email"
        placeholder="Carrier Email Address"
        name="carrierEmail"
        value={data.carrierEmail}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Shipper Rate"
        name="shipperRate"
        value={data.shipperRate}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Carrier Rate"
        name="carrierRate"
        value={data.carrierRate}
        onChange={handleEdit}
        readOnly={!isEditable}
      />

      <input
        type="text"
        placeholder="Net Margin"
        name="margin"
        value={data.margin}
        readOnly
      />

      <input
        type="date"
        placeholder="Invoicing  Date"
        name="invoiceDate"
        value={data.invoiceDate ? data.invoiceDate.toString().slice(0,10) : ""}
        readOnly
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

      <button onClick={handleSubmit} disabled={!isEditable}> Submit From </button>
      <button hidden={!isEditable} onClick={handlePayment}>Request for Payment</button>
      <br/>
      {!isEditable? <h3>Payment is already {init.paymentStatusId===2 ? "Requested": "Processed"}</h3>: <></>}
      </div>}
    </div>
  )
}
export default EditLoad;
