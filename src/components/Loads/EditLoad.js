import { useEffect, useState } from "react";
import { editLoad, getLoadOnId, handleApiError } from "../../api/api";
import { useParams } from "react-router";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as dayjs from "dayjs";

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
    createdOn: "",
    additionalBroker: [],
  });
  const [isEditable, setIsEditable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [init, setInit] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    getLoadOnId(id)
      .then((res) => {
        if (res.status === 200) {
          setData((state) => {
            return { ...state, ...res.data };
          });

          setInit(res.data);

          if (res.data?.paymentStatusId !== 1) {
            setIsEditable(false);
          } else {
            setIsEditable(true);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        handleApiError(err);
        setIsLoading(false);
      });
  }, [id, isEditable]);

  const handleSubmit = () => {
    const payload = [];
    Object.keys(data).forEach((e) => {
      if (data[e] !== init[e]) {
        payload.push({
          path: `/${e}`,
          op: "replace",
          value: `${data[e]}`,
        });
      }
    });

    editLoad(init.loadNumber, payload)
      .then((res) => {
        if (res.data === true) {
          alert("Load updated !!");
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  const handlePayment = () => {
    let payload = [
      {
        path: "/paymentStatusId",
        op: "replace",
        value: 2,
      },
    ];
    console.log(payload);

    editLoad(init.loadNumber, payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        handleApiError(err);
      });

    setIsEditable(false);
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
        return { ...state, margin: netMarginValue };
      });
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
          width: "86%",
          fontSize: "20px",
        }}
      >
        Edit Load Info
      </h1>
      {isLoading ? (
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
            readOnly
          />

          <TextField
            sx={{ height: "55px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Shipper Name"
            name="shipperName"
            value={data.shipperName}
            readOnly
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Load Description"
            name="loadDescription"
            value={data.loadDescription}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Pickup City and State"
            name="pickupLocation"
            value={data.pickupLocation}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Delivery City and State"
            name="deliveryLocation"
            value={data.deliveryLocation}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          {/* <TextField
            
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="date"
            label="Booking Date"
            name="createdOn"
            value={data.createdOn.toString().slice(0, 10)}
            readOnly
          /> */}

          <DatePicker
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            label="Booking Date"
            name="createdOn"
            value={dayjs(data.createdOn)}
            readOnly
          />

          {/* <TextField
            
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="date"
            label="Pickup Date"
            name="pickupDate"
            value={data.pickupDate?.toString().slice(0, 10)}
            onChange={handleEdit}
            readOnly={!isEditable}
          /> */}

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
            readOnly={!isEditable}
          />

          {/* <TextField
            
            sx={{ height: "70px", width: "27%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="date"
            label="Delivery Date"
            name="deliveryDate"
            value={data.deliveryDate?.toString().slice(0, 10)}
            onChange={handleEdit}
            readOnly={!isEditable}
          /> */}

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
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "20%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier MC Number"
            name="carrierMC"
            value={data.carrierMC}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Name"
            name="carrierName"
            value={data.carrierName}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier POC"
            name="carrierPOC"
            value={data.carrierPOC}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Contact Number"
            name="carrierContact"
            value={data.carrierContact}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "55%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="email"
            label="Carrier Email Address"
            name="carrierEmail"
            value={data.carrierEmail}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Shipper Rate"
            name="shipperRate"
            value={data.shipperRate}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Rate"
            name="carrierRate"
            value={data.carrierRate}
            onChange={handleEdit}
            readOnly={!isEditable}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Net Margin"
            name="margin"
            value={data.margin}
            readOnly
          />

          <TextField
            sx={{ height: "70px", width: "20%", mr: "43%", mb: "2%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Broker"
            name="broker"
            value={data.brokerName}
            readOnly
          />

          {/* <TextField
            
            sx={{ height: "70px", width: "27%", mb: "2%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="date"
            label="Invoicing Date"
            name="invoiceDate"
            value={
              data.invoiceDate ? data.invoiceDate.toString().slice(0, 10) : ""
            }
            readOnly
          /> */}

          <DatePicker
            sx={{ height: "70px", width: "27%", mb: "2%" }}
            label="Invoicing Date"
            name="invoiceDate"
            value={data.invoiceDate ? dayjs(data.invoiceDate) : null}
            readOnly
          />
          <br />

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
                    value={d.brokerName}
                    readOnly
                  />
                  <TextField
                    sx={{ height: "70px", width: "20%", mr: "3%", mb: "1%" }}
                    InputLabelProps={{
                      style: { fontSize: 15, fontWeight: "bold" },
                    }}
                    type="text"
                    name="sharedWithPercentage"
                    value={d.sharedPercentage}
                    readOnly
                  />
                </div>
              );
            })
          ) : (
            <br />
          )}

          <Button
            variant="contained"
            sx={{ width: "20%", mr: "43%" }}
            onClick={handleSubmit}
            disabled={!isEditable}
          >
            {" "}
            Submit From{" "}
          </Button>

          <Button
            variant="contained"
            color="success"
            sx={{ width: "27%" }}
            hidden={!isEditable}
            onClick={handlePayment}
          >
            {" "}
            Request for Payment{" "}
          </Button>
          <br />
          {!isEditable ? (
            <h3>
              Payment is already{" "}
              {init.paymentStatusId === 2 ? "Requested" : "Processed"}
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
