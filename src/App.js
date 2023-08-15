import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import RootLayout from "./Layouts/RootLayout";
import NewLoad from "./components/NewLoad";
import EditLoad from "./components/EditLoad";
import Home from "./components/Home";
import Shippers from "./components/Shippers";
import Login from "./components/Login";
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
            <Route path="Primate-CRM-FE/Edit" element={<EditLoad />} />
            <Route path="Primate-CRM-FE/Shippers" element={<Shippers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
