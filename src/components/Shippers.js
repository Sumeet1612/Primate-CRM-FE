import { useEffect, useState } from "react";
import { addShipper, getAllShippers, handleApiError } from "../api/api";
import { AgGridReact } from "ag-grid-react";
import LinearProgress from "@mui/material/LinearProgress";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

function Shippers() {
  const [shipperData, setShipperData] = useState({
    shipperName: "",
    address: "",
    poc: "",
    contact: "",
    email: "",
  });

  const [viewShippers, setViewShippers] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [colDef] = useState([
    { field: "id", filter: true, sortable: true },
    { field: "shipperName", filter: true, sortable: true },
    { field: "address", filter: true, sortable: true },
    { field: "poc", filter: true, sortable: true },
    { field: "contact", filter: true, sortable: true },
    { field: "email", filter: true, sortable: true },
    { field: "updatedOn", filter: true, sortable: true },
  ]);

  useEffect(() => {
    setIsLoading(true);
    getAllShippers()
      .then((res) => {
        if (res.status === 200) {
          setViewShippers(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        handleApiError(err);
        setIsLoading(false);
      });
  }, [refresh]);
  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;

    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  };

  const handleSubmit = () => {
    addShipper(shipperData)
      .then((res) => {
        if (res.status === 208) {
          alert("The Shipper already exists!!");
        } else if (res.status === 200) {
          alert("Shipper Added !!");

          setShipperData({
            shipperName: "",
            address: "",
            poc: "",
            contact: "",
            email: "",
          });

          setRefresh(!refresh);
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
        Add a New Shipper
      </h1>
      <br />
      <div>
        <TextField
          sx={{ height: "70px", width: "40%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Company Name"
          name="shipperName"
          value={shipperData.shipperName}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "40%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Person of Contact"
          name="poc"
          value={shipperData.poc}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "90%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Complete Address"
          name="address"
          value={shipperData.address}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "30%", mr: "5%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="text"
          label="Contact Nummber"
          name="contact"
          value={shipperData.contact}
          onChange={handleChange}
        />

        <TextField
          sx={{ height: "70px", width: "55%", mr: "10%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          type="email"
          label="Email"
          name="email"
          value={shipperData.email}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="success"
          endIcon={<AddIcon />}
          sx={{ width: "25%", ml:"32.5%" }}
          onClick={handleSubmit}
        >
          {" "}
          Add Shipper{" "}
        </Button>

        <h3
        style={{
          color: "#fff",
          backgroundColor: "#00b7aa",
          marginBottom: "2%",
          padding: "2%",
          width: "86%",
          fontSize: "18px",
          marginTop:"5%"
        }}
      >
        Manage your Shippers
      </h3>

      </div>
      <br />
      {isloading ? (
        <LinearProgress />
      ) : (
        <div className="ag-theme-alpine" style={{ height: 550, width: 915 }}>
          <AgGridReact rowData={viewShippers} columnDefs={colDef}></AgGridReact>
        </div>
      )}
    </div>
  );
}
export default Shippers;
