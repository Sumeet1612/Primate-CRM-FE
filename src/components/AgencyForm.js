import { useEffect, useState } from "react";
import { getAgencyLoadsOnStatus, handleApiError, processInvoices, uploadAgencyData } from "../api/api";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AgGridReact } from "ag-grid-react";

function AgencyForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const [check, setCheck] = useState(false);

  const [loads,setLoads]= useState([]);
  const [colDef]= useState([
    {field:"loadNumber", filter:true, sortable:true, resizable:true},
    {field:"shipperRate", filter:true, sortable:true, resizable:true},
    {field:"carrierRate", filter:true, sortable:true, resizable:true},
    {field:"margin", filter:true, sortable:true, resizable:true},
    {field:"adjustmentAmount", filter:true, sortable:true, resizable:true},
    {field:"invoiceDate", filter:true, sortable:true, resizable:true},
    {field:"uploadedOn", filter:true, sortable:true, resizable:true}
  ]) 

  useEffect(()=>{
    setLoading(true);
    getAgencyLoadsOnStatus(false)
    .then((res)=>{
      if(res.status===200){
        setLoads(res.data);
      }
      setLoading(false);
    })
    .catch((err)=>{
      handleApiError(err);
      setLoading(false);
    })
  },[check]);

  const handleFileChange = (event) => {
    setUpload(false);
    setCheck(false);
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("agencyFile", selectedFile);
      uploadAgencyData(formData)
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            setUpload(true);
            alert("File Uploaded. Proceed with Scanning Load Entries");
          }
        })
        .catch((err) => {
          setLoading(false);
          handleApiError(err);
        });
    } else {
      alert("No files selected");
    }
  };

  const handleScanChanges = () => {
    setLoading(true);
    processInvoices()
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setCheck(true);
          alert("Data Processed successfully");
        }
      })
      .catch((err) => {
        setLoading(false);
        setCheck(false);
        handleApiError(err);
      });
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
        {" "}
        Agency System{" "}
      </h1>
      <br />
      <p
        style={{
          marginLeft: "15px",
          fontSize: "15px",
          wordWrap: "break-word",
        }}
      >
        Please upload the MS Excel file from the agency.
      </p>
      <br />
      {loading ? <LinearProgress /> : <></>}
      <TextField 
      type="file" 
      variant="outlined"
      color="secondary"
      size="small"
      onChange={handleFileChange} />

      <Button
      variant="contained"
      color="info" 
      sx={{ width: "18%", ml:"3%" }}
      onClick={handleSubmit} disabled={upload}>
        Process File
      </Button>
      <br /><br/>

      {upload ? (
        <Button
          variant="contained"
          color="info"
          onClick={handleScanChanges}
          disabled={check}
        >
          Update Loads
        </Button>
      ) : (
        <></>
      )}
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
        {" "}
        Loads Invoiced but NOT Created in System{" "}
      </h1>
      <div className="ag-theme-alpine" style={{ height: 550, width: '98%' }}>
      <AgGridReact
        rowData={loads}
        columnDefs={colDef}
        pagination={true}
        paginationAutoPageSize={true}
      />
    </div>
    </div>
  );
}

export default AgencyForm;
