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
        {field: "invoiceNumber" , filter: true, sortable: true, resizable: true, width:150 },
        {field: "brokerAlias" , filter: true, sortable: true, resizable: true, width:130 },
        {field: "grossUsd" , filter: true, sortable: true, resizable: true, valueFormatter:params=>{
            return Number(params?.value).toFixed(2)
        },headerName:"Gross USD", width:130  },
        {field: "adjustmentDeduction" , filter: true, sortable: true, resizable: true, width:130, valueFormatter:params=>{
            return Number(params?.value).toFixed(2)
        }, headerName:"Adjustment" },
        {field: "phoneBillUsd" , filter: true, sortable: true, resizable: true, valueFormatter:params=>{
            return Number(params?.value).toFixed(2)
        }, headerName:"PhoneBill (USD)", width:150 },
        {field: "deductionUsd" , filter: true, sortable: true, resizable: true, valueFormatter:params=>{
            return -Number(params?.value).toFixed(2)
        }, headerName:"Deductions (USD)", width:165 },
        {field: "payableUsd" , filter: true, sortable: true, resizable: true, valueFormatter:params=>{
            return Number(params?.value).toFixed(2)
        },headerName:"Payable (USD)", width:150 },
        
        {field: "grossInr" , filter: true, sortable: true, resizable: true,  valueFormatter:params=>{
            return Number(params?.value).toFixed(2)
        },headerName:"Gross INR", width:130  },
        {field: "deductionInr" , filter: true, sortable: true, resizable: true, valueFormatter:params=>{
            return -Number(params?.value).toFixed(2) 
        }, headerName:"Deductions (INR)", width:165 },
        {field: "tds" , filter: true, sortable: true, resizable: true, width:100, valueFormatter:params=>{
            return params?.value + "%"
        } },
        {field: "netPayable" , filter: true, sortable: true, resizable: true, valueFormatter:params=>{
            return Number(params?.value).toFixed(2)
        },headerName:"Net Payable (INR)", width:175  },
        {field: "invoiceDate" , filter: true, sortable: true, resizable: true, width:140, valueFormatter: params=>{
            let date= new Date(params.value.toString())
            return date.toLocaleDateString('en-US');
          } },
        {field: "dueDate" , filter: true, sortable: true, resizable: true, width:110, valueFormatter: params=>{
            let date= new Date(params.value.toString())
            return date.toLocaleDateString('en-US');
          } },
        {field: "paidToAccount" , filter: true, sortable: true, resizable: true, width:170 },
        {field: "updatedOn" , filter: true, sortable: true, resizable: true, width:150,
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
                  onCellClicked={(x)=>handleCell(x)}
                  enableCellTextSelection={true}
                  />
              </div>
            )}
        </div>
    )

}

export default ViewInvoices;