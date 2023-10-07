import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editShipper, getShipper, handleApiError, deleteShipper } from "../../api/api";
import { Button } from "@mui/material";
import { checkPermissionToNavigation } from "../../api/validation";

function EditShippers() {

    const { id } = useParams();
    const nav= useNavigate();
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
        if(!checkPermissionToNavigation(res.data)){
          alert("You don't have the permission to view/edit the requested Shipper")
            nav('/Primate-CRM-FE/shippers')
        }
      }
      else if(res.status===204){
        alert('Shipper Not Found');
        nav('/Primate-CRM-FE/shippers')
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })
  },[id,nav]);

  const handleChange=(e)=>{
    let value = e.target.value;
    let feildName = e.target.name;
    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  }

  const handleDelete=()=>{
    deleteShipper(id)
    .then((res)=>{
      if(res.status===200){
        if((res.data.message==='Deleted Status : True')){
          alert('Shipper Deleted !!')
          nav('/Primate-CRM-FE/shippers')
        }
        else if(res.data?.message==='Cannot Delete Shipper as it is associated with some load'){
          alert('Cannot delete shipper as it is used in some load')
        }
        else{
          alert('Something went Wrong. Please retry.')
        }
      }
    })
    .catch((err)=>{
      handleApiError(err)
    })
  }

  const handleSubmit=()=>{

    let blankField = '';
    Object.keys(shipperData).every(fe=>{
      if(shipperData[fe]===''){
        blankField= fe;
        return false;
      }
      return true;
    })

    if(blankField !== ''){
      alert("Error: All fields are Mandatory to submit your changes");
      return;
    }

    let payload = [];
    Object.keys(shipperData).forEach((e) => {
      if (shipperData[e] !== init[e]) {
        payload.push({
          path: `/${e}`,
          op: "replace",
          value: `${shipperData[e]}`,
        });
      }
    });

    if(payload?.length>0){     
      editShipper(id,payload)
      .then((res)=>{
        if(res.status===200 && res.data===true){
          alert("Shipper Modified successfully !!")
          setInit(shipperData)
        }
      })
      .catch((err)=>{
        handleApiError(err);
      })
    }
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
            readOnly
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

          <Button
            variant="contained"
            color="error"
            sx={{ width: "25%", ml: "32.5%" }}
            onClick={handleDelete}
          >
            {" "}
            
            REMOVE SHIPPER{" "}
          </Button>
        </div>
      </div>
    </>
  );
}
export default EditShippers;
