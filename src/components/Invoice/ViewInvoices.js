import { useEffect, useState } from "react";
import { getAllGeneratedInvoices, getPastInvoicesForBroker, handleApiError } from "../../api/api";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import LinearProgress from "@mui/material/LinearProgress";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function ViewInvoices(){
    const [isloading,setIsLoading]=useState(false);
    const brokerId= loggedInUserId();
    const userRole= loggedInUserRole();

    const [invoices, setInvoices]= useState([])

    const [cols]=useState([
        {field: "invoiceNumber" , filter: true, sortable: true},
        {field: "brokerId" , filter: true, sortable: true},
        {field: "grossUsd" , filter: true, sortable: true},
        {field: "adjustmentDeduction" , filter: true, sortable: true},
        {field: "payableUsd" , filter: true, sortable: true},
        {field: "phoneBillUsd" , filter: true, sortable: true},
        {field: "grossInr" , filter: true, sortable: true},
        {field: "deductionInr" , filter: true, sortable: true},
        {field: "tds" , filter: true, sortable: true},
        {field: "netPayable" , filter: true, sortable: true},
        {field: "invoiceDate" , filter: true, sortable: true},
        {field: "dueDate" , filter: true, sortable: true},
        {field: "paidToAccount" , filter: true, sortable: true},
        {field: "updatedOn" , filter: true, sortable: true},
        //{field: "additionalDetails" , filter: true, sortable: true}
    ])

    useEffect(()=>{
        if(userRole===1){
            setIsLoading(true)
            getAllGeneratedInvoices()
            .then((res=>{
                if(res.status===200){
                    setInvoices(res.data)
                }
                setIsLoading(false);
                }))
            .catch((err)=>{
            handleApiError(err);
            setIsLoading(false);
            })
        }
        else{
            setIsLoading(true);
            getPastInvoicesForBroker(brokerId)
            .then((res=>{
                if(res.status===200){
                    setInvoices(res.data)
                }
                setIsLoading(false);
            }))
            .catch((err)=>{
            handleApiError(err);
            setIsLoading(false);
            })
        }
    },[brokerId,userRole])

    return(
        <div className="PageLayout Invoice">
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

            {isloading? <LinearProgress/>:(
                <div className="ag-theme-alpine" style={{ height: 500, width: '94%' }}>
                <AgGridReact
                  rowData={invoices}
                  columnDefs={cols}
                ></AgGridReact>
              </div>
            )}
        </div>
    )

}

export default ViewInvoices;