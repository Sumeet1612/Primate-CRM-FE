import { usePDF } from "react-to-pdf";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import {  getInvoiceOnId, handleApiError } from "../../api/api";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import { useNavigate, useParams } from "react-router";

function InvoiceLayout(){

    const brokerId= loggedInUserId();
    const userRole= loggedInUserRole();
    const history= useNavigate();
    const {invoiceNumber} = useParams();
    const { toPDF, targetRef } = usePDF({filenamebrokerProfile: 'page.pdf'});
    const [invoices, setInvoices]= useState({
        brokerName: '',
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
        invoiceDate: '',
        dueDate: '',
        paidToAccount: '',
        additionalDetails: '',
        createdOn: '',
        updatedOn: ''
      });

      const [bankDetails,setBankDetaiks] = useState({
        Id:'',
        BankName:'',
        Ifsc:''
      })

    useEffect(()=>{
        if(isNaN(brokerId) || isNaN(userRole)){
            history("/Primate-CRM-FE/login")
            return;
          }
          getInvoiceOnId(invoiceNumber)
          .then((res)=>{
            if(res.status===200){
                setInvoices(res.data);
                setBankDetaiks(()=>{
                    return JSON.parse(res.data?.additionalDetails)
                })
            }
          })
          .catch((err)=>{
            handleApiError(err);
          })
    },[brokerId,userRole, history, invoiceNumber])

    return(
        <div className="PageLayout">
        <button onClick={() => toPDF()}>Download PDF</button>
        <div ref={targetRef}>
        <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "100%",
            fontSize: "20px",
            textAlign:"center"
          }}
        >
          Invoice - Primate Outsorcing Private Limited
        </h1>
        <TextField
          type="text"
          variant="standard"
          sx={{  width: "20%", mb: "0.25%", fontWeight:"bold" }}
          value="Billed By: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{  width: "25%", mr: "5%", mb: "0.25%" }}
          value={invoices.brokerName}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Invoice Number # : "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={invoices.invoiceNumber}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>

        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Bill To: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value="Primate Outsourcing Private Limited"
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>

        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Date: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={invoices.invoiceDate?.substring(0,10)}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Payment Terms: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value="NET 15"
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>

        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Due Date: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={invoices.dueDate?.substring(0,10)}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Balance Due: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={"₹ " + Number(invoices.netPayable)?.toFixed(2)}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>

        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Freelance service: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={"₹ " + Number(invoices.grossInr)?.toFixed(2)}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value="Deductions: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={"₹ " + Number(invoices.deductionInr)?.toFixed(2)}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
         <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "20%", mb: "0.25%" }}
          value={"TDS "+ invoices.tds + "%"}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "25%", mr: "5%", mb: "0.25%" }}
          value={"₹ " + Number((invoices.tds/100)*(invoices.grossInr-invoices.deductionInr))?.toFixed(2)}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        /> 
        <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "50%", mr: "5%", mb: "0.25%" }}
          value={"All Payments are made to: "}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "50%", mr: "5%", mb: "0.25%" }}
          value={"Bank: "+ bankDetails?.BankName}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
         <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "50%", mr: "5%", mb: "0.25%" }}
          value={"A/C Number:"+ bankDetails?.Id}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
         <br/>
        <TextField
          type="text"
          variant="standard"
          sx={{ width: "50%", mr: "5%", mb: "0.25%" }}
          value={"IFSC: "+ bankDetails?.Ifsc}
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />

        </div>
        </div>
    )
}
export default InvoiceLayout