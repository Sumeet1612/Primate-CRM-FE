import { useNavigate } from "react-router-dom";

function Home(){

const nav=useNavigate();
const handleNavigation=()=>{
    nav("/new")
}

return(
    <>
    <h1> Home Page1</h1>
    <h2>Test</h2>
    <label onClick={handleNavigation}>Create New Load</label>
    </>
)
}

export default Home