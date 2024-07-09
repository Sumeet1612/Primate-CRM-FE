import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "../../img/Avatar.jpg";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import {
  editBroker,
  getBrokerOnId,
  handleApiError,
} from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { loggedInUserId, loggedInUserRole } from "../../api/validation";
import PasswordChangeModal from "./PasswordChangeModal";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

function Profile() {
  const [broker, setBroker] = useState({
    id: "",
    userName: "",
    alias: "",
    contactNumber: "",
    isActive: "",
    email: "",
    maxCommision: "",
    officeEmail: "",
    officePhone: "",
    extn: "",
    roleId: 2,
    residentialAddress: "",
    permanentAddress: "",
    tmsPassword: "",
    currencyId: 0,
    phoneBill: "",
    whatsAppNumber: "",
    tds: "",
    deductionInr: "",
    updatedOn: "",
    createdOn: "",
    accountDetails: [],
  });
  const [init, setinit] = useState({});
  const [account, setAccount] = useState([
    {
      id: "",
      bankName: "",
      ownerName: "",
      ifsc: "",
      pan: "",
      brokerId: "",
      isPrimary: true,
      updatedOn: "",
    },
  ]);

  const [others, setOthers] = useState({
    exchangeRate: "0",
    userRole: loggedInUserRole(),
    dialogOpen: false,
    profileCompletionPercentage: 0,
    refresh: 0,
  });

  const { loggedInBrokerId } = useParams();

  const nav = useNavigate();

  useEffect(()=>{
    const user= loggedInUserId();
    if(loggedInBrokerId === 'NaN'){
      if(isNaN(user)){
        nav('/login/')
        return;
      }
      else{
      nav(`/profile/${user}`)
      }
    }
    else{
    let currencyData=[];
    if(loggedInBrokerId > 0 && (user===parseInt(loggedInBrokerId) || others.userRole===1)){



        // get broker details
        getBrokerOnId(loggedInBrokerId)
          .then((res) => {
            if (res.status === 200) {
              // calculate profile completion percentage
              let kc = 0;
              let ec = 0;
              Object.keys(res?.data).every((p) => {
                kc++;
                if (res?.data[p] === "" || res?.data[p] === null) {
                  res.data[p] = ""; //setting null to empty for preventing warning on console
                  ec++;
                }
                if (p === "accountDetails") {
                  if (res?.data[p].length === 0) {
                    ec++;
                  }
                }
                if (p === "tds" || p === "maxCommision" || p === "currencyId") {
                  if (res?.data[p] === 0) {
                    ec++;
                  }
                }
                return true;
              });
              setOthers((prev) => {
                return {
                  ...prev,
                  profileCompletionPercentage: ((kc - ec) * 100) / kc,
                };
              });

              // set state
              setBroker(res.data);
              setAccount(res.data?.accountDetails);
              setinit(res.data);
              const exchangeRate = currencyData.filter(
                (x) => x.id === res.data?.currencyId
              );
              if (exchangeRate?.length > 0) {
                setOthers((prev) => {
                  return {
                    ...prev,
                    exchangeRate: exchangeRate[0].exchangeRate,
                  };
                });
              }
            }
          })
          .catch((err) => {
            handleApiError(err);
          });
      } else {
        alert("Unauthorized Access");
      }
    }
  }, [loggedInBrokerId, nav, others.userRole, others.refresh]);

  const handleChange = (e) => {
    let fname = e.target.name;
    let value = e.target.value;
    setBroker((state) => {
      return { ...state, [fname]: value };
    });
  };

  const handleAccount = (e, index) => {
    let fname = e.target.name;
    let fValue = e.target.value;
    let additionalAccounts = [...account];
    additionalAccounts[index][fname] = fValue;
    setAccount(() => {
      return additionalAccounts;
    });
    setBroker((b) => {
      return {
        ...b,
        accountDetails: additionalAccounts,
      };
    });
  };

  const handleNewAccount = () => {
    setAccount((prevAcnt) => {
      return [
        ...prevAcnt,
        {
          id: "",
          bankName: "",
          ownerName: "",
          ifsc: "",
          pan: "",
          brokerId: loggedInBrokerId,
          isPrimary: false,
        },
      ];
    });
  };

  const removeBank = (index) => {
    let acnt = [...account];
    acnt.splice(index, 1);
    setAccount(acnt);
    setBroker((prevState) => {
      return { ...prevState, accountDetails: acnt };
    });
  };

  const handleSave = () => {
    const payload = [];
    Object.keys(broker).forEach((e) => {
      if (broker[e] !== init[e]) {
        payload.push({
          path: `/${e}`,
          op: "replace",
          value: broker[e],
        });
      }
    });

    if (payload?.length > 0) {
      editBroker(broker.id, payload)
        .then((res) => {
          if (res.status === 200 && res.data === true) {
            alert("Profile Updated");
            setinit(broker);
            setOthers((prev) => {
              return { ...prev, refresh: prev.refresh++ };
            });
          }
        })
        .catch((err) => {
          handleApiError(err);
        });
    }
  };

  const handleDialogClose = () => {
    setOthers((prev) => {
      return { ...prev, dialogOpen: false };
    });
  };

  const handleDialogOpen = () => {
    setOthers((prev) => {
      return { ...prev, dialogOpen: true };
    });
  };

  const handleActive = () => {
    if (broker.isActive) {
      if (
        window.confirm(
          "Are you sure you want to make this broker Inactive? Note:Marking Inactive won't allow this user to login."
        )
      ) {
        const payload = [
          {
            path: "/isActive",
            op: "replace",
            value: false,
          },
        ];
        editBroker(broker.id, payload)
          .then((res) => {
            if (res.status === 200) {
              setBroker((prev) => {
                return { ...prev, isActive: false };
              });
            }
          })
          .catch((err) => {
            handleApiError(err);
          });
      }
    } else {
      if (window.confirm("Are you sure you want to make this broker Active?")) {
        const payload = [
          {
            path: "/isActive",
            op: "replace",
            value: true,
          },
        ];
        editBroker(broker.id, payload)
          .then((res) => {
            if (res.status === 200) {
              setBroker((prev) => {
                return { ...prev, isActive: true };
              });
            }
          })
          .catch((err) => {
            handleApiError(err);
          });
      }
    }
  };

  return (
    <>
      <div className="profile PageLayout">
        <h1
          style={{
            color: "white",
            backgroundColor: "#00b7aa",
            marginBottom: "2%",
            padding: "2%",
            width: "90%",
            fontSize: "20px",
          }}
        >
          Profile
        </h1>
        <div
          style={{ width: "92%", display: "flex", justifyContent: "flex-end" }}
        >
          <label>Profile Completion Status:&nbsp;&nbsp; </label>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={others.profileCompletionPercentage}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {`${Math.round(others.profileCompletionPercentage)}%`}
              </Typography>
            </Box>
          </Box>
          <br />
        </div>
        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          {" "}
          Personal Details{" "}
        </h2>
        <div className="BrokerContactInfo1">
          <div className="info">
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Name"
              name="userName"
              value={broker.userName}
              onChange={handleChange}
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Contact Number"
              name="contactNumber"
              value={broker.contactNumber}
              onChange={handleChange}
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Whatsapp Number (if different)"
              name="whatsAppNumber"
              value={broker.whatsAppNumber}
              onChange={handleChange}
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="email"
              label="Email Address"
              name="email"
              value={broker.email}
              InputProps={{ readOnly: true }}
            />{" "}
            <br />
          </div>
          <div>
            <Box
              component="img"
              sx={{
                height: 250,
                width: 250,
              }}
              alt="The house from the offer."
              src={Avatar}
            />
          </div>
        </div>
        <TextField
          size="small"
          sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
          type="text"
          label="Permanent Address"
          name="permanentAddress"
          value={broker.permanentAddress}
          onChange={handleChange}
        />
        <TextField
          size="small"
          sx={{ height: "50px", width: "90%", mr: "10%", mb: "2%" }}
          type="text"
          label="Residence Address"
          name="residentialAddress"
          value={broker.residentialAddress}
          onChange={handleChange}
        />
        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          {" "}
          Company Contact Details{" "}
        </h2>

        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="text"
          label="Alias Name"
          name="alias"
          value={broker.alias}
          onChange={handleChange}
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "3%", mb: "1%" }}
          type="text"
          label="OFS Contact Number"
          name="contact"
          value="(651) 468-6868"
          InputProps={{ readOnly: true }}
        />
        <TextField
          size="small"
          sx={{ height: "50px", width: "15%", mr: "3%", mb: "1%" }}
          type="text"
          label="Extension"
          name="extn"
          value={broker.extn}
          onChange={handleChange}
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="text"
          label="Cell Number"
          name="officePhone"
          value={broker.officePhone}
          onChange={handleChange}
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="email"
          label="Email Address"
          name="officeEmail"
          value={broker.officeEmail}
          onChange={handleChange}
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="email"
          label="TMS Password"
          name="tmsPassword"
          value={broker.tmsPassword}
          onChange={handleChange}
        />

        <h2
          style={{
            color: "white",
            backgroundColor: "black",
            marginBottom: "2%",
            padding: "0.5%",
            width: "93%",
            fontSize: "15px",
          }}
        >
          Bank Account Details{" "}
        </h2>
        <div className="BankDetails">
          {account ? (
            account.map((acnt, index) => {
              return (
                <div className="BankInfo" key={index}>
                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
                    type="text"
                    label="Name of Bank"
                    name="bankName"
                    value={acnt.bankName}
                    onChange={(e) => handleAccount(e, index)}
                  />
                  <br />
                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "90%", mr: "3%", mb: "1%" }}
                    type="text"
                    label="Account Holder's Name"
                    name="ownerName"
                    value={acnt.ownerName}
                    onChange={(e) => handleAccount(e, index)}
                  />

                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
                    type="text"
                    label="Account Number"
                    name="id"
                    value={acnt.id}
                    onChange={(e) => handleAccount(e, index)}
                  />
                  <br />
                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
                    type="text"
                    label="IFSC Code"
                    name="ifsc"
                    value={acnt.ifsc}
                    onChange={(e) => handleAccount(e, index)}
                  />

                  <TextField
                    size="small"
                    sx={{ height: "50px", width: "70%", mr: "5%", mb: "1%" }}
                    type="text"
                    label="PAN Number associated with account"
                    name="pan"
                    value={acnt.pan}
                    onChange={(e) => handleAccount(e, index)}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeBank(index)}
                  >
                    X
                  </Button>
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className="AddButton">
            <Button
              variant="contained"
              color="success"
              size="large"
              endIcon={<AddIcon />}
              sx={{ mb: "3%", width: "50%" }}
              onClick={handleNewAccount}
            >
              Add
            </Button>
            <p fontSize="14px">Add another Bank Account</p>
          </div>
        </div>
        <div hidden={others.userRole !== 1}>
          <h2
            style={{
              color: "white",
              backgroundColor: "black",
              marginBottom: "2%",
              padding: "0.5%",
              width: "93%",
              fontSize: "15px",
            }}
          >
            Miscellaneous Details{" "}
          </h2>

          <TextField
            size="small"
            sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
            type="text"
            label="Phone Bill(USD)"
            name="phoneBill"
            value={broker.phoneBill}
            onChange={handleChange}
          />

          <TextField
            size="small"
            sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
            type="text"
            label="Commission %"
            name="maxCommision"
            value={broker.maxCommision}
            onChange={handleChange}
          />

          <TextField
            size="small"
            sx={{ height: "50px", width: "20%", mr: "10%", mb: "1%" }}
            type="text"
            label="Exchange Rate"
            name="currencyId"
            value={broker.currencyId}
            onChange={handleChange}
          />
          <br />

          <TextField
            size="small"
            sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
            type="text"
            label="TDS"
            name="tds"
            value={broker.tds}
            onChange={handleChange}
          />

          <TextField
            size="small"
            sx={{ height: "50px", width: "25%", mr: "10%", mb: "1%" }}
            type="text"
            label="INR Deductions"
            name="deductionInr"
            value={broker.deductionInr}
            onChange={handleChange}
          />
          <br />
         
        </div>

        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "25%", mb: "1%", mr: "6%" }}
          onClick={handleSave}
        >
          Save Changes
        </Button>
{others.userRole===1?
        <Button
            variant="contained"
            color="info"
            sx={{ width: "25%", mb: "1%", mr: "6%" }}
            onClick={handleActive}
          >
            {broker.isActive ? "Mark Inactive" : "Mark Active"}
          </Button>
          :<></>}

        <Button
          variant="contained"
          color="info"
          sx={{ width: "25%", mb: "1%", mr: "6%"}}
          onClick={handleDialogOpen}
        >
          Change Password
        </Button>

        <Dialog open={others.dialogOpen} onClose={handleDialogClose}>
          <DialogContent>
            <PasswordChangeModal
              email={broker.email}
              brokerId={broker.id}
              dialog={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
export default Profile;
