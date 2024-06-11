import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllLoads, getLoadForBroker, handleApiError, updatePaymentState } from "../../api/api";
import { useNavigate } from "react-router";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";

function ViewLoads() {
  const nav = useNavigate();
  const [loads, setLoads] = useState([]);
  const [filteredloads, setFilteredLoads] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [gridApi, setGridApi] = useState(null);
  const [paymentState, setPaymentState]= useState({
    status:0,
    selectedLoad:[]
  });

  useEffect(() => {
    let brokerId = loggedInUserId();
    let roleId= loggedInUserRole();
    if (brokerId > 0) {
      setIsLoading(true);
      if(roleId===2){
      getLoadForBroker(brokerId)
        .then((res) => {
          if(res.status===200){
            setLoads(res.data);
            setFilteredLoads(res.data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          handleApiError(err);
          setIsLoading(false);
        });
      }
      else if(roleId===1){
        getAllLoads(brokerId)
        .then((res) => {
          if(res.status===200){
            setLoads(res.data);
            setFilteredLoads(res.data);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          handleApiError(err);
          setIsLoading(false);
        });
      }
    }
  }, [reload]);

  const formatDate=(params)=>{
    if(params?.value?.toString().slice(0,10) === undefined){
      return '';
    }
    else{
     let date= new Date(params?.value?.toString());
     return date.toLocaleDateString('en-US')
    }
}

const getStatus=(param)=>{
  if(param.value===1){
    return "Open"
  }
  else if(param.value===2){
    return "Requested"
  }
  else if(param.value===3){
    return "Approved"
  }
  else if(param.value===4){
    return "Paid"
  }
}

  const [columnDefs] = useState([
    { headerCheckboxSelection:true, checkboxSelection:true, field: "",  width:50, headerName:'#' },
    { field: "loadNumber", filter: true, sortable: true, tooltipField:'loadNumber', width:120, headerName:'LOAD #', resizable: true },
    { field: "paymentStatusId", sortable: true, tooltipField:'Load Status', width:120, headerName:'STATUS', resizable: true,
  valueFormatter: params=>getStatus(params) },
    { field: "shipperName", filter: true, sortable: true, tooltipField:'shipperName', width:200, headerName:'SHIPPER NAME', resizable: true },
    { field: "pickupLocation", filter: true, sortable: true, tooltipField:'pickupLocation', width:150, headerName:'ORIGIN', resizable: true },
    { field: "deliveryLocation", filter: true, sortable: true, tooltipField:'deliveryLocation', width:150, headerName:'DESTINATION', resizable: true },
    { field: "pickupDate", filter: 'true', sortable: true, tooltipField:'pickupDate', width:150, headerName:'PICKUP DATE', resizable: true ,
    valueFormatter: params=>formatDate(params)},
    { field: "deliveryDate", filter: 'true', sortable: true, tooltipField:'deliveryDate', width:150, headerName:'DELIVERY DATE', resizable: true ,
    valueFormatter: params=>formatDate(params)},
    { field: "brokerName", filter: true, sortable: true, width:120, headerName:'BROKER', resizable: true  }, // We need to display Broker to the Admin, but this coulmn will no be needed in the User section.
    { field: "carrierMC", filter: true, sortable: true, tooltipField:'carrierMC', width:135, headerName:'CARRIER MC', resizable: true  },
    { field: "carrierName", filter: true, sortable: true, tooltipField:'carrierName', width:200, headerName:'CARRIER NAME', resizable: true  },
    { field: "carrierPOC", filter: true, sortable: true, tooltipField:'carrierPOC', width:150, headerName:'CARRIER POC' , resizable: true },
    { field: "carrierContact", filter: true, sortable: true, tooltipField:'carrierContact', width:150, headerName:'CARRIER PHONE #' , resizable: true },
    { field: "carrierEmail", filter: true, sortable: true, tooltipField:'carrierEmail', width:250, headerName:'CARRIER EMAIL', resizable: true  },
    { field: "shipperRate", filter: true, sortable: true, tooltipField:'shipperRate', width:150, headerName:'SHIPPER RATE', resizable: true  },
    { field: "carrierRate", filter: true, sortable: true, tooltipField:'carrierRate', width:150, headerName:'CARRIER RATE' , resizable: true },
    { field: "margin", filter: true, sortable: true, tooltipField:'margin', width:120, headerName:'MARGIN' , resizable: true },
    { field: "invoiceDate", filter: 'true', sortable: true, tooltipField:'invoiceDate', width:150, headerName:'INVOICED ON', resizable: true ,
    valueFormatter: params=>formatDate(params) },
    { field: "mismatched", filter: true, sortable: true , resizable: true }, 
    { field: "updatedOn", filter: 'true', sortable: true, tooltipField:'updatedOn', width:150, headerName:'UPDATED ON', resizable: true , 
     valueFormatter: params=>formatDate(params)}
  ]);

  const handleCell = (cellEvent) => {
    let loadId = cellEvent?.data?.loadNumber;
    if (cellEvent?.colDef?.field === "loadNumber") {
      if (window.confirm("Do you want to View/Edit the Load?")) {
        nav(`/editLoad/${loadId}`);
      }
    }
  };

  const handleViewChange = (viewId) => {
    if(loads?.length>0){
      setPaymentState({
        status:0,
        selectedLoad:[]
      })
      if (viewId === "0") {
        setFilteredLoads(loads);
      } else if (viewId === "1") {
        setFilteredLoads(loads?.filter((x) => x.invoiceDate !== null && x.paymentStatusId===1));
      } else if (viewId === "2") {
        setFilteredLoads(loads?.filter((x) => x.paymentStatusId === 2));
      } else if (viewId === "3") {
        setFilteredLoads(loads?.filter((x) => x.paymentStatusId === 3));
      } else if (viewId === "4") {
        setFilteredLoads(loads?.filter((x) => x.invoiceDate === null));
      } else if (viewId === "5") {
        setFilteredLoads(loads?.filter((x) => x.mismatched));
      }else if(viewId==="6"){
        setFilteredLoads(loads?.filter((x)=>x.invoiceNumber===null && x.paymentStatusId===3))
      }
    }
  };

  const handleMutipleSelection=(event)=>{
    let selectedRow = event.api.getSelectedRows();
    if(selectedRow.length>0){
    if(selectedRow.every(x=>x.paymentStatusId===1 && x.invoiceDate)){
      setPaymentState((prev)=>{
        return {selectedLoad: selectedRow.map(x=>x.loadNumber), status:2}
      });
    }
    else if(selectedRow.every(x=>x.paymentStatusId===2)){
      setPaymentState((prev)=>{
        return {selectedLoad: selectedRow.map(x=>x.loadNumber), status:3}
      });
    }
    else{
      setPaymentState((prev)=>{
        return {selectedLoad: selectedRow.map(x=>x.loadNumber), status:0}
      });
    }
  }
  else{
    setPaymentState((prev)=>{
      return {selectedLoad:[], status:0}
    });
  }
  }
  const handlePayment=()=>{
    if(paymentState?.status>0){
      updatePaymentState(paymentState?.selectedLoad, paymentState?.status)
      .then((res)=>{
        if(res?.status===200){
          if(paymentState?.status===2 && res?.data){
            alert("Payment Requested !!")
            setReload((prev)=>{return prev+1});
            setPaymentState((prev)=>{
              return {selectedLoad:[], status:0}
            });
          }
          else if(paymentState?.status===3 && res?.data){
            alert("Payment Approved !!")
            setReload((prev)=>{return prev+1});
            setPaymentState((prev)=>{
              return {selectedLoad:[], status:0}
            });
          }
        }
      })
      .catch((err)=>{
        handleApiError(err);
      })
    }
    
  }

  return (
    <>
      <div className="PageLayout" style={{ height: '100%' }}>
      <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "95%",
            fontSize: "20px",
          }}
        >
          Manage Loads
        </h1>
        <label> Select View</label> <>   </>
        <select onChange={(event) => handleViewChange(event.target.value)}>
          <option value="0">All Loads</option>
          <option value="1">Invoiced Loads & Payment not Requested</option>
          <option value="2">Loads with Payment Requested</option>
          <option value="3">Loads with Payment Processed</option>
          <option value="4">Not Invoiced Load</option>
          <option value="6">Next Payout</option>
          <option value="5">Loads with Rate Discrepancy</option>
        </select> 
        <Button
        variant="contained"
        color="success"
        sx={{ width: "25%" , marginLeft:"25%"}}
        onClick={()=>{gridApi.exportDataAsCsv({fileName:"PrimateLoad.csv"});}}>
          EXPORT TO EXCEL
      </Button>
        <br/>  <br/>
        {isloading ? (
           <LinearProgress />
        ) : (
          <div className="ag-theme-alpine" style={{ height: "90%" , width: '98%' }}>
          {paymentState.status=== 0 ? <></>:
            <Button
                variant="contained"
                color="success"
                sx={{ width: "40%" }}
                onClick={handlePayment}
              >
                {" "}
                {paymentState.status === 2 ? "Request Payment": "Approve Payment"}{" "}
              </Button>
              }
            <AgGridReact
              rowData={filteredloads}
              columnDefs={columnDefs}
              onCellClicked={(x) => handleCell(x)}
              pagination={true}
              paginationAutoPageSize={true}
              rowSelection="multiple"
              onSelectionChanged={handleMutipleSelection}
              onGridReady={(event)=>{setGridApi(event.api)}}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ViewLoads;
