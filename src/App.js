import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NewLoad from "./components/NewLoad";
import EditLoad from "./components/EditLoad";
import Home from "./components/Home";
import Shippers from "./components/Shippers";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="App">
      <h1>Welcome to CRM</h1>
      {/* <Navigation /> */}
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="New" element={<NewLoad />} />
          <Route path="Edit" element={<EditLoad />} />
          <Route path="Shippers" element={<Shippers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
