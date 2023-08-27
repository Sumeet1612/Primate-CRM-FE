import { useState } from "react";
import { handleApiError, processInvoices, uploadAgencyData } from "../api/api";
import LinearProgress from '@mui/material/LinearProgress';

function AgencyForm(){

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading]= useState(false);
    const [upload, setUpload]= useState(false);
    const [check, setCheck]= useState(false);

    const handleFileChange=(event)=>{
        setUpload(false);
        setSelectedFile(event.target.files[0]);
    }

    const handleSubmit=()=>{
        if(selectedFile){
            setLoading(true)
            const formData = new FormData();
            formData.append('agencyFile',selectedFile);
            uploadAgencyData(formData)
            .then((res)=>{
                setLoading(false)
                if(res.status===200){                   
                    setUpload(true);
                    alert("File Uploaded. Proceed with Scanning Load Entries")
                }
            })
            .catch((err)=>{
                setLoading(false)
                handleApiError(err)
            });
        }
        else{
            alert("No files selected");
        }
    }
   
    const handleScanChanges =()=>{
        setLoading(true)
        processInvoices()
        .then((res)=>{
            console.log(res)
            setLoading(false)
            if(res.status===200){
                setCheck(true)
                alert("Data Processed successfully")
            }
        })
        .catch((err)=>{
            setLoading(false)
            setCheck(false);
            handleApiError(err)
        });
    }
    return(
        <div className="PageLayout">
            <h1> Agency System </h1>
            <br/>
            {loading ? <LinearProgress/> : <></>}
            <input type='file' onChange={handleFileChange}/>
            <button onClick={handleSubmit} disabled={upload}>Process File</button>
            <br/>
            {upload ? <button onClick={handleScanChanges} disabled={check}>Update Loads</button> : <></>}
        </div>
    )
}

export default AgencyForm