import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  createAggregateLoads,
  getFailedAggregateLoads,
  handleApiError,
} from "../../api/api";
import { showNotification } from "../../api/Notification";
import { loggedInUserRole } from "../../api/validation";
import { useNavigate } from "react-router-dom";

const acceptedFileTypes = [".csv", ".xls", ".xlsx"];

function AggregateLoads() {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailedLoadsLoading, setIsFailedLoadsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [failedLoadRows, setFailedLoadRows] = useState([]);
  const [failedLoadGridApi, setFailedLoadGridApi] = useState(null);
  const [reloadFailedLoads, setReloadFailedLoads] = useState(0);
  const [failedLoadColumnDefs] = useState([
    { field: "loadNumber", filter: true, sortable: true, resizable: true, headerName: "LOAD #", headerClass: "center-header" },
    {
      field: "errorMessage",
      headerName: "ERROR MESSAGE",
      filter: true,
      sortable: true,
      resizable: true,
      minWidth: 500,
      headerClass: "center-header",
    },
    {
      field: "uploadedOn",
      filter: true,
      sortable: true,
      resizable: true,
      headerName: "UPLOADED ON",
      headerClass: "center-header",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "",
    },
  ]);
  const nav = useNavigate();
  useEffect(() => {
    const userRole = loggedInUserRole();
    if(userRole !== 1) {
      //only admin can upload aggregate loads, so if the user is not an admin, redirect them to the home page
      showNotification("You do not have permission to access this page", "error");
      nav("/");
      return;
    }
    setIsFailedLoadsLoading(true);
    getFailedAggregateLoads()
      .then((res) => {
        if (res.status === 200) {
          setFailedLoadRows(res.data || []);
        }
        setIsFailedLoadsLoading(false);
      })
      .catch((err) => {
        setIsFailedLoadsLoading(false);
        handleApiError(err);
      });
  }, [reloadFailedLoads]);

  const formatFileSize = (size) => {
    if (!size) {
      return "0 KB";
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndSetFile = (file) => {
    if (!file) {
      return;
    }

    const extension = `.${file.name.split(".").pop().toLowerCase()}`;
    if (!acceptedFileTypes.includes(extension)) {
      showNotification("Please upload only Excel or CSV files", "warning");
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleFileChange = (event) => {
    validateAndSetFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndSetFile(event.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      showNotification("No file selected", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("loadFile", selectedFile, selectedFile.name);

    setIsLoading(true);
    createAggregateLoads(formData)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          setUploadResult(res.data);
          setSelectedFile(null);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          setReloadFailedLoads((prev) => prev + 1);
          showNotification("Loads uploaded successfully");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        handleApiError(err);
      });
  };

  const createdLoads =
    uploadResult?.createdLoads ||
    uploadResult?.loadsCreated ||
    uploadResult?.createdCount ||
    uploadResult?.successCount;
  const failedLoads =
    uploadResult?.failedLoads ||
    uploadResult?.failedCount ||
    uploadResult?.errorCount;

  return (
    <div className="PageLayout aggregate-loads-page">
      <h1 className="page-title-bar">Add Aggregate Loads</h1>
      {isLoading ? <LinearProgress sx={{ width: "96%", mb: 2 }} /> : <></>}

      <Box className="aggregate-loads-content">
        <Paper
          elevation={0}
          className={`aggregate-upload-panel ${isDragging ? "dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <CloudUploadIcon className="aggregate-upload-icon" />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Upload loads file
          </Typography>
          <Typography sx={{ color: "#53646f", mb: 3, maxWidth: 560 }}>
            Select or drop a CSV or Excel file to create multiple loads in one
            request.
          </Typography>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              color="info"
              startIcon={<DescriptionIcon />}
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
            >
              Choose File
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<FileUploadIcon />}
              onClick={handleSubmit}
              disabled={isLoading || !selectedFile}
            >
              Upload Loads
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} className="aggregate-details-panel">
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            File details
          </Typography>

          {selectedFile ? (
            <Box className="selected-file-row">
              <DescriptionIcon color="info" />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 700, wordBreak: "break-word" }}>
                  {selectedFile.name}
                </Typography>
                <Typography sx={{ color: "#65757f", fontSize: 14 }}>
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
              <Button
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => {
                  setSelectedFile(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
                disabled={isLoading}
              >
                Remove
              </Button>
            </Box>
          ) : (
            <Alert severity="info">
              Supported formats are CSV, XLS, and XLSX.
            </Alert>
          )}

          {uploadResult ? (
            <Box className="upload-result-box">
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Upload complete
              </Typography>
              {createdLoads !== undefined ? (
                <Typography>Created loads: {createdLoads}</Typography>
              ) : (
                <></>
              )}
              {failedLoads !== undefined ? (
                <Typography>Failed rows: {failedLoads}</Typography>
              ) : (
                <></>
              )}
              {uploadResult?.message ? (
                <Typography sx={{ mt: 1 }}>{uploadResult.message}</Typography>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}
        </Paper>
      </Box>

      <Box className="failed-loads-section">
        <h1 className="page-title-bar failed-loads-title">Failed Loads</h1>
        {isFailedLoadsLoading ? (
          <LinearProgress sx={{ width: "96%", mb: 2 }} />
        ) : (
          <></>
        )}
        <Box className="failed-loads-toolbar">
          <Typography sx={{ color: "#53646f" }}>
            Loads that failed during Excel or CSV processing and were not
            created in the system.
          </Typography>
          {failedLoadRows?.length > 0 ? (
            <Button
              variant="contained"
              color="success"
              onClick={() =>
                failedLoadGridApi?.exportDataAsCsv({
                  fileName: "FailedAggregateLoads.csv",
                })
              }
            >
              Export To Excel
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <div className="ag-theme-alpine failed-loads-grid" style={{ height: "50vh", width: "80%" }}>
          <AgGridReact
            rowData={failedLoadRows}
            columnDefs={failedLoadColumnDefs}
            pagination={true}
            paginationAutoPageSize={true}
            onGridReady={(event) => setFailedLoadGridApi(event.api)}
            enableCellTextSelection={true}
          />
        </div>
      </Box>
    </div>
  );
}

export default AggregateLoads;
