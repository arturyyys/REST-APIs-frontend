import React, { Component, Fragment } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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

class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
  };

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, userId: userId });
    this.setAutoLogout(remainingMilliseconds);
  };

  mobileNavHandler = (isOpen) => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null, userId: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    fetch("URL")
      .then((res) => {
        if (!res.ok) {
          // Handle various response errors
          if (res.status === 422) {
            throw new Error("Validation failed.");
          }
          throw new Error("Could not authenticate you!");
        }
        return res.json(); // Assuming the response is JSON
      })
      .then((resData) => {
        this.setState({
          isAuth: true,
          token: resData.token,
          userId: resData.userId,
          authLoading: false,
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.setAutoLogout(60 * 60 * 1000);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    fetch("URL")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 422) {
            throw new Error(
              "Validation failed. Make sure the email address isn't used yet!"
            );
          }
          throw new Error("Creating a user failed!");
        }
        return res.json(); // Assuming the response is JSON
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ isAuth: false, authLoading: false });
        this.props.navigate("/"); // Assuming you have a way to navigate
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(this.logoutHandler, milliseconds);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  render() {
    let routes = (
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );

    if (this.state.isAuth) {
      routes = (
        <Routes>
          <Route
            path="/"
            element={
              <FeedPage userId={this.state.userId} token={this.state.token} />
            }
          />
          <Route
            path="/:postId"
            element={
              <SinglePostPage
                userId={this.state.userId}
                token={this.state.token}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    return (
      <Fragment>
        <Backdrop
          open={this.state.showBackdrop}
          onClick={this.backdropClickHandler}
        />
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <Layout
          header={
            <Toolbar>
              <MainNavigation
                onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
              />
            </Toolbar>
          }
          mobileNav={
            <MobileNavigation
              open={this.state.showMobileNav}
              onChooseItem={this.mobileNavHandler.bind(this, false)}
              onLogout={this.logoutHandler}
              isAuth={this.state.isAuth}
            />
          }
        />
        {routes}
      </Fragment>
    );
  }
}

export default App;
