import React, { useEffect, useState } from "react";
import { SidebarAdminData, SidebarUserData } from "./SidebarData";
import { Link } from "react-router-dom";
import "../../App.css";

function Sidebar() {
  const [data, setData]= useState(SidebarUserData);

  useEffect(()=>{   
    let userId=sessionStorage.getItem("UserId")
    let roleId=sessionStorage.getItem("Role")

    if(parseInt(roleId)===1){
      setData(()=>{return SidebarUserData.concat(...SidebarAdminData).filter(x=>x.title!=="Login")})
    }
    
    else if(userId > 0){
      setData(()=>{return SidebarUserData.filter(x=>x.title !=="Login")})
    }
  },[])

  return (
    <div className="Sidebar">
      <ul>
        {data?.map((val, key) => (
          <li
            key={key}
          >
            <Link to={val.path}>{val.icon}{val.title}</Link>  
          </li>
        ))}        
      </ul>
    </div>
  );
}

export default Sidebar;
