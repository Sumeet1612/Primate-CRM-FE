import { useNavigate } from "react-router-dom";

function Home(){

const nav=useNavigate();
const handleNavigation=()=>{
    nav("/new")
}

return(
    <>
    <h1> Home Page</h1>
    <label onClick={handleNavigation}>Create New Load</label>
    </>
)
}

export default Home