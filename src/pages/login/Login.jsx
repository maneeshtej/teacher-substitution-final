import React, { useEffect, useState } from "react";
import "./login.css";
import {
  fetchUsers,
  getTeacherDetailsByEmail,
  handleFetch,
} from "../../../utils/fetchUtils";
import { signIn, getUser, isUserLoggedIn } from "../../../utils/authUtils";
import useTeachStore from "../../context/useTeachStore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(false);
  const { setteacherid, setteachername, setteacheremail, setteacherdetails } =
    useTeachStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const isLoggedIn = await isUserLoggedIn();

        if (isLoggedIn) {
          navigate("/home");
        }
      } catch (e) {
        console.error("error", e);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    // console.log(username, password);
  }, [username, password]);

  const handleUsername = (e) => {
    if (!e) {
      console.error("Please check, username no e");
    }
    setUsername(e.target.value ?? null);
  };

  const handlePassword = (e) => {
    if (!e) {
      console.error("Please check, password no e");
    }
    setPassword(e.target.value ?? null);
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading

    try {
      const { data, error } = await signIn(username, password);

      if (error) {
        console.error("Login error:", error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        const isLoggedIn = await isUserLoggedIn();
        setLoading(false);

        if (isLoggedIn) {
          // console.log(data.user.email);

          if (data.user.email) {
            // setStateData("email", data.user.email);
            setteacheremail(data.user.email);
          }

          try {
            const { data: teacherData, error: teacherError } =
              await getTeacherDetailsByEmail(username);

            if (teacherError) {
              console.error("Error fetching teacher details:", teacherError);
            }
            // console.log(teacherData);
            // setStateData("teacherData", teacherData);
            setteacherdetails(teacherData);
            // setStateData("teacherID", teacherData[0].id);
            setteacherid(teacherData[0].id);
            setteachername(teacherData[0].name);
          } catch (e) {
            console.error("Unexpected error fetching teacher details:", e);
          }

          navigate("/home");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false); // Ensure loading stops in all cases
    }
  };

  return (
    <div /*{Main Wrapper}*/
      className={`fixed overflow-y-hidden h-[100vh] w-[100vw] text-textc`}
    >
      <div
        className={`fixed h-[100vh] w-[100vw] backdrop-blur-2xl z-10 
    transition-opacity duration-300 ease-in-out flex items-center justify-center
    ${loading ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
      >
        <span className="text-black text-[30px]">Loading</span>
      </div>

      <div className="flex flex-col h-[30vh]">
        <div className="flex items-center justify-start flex-1 gap-[5px] h-[10vh] pl-[10px] pr-[13px] text-black">
          {/* Header */}
          <div className="h-[30px] w-[30px] rounded-[100px] bg-gray-400 "></div>
          Login
          <div className="ml-auto">V</div>
        </div>
        <span className="flex items-center justify-center flex-3 text-black text-[40px] font-[900] font-cursive">
          Teacher Substitution
        </span>
        {/* Main */}
      </div>
      <div className="transition-all duration-500 ease-in-out">
        {/* <BackgroundWaves /> */}
        <div
          className={`flex items-center justify-start
            flex-col gap-[30px] h-[100vh] bg-[#FAC375] sm:bg-[#ffefd8] transition-all duration-500 ease-in-out`}
        >
          <div className="flex flex-col gap-[20px] items-center justify-center pb-[10px] w-[100%] h-[40vh] transition-all duration-200 ease-in-out">
            <div className="flex flex-col items-center justify-center gap-[5px] w-[100%]">
              <input
                type="text"
                className="h-[7vh] w-[min(80%,400px)] rounded-[10px] p-[10px] text-[13px] focus:outline-0 focus:p-[15px] transition-all duration-500 ease-in-out"
                placeholder="Username"
                onChange={(e) => {
                  handleUsername(e);
                }}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "saturate(160%) blur(10px)",
                }}
              ></input>
            </div>
            <div className="flex flex-col items-center justify-center gap-[5px] w-[100%] transition-all duration-200 ease-in-out">
              <input
                type="password"
                className="h-[7vh] w-[min(80%,400px)] rounded-[10px] p-[10px] text-[13px] focus:outline-0 focus:p-[15px] transition-all duration-500 ease-in-out"
                placeholder="Password"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "saturate(160%) blur(10px)",
                }}
                onChange={(e) => {
                  handlePassword(e);
                }}
              ></input>
            </div>

            <div
              className="flex items-center justify-center h-[7vh] w-[min(40%,200px)] rounded-[10px] mt-[15px] bg-backgroundc"
              onClick={() => {
                handleLogin();
              }}
            >
              Log in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

function BackgroundWaves({}) {
  return (
    <svg
      width="100%"
      id="svg"
      viewBox="0 0 1440 690"
      xmlns="http://www.w3.org/2000/svg"
      class="transition duration-300 ease-in-out delay-150"
      className="flex sm:fixed sm:bottom-0 
            sm:translate-y-[5vw] md:translate-y-[15vw] lg:translate-y-[23vw] xl:translate-y-[33vw]"
    >
      <path
        d="M 0,700 L 0,131 C 74.98564593301438,114.94258373205741 149.97129186602876,98.88516746411483 237,116 C 324.02870813397124,133.11483253588517 423.1004784688995,183.4019138755981 528,179 C 632.8995215311005,174.5980861244019 743.6267942583731,115.50717703349284 839,108 C 934.3732057416269,100.49282296650716 1014.3923444976076,144.5693779904306 1112,157 C 1209.6076555023924,169.4306220095694 1324.8038277511962,150.2153110047847 1440,131 L 1440,700 L 0,700 Z"
        stroke="none"
        stroke-width="0"
        fill="#fac375"
        fill-opacity="0.4"
        class="transition-all duration-300 ease-in-out delay-150 path-0"
      ></path>
      <path
        d="M 0,700 L 0,306 C 108.8133971291866,280.8038277511962 217.6267942583732,255.60765550239233 317,254 C 416.3732057416268,252.39234449760767 506.3062200956938,274.37320574162686 597,276 C 687.6937799043062,277.62679425837314 779.1483253588517,258.89952153110045 881,263 C 982.8516746411483,267.10047846889955 1095.1004784688994,294.0287081339713 1190,305 C 1284.8995215311006,315.9712918660287 1362.4497607655503,310.9856459330143 1440,306 L 1440,700 L 0,700 Z"
        stroke="none"
        stroke-width="0"
        fill="#fac375"
        fill-opacity="0.53"
        class="transition-all duration-300 ease-in-out delay-150 path-1"
      ></path>
      <path
        d="M 0,700 L 0,481 C 100.71770334928229,487.51674641148327 201.43540669856458,494.0334928229665 292,485 C 382.5645933014354,475.9665071770335 462.97607655502406,451.3827751196171 562,453 C 661.0239234449759,454.6172248803829 778.6602870813397,482.43540669856463 881,486 C 983.3397129186603,489.56459330143537 1070.3827751196172,468.8755980861244 1161,464 C 1251.6172248803828,459.1244019138756 1345.8086124401914,470.0622009569378 1440,481 L 1440,700 L 0,700 Z"
        stroke="none"
        stroke-width="0"
        fill="#fac375"
        fill-opacity="1"
        class="transition-all duration-300 ease-in-out delay-150 path-2"
      ></path>
    </svg>
  );
}
