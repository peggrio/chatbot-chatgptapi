import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chatbot from "./pages/Chatbot";
import Rash_generator from "./pages/Rash_Generator";
import Home from "./pages/Home";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/rash_generator" element={<Rash_generator />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
