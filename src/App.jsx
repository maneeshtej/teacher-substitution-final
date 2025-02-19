import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/Home";
import SubstitutionDetails from "./pages/substitution/SubstitutionDetails";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/home/subdetails"
            element={<ProtectedRoute element={<SubstitutionDetails />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
