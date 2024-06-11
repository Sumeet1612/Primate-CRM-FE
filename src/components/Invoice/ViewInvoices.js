import { useEffect, useState } from "react";
import { getAllGeneratedInvoices, getPastInvoicesForBroker, handleApiError } from "../../api/api";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import LinearProgress from "@mui/material/LinearProgress";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";

function ViewInvoices(){
    const [isloading,setIsLoading]=useState(false);
    const brokerId= loggedInUserId();
    const userRole= loggedInUserRole();
    const [invoices, setInvoices]= useState([])

    const [cols]=useState([
        {field: "invoiceNumber" , filter: true, sortable: true, resizable: true },
        {field: "brokerAlias" , filter: true, sortable: true, resizable: true },
        {field: "grossUsd" , filter: true, sortable: true, resizable: true },
        {field: "adjustmentDeduction" , filter: true, sortable: true, resizable: true },
        {field: "payableUsd" , filter: true, sortable: true, resizable: true },
        {field: "phoneBillUsd" , filter: true, sortable: true, resizable: true },
        {field: "grossInr" , filter: true, sortable: true, resizable: true },
        {field: "deductionInr" , filter: true, sortable: true, resizable: true },
        {field: "tds" , filter: true, sortable: true, resizable: true },
        {field: "netPayable" , filter: true, sortable: true, resizable: true },
        {field: "invoiceDate" , filter: true, sortable: true, resizable: true, valueFormatter: params=>{
            let date= new Date(params.value.toString())
            return date.toLocaleDateString('en-US');
          } },
        {field: "dueDate" , filter: true, sortable: true, resizable: true, valueFormatter: params=>{
            let date= new Date(params.value.toString())
            return date.toLocaleDateString('en-US');
          } },
        {field: "paidToAccount" , filter: true, sortable: true, resizable: true },
        {field: "updatedOn" , filter: true, sortable: true, resizable: true,
        valueFormatter: params=>{
            let date= new Date(params.value.toString())
            return date.toLocaleDateString('en-US');
          } }
    ])

    const history= useNavigate();

    useEffect(()=>{
        if(isNaN(brokerId) || isNaN(userRole)){
            history("/login")
            return;
          }
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
    },[brokerId,userRole, history])

    const handleCell=(cellEvent)=>{
        let invNumber= cellEvent?.data?.invoiceNumber;
        if(cellEvent?.colDef?.field==="invoiceNumber"){
          history(`/invoice/${invNumber}`)
        }
      }

    return(
        <div className="PageLayout Invoice" style={{ height: '100%' }}>
            <h1
                style={{
                    color: "white",
                    backgroundColor: "#00b7aa",
                    marginBottom: "2%",
                    padding: "2%",
                    width: "94%",
                    fontSize: "16px",
                }}
            >
            Past Payments
            </h1>

            {isloading? <LinearProgress/>:(
                <div className="ag-theme-alpine" style={{ height: '90%', width: '98%' }}>
                <AgGridReact
                  rowData={invoices}
                  columnDefs={cols}
                  pagination={true}
                  paginationAutoPageSize={true}
                  onCellClicked={(x)=>handleCell(x)} />
              </div>
            )}
        </div>
    )

}

export default ViewInvoices;