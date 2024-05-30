import { useEffect, useState } from "react";
import "../../App.css";
import LogoutIcon from "@mui/icons-material/Logout";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { logOut, loggedInUserId, loggedInUserRole } from "../../api/validation";
import Cards from "./Cards";
import {
  getMarginForAdmin,
  getMarginForBroker,
  handleApiError,
} from "../../api/api";
import logo from "../../img/poLogo.png";

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [margin, setMargin] = useState({
    currentMonthMargin: 0,
    totalMargin: 0,
    invoicedMargin: 0,
    lastInvoicedAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const userId = loggedInUserId();
    if (userId > 0) {
      setLoggedIn(true);
      const userRole = loggedInUserRole();
      if (userRole === 1) {
        setIsLoading(true);
        getMarginForAdmin()
          .then((res) => {
            setIsLoading(false);
            setMargin(res?.data);
          })
          .catch((err) => {
            setIsLoading(false);
            handleApiError(err);
          });
      } else if (userRole === 2) {
        setIsLoading(true);
        getMarginForBroker(userId)
          .then((res) => {
            setIsLoading(false);
            setMargin(res?.data);
          })
          .catch((err) => {
            setIsLoading(false);
            handleApiError(err);
          });
      }
    } else {
      nav("/Login");
    }
  }, [nav]);

  const logout = () => {
    logOut();
    setLoggedIn(false);
    window.location.reload();
    alert("Logged Out");
  };

  return (
    <div className="PageLayout">
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center", marginBottom:"4%"}}>
        <img
          style={{ width: "100px", height: "100px" }}
          src={logo}
          alt="PO Logo"
        />

        <h1 style={{ textAlign: "center", marginLeft:"4%" }}>
          {" "}
          Welcome To Primate CRM Application
        </h1>
      </div>

      {loggedIn ? (
        isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "25%", margin: "3%", padding:"15px 0px" }}
              onClick={() => nav("/new")}
            >
              Add New Load
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "25%", margin: "3%", padding:"15px 0px" }}
              onClick={() => nav("/shippers")}
            >
              Shippers
            </Button>

            <Button
              variant="contained"
              color="info"
              sx={{ width: "25%", margin: "3%", padding:"15px 0px" }}
              onClick={() => nav("/invoice/generate")}
            >
              Generate Invoice
            </Button>

            <div style={{ marginTop: "4%" }} className="Row1">
              <Cards
                title="Monthly Sale"
                value={"$ " + margin?.currentMonthMargin}
              />
              <Cards title="Gross Sale" value={"$ " + margin?.totalMargin} />
            </div>
            <div className="Row2">
              <Cards
                title="Sale After Last Invoice"
                value={"$ " + margin?.invoicedMargin}
              />
              <Cards
                title="Last Payout"
                value={"₹ " + margin?.lastInvoicedAmount}
              />
            </div>
          </>
        )
      ) : (
        <>
          {" "}
          <br /> Please Login to Proceed <br />{" "}
        </>
      )}

      <br />
      {loggedIn ? (
        <>
          <LogoutIcon onClick={logout} /> <h3>Log Out</h3>{" "}
        </>
      ) : (
        <>
          <LockOutlinedIcon onClick={() => nav("/login")} />
          <h3>Log In</h3>{" "}
        </>
      )}
    </div>
  );
}

export default Home;
