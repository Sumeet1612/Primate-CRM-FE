import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { createLoad, handleApiError, loadActiveBrokers } from "../../api/api";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as dayjs from "dayjs";
import "./load.css";

function NewLoad() {
  const [sendData, setSendData] = useState({
    loadNumber: "",
    shipperName: "",
    pickupLocation: "",
    deliveryLocation: "",
    bookingDate: "",
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
    netMargin: "",
    invoicingDate: "",
    paymentDate: "",
    brokerId: "",
    additionalBroker: [],
  });
  const [availableBrokers, setAvailableBrokers] = useState([]);
  const [brokerName, setBrokerName] = useState("XXX");
  const [isLoading, setIsLoading] = useState(false);

  const history = useNavigate();
  useEffect(() => {
    console.log("start test");
    if (sessionStorage.getItem("UserId")) {
      setIsLoading(true);
      loadActiveBrokers()
        .then((res) => {
          setAvailableBrokers(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          handleApiError(err);
        });
      setSendData((state) => {
        return { ...state, brokerId: sessionStorage.getItem("UserId") };
      });
    }
  }, []);

  useEffect(() => {
    if (availableBrokers.length > 0) {
      setBrokerName(() => {
        return availableBrokers.filter(
          (x) => x.id === parseInt(sessionStorage.getItem("UserId"))
        )[0].userName;
      });
    }
  }, [availableBrokers]);

  const handleMultipleBrokers = (e, index) => {
    let value = e.target.value;
    let feildName = e.target.name;
    const updatedBrokers = [...additionalBrokers];
    updatedBrokers[index][feildName] = value;
    setAdditionalBrokers(() => {
      return updatedBrokers;
    });
    setSendData((prevState) => {
      return { ...prevState, additionalBroker: additionalBrokers };
    });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;

    setSendData((state) => {
      return { ...state, [feildName]: value };
    });

    if (feildName === "shipperRate" || feildName === "carrierRate") {
      setSendData((state) => {
        let netMarginValue = state.shipperRate - state.carrierRate;
        return { ...state, netMargin: netMarginValue };
      });
    }
  };
  const [additionalBrokers, setAdditionalBrokers] = useState([]);

  const undoBroker = (index) => {
    setAdditionalBrokers((s) => {
      let arr = [...s];
      arr.splice(index, 1);
      return arr;
    });
  };

  const manageBrokers = () => {
    setAdditionalBrokers((state) => {
      return [
        ...state,
        {
          brokerId: "",
          sharedPercentage: "",
        },
      ];
    });
  };

  const handleSubmit = () => {
    console.log(sendData);
    createLoad(sendData)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (res.data?.additionalBrokersCreated && res.data?.loadCreated) {
            alert("Load created successfully");
            setSendData({
              loadNumber: "",
              shipperName: "",
              pickupLocation: "",
              deliveryLocation: "",
              bookingDate: "",
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
              netMargin: "",
              invoicingDate: "",
              paymentDate: "",
              brokerId: "",
              additionalBroker: [],
            });
            history("/Primate-CRM-FE/");
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
          fontSize: "25px",
        }}
      >
        Add a New Load
      </h1>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <div>
          <TextField
            required
            sx={{ height: "80px", width: "20%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="loadNumber"
            label="Enter Load Number"
            name="loadNumber"
            value={sendData.loadNumber}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "30%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="shipperName"
            label="Enter Shipper Name"
            name="shipperName"
            value={sendData.shipperName}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "30%", mr: "10%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="loadDescription"
            label="Load Description"
            name="loadDescription"
            value={sendData.loadDescription}
            onChange={handleChange}
          />
          <br />

          <TextField
            required
            sx={{ height: "80px", width: "40%", mr: "10%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="pickupLocation"
            label="Enter Pickup City, State"
            name="pickupLocation"
            value={sendData.pickupLocation}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "40%", mr: "10%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="deliveryLocation"
            label="Enter Delivery City, State"
            name="deliveryLocation"
            value={sendData.deliveryLocation}
            onChange={handleChange}
          />
          <br />

          <DatePicker
            sx={{ height: "80px", width: "27%", mr: "4.5%" }}
            required
            id="bookingDate"
            label="Booking Date"
            name="bookingDate"
            value={sendData.bookingDate ? dayjs(sendData.bookingDate) : null}
            onChange={(date) => {
              // console.log (date)
              setSendData((prev) => {
                return {
                  ...prev,
                  bookingDate: dayjs(date).format("MM/DD/YYYY"),
                };
              });
            }}
          />

          <DatePicker
            sx={{ height: "80px", width: "27%", mr: "4.5%" }}
            required
            id="pickupDate"
            name="pickupDate"
            label="Pickup Date"
            value={sendData.pickupDate ? dayjs(sendData.pickupDate) : null}
            onChange={(date) => {
              setSendData((prev) => {
                console.log("11");
                return {
                  ...prev,
                  pickupDate: dayjs(date).format("MM/DD/YYYY"),
                };
              });
            }}
          />

          <DatePicker
            sx={{ height: "80px", width: "27%", mr: "10%" }}
            required
            id="deliveryDate"
            label="Delivery Date"
            name="deliveryDate"
            value={sendData.deliveryDate ? dayjs(sendData.deliveryDate) : null}
            onChange={(date) => {
              setSendData((prev) => {
                return {
                  ...prev,
                  deliveryDate: dayjs(date).format("MM/DD/YYYY"),
                };
              });
            }}
          />
          <br />

          <TextField
            required
            sx={{ height: "80px", width: "20%", mr: "3%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="broker"
            label="Broker"
            name="brokerId"
            value={brokerName}
            readOnly
          />

          <Button
            variant="contained"
            color="success"
            onClick={manageBrokers}
            endIcon={<AddIcon />}
            sx={{ width: "10%" }}
          >
            Add
          </Button>
          <i
            style={{
              marginLeft: "15px",
              fontSize: "15px",
              wordWrap: "break-word",
            }}
          >
            Click the button to add Additional Broker and shared Commission
            Percentage
          </i>
          <br />

          {additionalBrokers ? (
            additionalBrokers.map((additionalBroker, index) => {
              return (
                <div key={index}>
                  <Select
                    sx={{ height: "55px", width: "20%", mb: "3%", mr: "4.5%" }}
                    name="brokerId"
                    value={additionalBroker.brokerId}
                    onChange={(e) => handleMultipleBrokers(e, index)}
                  >
                    <MenuItem value="">Select an option</MenuItem>
                    {availableBrokers.map((availableBroker) => {
                      return (
                        <MenuItem
                          key={availableBroker.id}
                          value={availableBroker.id}
                        >
                          {availableBroker.userName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <TextField
                    required
                    sx={{ height: "80px", width: "20%", mr: "3%" }}
                    type="text"
                    id="sharedPercentage"
                    label="Shared Percentage"
                    name="sharedPercentage"
                    value={additionalBroker.sharedPercentage}
                    onChange={(e) => handleMultipleBrokers(e, index)}
                  />
                  <button
                    onClick={() => {
                      undoBroker(index);
                    }}
                  >
                    {" "}
                    x{" "}
                  </button>
                  <br />
                </div>
              );
            })
          ) : (
            <br />
          )}
          <TextField
            required
            sx={{ height: "80px", width: "20%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierMC"
            label="Carrier MC Number"
            name="carrierMC"
            value={sendData.carrierMC}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "30%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierName"
            label="Carrier Name"
            name="carrierName"
            value={sendData.carrierName}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "30%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierPOC"
            label="Carrier POC"
            name="carrierPOC"
            value={sendData.carrierPOC}
            onChange={handleChange}
          />
          <br />

          <TextField
            required
            sx={{ height: "80px", width: "30%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierContact"
            label="Carrier Phone Number"
            name="carrierContact"
            value={sendData.carrierContact}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "55%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="email"
            id="carrierEmail"
            label="Carrier Email Address"
            name="carrierEmail"
            value={sendData.carrierEmail}
            onChange={handleChange}
          />
          <br />

          <TextField
            required
            sx={{ height: "80px", width: "27%", mr: "4.5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="shipperRate"
            label="Shipper Rate"
            name="shipperRate"
            value={sendData.shipperRate}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "27%", mr: "4.5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="carrierRate"
            label="Carrier Rate"
            name="carrierRate"
            value={sendData.carrierRate}
            onChange={handleChange}
          />

          <TextField
            required
            sx={{ height: "80px", width: "27%", mr: "4.5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            id="netmargin"
            label="Net Margin"
            name="netMargin"
            value={sendData.netMargin}
            readOnly
          />
          <br />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "10%", ml: "40%" }}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
export default NewLoad;
