import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import { useTheme } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/Home";

function App() {
  const [count, setCount] = useState(0);
  const { textStyle } = useTheme();

  return (
    <div
      className=""
      style={{
        fontFamily: `${textStyle.fontFamily}`,
        color: textStyle.fontColor,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
