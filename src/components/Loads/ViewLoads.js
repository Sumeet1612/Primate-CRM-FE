import { useEffect, useState } from "react";
import { getLoadForBroker, handleApiError } from "../../api/api";
import './load.css'
import PreviewIcon from '@mui/icons-material/Preview';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from "react-router-dom";

function ViewLoads(){

    const nav= useNavigate();
    const [isLoading, setIsLoading]= useState(false)
    const [loads,setLoads] = useState();
    useEffect(()=>{
        let brokerId= parseInt(sessionStorage.getItem("UserId"));
        if (brokerId>0){
            console.log("API calling")
            setIsLoading(true)
            getLoadForBroker(brokerId)
            .then((res)=>{
                console.log(res);
                setLoads(res.data)
                setIsLoading(false)
            })
            .catch((err)=>{
                handleApiError(err);
                setIsLoading(false)
            })
        }
    },[])

    const editLoad=(loadId)=>{
        console.log(loadId);
        nav(`/Primate-CRM-FE/editLoad/${loadId}`)
    }

    return(
        <div className="PageLayout">
            <h1>View Loads</h1>
            {isLoading?<LinearProgress/>:
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Loadnumber</th>
                            <th>Description</th>
                            <th>Shipper Name</th>
                            <th>Pickup Location</th>
                            <th>Delivery Location</th>
                            <th>Pickup Date</th>
                            <th>Delivery Date</th>
                            <th>Broker</th>
                            <th>Self rate</th>
                            <th>Carrier Name</th>
                            <th>Carrier POC</th>
                            <th>Carrier Contact</th>
                            <th>Carrier Email</th>
                            <th>Payment Status</th>
                            <th>Shipper Rate</th>
                            <th>Carrier Rate</th>
                            <th>Margin</th>
                            <th>Invoice Date</th>
                            <th>Mismatched</th>
                            <th>Created On</th>
                            <th>Last Modified</th>
                            <th>ACTION</th>
                       </tr>
                    </thead>
                    <tbody>
                        {loads?.map((ld)=>{
                            return(
                                <tr key={ld.loadNumber}>
                                    <td>{ld.loadNumber}</td>
                                    <td>{ld.loadDescription}</td>
                                    <td>{ld.shipperName}</td>
                                    <td>{ld.pickupLocation}</td>
                                    <td>{ld.deliveryLocation}</td>
                                    <td>{ld.pickupDate}</td>
                                    <td>{ld.deliveryDate}</td>
                                    <td>{ld.brokerName}</td>
                                    <td>{ld.selfRate}</td>
                                    <td>{ld.carrierName}</td>
                                    <td>{ld.carrierPOC}</td>
                                    <td>{ld.carrierContact}</td>
                                    <td>{ld.carrierEmail}</td>
                                    <td>{ld.paymentStatusId}</td>
                                    <td>{ld.shipperRate}</td>
                                    <td>{ld.carrierRate}</td>
                                    <td>{ld.margin}</td>
                                    <td>{ld.invoiceDate}</td>
                                    <td>{ld.mismatched?"Mismatch":"NA"}</td>
                                    <td>{ld.createdOn}</td>
                                    <td>{ld.updatedOn}</td>
                                    <td onClick={()=>editLoad(ld.loadNumber)}> <PreviewIcon/></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default ViewLoads;