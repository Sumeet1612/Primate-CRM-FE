import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import LinearProgress from "@mui/material/LinearProgress";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAllLoads, getLoadForBroker, handleApiError } from "../../api/api";
import { useNavigate } from "react-router";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";

function ViewLoads() {
  const nav = useNavigate();
  const [loads, setLoads] = useState([]);
  const [filteredloads, setFilteredLoads] = useState([]);
  const [isloading, setIsLoading] = useState(false);

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
  }, []);

  const formatDate=(params)=>{
    if(params?.value?.toString().slice(0,10) === undefined){
      return '';
    }
    else{
     let date= new Date(params?.value?.toString());
     return date.toLocaleDateString('en-US')
    }
}

  const [columnDefs] = useState([
    { field: "loadNumber", filter: true, sortable: true, tooltipField:'loadNumber', width:120, headerName:'LOAD #', resizable: true },
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
    // { field: "createdOn", filter: 'true', sortable: true, valueFormatter: params=>formatDate(params), resizable: true  },
    { field: "updatedOn", filter: 'true', sortable: true, tooltipField:'updatedOn', width:150, headerName:'UPDATED ON', resizable: true , 
     valueFormatter: params=>formatDate(params)}
  ]);

  const handleCell = (cellEvent) => {
    let loadId = cellEvent?.data?.loadNumber;
    if (cellEvent?.colDef?.field === "loadNumber") {
      if (window.confirm("Do you want to View/Edit the Load?")) {
        nav(`/Primate-CRM-FE/editLoad/${loadId}`);
      }
    }
  };

  const handleViewChange = (viewId) => {
    if(loads?.length>0){
      if (viewId === "0") {
        setFilteredLoads(loads);
      } else if (viewId === "1") {
        setFilteredLoads(loads?.filter((x) => x.invoiceDate !== null));
      } else if (viewId === "2") {
        setFilteredLoads(loads?.filter((x) => x.paymentStatusId === 2));
      } else if (viewId === "3") {
        setFilteredLoads(loads?.filter((x) => x.paymentStatusId === 3));
      } else if (viewId === "4") {
        setFilteredLoads(loads?.filter((x) => x.invoiceDate === null));
      } else if (viewId === "5") {
        setFilteredLoads(loads?.filter((x) => x.mismatched));
      }
    }
  };

  return (
    <>
      <div className="PageLayout">
      <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "90%",
            fontSize: "20px",
          }}
        >
          Manage Loads
        </h1>
        <label> Select View</label> <>   </>
        <select onChange={(event) => handleViewChange(event.target.value)}>
          <option value="0">All Loads</option>
          <option value="1">Invoiced Load</option>
          <option value="2">Loads with Payment Requested</option>
          <option value="3">Loads with Payment Processed</option>
          <option value="4">Not Invoiced Load</option>
          <option value="5">Loads with Rate Discrepancy</option>
        </select> <br/>  <br/>
        {isloading ? (
           <LinearProgress />
        ) : (
          <div className="ag-theme-alpine" style={{ height: 500, width: '94%' }}>
            <AgGridReact
              rowData={filteredloads}
              columnDefs={columnDefs}
              onCellClicked={(x) => handleCell(x)}
              pagination={true}
            ></AgGridReact>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewLoads;
