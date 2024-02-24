import { BrowserRouter, Routes, Route } from "react-router-dom"
import Chatbot from "./pages/Chatbot";
import Home from "./pages/Home";

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
