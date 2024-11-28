import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import * as dayjs from "dayjs";
import { useEffect, useState } from "react";
import { generateInvoice, getPrepInvoice, handleApiError } from "../../api/api";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import { useNavigate } from "react-router-dom";

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
    deductionUsd: '',
    tds: '',
    netPayable: '',
    brokerProfile:{
      alias:'',
      accountDetails:[{
        id:'',
        ownerName:'',
        pan:'',
        ifsc:'',
        bank:''
      }],
      brokerCharges:[{
        id:0,
        typeId:0,
        description:'',
        amount:0,
        brokerId:0
      }]
    
    },
    paidToAccount:'0',
    description:''
  });

  const [others,setOthers]=useState({
    refresh:false,
    preInvoiceLoading:false,
    prevInvoiceLoading:false
  })
  const brokerId= loggedInUserId();
  const userRole= loggedInUserRole();
  const history= useNavigate();

  useEffect(()=>{
    if(isNaN(brokerId) || isNaN(userRole)){
      history("/login")
      return;
    }
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
  },[brokerId,others.refresh,history, userRole])


  const handleChange=(event)=>{
    let fname= event.target.name;
    let fvalue= event.target.value
    setPreInvoice((prevState)=>{
      return {...prevState,[fname]:fvalue}
    })
  }

  const handleInvoiceCreation=()=>{
    if(preInvoice.description==="" || preInvoice.description===null){
      alert("Please provide invoice description")
      return;
    }

    generateInvoice(preInvoice)
    .then((res)=>{
      if(res.status===200){
        setOthers((prev)=>{return({...prev,refresh:!prev.refresh})});
        alert("invoice generated")
        history("/invoices")
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
          value={preInvoice.brokerProfile?.alias}
        />

        <Select name="paidToAccount"
          value={preInvoice.paidToAccount}
          onChange={handleChange}>
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
          value="Primate Outsourcing PVT. LTD."
        />
        <DatePicker
          label="Invoiced On"
          type="date"
          sx={{ height: "70px", width: "27%", mr: "10%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          readOnly={true}
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
          readOnly={true}
          value={dayjs(dueDate)}
        />

        <TextField
          label="Total Margin"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.grossUsd).toFixed(2)}
        />
        <TextField
          label="Adjustment (If any)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.adjustmentDeduction).toFixed(2)}
        />
        
        <TextField
          label="Phone Bill (USD)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.phoneBillUsd).toFixed(2)}
        />
        <TextField
          label="Deduction (USD)"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.deductionUsd).toFixed(2)}
        />

        <TextField
          label="Payable USD"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.payableUsd).toFixed(2)}
        />

        <TextField
          label="Converted INR"
          type="text"
          sx={{ height: "70px", width: "16%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.grossInr).toFixed(2)}
        />

        <TextField
          label="Deduction INR"
          type="text"
          sx={{ height: "70px", width: "16%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.deductionInr).toFixed(2)}
        />

        <TextField
          label="Payable INR"
          type="text"
          sx={{ height: "70px", width: "16%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.grossInr-preInvoice.deductionInr).toFixed(2)}
        />

        <TextField
          label={"TDS : "+ preInvoice.tds +" %"}
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.tds/100 * (preInvoice.grossInr-preInvoice.deductionInr)).toFixed(3)}
        />

        <TextField
          label="Net Payable"
          type="text"
          sx={{ height: "70px", width: "15%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          InputProps={{readOnly:true}}
          value={Number(preInvoice.netPayable).toFixed(2)}
        />

        <TextField
          label="Invoice Description*"
          type="text"
          name="description"
          sx={{ height: "70px", width: "40%", mr: "3.5%", mb: "1%" }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          value={preInvoice.description}
          onChange={handleChange}
        />
        <br/>
        <h2
            style={{
              color: "white",
              backgroundColor: "black",
              marginBottom: "2%",
              padding: "0.5%",
              width: "93%",
              fontSize: "15px",
            }}
          >
            Additional Charges Details{" "}
          </h2>
        <div>
              {preInvoice?.brokerProfile?.brokerCharges?.length>0 ?(<>
              {preInvoice?.brokerProfile?.brokerCharges?.map((ch, index)=>{
                return (<div key={index}>
                  {ch?.typeId===1? <TextField
                    size="small"
                    sx={{ height: "50px", width: "20%", mr: "2%", mb: "2%" }}
                    type="text"
                    label="Type"
                    value="USD Deduction"
                    disabled
                  />: ch.typeId===2?
                  <TextField
                  size="small"
                  sx={{ height: "50px", width: "20%", mr: "2%", mb: "2%" }}
                  type="text"
                  label="Type"
                  value="USD Addition"
                  disabled
                  />: ch?.typeId===3?
                  <TextField
                  size="small"
                  sx={{ height: "50px", width: "20%", mr: "2%", mb: "2%" }}
                  type="text"
                  label="Type"
                  value="INR Deduction"
                  disabled
                />: ch?.typeId===4? <TextField
              size="small"
              sx={{ height: "50px", width: "20%", mr: "2%", mb: "2%" }}
              type="text"
              label="Type"
              value="INR Addition"
              disabled
            />: <></>}
                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "20%", mr: "2%", mb: "2%" }}
                    type="text"
                    label="Description"
                    name="description"
                    value={ch.description}
                  />
                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "20%", mr: "3%", mb: "2%" }}
                    type="text"
                    label="Amount"
                    name="amount"
                    value={ch.amount}
                  />
                </div>)
              })}
              </>)
              :<></>}
            </div>

        <Button variant="contained" color="info" 
        style={{height:"50px", width:"30%"}}
        disabled={preInvoice.payableUsd===0 || preInvoice.paidToAccount==="0"}
        onClick={handleInvoiceCreation}
        >
          Generate Invoice
          </Button>
      </div>
    </>
  );
}
export default Invoice;
