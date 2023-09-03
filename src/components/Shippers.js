import { useEffect, useState } from "react";
import { addShipper, getAllShippers, handleApiError } from "../api/api";
import { AgGridReact } from 'ag-grid-react';
import LinearProgress from '@mui/material/LinearProgress';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function Shippers() {
  const [shipperData, setShipperData] = useState({
    shipperName: "",
    address: "",
    poc: "",
    contact: "",
    email: "",
  });

  const [viewShippers,setViewShippers]=useState([]);
  const [isloading,setIsLoading]=useState(false);
  const [refresh,setRefresh]=useState(false);

  const [colDef]=useState([
    {field:"id",filter: true, sortable: true},
    {field:"shipperName",filter: true, sortable: true},
    {field:"address",filter: true, sortable: true},
    {field:"poc",filter: true, sortable: true},
    {field:"contact",filter: true, sortable: true},
    {field:"email",filter: true, sortable: true},
    {field:"updatedOn",filter: true, sortable: true}
  ]);

  useEffect(()=>{
    setIsLoading(true);
    getAllShippers()
    .then((res)=>{
      if(res.status===200){
        setViewShippers(res.data);
      }
      setIsLoading(false);
    })
    .catch((err)=>{
      handleApiError(err);
      setIsLoading(false);
    })
  },[refresh])
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
      
      setRefresh(!refresh)
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })
  };

  return (
    <div className="PageLayout">
      <h1>Manage your Shippers</h1>
      <br/>
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
      <br/>
      <br/>
      {isloading? <LinearProgress/>:
      <div className="ag-theme-alpine" style={{height: 550, width: 950}}>
            <AgGridReact
                rowData={viewShippers}
                columnDefs={colDef}>
            </AgGridReact>
        </div>}
    </div>
  );
}
export default Shippers;
