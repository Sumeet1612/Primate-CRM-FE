import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ReceiptIcon from "@mui/icons-material/Receipt";

export const SidebarData = [
  { title: "Home", icon: <HomeIcon />, path: "/" },
  { title: "Shippers", icon: <EngineeringIcon />, path: "/shippers" },
  { title: "Loads", icon: <AirportShuttleIcon />, path: "/new" },
  { title: "Profile", icon: <AccountBoxIcon />, path: "/profile" },
  { title: "Invoice", icon: <ReceiptIcon />, path: "/invoice" },
];
