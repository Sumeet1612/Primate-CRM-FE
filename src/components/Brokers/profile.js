import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Avatar from "../../img/Avatar.jpg";
import Box from "@mui/material/Box";

function Profile() {
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
        <br />
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
              name="brokerName"
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Contact Number"
              name="contactNumber"
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="Whatsapp Number (if different)"
              name="whatsappNumber"
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="text"
              label="PAN NUmber"
              name="numberPAN"
            />{" "}
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1.5%" }}
              type="email"
              label="Email Address"
              name="pEmail"
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
          name="pAddress"
        />
        <TextField
          size="small"
          sx={{ height: "50px", width: "90%", mr: "10%", mb: "2%" }}
          type="text"
          label="Residence Address"
          name="rAddress"
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
          name="brokerAliasName"
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "3%", mb: "1%" }}
          type="text"
          label="OFS Contact Number"
          name="OFScontactNumber"
        />
        <TextField
          size="small"
          sx={{ height: "50px", width: "15%", mr: "3%", mb: "1%" }}
          type="text"
          label="Extension"
          name="extension"
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="text"
          label="Cell Number"
          name="cellNumber"
        />
        <br />
        <TextField
          size="small"
          sx={{ height: "50px", width: "54%", mr: "10%", mb: "1%" }}
          type="email"
          label="Email Address"
          name="wEmail"
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
          Bank Account Details{" "}
        </h2>
        <div className="BankDetails">
          <div className="BankInfo">
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="Name of Bank"
              name="bank Name"
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "3%", mb: "1%" }}
              type="text"
              label="Account Holder's Name"
              name="holderName"
            />

            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="Account Number"
              name="accNumber"
            />
            <br />
            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="IFSC Code"
              name="codeIFSC"
            />

            <TextField
              size="small"
              sx={{ height: "50px", width: "90%", mr: "10%", mb: "1%" }}
              type="text"
              label="PAN Number associated with account"
              name="associatedPAN"
            />

          </div>
          <div className="AddButton">
            <Button
              variant="contained"
              color="success"
              size="large"
              endIcon={<AddIcon />}
              sx={{ mb: "3%", width: "50%" }}
            >
              Add
            </Button>
            <p fontSize="14px">Add another Bank Account</p>
          </div>
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
          Miscellaneous Details{" "}
        </h2>

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
          type="text"
          label="Phone Bill(USD)"
          name="phoneBill"
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "3%", mb: "1%" }}
          type="text"
          label="Commission %"
          name="naxCommission"
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "10%", mb: "1%" }}
          type="text"
          label="Currency"
          name="currency"
        />

        <TextField
          size="small"
          sx={{ height: "50px", width: "25%", mr: "10%", mb: "1%" }}
          type="text"
          label="Exchange Rate"
          name="exchangeRate"
        />
        <br />

        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "20%", mb: "1%", mr: "40%" }}
        >
          Save Changes
        </Button>

        {/* <Button
          variant="contained"
          color="inherit"
          sx={{ width: "20%", mb: "1%", mr:"0%" }}        >
          Edit Profile
        </Button> */}

        <Button
          variant="contained"
          color="info"
          sx={{ width: "20%", mb: "1%", mr: "10%" }}
        >
          Change Password
        </Button>
      </div>
    </>
  );
}
export default Profile;
