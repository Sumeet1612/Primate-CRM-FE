import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { handleApiError, register } from "../../api/api";
import logo from "../../img/poLogo.png";

const theme = createTheme();

export default function SignUp() {
  const [role, setRole] = React.useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    let validationError = false;
    const data = new FormData(event.currentTarget);
    let registerObj = {
      email: data.get("email"),
      alias: data.get("alias"),
      password: data.get("password"),
      userName: data.get("userName"),
      roleId: data.get("roleId"),
      isActive: data.get("active") ? true : false,
    };

    //validation for all mandatory fields
    Object.keys(registerObj).every((r) => {
      if (registerObj[r] === "") {
        validationError = true;
        return false;
      }
      return true;
    });

    if (validationError) {
      alert("All fields are mandatory for broker registeration");
      return;
    }

    if (registerObj.password?.length < 8) {
      alert("Password should be atleast 8 character long");
      return;
    }
    //API Call
    register(registerObj)
      .then((res) => {
        if (res.status === 200) {
          alert("New Broker Added");
          event.target.reset();
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            marginLeft:"30%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            style={{ width: "200px", height: "175px", marginBottom: "5%" }}
            src={logo}
            alt="PO Logo"
          />

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Broker Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="alias"
                  required
                  fullWidth
                  id="alias"
                  label="Broker Alias"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item md={4}>
                <InputLabel>Role</InputLabel>
              </Grid>
              <Grid item md={8} >
                <Select
                  labelId="roleLabel"
                  label="Role"
                  name="roleId"
                  id="roleId"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  <MenuItem value="0" disabled>
                    <em>Select Role</em>
                  </MenuItem>
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Broker</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox name="active" value="isActive" color="primary" />
                  }
                  label="Create Broker with Active Status"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
