import { useState } from "react"
import { useNavigate } from "react-router";

function SearchLoad() {
const [loadNumber,setloadNumber]= useState(0);
const navigate = useNavigate();
const handleSearch=()=>{
    navigate(`/Primate-CRM-FE/editLoad/${loadNumber}`)
}
  return (
    <div className="PageLayout">
        <h1>Search for a load</h1>
        <label>Enter Load Number</label>
        <input type='text' onChange={(event)=>setloadNumber(event.target.value)}/>
        <button onClick={handleSearch}>Search Load</button>
    </div>
  )
}

export default SearchLoad