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

    useEffect(()=>{
        if(isNaN(brokerId) || isNaN(userRole)){
            history("/Primate-CRM-FE/login")
            return;
          }
          getInvoiceOnId(invoiceNumber)
          .then((res)=>{
            if(res.status===200){
                setInvoices(res.data);
            }
          })
          .catch((err)=>{
            handleApiError(err);
          })
    },[brokerId,userRole, history, invoiceNumber])

    return(
        <div className="PageLayout">
            <h1>Broker Invoice</h1>
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
          sx={{ height: "70px", width: "20%", mb: "0.25%" }}
          value="Billed By: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ height: "70px", width: "25%", mr: "5%", mb: "0.25%" }}
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
          sx={{ height: "70px", width: "20%", mb: "0.25%" }}
          value="Invoice Number#: "
          InputProps={{
            disableUnderline: true,
            readOnly:true 
          }}
        />
        <TextField
          type="text"
          variant="standard"
          sx={{ height: "70px", width: "25%", mr: "5%", mb: "0.25%" }}
          value={invoices.invoiceNumber}
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