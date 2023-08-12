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
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<RootLayout />}>
            <Route exact path="/" element={<Home />} />
            <Route path="New" element={<NewLoad />} />
            <Route path="Edit" element={<EditLoad />} />
            <Route path="Shippers" element={<Shippers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
