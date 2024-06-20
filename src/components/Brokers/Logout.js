import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logOut } from "../../api/validation";

export default function Logout(){
    const nav= useNavigate();
    useEffect(()=>{
        LogOutWithReload();
        nav('/Login')
    },[nav])

    const LogOutWithReload = () => {
        logOut();
        window.location.reload();
        alert("Logged Out");
      };

    return(
        <div>
            Logging Out...
        </div>
    )

}