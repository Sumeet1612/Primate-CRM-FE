import { useEffect, useState } from "react";
import { deleteLoad, editLoad, getLoadOnId, handleApiError } from "../../api/api";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
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
  const nav= useNavigate();

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
          
        }
        else if(res.status===204){
          alert('Load Not Found');
          nav('/Primate-CRM-FE/viewLoads')
        }
        setIsLoading(false);
      })
      .catch((err) => {
        handleApiError(err);
        setIsLoading(false);
      });
  }, [id, isEditable,nav]);

  const handleSubmit = () => {
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

    editLoad(init.loadNumber, payload)
      .then((res) => {
        if (res.data === true) {
          alert("Load updated !!");
          setInit(data)
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

    editLoad(init.loadNumber, payload)
      .then((res) => {
        alert("Payment Requested !!")
        setInit(data)
      })
      .catch((err) => {
        handleApiError(err);
      });

    setIsEditable(false);
  };

  const handleDelete=()=>{
    deleteLoad(data.loadNumber)
    .then((res)=>{
      if(res.status===200){
        if(res.data.message==='Load Deleted: True'){
          alert('Load Deleted !!')
          nav('/Primate-CRM-FE/viewLoads')
        }
        else if(res.data?.message==='Cannot Delete Load as it is already proceesed for payment'){
          alert(res.data.message);
        }
        else{
          alert('Some went wrong. Please retry.')
        }
      }
    })
    .catch((err)=>{
      handleApiError(err)
    })
  }

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
            InputProps={{readOnly:true}}
          />

          <TextField
            sx={{ height: "55px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Shipper Name"
            name="shipperName"
            value={data.shipperName}
            InputProps={{readOnly:true}}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Load Description"
            name="loadDescription"
            value={data.loadDescription}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Pickup City and State"
            name="pickupLocation"
            value={data.pickupLocation}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Delivery City and State"
            name="deliveryLocation"
            value={data.deliveryLocation}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
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
            readOnly={!isEditable}
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
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Name"
            name="carrierName"
            value={data.carrierName}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier POC"
            name="carrierPOC"
            value={data.carrierPOC}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Contact Number"
            name="carrierContact"
            value={data.carrierContact}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "55%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="email"
            label="Carrier Email Address"
            name="carrierEmail"
            value={data.carrierEmail}
            InputProps={{readOnly:!isEditable}}
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
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Carrier Rate"
            name="carrierRate"
            value={data.carrierRate}
            onChange={handleEdit}
            InputProps={{readOnly:!isEditable}}
          />

          <TextField
            sx={{ height: "70px", width: "27%", mr: "4.5%", mb: "1%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Net Margin"
            name="margin"
            value={data.margin}
            InputProps={{readOnly:true}}
          />

          <TextField
            sx={{ height: "70px", width: "20%", mr: "43%", mb: "2%" }}
            InputLabelProps={{ style: { fontSize: 15, fontWeight: "bold" } }}
            type="text"
            label="Broker"
            name="broker"
            value={data.brokerName}
            InputProps={{readOnly:true}}
          />


          <DatePicker
            sx={{ height: "70px", width: "27%", mb: "2%" }}
            label="Invoicing Date"
            name="invoiceDate"
            value={data.invoiceDate ? dayjs(data.invoiceDate) : null}
            readOnly={true}
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
                    InputProps={{readOnly:true}}
                  />
                  <TextField
                    sx={{ height: "70px", width: "20%", mr: "3%", mb: "1%" }}
                    InputLabelProps={{
                      style: { fontSize: 15, fontWeight: "bold" },
                    }}
                    type="text"
                    name="sharedWithPercentage"
                    value={d.sharedPercentage}
                    InputProps={{readOnly:true}}
                  />
                </div>
              );
            })
          ) : (
            <br />
          )}

          <Button
            variant="contained"
            sx={{ width: "20%"}}
            onClick={handleSubmit}
            disabled={!isEditable}
          >
            {" "}
            Submit From{" "}
          </Button>

          <Button
            variant="contained"
            color="success"
            sx={{ width: "20%" }}
            onClick={handleDelete}
            disabled={!isEditable}
          >
            {" "}
            DELETE LOAD{" "}
          </Button>

          <Button
            variant="contained"
            color="success"
            sx={{ width: "27%" }}
            disabled={!isEditable}
            onClick={handlePayment}
          >
            {" "}
            Request for Payment{" "}
          </Button>
          <br />
          {!isEditable ? (
            <h3>
              Payment is already{" "}
              {init.paymentStatusId === 2 ? "Requested" : init.paymentStatusId===3? "Processed": ""}
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
