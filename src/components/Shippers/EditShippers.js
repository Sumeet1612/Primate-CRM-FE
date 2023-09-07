import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editShipper, getShipper, handleApiError } from "../../api/api";
import { Button } from "@mui/material";

function EditShippers() {

    const { id } = useParams();
    const [init, setInit]= useState([]);
    const [shipperData, setShipperData] = useState({
        shipperName: "",
        address: "",
        poc: "",
        contact: "",
        email: "",
        website:"",
      });

  useEffect(() => {
    getShipper(id)
    .then((res)=>{
      if(res.status===200){
        setShipperData(res.data);
        setInit(res.data);
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })
  },[id]);

  const handleChange=(e)=>{
    let value = e.target.value;
    let feildName = e.target.name;
    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  }


  const handleSubmit=()=>{
    const payload = [];
    Object.keys(shipperData).forEach((e) => {
      if (shipperData[e] !== init[e]) {
        payload.push({
          path: `/${e}`,
          op: "replace",
          value: `${shipperData[e]}`,
        });
      }
    });

    editShipper(id,payload)
    .then((res)=>{
      if(res.status===200 && res.data===true){
        alert("Shiiper Modified successfully !!")
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })
  }
  
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
            sx={{ height: "70px", width: "60%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            label="Complete Address"
            name="address"
            value={shipperData.address}
            onChange={handleChange}
          />

          <TextField
            sx={{ height: "70px", width: "25%", mr: "5%" }}
            InputLabelProps={{ style: { fontSize: 15 } }}
            type="text"
            label="Website"
            name="website"
            value={shipperData.website}
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
            color="primary"
            sx={{ width: "25%", ml: "32.5%" }}
            onClick={handleSubmit}
          >
            {" "}
            Save Changes{" "}
          </Button>
        </div>
      </div>
    </>
  );
}
export default EditShippers;
