import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

function Invoice() {
  return (
    <>
      <div className="PageLayout Invoice">
        <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "90%",
            fontSize: "20px",
          }}
        >
          Invoice
        </h1>

        <TextField
          label="Billed by"
          type="text"
          sx={{ height: "70px", width: "40%", mr: "35%", mb: "0.25%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Invoice #"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Bill To"
          type="text"
          sx={{ height: "70px", width: "53%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Invoiced On"
          type="date"
          sx={{ height: "70px", width: "27%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Payment Terms"
          type="text"
          sx={{
            height: "70px",
            width: "15%",
            mr: "10%",
            mb: "1%",
            mr: "10.5%",
          }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Due Date"
          type="date"
          sx={{ height: "70px", width: "27%", mr: "10.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="PO# (If any)"
          type="text"
          sx={{ height: "70px", width: "27%", mr: "5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Total Margin"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Adjustment (If any)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Payable USD"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Phone Bill"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Converted INR"
          type="text"
          sx={{ height: "70px", width: "16%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Deductions (if any)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="TDS value"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />
        <TextField
          label="Net Payable"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
        />

        <Button variant="contained" color="info" style={{height:"50px", width:"15%"}}>Generate Invoice</Button>

        <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "90%",
            fontSize: "16px",
          }}
        >
          Past Payments
        </h1>
      </div>
    </>
  );
}
export default Invoice;
