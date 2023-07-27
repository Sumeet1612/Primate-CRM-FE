import React from "react";
import { SidebarData } from "./SidebarData";
import { Link } from "react-router-dom";
import "../App.css";

function Sidebar() {
  return (
    <div className="Sidebar">
      <ul>
        {console.log(SidebarData)}
        {SidebarData.map((val, key) => (
          <li
            key={key}
          >
            <Link to={val.path}>{val.icon}{val.title} </Link>  
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
