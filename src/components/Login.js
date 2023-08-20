import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callLogin, handleApiError } from "../api/api";

function Login() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
        email: email,
        password: password,
      }; 
    var result= callLogin(data);
    result.then((res)=>{
        if (res.status === 200) {
            if (res.data?.id !== -1) {
              alert("logged In");
              sessionStorage.setItem("Role", res.data?.roleId);
              sessionStorage.setItem("UserId", res.data?.id);
              history("/Primate-CRM-FE/");
            } else {
              if (res.data?.isActive === false) {
                alert(
                  "You no longer have the access. Please contact your Admin."
                );
              } else {
                alert("Incorrect credentials.");
              }
            }
          }
    }).catch((err)=>{
        handleApiError(err);
    }) 
  };

  return (
    <form onSubmit={handleSubmit}>
      <label> User ID </label>
      <input
        type="email"
        placeholder="user@onlinefreight.com"
        id="email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
      />

      <br />

      <label> Password </label>
      <input
        type="password"
        placeholder="*********"
        id="password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit"> Log In </button>

      <br />

      <label onClick={() => history("/Primate-CRM-FE")}>Home</label>
    </form>
  );
}

export default Login;
