import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  editShipper,
  getShipper,
  handleApiError,
  deleteShipper,
  getLoadsForShipper,
} from "../../api/api";
import { Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { checkPermissionToNavigation } from "../../api/validation";

function EditShippers() {
  const { id } = useParams();
  const nav = useNavigate();
  const [init, setInit] = useState([]);
  const [shipperData, setShipperData] = useState({
    shipperName: "",
    address: "",
    poc: "",
    contact: "",
    email: "",
    website: "",
  });

  const formatDate = (params) => {
    if (params?.value?.toString().slice(0, 10) === undefined) {
      return "";
    } else {
      let date = new Date(params?.value?.toString());
      return date.toLocaleDateString("en-US");
    }
  };

  const [isloading, setIsLoading] = useState(false);
  const [loads, setLoads] = useState([]);
  const [columnDefs] = useState([
    {
      field: "loadNumber",
      filter: true,
      sortable: true,
      tooltipField: "loadNumber",
      width: 120,
      headerName: "LOAD #",
      resizable: true,
    },
    {
      field: "shipperName",
      filter: true,
      sortable: true,
      tooltipField: "shipperName",
      width: 200,
      headerName: "SHIPPER NAME",
      resizable: true,
    },
    {
      field: "pickupLocation",
      filter: true,
      sortable: true,
      tooltipField: "pickupLocation",
      width: 150,
      headerName: "ORIGIN",
      resizable: true,
    },
    {
      field: "deliveryLocation",
      filter: true,
      sortable: true,
      tooltipField: "deliveryLocation",
      width: 150,
      headerName: "DESTINATION",
      resizable: true,
    },
    {
      field: "pickupDate",
      filter: "true",
      sortable: true,
      tooltipField: "pickupDate",
      width: 150,
      headerName: "PICKUP DATE",
      resizable: true,
      valueFormatter: (params) => formatDate(params),
    },
    {
      field: "deliveryDate",
      filter: "true",
      sortable: true,
      tooltipField: "deliveryDate",
      width: 150,
      headerName: "DELIVERY DATE",
      resizable: true,
      valueFormatter: (params) => formatDate(params),
    },
    {
      field: "brokerName",
      filter: true,
      sortable: true,
      width: 120,
      headerName: "BROKER",
      resizable: true,
    }, // We need to display Broker to the Admin, but this coulmn will no be needed in the User section.
    {
      field: "carrierMC",
      filter: true,
      sortable: true,
      tooltipField: "carrierMC",
      width: 135,
      headerName: "CARRIER MC",
      resizable: true,
    },
    {
      field: "carrierName",
      filter: true,
      sortable: true,
      tooltipField: "carrierName",
      width: 200,
      headerName: "CARRIER NAME",
      resizable: true,
    },
    {
      field: "carrierPOC",
      filter: true,
      sortable: true,
      tooltipField: "carrierPOC",
      width: 150,
      headerName: "CARRIER POC",
      resizable: true,
    },
    {
      field: "carrierContact",
      filter: true,
      sortable: true,
      tooltipField: "carrierContact",
      width: 150,
      headerName: "CARRIER PHONE #",
      resizable: true,
    },
    {
      field: "carrierEmail",
      filter: true,
      sortable: true,
      tooltipField: "carrierEmail",
      width: 250,
      headerName: "CARRIER EMAIL",
      resizable: true,
    },
    {
      field: "shipperRate",
      filter: true,
      sortable: true,
      tooltipField: "shipperRate",
      width: 150,
      headerName: "SHIPPER RATE",
      resizable: true,
    },
    {
      field: "carrierRate",
      filter: true,
      sortable: true,
      tooltipField: "carrierRate",
      width: 150,
      headerName: "CARRIER RATE",
      resizable: true,
    },
    {
      field: "margin",
      filter: true,
      sortable: true,
      tooltipField: "margin",
      width: 120,
      headerName: "MARGIN",
      resizable: true,
    },
    {
      field: "invoiceDate",
      filter: "true",
      sortable: true,
      tooltipField: "invoiceDate",
      width: 150,
      headerName: "INVOICED ON",
      resizable: true,
      valueFormatter: (params) => formatDate(params),
    },
    { field: "mismatched", filter: true, sortable: true, resizable: true },
    // { field: "createdOn", filter: 'true', sortable: true, valueFormatter: params=>formatDate(params), resizable: true  },
    {
      field: "updatedOn",
      filter: "true",
      sortable: true,
      tooltipField: "updatedOn",
      width: 150,
      headerName: "UPDATED ON",
      resizable: true,
      valueFormatter: (params) => formatDate(params),
    },
  ]);

  useEffect(() => {
    setIsLoading(true);
    getShipper(id)
    .then((res)=>{
      if(res.status===200){
        setShipperData(res.data);
        setInit(res.data);
        if(!checkPermissionToNavigation(res.data)){
          alert("You don't have the permission to view/edit the requested Shipper")
            nav('/shippers')
        }
      }
      else if(res.status===204){
        alert('Shipper Not Found');
        nav('/shippers')
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })

    getLoadsForShipper(id)
      .then((res) => {
        if (res.status === 200) {
          setLoads(res.data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        handleApiError(err);
        setIsLoading(false);
      });
  }, [id, nav]);

  const handleChange = (e) => {
    let value = e.target.value;
    let feildName = e.target.name;
    setShipperData((state) => {
      return { ...state, [feildName]: value };
    });
  };

  const handleDelete = () => {
    deleteShipper(id)
    .then((res)=>{
      if(res.status===200){
        if((res.data.message==='Deleted Status : True')){
          alert('Shipper Deleted !!')
          nav('/shippers')
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

  const handleSubmit = () => {
    let blankField = "";
    Object.keys(shipperData).every((fe) => {
      if (shipperData[fe] === "") {
        blankField = fe;
        return false;
      }
      return true;
    });

    if (blankField !== "") {
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

    if (payload?.length > 0) {
      editShipper(id, payload)
        .then((res) => {
          if (res.status === 200 && res.data === true) {
            alert("Shipper Modified successfully !!");
            setInit(shipperData);
          }
        })
        .catch((err) => {
          handleApiError(err);
        });
    }
  };

  const handleOpenLoad = (cellEvent) => {
    let loadId = cellEvent?.data?.loadNumber;
    if (cellEvent?.colDef?.field === "loadNumber") {
      if (window.confirm("Do you want to View/Edit the Load?")) {
        nav(`/editLoad/${loadId}`);
      }
    }
  };

  return (
    <>
      {isloading ? (
        <LinearProgress />
      ) : (
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
                color="primary"
                sx={{ width: "25%" }}
                onClick={handleSubmit}
              >
                {" "}
                Save Changes{" "}
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{ width: "25%"}}
                onClick={handleDelete}
              >
                {" "}
                REMOVE SHIPPER{" "}
              </Button>
            </div>
          </div>
          <br />
          <div
            className="ag-theme-alpine"
            style={{ height: 550, width: "98%" }}
          >
            <AgGridReact
              rowData={loads}
              columnDefs={columnDefs}
              pagination={true}
              paginationAutoPageSize={true}
              onCellClicked={(x) => handleOpenLoad(x)}
            />
          </div>
        </div>
      )}
    </>
  );
}
export default EditShippers;
