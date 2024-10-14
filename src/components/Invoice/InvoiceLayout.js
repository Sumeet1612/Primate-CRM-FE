import { usePDF } from "react-to-pdf";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { getInvoiceOnId, handleApiError } from "../../api/api";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import { useNavigate, useParams } from "react-router";
import "../Invoice/InvoiceLayout.css";

function InvoiceLayout() {
  const brokerId = loggedInUserId();
  const userRole = loggedInUserRole();
  const history = useNavigate();
  const { invoiceNumber } = useParams();
  const { toPDF, targetRef } = usePDF({ filenamebrokerProfile: "page.pdf" });
  const [invoices, setInvoices] = useState({
    brokerName: "",
    invoiceNumber: "",
    brokerId: "",
    grossUsd: "",
    adjustmentDeduction: "",
    payableUsd: "",
    phoneBillUsd: "",
    grossInr: "",
    deductionInr: "",
    tds: "",
    netPayable: "",
    invoiceDate: "",
    dueDate: "",
    paidToAccount: "",
    additionalDetails: "",
    description: "",
    createdOn: "",
    updatedOn: "",
  });

  const [bankDetails, setBankDetaiks] = useState({
    Id: "",
    BankName: "",
    Ifsc: "",
    OwnerName: "",
    Pan: "",
  });

    useEffect(()=>{
        if(isNaN(brokerId) || isNaN(userRole)){
            history("/login")
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

  return (
    <div className="PageLayout">
      <div ref={targetRef}>
        <div className="invoiceLayout" style={{ marginLeft: "8%" }}>
          <br />
          <br />
          <br />

          <div className="Row1">
            <div>
              <h4>{bankDetails.OwnerName}</h4>
            </div>
            <div className="Row1Column2">
              <div>
                <h1>Invoice</h1>
              </div>
              <div>
                <TextField
                  type="text"
                  variant="standard"
                  value={invoices.invoiceNumber}
                  InputProps={{
                    disableUnderline: true,
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="Row2">
            <div className="Row2Column1">
              <p className>Bill To:</p>

              <p>
                <strong>Primate Outsourcing Private Limited</strong>
              </p>
            </div>

            <div className="Row2Column2">
              <table style={{ width: "85%" }}>
                <tr>
                  <td>Date:</td>
                  <td>{invoices.invoiceDate?.substring(0, 10)}</td>
                </tr>

                <tr>
                  <td>Payment Terms:</td>
                  <td>NET 15</td>
                </tr>

                <tr>
                  <td>Due Date:</td>
                  <td>{invoices.dueDate?.substring(0, 10)}</td>
                </tr>

                <tr>
                  <td className="balanceDue">Balance Due:</td>
                  <td className="balanceDue">
                    {"₹ " + Number(invoices.netPayable)?.toFixed(2)}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div className="Row3">
            <table style={{ width: "95%" }}>
              <tr>
                <th>Items</th>
                <th>Amount</th>
              </tr>

              <tr>
                <td>Contractual Services</td>
                <td>{"₹ " + Number(invoices.grossInr)?.toFixed(2)}</td>
              </tr>

              <tr>
                <td>Deductions</td>
                <td>{"₹ " + Number(invoices.deductionInr)?.toFixed(2)}</td>
              </tr>

              <tr>
                <td>TDS</td>
                <td>
                  {"₹ " +
                    Number(
                      (invoices.tds / 100) *
                        (invoices.grossInr - invoices.deductionInr)
                    )?.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td className="balanceDue">Total</td>
                <td className="balanceDue">
                  {"₹ " + Number(invoices.netPayable)?.toFixed(2)}
                </td>
              </tr>
            </table>
          </div>

          <div className="Row4">
            <p>
              <strong>Notes:</strong>
            </p>
            <br />
            <p>All Payments to be made to:</p>
            <p>Bank Name: {bankDetails?.BankName}</p>
            <p>Account Number: {bankDetails?.Id}</p>
            <p>IFSC Code: {bankDetails?.Ifsc}</p>
            <p>PAN Number: {bankDetails?.Pan}</p>
          </div>
          <br/>
          <p style={{color:'#000053'}}>Phone Bill Charged: ${invoices.phoneBillUsd}</p>
        </div>
      </div>
      <div className="downloadButton">
        <button onClick={() => toPDF()}>Download PDF</button>
      </div>
    </div>
  );
}
export default InvoiceLayout;
