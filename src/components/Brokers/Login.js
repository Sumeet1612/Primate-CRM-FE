import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { callLogin, handleApiError } from '../../api/api';
import { setUserAndRole } from '../../api/validation';
import ResetPasswordModal from './ResetPasswordModal';

const defaultTheme = createTheme();

export default function SignIn() {

  const history= useNavigate();
  const [dialogOpen,setDialogOpen]= React.useState(false);

  const closeDialog=()=>{
    setDialogOpen(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    var loginData={
      email: data.get('email'),
      password: data.get('password'),
    }
    callLogin(loginData)
      .then((res)=>{
        if (res.status === 200) {
            if (res.data?.id !== -1) {
              alert("logged In");
              setUserAndRole(res.data?.jwtToken)
              history("/Primate-CRM-FE/");
              window.location.reload();
            } else {
              if (res.data?.isActive === false) {
                alert(
                  "You no longer have the access. Please contact your Admin."
                );
              } else {
                alert("Incorrect credentials.");
              }
            }
          }
    }).catch((err)=>{
        handleApiError(err);
    }) 
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
          <Button
                type="submit"
                fullWidth
                variant="text"
                sx={{ mt: 3, mb: 2 }}
                onClick={()=>setDialogOpen(true)}
          >
              Forgot Your Password? Reset 
          </Button>

          <Dialog open={dialogOpen} onClose={closeDialog}>
            <DialogContent>
              <ResetPasswordModal closeDialog={closeDialog}/>
            </DialogContent>
          </Dialog>
      </Container>
    </ThemeProvider>
  );
}