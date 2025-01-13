import './App.css';
import Navbar from './Component/Navebar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './Pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home/>} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
