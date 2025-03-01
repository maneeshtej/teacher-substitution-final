import React, { useEffect, useState } from "react";
import "./login.css";
import {
  fetchUsers,
  getTeacherDetailsByEmail,
} from "../../../utils/fetchUtils";
import { signIn, isUserLoggedIn } from "../../../utils/authUtils";
import useTeachStore from "../../context/useTeachStore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const navigate = useNavigate();

  const { setteacherid, setteachername, setteacheremail, setteacherdetails } =
    useTeachStore();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLoggedIn = await isUserLoggedIn();
        if (isLoggedIn) navigate("/home");
      } catch (e) {
        console.error("Error checking login status:", e);
      } finally {
        setPageLoad(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await signIn(username, password);
      if (error) {
        console.error("Login error:", error.message);
        return;
      }

      if (data?.user) {
        setteacheremail(data.user.email);

        try {
          const { data: teacherData, error: teacherError } =
            await getTeacherDetailsByEmail(username);
          if (teacherError) {
            console.error("Error fetching teacher details:", teacherError);
          } else if (teacherData?.length > 0) {
            setteacherdetails(teacherData);
            setteacherid(teacherData[0].id);
            setteachername(teacherData[0].name);
          }
        } catch (fetchError) {
          console.error(
            "Unexpected error fetching teacher details:",
            fetchError
          );
        }
        navigate("/home");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed h-screen w-screen text-textc bg-backgroundc">
      {(loading || pageLoad) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl font-anton">
          <div className="animate-pulse">
            <h1>Teacher</h1>
            <h1>Substitution</h1>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full items-center justify-center bg-backgroundc gap-[4vh]">
        <h1 className="text-4xl font-bold mb-6">Teacher Substitution</h1>
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </div>
    </div>
  );
}

export default Login;
