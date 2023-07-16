import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NewLoad from './components/NewLoad';
import EditLoad from './components/EditLoad';

function App() {
  return (
    <div className="App">
      <h1>Welcome to CRM</h1>
    <BrowserRouter>
    <Routes>
      <Route path = "New" element = {<NewLoad/>}/>
      <Route path = "Edit" element = {<EditLoad/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
