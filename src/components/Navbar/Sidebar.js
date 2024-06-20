import React, { useEffect, useState } from "react";
import { SidebarAdminData, SidebarUserData } from "./SidebarData";
import { Link } from "react-router-dom";
import "../../App.css";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";

function Sidebar() {
  const [data, setData]= useState(SidebarUserData);

  useEffect(()=>{
    let userId=loggedInUserId()
    let roleId=loggedInUserRole()
    if(parseInt(roleId)===1){
      setData(()=>{return SidebarUserData.concat(...SidebarAdminData)
        // move logout at the end, otherwise it was coming im mid of list
        .filter(x=>x.path!=="logout").concat(SidebarUserData.filter(x=>x.path==="logout"))})
    }
    
    else if(userId > 0){
      setData(()=>{return SidebarUserData})
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
