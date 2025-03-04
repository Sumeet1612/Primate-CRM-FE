import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import AuthLayout from "./Layouts/AuthLayout";
import RootLayout from "./Layouts/RootLayout";
import NewLoad from "./components/Loads/NewLoad";
import Profile from "./components/Brokers/profile";
import Invoice from "./components/Invoice/invoice";
import EditLoad from "./components/Loads/EditLoad";
import Home from "./components/Dashboard/Home";
import Shippers from "./components/Shippers/Shippers";
import Login from "./components/Brokers/Login";
import SearchLoad from "./components/Loads/SearchLoad";
import ViewLoads from "./components/Loads/ViewLoads";
import SignUp from "./components/Brokers/SignUp";
import AgencyForm from "./components/AgencyForm";
import "./App.css";
import EditShippers from "./components/Shippers/EditShippers";
import ViewBrokers from "./components/Brokers/ViewBrokers";
import ViewInvoices from "./components/Invoice/ViewInvoices";
import InvoiceLayout from "./components/Invoice/InvoiceLayout";
import Logout from "./components/Brokers/Logout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
            </Route>
            <Route element={<RootLayout />}>
              <Route exact path="" element={<Home />} />
              <Route
                exact
                path="register"
                element={<SignUp />}
              />
              <Route path="new" element={<NewLoad />} />
              <Route
                path="editLoad/:id"
                element={<EditLoad />}
              />
              <Route path="viewLoads" element={<ViewLoads />} />
              <Route
                path="searchLoad"
                element={<SearchLoad />}
              />
              <Route path="Shippers" element={<Shippers />} />
              <Route path="Shippers/:id" element={<EditShippers />} />
              <Route path="agency" element={<AgencyForm />} />
              <Route path="profile/:loggedInBrokerId" element={<Profile />} />
              <Route path="invoice/generate" element={<Invoice />} />
              <Route path="invoices" element={<ViewInvoices />} />
              <Route path="manageBrokers" element={<ViewBrokers/>}/>
              <Route path="invoice/:invoiceNumber" element={<InvoiceLayout/>}/>
              <Route path="logout" element={<Logout/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer/> 
      </LocalizationProvider>
    </div>
  );
}

export default App;
