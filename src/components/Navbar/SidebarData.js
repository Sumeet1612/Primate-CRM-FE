import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LogoutIcon from "@mui/icons-material/Logout";
import { loggedInUserId } from "../../api/validation";

export const SidebarUserData = [
  { title: "Home", icon: <HomeIcon />, path: "" },
  { title: "Shippers", icon: <EngineeringIcon />, path: "shippers" },
  { title: "Profile", icon: <AccountBoxIcon />, path: `profile/${loggedInUserId()}` },
  { title: "Loads", icon: <AirportShuttleIcon />, path: "viewLoads" },
  { title: "Invoices", icon: <ReceiptIcon />, path: "invoices" },
  { title: "Logout", icon: <LogoutIcon />, path: "logout" },
];

export const SidebarAdminData = [
  { title: "Brokers", icon: <AccountBoxIcon />, path: "manageBrokers" },
  { title: "Register", icon: <GroupAddIcon />, path: "register" },
  { title: "Agency System", icon: <FileUploadIcon />, path: "agency" }
];
