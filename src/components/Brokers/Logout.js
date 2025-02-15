import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logOut } from "../../api/validation";
import { showNotification } from "../../api/Notification";

export default function Logout(){
    const nav= useNavigate();
    useEffect(()=>{
        logOut();
        nav('/Login')
        window.location.reload();
        showNotification("Logged Out");
    },[nav])

    return(
        <div>
            Logging Out...
        </div>
    )

}