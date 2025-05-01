import './App.css';
import Navbar from './Component/Navebar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './Pages/Home/Home';
import Check from "./Pages/Check/Check"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/check" exact element={<Check/>} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
