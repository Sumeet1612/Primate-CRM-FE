import { useEffect, useState } from "react";
import "../App.css";
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";

function Home(){

    const [loggedIn, setLoggedIn]=  useState(false);
    const nav= useNavigate();
useEffect(()=>{
    if(sessionStorage.getItem("role")){
        setLoggedIn(true);
    }
},[])
const logout=()=>{
    sessionStorage.removeItem("UserId")
    sessionStorage.removeItem("Role")
    alert("Logged Out");
}

return(
    <div className="PageLayout">
    <h1> Home</h1>
    <br/>
    {loggedIn? <><LogoutIcon onClick={logout}/> <h3>Log Out</h3> </>: 
    <><LockOutlinedIcon onClick={()=>nav('/Primate-CRM-FE/login')}/><h3>Log In</h3> </>}
    </div>
)
}

export default Home