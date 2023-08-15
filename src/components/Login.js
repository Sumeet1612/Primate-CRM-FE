import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const baseApiUrl= process.env.REACT_APP_BASE_URL_API;
    const history = useNavigate();
    const [email, setEmail]= useState("")
    const[password,setPassword]=useState("")

    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post(`${baseApiUrl}/users/login`,
       {
        "email": email,
        "password": password
      }).then((res)=>{
        if(res.status=== 200){
           if(res.data?.id !== -1){
            alert("logged In")
            sessionStorage.setItem("Role",res.data?.roleId)
            sessionStorage.setItem("UserId",res.data?.id)
           }
           else{
            if(res.data?.isActive===false){
                alert("You no longer have the access. Please contact your Admin.")
            }
            else{
                alert("Incorrect credentials.")
            }
           }
        }
        else if(res.status===417){
            alert("Server error")
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <label> User ID </label> 
            <input type="email" placeholder="user@onlinefreight.com" id="email" name="email" onChange={(event)=>setEmail(event.target.value)}/>
            
            <br/>

            <label> Password </label> 
            <input type="password" placeholder="*********" id="password" name="password" onChange={(event)=>setPassword(event.target.value)}/>

            <button type="submit"> Log In </button>
            
            <br/>

            <label onClick={()=>history("/Primate-CRM-FE")}>Home</label>
        </form>

    );

}

export default Login
