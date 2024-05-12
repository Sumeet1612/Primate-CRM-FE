import { useEffect, useState } from "react";
import {
  deleteLoad,
  editLoad,
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

function EditLoad() {
  const [data, setData] = useState({
    loadNumber: "",
    shipperName: "",
    pickupLocation: "",
    deliveryLocation: "",
    pickupDate: "",
    deliveryDate: "",
    loadDescription: "",
    carrierMC: "",
    carrierName: "",
    carrierPOC: "",
    carrierContact: "",
    carrierEmail: "",
    shipperRate: 0,
    carrierRate: 0,
    margin: "",
    invoiceDate: "",
    brokerName: "",
    brokerId: "",
    adjustmentAmount: 0,
    createdOn: "",
    mismatched: true,
    additionalBroker: [],
  });
  const [init, setInit] = useState([]);
  const userRole = loggedInUserRole();
  const { id } = useParams();
  const nav = useNavigate();
  const [obj, setObj] = useState({
    isEditable: true,
    isLoading: false,
    refresh: 0,
  });

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

          if (res.data?.paymentStatusId !== 1) {
            setObj((prev) => {
              return { ...prev, isEditable: false };
            });
          } else {
            setObj((prev) => {
              return { ...prev, isEditable: true };
            });
          }
          if(!checkPermissionToNavigation(res.data)){
            alert("You don't have the permission to view/edit the requested Load")
            nav('/viewLoads')
          }
        } else if (res.status === 204) {
          alert("Load Not Found");
          nav("/Primate-CRM-FE/viewLoads");
        }
        else if(res.status===204){
          alert('Load Not Found');
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
    let blankField = "";
    Object.keys(data).every((sd) => {
      if (
        data[sd] === "" &&
        sd !== "additionalBroker" &&
        sd !== "invoiceDate"
      ) {
        blankField = sd;
        return false;
      }
      return true;
    });

    if (blankField !== "") {
      alert(
        `Error: All fileds are mandatory to submit your changes. ${blankField} is blank.`
      );
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
            alert("Load updated !!");
            setInit(data);
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
            alert(
              "Cannot request for payment as there is a mismatch of rates with Agency System"
            );
            setObj((prev) => {
              return { ...prev, isLoading: false, refresh: prev.refresh + 1 };
            });
            return;
          } else if (res?.data === 2) {
            alert(
              `Cannot scan changes. Contact admin and report error code : ${2}`
            );
            setObj((prev) => {
              return { ...prev, isLoading: false };
            });
            return;
          }
        } else {
          alert(
            `Something went wrong. Report error status code: ${res?.status} to Admin`
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
            alert("Payment Requested !!");
          } else if (statusId === 1) {
            alert("Payment Rejected !!");
          } else if (statusId === 3) {
            alert("Payment Approved !!");
            nav("/Primate-CRM-FE/viewLoads");
          }
          else if(statusId===1){
            alert("Payment Rejected !!")
          }
          else if(statusId===3){
            alert("Payment Approved !!")
            nav('/viewLoads')
          }
          setInit(data);
        }
        setObj((prev) => {
          return {
            ...prev,
            refresh: prev.refresh + 1,
            isEditable: false,
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
    deleteLoad(data.loadNumber)
    .then((res)=>{
      if(res.status===200){
        if(res.data.message==='Load Deleted: True'){
          alert('Load Deleted !!')
          nav('/viewLoads')
        }
        else if(res.data?.message==='Cannot Delete Load as it is already proceesed for payment'){
          alert(res.data.message);
        }
        else{
          alert('Some went wrong. Please retry.')
        }
      })
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

  const handleBrokerResolve = () => {
    resolveMismatchByBroker(data?.loadNumber)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data === 0) {
            setObj((prev) => {
              return { ...prev, refresh: prev.refresh + 1 };
            });
            alert("Mismatch of rates with Agency system is resolved");
          } else {
            alert(
              "There is mismatch of rates with Agency System. Please recheck rates or contact admin"
            );
          }
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  const handleAdminResolve = () => {
    let payload = [
      {
        path: "/mismatched",
        op: "replace",
        value: false,
      },
    ];

    editLoad(data?.loadNumber, payload)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data === true) {
            alert("Mismatch resolved");
          }
        }
      })
      .catch((err) => {
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
          width: "86%",
          fontSize: "20px",
        }}
      >
        Edit Load Info
      </h1>
      {obj.isLoading ? (
        <LinearProgress />
      ) : (
        <div>
          <TextField
            sx={{ height: "70px", width: "20%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Load Number"
            name="loadNumber"
            value={data.loadNumber}
            InputProps={{ readOnly: true }}
          />

          <TextField
            sx={{ height: "55px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Shipper Name"
            name="shipperName"
            value={data.shipperName}
            InputProps={{ readOnly: true }}
            onClick={handleOpenShipper}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Load Description"
            name="loadDescription"
            value={data.loadDescription}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Pickup City and State"
            name="pickupLocation"
            value={data.pickupLocation}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Delivery City and State"
            name="deliveryLocation"
            value={data.deliveryLocation}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <DatePicker
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            label="Booking Date"
            name="createdOn"
            value={dayjs(data.createdOn)}
            readOnly={true}
          />

          <DatePicker
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            label="Pickup Date"
            name="pickupDate"
            value={dayjs(data.pickupDate)}
            onChange={(date) =>
              setData((prev) => {
                return {
                  ...prev,
                  pickupDate: dayjs(date).format("MM/DD/YYYY"),
                };
              })
            }
            readOnly={!obj.isEditable}
          />

          <DatePicker
            sx={{ height: "70px", width: "27%", mr: "10%", mb: "1%" }}
            label="Delivery Date"
            name="deliveryDate"
            value={dayjs(data.deliveryDate)}
            onChange={(date) =>
              setData((prev) => {
                return {
                  ...prev,
                  deliveryDate: dayjs(date).format("MM/DD/YYYY"),
                };
              })
            }
            readOnly={!obj.isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "20%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier MC Number"
            name="carrierMC"
            value={data.carrierMC}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Name"
            name="carrierName"
            value={data.carrierName}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier POC"
            name="carrierPOC"
            value={data.carrierPOC}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Contact Number"
            name="carrierContact"
            value={data.carrierContact}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable }}
          />

          <TextField
            sx={{ height: "70px", width: "55%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="email"
            label="Carrier Email Address"
            name="carrierEmail"
            value={data.carrierEmail}
            InputProps={{ readOnly: !obj.isEditable }}
            onChange={handleEdit}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Shipper Rate"
            name="shipperRate"
            value={data.shipperRate}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable && userRole !== 1 }}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Rate"
            name="carrierRate"
            value={data.carrierRate}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable && userRole !== 1 }}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Net Margin"
            name="margin"
            value={data.margin}
            InputProps={{ readOnly: true }}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Broker"
            name="broker"
            value={data.brokerName}
            InputProps={{ readOnly: true }}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Adjustment Amount"
            name="adjustmentAmount"
            value={data.adjustmentAmount}
            onChange={handleEdit}
            InputProps={{ readOnly: !obj.isEditable && userRole !== 1 }}
          />

          <DatePicker
            sx={{ height: "70px", width: "27%", mb: "2%" }}
            label="Invoicing Date"
            name="invoiceDate"
            value={data.invoiceDate ? dayjs(data.invoiceDate) : null}
            readOnly={true}
          />
          <br />

          {data?.invoiceNumber ? (
            <TextField
              sx={{ height: "70px", width: "40%", mr: "4.5%", mb: "1%" }}
              InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
              type="text"
              label="Primary Invoices"
              name="primaryInvoiceNumber"
              value={data.invoiceNumber}
              InputProps={{ readOnly: true }}
            />
          ) : (
            <></>
          )}

          {data.additionalBroker ? (
            data.additionalBroker.map((d, index) => {
              return (
                <div key={index}>
                  <TextField
                    sx={{ height: "55px", width: "20%", mr: "4.5%", mb: "1%" }}
                    InputLabelProps={{
                      style: { fontSize: 15, fontWeight: "bold" },
                    }}
                    type="text"
                    name="sharedWithName"
                    label="Shared With"
                    value={d.brokerName}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    sx={{ height: "70px", width: "20%", mr: "3%", mb: "1%" }}
                    InputLabelProps={{
                      style: { fontSize: 15, fontWeight: "bold" },
                    }}
                    type="text"
                    label="Shared Percentage"
                    name="sharedWithPercentage"
                    value={d.sharedPercentage}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    sx={{ height: "70px", width: "20%", mr: "3%", mb: "1%" }}
                    InputLabelProps={{
                      style: { fontSize: 15, fontWeight: "bold" },
                    }}
                    type="text"
                    label="Invoiced In"
                    name="additionalBrokerInvoiceIn"
                    value={d.invoiceNumber}
                    InputProps={{ readOnly: true }}
                  />
                </div>
              );
            })
          ) : (
            <br />
          )}

          {data?.mismatched ? (
            <h3>There is a rate Discrepancy in this load.</h3>
          ) : (
            <></>
          )}
          <br />
          {data?.mismatched ? (
            userRole === 1 ? (
              <Button
                name="admin resolve mismatch"
                variant="contained"
                sx={{ width: "40%" }}
                onClick={handleAdminResolve}
                disabled={!obj.isEditable && userRole === 2}
              >
                {" "}
                Resolve Mismatch{" "}
              </Button>
            ) : (
              <Button
                name="broker resolve mismatch"
                variant="contained"
                sx={{ width: "40%" }}
                onClick={handleBrokerResolve}
                disabled={!obj.isEditable && userRole === 2}
              >
                {" "}
                Reevaluate mismatch{" "}
              </Button>
            )
          ) : (
            <></>
          )}
          <br />
          <br />

          <div
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              sx={{ width: "20%" }}
              onClick={handleSubmit}
              disabled={!obj.isEditable && userRole === 2}
            >
              {" "}
              SAVE CHANGES{" "}
            </Button>

            <Button
              variant="contained"
              color="success"
              sx={{ width: "20%" }}
              onClick={handleDelete}
              disabled={!obj.isEditable}
            >
              {" "}
              DELETE LOAD{" "}
            </Button>

            {data?.mismatched ||
            !data?.invoiceDate ||
            data?.paymentStatusId !== 1 ? (
              <></>
            ) : (
              <Button
                variant="contained"
                color="success"
                sx={{ width: "20%" }}
                disabled={!obj.isEditable || !data.invoiceDate}
                onClick={() => handlePayment(2)}
              >
                {" "}
                Request Payment{" "}
              </Button>
            )}
          </div>

          <div hidden={userRole === 2 || data.paymentStatusId !== 2}>
            <div
              style={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                color="success"
                sx={{ width: "20%" }}
                disabled={init.paymentStatusId !== 2}
                onClick={() => handlePayment(3)}
              >
                {" "}
                Approve Payment{" "}
              </Button>

              <Button
                variant="contained"
                color="success"
                sx={{ width: "20%" }}
                disabled={init.paymentStatusId !== 2}
                onClick={() => handlePayment(1)}
              >
                {" "}
                Reject Payment{" "}
              </Button>
            </div>
          </div>

          {!obj.isEditable ? (
            <h3>
              Payment is already{" "}
              {init.paymentStatusId === 2
                ? "Requested"
                : init.paymentStatusId === 3
                ? "Processed"
                : ""}
            </h3>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
export default EditLoad;
