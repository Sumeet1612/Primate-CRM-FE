import { useEffect, useState } from "react";
import { addShipper, getAllShippers, getAllShippersForBroker, handleApiError } from "../../api/api";
import { AgGridReact } from "ag-grid-react";
import LinearProgress from "@mui/material/LinearProgress";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";

function Shippers() {
  const brokerId= loggedInUserId();
  const userRole= loggedInUserRole();
  const [shipperData, setShipperData] = useState({
    brokerId:brokerId,
    shipperName: "",
    address: "",
    poc: "",
    contact: "",
    email: "",
    website:"",
  });

  const [viewShippers, setViewShippers] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigation=useNavigate()

  const handleCell=(cellEvent)=>{
    let shipperId=cellEvent?.data?.id;
    if(cellEvent?.colDef?.field==="id"){
      navigation(`/Primate-CRM-FE/Shippers/${shipperId}`)
    }
  }

  const [colDef] = useState([
    { field: "id", filter: true, sortable: true, tooltipField:'id', width:75, headerName:'ID', resizable: true},
    { field: "shipperName", filter: true, sortable: true, width:200, tooltipField:'shipperName', headerName:"SHIPPER NAME", resizable: true },
    { field: "address", filter: true, sortable: true, width:325, tooltipField:'address', headerName:"ADDRESS" , resizable: true},
    { field: "website", filter: true, sortable: true, width:250, tooltipField:'website', headerName:"WEBSITE", resizable: true },
    { field: "poc", filter: true, sortable: true, width:150, tooltipField:'poc', headerName:"POC" , resizable: true},
    { field: "contact", filter: true, sortable: true, width:150, tooltipField:'contact', headerName:"PHONE #" , resizable: true},
    { field: "email", filter: true, sortable: true,width:250, tooltipField:'email', headerName:"EMAIL" , resizable: true},
    { field: "updatedOn", filter: true, sortable: true, width:150, headerName:"UPDATED ON", resizable: true,
    valueFormatter: params=>{
      let date= new Date(params.value.toString())
      return date.toLocaleDateString('en-US');
    }}
  ]);

  useEffect(() => {
    if(isNaN(brokerId) || isNaN(userRole)){
      navigation("/Primate-CRM-FE/login")
      return;
    }
    if(brokerId>0 && userRole===2){    
      setIsLoading(true);
      getAllShippersForBroker(brokerId)
        .then((res) => {
          if (res.status === 200) {
            setViewShippers(res.data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          handleApiError(err);
          setIsLoading(false);
        });
    }
    if(userRole=== 1 && brokerId>0){
      setIsLoading(true);
      getAllShippers()
        .then((res) => {
          if (res.status === 200) {
            setViewShippers(res.data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          handleApiError(err);
          setIsLoading(false);
        });
    }
  }, [refresh,brokerId, userRole,navigation]);

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;

    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  };

  const handleSubmit = () => {
    //validate that no filed is left empty
    let validationError = false;
    Object.keys(shipperData).every(fe=>{
      if(shipperData[fe]===''){
        validationError= true;
        return false;
      }
      return true;
    })

    //if validated, then call api to create shipper
    if(!validationError){
      addShipper(shipperData)
        .then((res) => {
          if (res.status === 208) {
            alert("The Shipper already exists!!");
          } else if (res.status === 200) {
            alert("Shipper Added !!");

            setShipperData({
              brokerId:brokerId,
              shipperName: "",
              address: "",
              poc: "",
              contact: "",
              email: "",
              website:"",
            });

            setRefresh(!refresh);
          }
        })
        .catch((err) => {
          handleApiError(err);
        });
    }
    else{
      alert('Please Complete the form to proceed')
    }
  };

  return (
    <div className="PageLayout">
      <h1
        style={{
          color: "#fff",
          backgroundColor: "#00b7aa",
          marginBottom: "2%",
          padding: "2%",
          width: "94%",
          fontSize: "20px",
        }}
      >
        Add a New Shipper
      </h1>
      <br />
      <div>
        <TextField
          sx={{ height: "70px", width: "40%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Company Name"
          name="shipperName"
          value={shipperData.shipperName}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "40%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Person of Contact"
          name="poc"
          value={shipperData.poc}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "60%", mr: "5%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Complete Address"
          name="address"
          value={shipperData.address}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "25%", mr: "5%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Website"
          name="website"
          value={shipperData.website}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "30%", mr: "5%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Contact Nummber"
          name="contact"
          value={shipperData.contact}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "55%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="email"
          label="Email"
          name="email"
          value={shipperData.email}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="success"
          endIcon={<AddIcon />}
          sx={{ width: "25%", ml: "32.5%" }}
          onClick={handleSubmit}
        >
          {" "}
          Add Shipper{" "}
        </Button>

        <h3
          style={{
            color: "#fff",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "94%",
            fontSize: "18px",
            marginTop: "5%",
          }}
        >
          {userRole===1?"Manage All Shippers":"Manage your Shippers"}
        </h3>
      </div>
      <br />
      {isloading ? (
        <LinearProgress />
      ) : (
        <div className="ag-theme-alpine" style={{ height: 550, width: '98%' }}>
          <AgGridReact 
            rowData={viewShippers} 
            columnDefs={colDef} 
            onCellClicked={(x)=>handleCell(x)}
            pagination={true}
            paginationAutoPageSize={true} />
        </div>
      )}
    </div>
  );
}
export default Shippers;
