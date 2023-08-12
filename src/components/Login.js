import { useState } from "react";

function Login(){
    const [email, setEmail]= useState("")
    const[password,setPassword]=useState("")

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(email);
    }


    return(
        <form onSubmit={handleSubmit}>
            <label> User ID </label> 
            <input type="email" placeholder="user@onlinefreight.com" id="email" name="email"/>
            
            <br/>

            <label> Password </label> 
            <input type="password" placeholder="*********" id="password" name="password"/>

            <button> Log In </button>
        </form>

    );

}

export default Login
