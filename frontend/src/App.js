import { BrowserRouter, Routes, Route } from "react-router-dom"
import Chatbot from "./pages/Chatbot";
import Home from "./pages/Home";
import axios from "axios"

axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
