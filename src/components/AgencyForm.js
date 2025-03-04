import { useEffect, useState } from "react";
import { getAgencyLoadsOnStatus, handleApiError, processInvoices, uploadAgencyData } from "../api/api";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AgGridReact } from "ag-grid-react";
import { showNotification } from "../api/Notification";

function AgencyForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState(false);
  const [reload, setReload]= useState(0);
  const [gridApi, setGridApi]= useState(null);

  const [loads,setLoads]= useState([]);
  const [colDef]= useState([
    {field:"loadNumber", filter:true, sortable:true, resizable:true},
    {field:"shipperRate", filter:true, sortable:true, resizable:true},
    {field:"carrierRate", filter:true, sortable:true, resizable:true},
    {field:"margin", filter:true, sortable:true, resizable:true},
    {field:"adjustmentAmount", filter:true, sortable:true, resizable:true},
    {field:"invoiceDate", filter:true, sortable:true, resizable:true, valueFormatter: params=>formatDate(params)},
    {field:"uploadedOn", filter:true, sortable:true, resizable:true, valueFormatter: params=>formatDate(params)}
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
  },[reload]);

  const formatDate=(params)=>{
    if(params?.value?.toString().slice(0,10) === undefined){
      return '';
    }
    else{
     let date= new Date(params?.value?.toString());
     return date.toLocaleDateString('en-US')
    }
}

  const handleFileChange = (event) => {
    setUpload(false);
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
            showNotification("File Uploaded. Proceed with Scanning Load Entries");
          }
        })
        .catch((err) => {
          setLoading(false);
          handleApiError(err);
        });
    } else {
      showNotification("No files selected","warning");
    }
  };

  const handleScanChanges = () => {
    setLoading(true);
    processInvoices()
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          showNotification("Data Processed successfully");
          setReload(reload+1);
        }
      })
      .catch((err) => {
        setLoading(false);
        handleApiError(err);
      });
  };

  return (
    <div className="PageLayout" style={{ height: '100%' }}>
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

        <Button
        sx={{mb:"2%"}}
          variant="contained"
          color="info"
          onClick={handleScanChanges}
        >
          Update Loads
        </Button>

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
      <div className="ag-theme-alpine" style={{ height: '90%', width: '98%' }}>
      {loads?.length>0 ?
      <Button
        variant="contained"
        color="success"
        sx={{ width: "25%" }}
        onClick={()=>{gridApi.exportDataAsCsv({fileName:"NotCreatedLoad.csv"});}}
      > EXPORT TO EXCEL</Button>
      :<></>}
      <AgGridReact
        rowData={loads}
        columnDefs={colDef}
        pagination={true}
        paginationAutoPageSize={true}
        onGridReady={(event)=>{setGridApi(event.api)}}
        enableCellTextSelection={true}
      />
    </div>
    </div>
  );
}

export default AgencyForm;
