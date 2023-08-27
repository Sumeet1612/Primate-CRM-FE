import { useNavigate } from "react-router-dom";
import "../App.css";

function Home(){

const nav=useNavigate();
const handleNavigation=()=>{
    nav("/new")
}

const handleShipperNavigation=()=>{
    nav("/Primate-CRM-FE/shippers")
}

return(
    <div className="PageLayout">
    <h1> Home Page</h1>
    <label onClick={handleNavigation}>Create New Load</label>
    <button onClick ={handleShipperNavigation} > Shippers </button>
    </div>
)
}

export default Home