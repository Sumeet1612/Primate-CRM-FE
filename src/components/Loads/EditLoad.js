import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  deleteLoad,
  editLoad,
  getLoadHistory,
  getLoadOnId,
  handleApiError,
  resolveMismatchByBroker,
} from "../../api/api";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as dayjs from "dayjs";
import {
  checkPermissionToNavigation,
  loggedInUserRole,
} from "../../api/validation";
import { showNotification } from "../../api/Notification";

function EditLoad() {
  const [data, setData] = useState({
    loadNumber: "",
    shipperName: "",
    loadDescription: "",
    shipperRate: 0,
    carrierRate: 0,
    margin: "",
    invoiceDate: "",
    brokerName: "",
    brokerId: "",
    adjustmentAmount: 0,
    createdOn: "",
    mismatched: true,
  });
  const [init, setInit] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const userRole = loggedInUserRole();
  const { id } = useParams();
  const nav = useNavigate();
  const [obj, setObj] = useState({
    isLoading: false,
    refresh: 0,
  });

  const isFieldReadOnly = userRole !== 1;

const getStatusMeta = (status, flagged) => {
  let meta = { label: "Open", color: "#1976d2", textColor: "#fff" };

  // 1. Get the base metadata based on status
  switch (Number(status)) {
    case 1:
      meta = {
        label: data?.invoiceDate ? "Invoiced" : "Open",
        color: data?.invoiceDate ? "#2e7d32" : "#1976d2",
        textColor: "#fff",
      };
      break;
    case 2:
      meta = { label: "Requested", color: "#ef6c00", textColor: "#fff" };
      break;
    case 3:
      meta = { label: "Approved", color: "#00897b", textColor: "#fff" };
      break;
    case 4:
      meta = { label: "Paid", color: "#6a1b9a", textColor: "#fff" };
      break;
    case 5:
      meta = { label: "Adjustment Paid", color: "#6a1b9a", textColor: "#fff" };
      break;
    default:
      meta = { label: "Open", color: "#1976d2", textColor: "#fff" };
  }

  // 2. If flagged, append the flag label and override colours to red
  if (flagged) {
    meta.label = `${meta.label} / Flagged`;
    meta.color = "#d32f2f";
    meta.textColor = "#fff";
  }

  return meta;
};


  const loadStatusMeta = getStatusMeta(data?.paymentStatusId, data?.mismatched);
  const historyColumnDefs = [
    {
      field: "changedField",
      headerName: "Changed Field",
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      headerClass: "center-header",
    },
    {
      field: "oldValue",
      headerName: "Old Value",
      valueFormatter: ({ value }) => value ?? "null",
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      headerClass: "center-header",
    },
    {
      field: "newValue",
      headerName: "New Value",
      valueFormatter: ({ value }) => value ?? "null",
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      headerClass: "center-header",
    },
    {
      field: "changedOn",
      headerName: "Changed On",
      valueFormatter: ({ value }) => value ? new Date(value).toLocaleString() : "",
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 190,
      headerClass: "center-header",
    },
  ];

  useEffect(() => {
    if (!data.loadNumber) {
      return undefined;
    }

    let isCurrent = true;
    setHistoryLoading(true);
    getLoadHistory(data.loadNumber)
      .then((res) => {
        if (isCurrent) {
          setHistory(res.status === 200 && Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          handleApiError(err);
          setHistory([]);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setHistoryLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [data.loadNumber, historyRefresh]);

  useEffect(() => {
    setObj((prev) => {
      return { ...prev, isLoading: true };
    });
    getLoadOnId(id)
      .then((res) => {
        if (res.status === 200) {
          setData((state) => {
            return { ...state, ...res.data };
          });

          setInit(res.data);

          if(!checkPermissionToNavigation(res.data)){
            showNotification("You don't have the permission to view/edit the requested Load","error")
            nav('/viewLoads')
          }
        } else if (res.status === 204) {
          showNotification("Load Not Found","error");
          nav("/viewLoads");
        }
        else if(res.status===204){
          showNotification('Load Not Found',"error");
          nav('/viewLoads')
        }
        setObj((prev)=>{return {...prev, isLoading:false}})
      })
      .catch((err) => {
        handleApiError(err);
        setObj((prev) => {
          return { ...prev, isLoading: false };
        });
      });
  }, [id, nav, obj.refresh]);

  const handleSubmit = () => {
    if (userRole !== 1) {
      showNotification("Only admin can edit loads.", "error");
      return;
    }

    let payload = [];
    Object.keys(data).forEach((e) => {
      if (data[e] !== init[e]) {
        payload.push({
          path: `/${e}`,
          op: "replace",
          value: `${data[e]}`,
        });
      }
    });

    if (payload.length > 0) {
      editLoad(init.loadNumber, payload)
        .then((res) => {
          if (res.data === true) {
            showNotification("Load updated !!");
            setInit(data);
            setHistoryRefresh((refresh) => refresh + 1);
          }
        })
        .catch((err) => {
          handleApiError(err);
        });
    }
  };

  const handlePayment = async (statusId) => {
    let payload = [
      {
        path: "/paymentStatusId",
        op: "replace",
        value: statusId,
      },
    ];

    setObj((prev) => {
      return { ...prev, isLoading: true };
    });

    //before requesting for payment check mismatch status
    if (statusId === 2) {
      try {
        const res = await resolveMismatchByBroker(data?.loadNumber);
        if (res?.status === 200) {
          if (res?.data === 1) {
            showNotification(
              "Cannot request for payment as there is a mismatch of rates with Agency System","error"
            );
            setObj((prev) => {
              return { ...prev, isLoading: false, refresh: prev.refresh + 1 };
            });
            return;
          } else if (res?.data === 2) {
            showNotification(
              `Cannot scan changes. Contact admin and report error code : ${2}`,"error"
            );
            setObj((prev) => {
              return { ...prev, isLoading: false };
            });
            return;
          }
        } else {
          showNotification(
            `Something went wrong. Report error status code: ${res?.status} to Admin`,"error"
          );
          setObj((prev) => {
            return { ...prev, isLoading: false };
          });
          return;
        }
      } catch (err) {
        handleApiError(err);
        setObj((prev) => {
          return { ...prev, isLoading: false };
        });
        return;
      }
    }

    //if no mismatch. change payment status.
    editLoad(init.loadNumber, payload)
      .then((res) => {
        if (res?.status === 200 && res?.data === true) {
          if (statusId === 2) {
            showNotification("Payment Requested !!");
          } else if (statusId === 1) {
            showNotification("Payment Rejected !!");
          } else if (statusId === 3) {
            showNotification("Payment Approved !!");
            nav("/viewLoads");
          }
          else if(statusId===1){
            showNotification("Payment Rejected !!")
          }
          else if(statusId===3){
            showNotification("Payment Approved !!")
            nav('/viewLoads')
          }
          setInit(data);
          setHistoryRefresh((refresh) => refresh + 1);
        }
        setObj((prev) => {
          return {
            ...prev,
            refresh: prev.refresh + 1,
            isLoading: false,
          };
        });
      })
      .catch((err) => {
        setObj((prev) => {
          return { ...prev, isLoading: false };
        });
        handleApiError(err);
      });
  };

  const handleDelete = () => {
    if (userRole !== 1) {
      showNotification("Only admin can delete loads.", "error");
      return;
    }

    deleteLoad(data.loadNumber)
    .then((res)=>{
      if(res.status===200){
        if(res.data.message==='Load Deleted: True'){
          showNotification('Load Deleted !!')
          nav('/viewLoads')
        }
        else if(res.data?.message==='Cannot Delete Load as it is already proceesed for payment'){
          showNotification(res.data.message,"warning");
        }
        else{
          showNotification('Some went wrong. Please retry.',"error")
        }
      }})
      .catch((err) => {
        handleApiError(err);
      });
  };

  const handleEdit = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;
    setData((state) => {
      return { ...state, [feildName]: value };
    });

    if (feildName === "shipperRate" || feildName === "carrierRate") {
      setData((state) => {
        let netMarginValue = state.shipperRate - state.carrierRate;
        return { ...state, margin: Number(netMarginValue.toFixed(2)) };
      });
    }
  };

  const handleOpenShipper=()=>{
    nav(`/Shippers/${data.shipperId}`)
  }

  const handleToggleFlag = () => {
    if (userRole !== 1) {
      showNotification("Only admin can flag loads.", "error");
      return;
    }

    const nextFlagValue = !Boolean(data?.mismatched);
    const payload = [
      {
        path: "/mismatched",
        op: "replace",
        value: nextFlagValue,
      },
    ];

    editLoad(data?.loadNumber, payload)
      .then((res) => {
        if (res?.status === 200 && res?.data === true) {
          setData((prev) => ({ ...prev, mismatched: nextFlagValue }));
          setInit((prev) => ({ ...prev, mismatched: nextFlagValue }));
          setHistoryRefresh((refresh) => refresh + 1);
          showNotification(nextFlagValue ? "Load flagged for review." : "Load flag removed.");
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  const handleRePayment = () => {
    if (userRole !== 1) {
      showNotification("Only admin can add loads back to invoice.", "error");
      return;
    }
    const payload = [
      {
        path: "/paymentStatusId",
        op: "replace",
        value: 4,
      },
      {
        path: "/isAdjustmentInvoiced",
        op: "replace",
        value: false,
      },
    ];

    editLoad(data?.loadNumber, payload)
      .then((res) => {
        if (res?.status === 200 && res?.data === true) {
          setData((prev) => ({ ...prev, paymentStatusId: 4 }));
          setInit((prev) => ({ ...prev, paymentStatusId: 4 }));
          setHistoryRefresh((refresh) => refresh + 1);
          showNotification("Load added back to invoice.");
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  return (
    <div className="PageLayout" style={{ padding: "24px 16px 32px" }}>
      <div
        style={{
          color: loadStatusMeta.textColor,
          backgroundColor: loadStatusMeta.color,
          marginBottom: "24px",
          padding: "18px 20px",
          width: "100%",
          maxWidth: "1280px",
          borderRadius: "12px",
          fontSize: "22px",
          fontWeight: 700,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span>Edit Load Info</span>
        <span
          style={{
            backgroundColor: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: "999px",
            padding: "6px 12px",
            fontSize: "14px",
            letterSpacing: "0.5px",
            fontWeight: 600,
          }}
        >
          {loadStatusMeta.label}
        </span>
      </div>

      {obj.isLoading ? (
        <LinearProgress />
      ) : (
        <div style={{ width: "100%", maxWidth: "1280px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px 20px",
              width: "100%",
            }}
          >
            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Load Number"
              name="loadNumber"
              value={data.loadNumber}
              InputProps={{ readOnly: true }}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Shipper Name"
              name="shipperName"
              value={data.shipperName}
              InputProps={{ readOnly: true }}
              onClick={handleOpenShipper}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Load Description"
              name="loadDescription"
              value={data.loadDescription}
              onChange={handleEdit}
              InputProps={{ readOnly: isFieldReadOnly }}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Shipper Rate"
              name="shipperRate"
              value={data.shipperRate}
              onChange={handleEdit}
              InputProps={{ readOnly: isFieldReadOnly }}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Carrier Rate"
              name="carrierRate"
              value={data.carrierRate}
              onChange={handleEdit}
              InputProps={{ readOnly: isFieldReadOnly }}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Net Margin"
              name="margin"
              value={data.margin}
              InputProps={{ readOnly: true }}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Broker"
              name="broker"
              value={data.brokerName}
              InputProps={{ readOnly: true }}
            />

            <TextField
              sx={{ height: "70px" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Adjustment Amount"
              name="adjustmentAmount"
              value={data.adjustmentAmount}
              onChange={handleEdit}
              InputProps={{ readOnly: isFieldReadOnly }}
            />

            <DatePicker
              sx={{ height: "70px" }}
              label="Invoicing Date"
              name="invoiceDate"
              value={data.invoiceDate ? dayjs(data.invoiceDate) : null}
              readOnly={true}
            />
          </div>

          {data?.invoiceNumber ? (
            <div style={{ marginTop: "18px", maxWidth: "420px" }}>
              <TextField
                sx={{ height: "70px", width: "100%" }}
                InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
                type="text"
                label="Primary Invoice"
                name="primaryInvoiceNumber"
                value={data.invoiceNumber}
                InputProps={{ readOnly: true }}
              />
            </div>
          ) : (
            <></>
          )}

          <div
            style={{
              width: "100%",
              maxWidth: "1280px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "16px",
              marginTop: "28px",
              marginBottom: "20px",
            }}
          >
            {userRole === 1 ? (
              <>
              <Button
                variant="contained"
                color={data?.mismatched ? "warning" : "error"}
                sx={{ minWidth: "200px", flex: "1 1 220px" }}
                onClick={handleToggleFlag}
              >
                {data?.mismatched ? "Remove Flag" : "Flag Load"}
              </Button>

              <Button
                variant="contained"
                sx={{ minWidth: "200px", flex: "1 1 220px" }}
                onClick={handleSubmit}
              >
                SAVE CHANGES
              </Button>

              {userRole === 1 && data.paymentStatusId !== 4 && data.paymentStatusId !== 5 ? <>
              <Button
                variant="contained"
                color="success"
                sx={{ minWidth: "200px", flex: "1 1 220px" }}
                onClick={handleDelete}
              >
                DELETE LOAD
              </Button>
              </> : null}
              {userRole === 1 && data.paymentStatusId === 5 ? <Button
                variant="contained"
                color="success"
                sx={{ minWidth: "200px", flex: "1 1 220px" }}
                onClick={handleRePayment}
              >
                ADD BACK TO INVOICE
              </Button>:null}
              </>
            ) : null}
          </div>

          {userRole === 1 && data.paymentStatusId === 2 ? (
            <div
              style={{
                width: "100%",
                maxWidth: "1280px",
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                color="success"
                sx={{ minWidth: "200px", flex: "1 1 220px" }}
                disabled={init.paymentStatusId !== 2}
                onClick={() => handlePayment(3)}
              >
                Approve Payment
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: "200px", flex: "1 1 220px" }}
                disabled={init.paymentStatusId !== 2}
                onClick={() => handlePayment(1)}
              >
                Reject Payment
              </Button>
            </div>
          ) : null}

          <section style={{ marginTop: "32px", width: "100%" }}>
            <h1 className="page-title-bar">Load History</h1>
            {historyLoading ? <LinearProgress sx={{ width: "98%", mb: 1 }} /> : null}
            <div className="ag-theme-alpine" style={{ height: "50vh", width: "98%" }}>
              <AgGridReact
                rowData={history}
                columnDefs={historyColumnDefs}
                pagination={true}
                paginationAutoPageSize={true}
                enableCellTextSelection={true}
                getRowId={({ data: entry }) => String(entry.id)}
                localeText={{
                  noRowsToShow: historyLoading ? "Loading history..." : "No history available.",
                }}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
export default EditLoad;
