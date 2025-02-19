import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/Home";
import SubstitutionDetails from "./pages/substitution/SubstitutionDetails";
import AddSubstitution from "./pages/substitution/AddSubstitution";
import AnimationsManager from "./context/animation/AnimationManager";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="">
      <BrowserRouter>
        <AnimationsManager>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/home/subdetails"
            element={<ProtectedRoute element={<SubstitutionDetails />} />}
          />
          <Route
            path="/addsubstitution"
            element={
              <ProtectedRoute element={<AddSubstitution></AddSubstitution>} />
            }
          />
        </AnimationsManager>
      </BrowserRouter>
    </div>
  );
}

export default App;
