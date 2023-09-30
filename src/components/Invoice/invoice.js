import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import * as dayjs from "dayjs";
import { useEffect, useState } from "react";
import { generateInvoice, getPrepInvoice, handleApiError } from "../../api/api";
import { loggedInUserId } from "../../api/validation";

function Invoice() {

  const currentDate= new Date()
  const dueDate= new Date();
  dueDate.setDate(dueDate.getDate()+15)

  const [preInvoice,setPreInvoice]=useState({
    invoiceNumber: '',
    brokerId: '',
    grossUsd: '',
    adjustmentDeduction: '',
    payableUsd: '',
    phoneBillUsd: '',
    grossInr: '',
    deductionInr: '',
    tds: '',
    netPayable: '',
    brokerProfile:{
      userName:'',
      accountDetails:[{
        id:'',
        ownerName:'',
        pan:'',
        ifsc:'',
        bank:''
      }]
    },
    paidToAccount:'0'
  });

  const [others,setOthers]=useState({
    refresh:false,
    preInvoiceLoading:false,
    prevInvoiceLoading:false
  })
  const brokerId= loggedInUserId();

  useEffect(()=>{
      getPrepInvoice(brokerId)
    .then((res)=>{
      if(res.status===200){
        setPreInvoice((prevState)=>{
          return {...prevState, ...res.data}
        })
      }
    })
    .catch((err)=>{
      handleApiError(err);
    })
  },[brokerId],others.refresh)


  const handleAccount=(event)=>{
    setPreInvoice((prevState)=>{
      return {...prevState,paidToAccount:event.target.value}
    })
  }

  const handleInvoiceCreation=()=>{
    generateInvoice(preInvoice)
    .then((res)=>{
      if(res.status===200){
        setOthers((prev)=>{return({...prev,refresh:!prev.refresh})});
        alert("invoice generated")
      }
    })
    .catch((err)=>{
      handleApiError(err)
    })
  }

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
          sx={{ height: "70px", width: "25%", mr: "10%", mb: "0.25%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.brokerProfile?.userName}
        />

        <Select name="paidToAccount"
          value={preInvoice.paidToAccount}
          onChange={handleAccount}>
            <MenuItem value="0" disabled>
              <em> Select Owner-Bank in which you want Payment</em>
            </MenuItem>
            {preInvoice.brokerProfile.accountDetails.map((acnt)=>{
              return(
                <MenuItem key={acnt.id} value={acnt.id}>{acnt.ownerName}-{acnt.bankName}</MenuItem>
              )
            })}
          </Select> 

          {preInvoice?.paidToAccount!=="0" ?
          (<div> 
            <TextField
              label="Bank Account Number"
              type="text"
              sx={{ height: "70px", width: "22%", mr: "10%", mb: "1%" }}
              InputLabelProps={{ style: { fontSize: 15 } }}
              value={preInvoice.brokerProfile.accountDetails.filter(x=>x.id===preInvoice.paidToAccount)[0].id}
              InputProps={{readOnly:true}}
            />

             <TextField
              label="IFSC"
              type="text"
              sx={{ height: "70px", width: "22%", mr: "10%", mb: "1%" }}
              InputLabelProps={{ style: { fontSize: 15 } }}
              value={preInvoice.brokerProfile.accountDetails.filter(x=>x.id===preInvoice.paidToAccount)[0].ifsc}
              InputProps={{readOnly:true}}
            />

             <TextField
              label="Owner PAN"
              type="text"
              sx={{ height: "70px", width: "22%", mr: "10%", mb: "1%" }}
              InputLabelProps={{ style: { fontSize: 15 } }}
              value={preInvoice.brokerProfile.accountDetails.filter(x=>x.id===preInvoice.paidToAccount)[0].pan}
              InputProps={{readOnly:true}}
            />
            </div>): (<></>)}

        <TextField
          label="Invoice #"
          type="text"
          sx={{ height: "70px", width: "22%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          value={preInvoice.invoiceNumber}
          InputProps={{readOnly:true}}
        />
        <TextField
          label="Bill To"
          type="text"
          sx={{ height: "70px", width: "53%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value="Primate Outsorcing Ltd"
        />
        <DatePicker
          label="Invoiced On"
          type="date"
          sx={{ height: "70px", width: "27%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={dayjs(currentDate)}
        />
        <TextField
          label="Payment Terms"
          type="text"
          sx={{
            height: "70px",
            width: "15%",
            mr: "10%",
            mb: "1%",
          }}
          InputLabelProps={{style: { fontSize: 15 }}}
          inputProps={{readOnly:true}}
          value="NET 15"
        />
        <DatePicker
          label="Due Date"
          type="date"
          sx={{ height: "70px", width: "27%", mr: "10.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={dayjs(dueDate)}
        />

        <TextField
          label="Total Margin"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.grossUsd}
        />
        <TextField
          label="Adjustment (If any)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.adjustmentDeduction}
        />
        <TextField
          label="Payable USD"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.payableUsd}
        />
        <TextField
          label="Phone Bill (USD)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.phoneBillUsd}
        />

        <TextField
          label="Converted INR"
          type="text"
          sx={{ height: "70px", width: "16%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.grossInr}
        />

        <TextField
          label="Deductions (if any)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.deductionInr}
        />

        <TextField
          label={"TDS : "+ preInvoice.tds +" %"}
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.tds/100 * (preInvoice.grossInr-preInvoice.deductionInr)}
        />

        <TextField
          label="Net Payable"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={preInvoice.netPayable}
        />

        <Button variant="contained" color="info" 
        style={{height:"50px", width:"15%"}}
        disabled={preInvoice.grossUsd===0 || preInvoice.paidToAccount==="0"}
        onClick={handleInvoiceCreation}
        >
          Generate Invoice
          </Button>
      </div>
    </>
  );
}
export default Invoice;
