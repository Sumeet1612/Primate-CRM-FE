import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FileUploadIcon from '@mui/icons-material/FileUpload';

export const SidebarUserData = [
  { title: "Home", icon: <HomeIcon />, path: "Primate-CRM-FE/" },
  { title: "Shippers", icon: <EngineeringIcon />, path: "Primate-CRM-FE/shippers" },
  { title: "Profile", icon: <AccountBoxIcon />, path: "Primate-CRM-FE/profile" },
  { title: "Add New Load", icon: <LocalShippingIcon />, path: "Primate-CRM-FE/new" },
  { title: "Manage Loads", icon: <AirportShuttleIcon />, path: "Primate-CRM-FE/viewLoads" },
  { title: "Invoice", icon: <ReceiptIcon />, path: "Primate-CRM-FE/invoice" },
  { title: "Login", icon: <ReceiptIcon />, path: "Primate-CRM-FE/login" },
];

export const SidebarAdminData = [
  { title: "Register", icon: <GroupAddIcon />, path: "Primate-CRM-FE/register" },
  { title: "Agency System", icon: <FileUploadIcon />, path: "Primate-CRM-FE/agency" },
];
