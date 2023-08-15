import { useState } from "react";

function Shippers() {
  const [shipperData, setShipperData] = useState({
    shipperName: "",
    shipperAddress: "",
    shipperPOC: "",
    shipperPhoneNumber: "",
    shipperEmail: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;

    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  };

  const handleSubmit = () => {
    console.log("button clicked");
    console.log(shipperData);
    localStorage.setItem("shipperData", JSON.stringify(shipperData));
    setShipperData({
      shipperName: "",
      shipperAddress: "",
      shipperPOC: "",
      shipperPhoneNumber: "",
      shipperEmail: "",
    });
  };

  return (
    <>
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
          name="shipperAddress"
          value={shipperData.shipperAddress}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Enter Shippper POC"
          name="shipperPOC"
          value={shipperData.shipperPOC}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Enter Phone Nummber"
          name="shipperPhoneNumber"
          value={shipperData.shipperPhoneNumber}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Shipper Email Address"
          name="shipperEmail"
          value={shipperData.shipperEmail}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}> Add Shipper </button>
      </div>
    </>
  );
}
export default Shippers;
