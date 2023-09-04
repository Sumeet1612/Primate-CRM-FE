import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import LinearProgress from "@mui/material/LinearProgress";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getLoadForBroker, handleApiError } from "../../api/api";
import { useNavigate } from "react-router";

function ViewLoads() {
  const nav = useNavigate();
  const [loads, setLoads] = useState([]);
  const [filteredloads, setFilteredLoads] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    let brokerId = parseInt(sessionStorage.getItem("UserId"));
    if (brokerId > 0) {
      setIsLoading(true);
      getLoadForBroker(brokerId)
        .then((res) => {
          setLoads(res.data);
          setFilteredLoads(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          handleApiError(err);
          setIsLoading(false);
        });
    }
  }, []);

  const [columnDefs] = useState([
    { field: "loadNumber", filter: true, sortable: true },
    { field: "loadDescription", filter: true, sortable: true },
    { field: "shipperName", filter: true, sortable: true },
    { field: "pickupLocation", filter: true, sortable: true },
    { field: "deliveryLocation", filter: true, sortable: true },
    { field: "pickupDate", filter: true, sortable: true },
    { field: "deliveryDate", filter: true, sortable: true },
    { field: "brokerName", filter: true, sortable: true },
    { field: "selfRate", filter: true, sortable: true },
    { field: "carrierMC", filter: true, sortable: true },
    { field: "carrierName", filter: true, sortable: true },
    { field: "carrierPOC", filter: true, sortable: true },
    { field: "carrierContact", filter: true, sortable: true },
    { field: "carrierEmail", filter: true, sortable: true },
    { field: "paymentStatusId", filter: true, sortable: true },
    { field: "shipperRate", filter: true, sortable: true },
    { field: "carrierRate", filter: true, sortable: true },
    { field: "margin", filter: true, sortable: true },
    { field: "invoiceDate", filter: true, sortable: true },
    { field: "mismatched", filter: true, sortable: true },
    { field: "createdOn", filter: true, sortable: true },
    { field: "updatedOn", filter: true, sortable: true },
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
    if (viewId === "0") {
      setFilteredLoads(loads);
    } else if (viewId === "1") {
      setFilteredLoads(loads.filter((x) => x.invoiceDate !== null));
    } else if (viewId === "2") {
      setFilteredLoads(loads.filter((x) => x.paymentStatusId === 2));
    } else if (viewId === "3") {
      setFilteredLoads(loads.filter((x) => x.paymentStatusId === 3));
    } else if (viewId === "4") {
      setFilteredLoads(loads.filter((x) => x.invoiceDate === null));
    } else if (viewId === "5") {
      setFilteredLoads(loads.filter((x) => x.mismatched));
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
          <div className="ag-theme-alpine" style={{ height: 550, width: 950 }}>
            <AgGridReact
              rowData={filteredloads}
              columnDefs={columnDefs}
              onCellClicked={(x) => handleCell(x)}
            ></AgGridReact>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewLoads;
