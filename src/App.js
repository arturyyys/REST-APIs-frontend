import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import Toolbar from "./components/Toolbar/Toolbar";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import FeedPage from "./pages/Feed/Feed";
import SinglePostPage from "./pages/Feed/SinglePost/SinglePost";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import "./App.css";

const App = () => {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const setAutoLogout = useCallback((milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");

    // Debugging: Log retrieved values from localStorage
    console.log("Token retrieved from localStorage:", storedToken);
    console.log("Expiry date retrieved from localStorage:", expiryDate);

    if (!storedToken || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setIsAuth(true);
    setToken(storedToken);
    setUserId(userId);
    setAutoLogout(remainingMilliseconds);
  }, [setAutoLogout]);

  const mobileNavHandler = (isOpen) => {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
  };

  const backdropClickHandler = () => {
    setShowBackdrop(false);
    setShowMobileNav(false);
    setError(null);
  };

  const logoutHandler = () => {
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  const loginHandler = async (event, authData) => {
    event.preventDefault();
    setAuthLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not authenticate you!");
      }

      const resData = await response.json();

      // Debugging: Log the response data
      console.log("Login response data:", resData);

      setIsAuth(true);
      setToken(resData.token);
      setUserId(resData.userId);

      // Store the token, userId, and expiryDate in localStorage
      localStorage.setItem("token", resData.token);
      localStorage.setItem("userId", resData.userId);
      const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour
      localStorage.setItem("expiryDate", expiryDate.toISOString());

      // Debugging: Log values after storing in localStorage
      console.log("Token stored in localStorage:", resData.token);
      console.log("User ID stored in localStorage:", resData.userId);
      console.log(
        "Expiry date stored in localStorage:",
        expiryDate.toISOString()
      );

      setAutoLogout(60 * 60 * 1000);
      navigate("/"); // Navigate to home after successful login
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong! Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const signupHandler = async (event, authData) => {
    if (event) {
      event.preventDefault();
    }
    setAuthLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed!");
      }

      const resData = await response.json();
      console.log("User created successfully:", resData);

      // Store token and userId in localStorage after successful signup
      setIsAuth(true);
      setToken(resData.token);
      setUserId(resData.userId);
      localStorage.setItem("token", resData.token);
      localStorage.setItem("userId", resData.userId);
      const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour
      localStorage.setItem("expiryDate", expiryDate.toISOString());

      setAutoLogout(60 * 60 * 1000);
      navigate("/"); // Navigate to home after successful signup
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong! Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  let routes = (
    <Routes>
      <Route
        path="/"
        element={<LoginPage onLogin={loginHandler} loading={authLoading} />}
      />
      <Route
        path="/signup"
        element={<SignupPage onSignup={signupHandler} loading={authLoading} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  if (isAuth) {
    routes = (
      <Routes>
        <Route path="/" element={<FeedPage userId={userId} token={token} />} />
        <Route
          path="/:postId"
          element={<SinglePostPage userId={userId} token={token} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Fragment>
        {showBackdrop && <Backdrop onClick={backdropClickHandler} />}
        <ErrorHandler error={error} onHandle={errorHandler} />
        <Toolbar>
          <MainNavigation
            onOpenMobileNav={() => mobileNavHandler(true)}
            onLogout={logoutHandler}
            isAuth={isAuth}
          />
        </Toolbar>
        <MobileNavigation
          open={showMobileNav}
          mobile
          onChooseItem={() => mobileNavHandler(false)}
          onLogout={logoutHandler}
          isAuth={isAuth}
        />
        {routes}
      </Fragment>
    </Layout>
  );
};

export default App;
