import { useEffect, useState } from "react";
import { handleApiError, loadAllBrokers } from "../../api/api";
import LinearProgress from "@mui/material/LinearProgress";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";

function ViewBrokers(){

    const [broker,setBroker]=useState([]);
      const [others,setOthers]=useState({
        loading:false
      })

      const nav= useNavigate();

      const [colDef]= useState([
        {field:'id', filter: true, sortable: true, resizable: true },
        {field:'alias', filter: true, sortable: true, resizable: true },
        {field:'userName', filter: true, sortable: true, resizable: true },
        {field:'email', filter: true, sortable: true, resizable: true },
        {field:'contact', filter: true, sortable: true, resizable: true },
        {field:'phoneBill', filter: true, sortable: true, resizable: true },
        {field:'officePhone', filter: true, sortable: true, resizable: true },
        {field:'Extn', filter: true, sortable: true, resizable: true },
        {field:'officeEmail', filter: true, sortable: true, resizable: true },
        {field:'maxCommision', filter: true, sortable: true, resizable: true },
        {field:'whatsAppNumber', filter: true, sortable: true, resizable: true },
        {field:'residentialAddress', filter: true, sortable: true, resizable: true },
        {field:'permanentAddress', filter: true, sortable: true, resizable: true },
        {field:'isActive', filter: true, sortable: true, resizable: true },
        {field:'tmsPassword', filter: true, sortable: true, resizable: true },
        {field:'updatedOn', filter: true, sortable: true, resizable: true,
        valueFormatter: params=>{
            let date= new Date(params.value.toString())
            return date.toLocaleDateString('en-US');
          }},
      ])

      useEffect(()=>{
        setOthers((prev)=>{
            return {...prev, loading:true}
        })

        loadAllBrokers()
        .then((res)=>{
            if(res.status===200){
                setBroker(res.data)
            }
            setOthers((prev)=>{
                return {...prev, loading:false}
            })
        })
        .catch((err)=>{
            handleApiError(err);
            setOthers((prev)=>{
                return {...prev, loading:false}
            })
        })

      },[])

      const handleCell=(cellEvent)=>{
        let brokerId= cellEvent?.data?.id;
        if(cellEvent?.colDef?.field==="id"){
          nav(`/Primate-CRM-FE/profile/${brokerId}`)
        }
      }

    return(
        <div className="profile PageLayout">
            <h1>Manage All Brokers</h1>
            {others.loading ? <LinearProgress/>:
            <div className="ag-theme-alpine" style={{ height: 550, width: '90%' }}>
          <AgGridReact 
            rowData={broker} 
            columnDefs={colDef} 
            onCellClicked={(x)=>handleCell(x)}
            pagination={true} >
          </AgGridReact>
        </div>
        }
        </div>
    )
}

export default ViewBrokers;