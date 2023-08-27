import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";

export const SidebarData = [
  { title: "Home", icon: <HomeIcon />, path: "Primate-CRM-FE/" },
  { title: "Shippers", icon: <EngineeringIcon />, path: "Primate-CRM-FE/shippers" },
  { title: "Create Load", icon: <AirportShuttleIcon />, path: "Primate-CRM-FE/new" },
  { title: "View Loads", icon: <AirportShuttleIcon />, path: "Primate-CRM-FE/viewLoads" },
  { title: "Profile", icon: <AccountBoxIcon />, path: "Primate-CRM-FE/profile" },
  { title: "Invoice", icon: <ReceiptIcon />, path: "Primate-CRM-FE/invoice" }
];
