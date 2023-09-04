import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import AuthLayout from "./Layouts/AuthLayout";
import RootLayout from "./Layouts/RootLayout";
import NewLoad from "./components/Loads/NewLoad";
import Profile from "./components/Brokers/Profile";
import Invoice from "./components/Invoice";
import EditLoad from "./components/Loads/EditLoad";
import Home from "./components/Home";
import Shippers from "./components/Shippers";
import Login from "./components/Brokers/Login";
import SearchLoad from "./components/Loads/SearchLoad";
import ViewLoads from "./components/Loads/ViewLoads";
import SignUp from "./components/Brokers/SignUp";
import AgencyForm from "./components/AgencyForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="Primate-CRM-FE/login" element={<Login />} />
            </Route>
            <Route element={<RootLayout />}>
              <Route exact path="Primate-CRM-FE/" element={<Home />} />
              <Route
                exact
                path="Primate-CRM-FE/register"
                element={<SignUp />}
              />
              <Route path="Primate-CRM-FE/new" element={<NewLoad />} />
              <Route
                path="Primate-CRM-FE/editLoad/:id"
                element={<EditLoad />}
              />
              <Route path="Primate-CRM-FE/viewLoads" element={<ViewLoads />} />
              <Route
                path="Primate-CRM-FE/searchLoad"
                element={<SearchLoad />}
              />
              <Route path="Primate-CRM-FE/Shippers" element={<Shippers />} />
              <Route path="Primate-CRM-FE/agency" element={<AgencyForm />} />
              <Route path="Primate-CRM-FE/profile" element={<Profile />} />
              <Route path="Primate-CRM-FE/invoice" element={<Invoice />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </div>
  );
}

export default App;
