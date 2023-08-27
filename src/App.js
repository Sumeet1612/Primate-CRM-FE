import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import RootLayout from "./Layouts/RootLayout";
import NewLoad from "./components/Loads/NewLoad";
import EditLoad from "./components/Loads/EditLoad";
import Home from "./components/Home";
import Shippers from "./components/Shippers";
import Login from "./components/Brokers/Login";
import SearchLoad from "./components/SearchLoad";
import ViewLoads from "./components/Loads/ViewLoads";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="Primate-CRM-FE/login" element={<Login />} />
          </Route>
          <Route element={<RootLayout />}>
            <Route exact path="Primate-CRM-FE/" element={<Home />} />
            <Route path="Primate-CRM-FE/New" element={<NewLoad />} />
            <Route path="Primate-CRM-FE/editLoad/:id" element={<EditLoad />} />
            <Route path="Primate-CRM-FE/viewLoads" element={<ViewLoads />} />
            <Route path="Primate-CRM-FE/searchLoad" element={<SearchLoad />} />
            <Route path="Primate-CRM-FE/Shippers" element={<Shippers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
