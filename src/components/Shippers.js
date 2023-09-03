import { useState } from "react";
import { addShipper, handleApiError } from "../api/api";

function Shippers() {
  const [shipperData, setShipperData] = useState({
    shipperName: "",
    address: "",
    poc: "",
    contact: "",
    email: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;

    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  };

  const handleSubmit = () => {
    addShipper(shipperData)
    .then((res)=>{
      if(res.status===208){
        alert("The Shipper already exists!!")
      }
      else if(res.status===200){
        alert("Shipper Added !!");
        setShipperData({
          shipperName: "",
          address: "",
          poc: "",
          contact: "",
          email: ""
      });
      }
    })
    .catch((err)=>{
      console.log(err);
      handleApiError(err);
    })
  };

  return (
    <div className="PageLayout">
      <h1>Manage your Shippers</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Shipper's Company Name"
          name="shipperName"
          value={shipperData.shipperName}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Enter Address"
          name="address"
          value={shipperData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Enter Shippper POC"
          name="poc"
          value={shipperData.poc}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Enter Phone Nummber"
          name="contact"
          value={shipperData.contact}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Shipper Email Address"
          name="email"
          value={shipperData.email}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}> Add Shipper </button>
      </div>
    </div>
  );
}
export default Shippers;
