import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//! ---------------> MIDDLEWARES IMPORT
import { useSession } from "../../middlewares/ProtectedRoutes";

//! ---------------> CSS IMPORT
import "./oauthLoginSuccess.css";

//! ---------------> ANIMATION IMPORT
import Lottie from "lottie-web";
import loginAnimation from "../../data/hello_wink_animation.json";

const GitHubLoginSuccess = () => {
  const [countdown, setCountdown] = useState(5);

  // const location = useLocation();
  // const urlParams = new URLSearchParams(location.search);
  // const token = urlParams.get("token");
  const { token } = useParams();
  const navigate = useNavigate();

  const saveUserToLocalStorage = (token) => {
    localStorage.setItem("userLoggedIn", JSON.stringify(token));
  };

  const session = useSession();
  console.log(session);

  useEffect(() => {
    const animationWrapper = document.getElementById("animationWrapper");

    if (token) {
      saveUserToLocalStorage(token);

      navigate(`/success/${token}`);

      Lottie.loadAnimation({
        container: animationWrapper,
        animationData: loginAnimation,
        loop: true,
        autoplay: true,
      });

      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);

        navigate("/homepage");
      }, 5000);
    } else {
      navigate("*");
    }
  }, [token, navigate]);

  return (
    <div className="mainWrapper">
      <div>Welcome {session?.displayName}</div>
      <div>Logged in successfully...</div>
      <div id="animationWrapper" className="animationWrapper" />
      <div className="redirectCounter">You will be redirected in {countdown} seconds</div>
    </div>
  );
};

export default GitHubLoginSuccess;
