import { useEffect, useState } from "react";
import "../../App.css";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {loggedInUserId, loggedInUserRole } from "../../api/validation";
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

  return (
    <div className="PageLayout">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "4%",
        }}
      >
        <img
          style={{ width: "150px", height: "120px" }}
          src={logo}
          alt="PO Logo"
        />
      </div>

      {loggedIn ? (
        isLoading ? (
          <LinearProgress />
        ) : (
          <div>
            <div
              className="buttonDiv"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "5% 5%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "25%", padding: "12px 0px" }}
                onClick={() => nav("/new")}
              >
                Add New Load
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "25%", padding: "12px 0px" }}
                onClick={() => nav("/shippers")}
              >
                Shippers
              </Button>

              <Button
                variant="contained"
                color="primary"
                sx={{ width: "25%", padding: "12px 0px" }}
                onClick={() => nav("/invoice/generate")}
              >
                Generate Invoice
              </Button>
            </div>

            <div className="cardDiv">
              <div
                className="Row1"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "5% 5%",
                }}
              >
                <Cards
                  title="Monthly Sale"
                  value={"$ " + margin?.currentMonthMargin}
                />
                <Cards title="Gross Sale" value={"$ " + margin?.totalMargin} />
              </div>
              <div
                className="Row2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "5% 5%",
                }}
              >
                <Cards
                  title="Sale After Last Invoice"
                  value={"$ " + margin?.invoicedMargin}
                />
                <Cards
                  title="Last Payout"
                  value={"₹ " + margin?.lastInvoicedAmount}
                />
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          {" "}
          <br /> Please Login to Proceed <br />{" "}
        </>
      )}
      
    </div>
  );
}

export default Home;
