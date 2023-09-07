import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditShippers() {

    const { id } = useParams();
    const [shipperData, setShipperData] = useState({
        shipperName: "",
        address: "",
        poc: "",
        contact: "",
        email: "",
        website:"",
      });

  useEffect(() => {
    
  },[]);
  
  return (
    <>
      <div className="PageLayout EditShippers">
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
          Edit Shipper info
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
          />

          <TextField
            sx={{ height: "70px", width: "40%", mr: "10%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            label="Person of Contact"
            name="poc"
            value={shipperData.poc}
          />

          <TextField
            sx={{ height: "70px", width: "60%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            label="Complete Address"
            name="address"
            value={shipperData.address}
          />

          <TextField
            sx={{ height: "70px", width: "25%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            label="Website"
            name="website"
            value={shipperData.website}
          />

          <TextField
            sx={{ height: "70px", width: "30%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            label="Contact Nummber"
            name="contact"
            value={shipperData.contact}
          />

          <TextField
            sx={{ height: "70px", width: "55%", mr: "10%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="email"
            label="Email"
            name="email"
            value={shipperData.email}
          />

          {/* <Button
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
            sx={{ width: "25%", ml: "32.5%" }}
            onClick={handleSubmit}
          >
            {" "}
            Save Changes{" "}
          </Button> */}
        </div>
      </div>
    </>
  );
}
export default EditShippers;
