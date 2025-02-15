import React, { useEffect, useState } from "react";
import { SidebarAdminData, SidebarUserData } from "./SidebarData";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import SearchIcon from "@mui/icons-material/Search";

function Sidebar() {
  const [data, setData] = useState(SidebarUserData);
  const [loadNum, setLoadNum] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    let userId = loggedInUserId();
    let roleId = loggedInUserRole();
    if (parseInt(roleId) === 1) {
      setData(() => {
        return (
          SidebarUserData.concat(...SidebarAdminData)
            // move logout at the end, otherwise it was coming im mid of list
            .filter((x) => x.path !== "logout")
            .concat(SidebarUserData.filter((x) => x.path === "logout"))
        );
      });
    } else if (userId > 0) {
      setData(() => {
        return SidebarUserData;
      });
    }
  }, []);

  const handleSearch = () => {
    nav(`editLoad/${loadNum}`);
    setLoadNum("");
  };

  const handleSearchOnEnter=(e)=>{
    if(e.key==="Enter" && loadNum){
      handleSearch();
    }
  }

  return (
    <div className="Sidebar">
      <div
        style={{
          height: "8%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          style={{
            height: "50%",
            width: "70%",
            fontWeight: "bold",
            fontSize: "16px",
            margin: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            paddingLeft: "11px",
            paddingTop: "3px",
            paddingBottom: "3px",
          }}
          type="number"
          onChange={(e) => setLoadNum(e.target.value)}
          value={loadNum}
          onKeyDown={handleSearchOnEnter}
        />
        <SearchIcon sx={{ fontSize: "30px" }} onClick={handleSearch} />
      </div>
      <div style={{height:'85%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <div>
          <ul>
            {data?.map((val, key) => (
              <li key={key}>
                <Link to={val.path}>
                  {val.icon}
                  {val.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p>
            All rights reserved &copy; 2024 Primate Outsourcing Private Limited
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
