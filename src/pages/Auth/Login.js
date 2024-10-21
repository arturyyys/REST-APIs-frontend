import React, { Component } from "react";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

class Login extends Component {
  state = {
    loginForm: {
      email: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, email],
      },
      password: {
        value: "",
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
      },
      formIsValid: false,
    },
  };

  // Handle input changes and validate
  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          value: value,
          valid: this.validateInput(
            value,
            prevState.loginForm[input].validators
          ),
        },
      };

      const formIsValid = Object.values(updatedForm).every(
        (input) => input.valid
      );

      return {
        loginForm: updatedForm,
        formIsValid: formIsValid,
      };
    });
  };

  // Validate a single input
  validateInput(value, validators) {
    return validators.every((validator) => validator(value));
  }

  // Mark input as touched
  inputBlurHandler = (input) => {
    this.setState((prevState) => ({
      loginForm: {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          touched: true,
        },
      },
    }));
  };

  // Handle form submission
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.formIsValid) {
      this.props.onLogin(event, {
        email: this.state.loginForm.email.value,
        password: this.state.loginForm.password.value,
      });
    } else {
      console.log("Form is invalid!"); // You might want to show an error message instead
    }
  };

  render() {
    return (
      <Auth>
        <form onSubmit={this.handleSubmit}>
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("email")}
            value={this.state.loginForm.email.value}
            valid={this.state.loginForm.email.valid}
            touched={this.state.loginForm.email.touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("password")}
            value={this.state.loginForm.password.value}
            valid={this.state.loginForm.password.valid}
            touched={this.state.loginForm.password.touched}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>
            Login
          </Button>
        </form>
      </Auth>
    );
  }
}

export default Login;
