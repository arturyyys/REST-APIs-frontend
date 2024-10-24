import React, { Component } from "react";
import Input from "../../components/Form/Input/Input"; // Make sure this path is correct
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
    },
    formIsValid: false, // Initialize form validity
  };

  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      let isValid = true;

      // Validate input using defined validators
      for (const validator of prevState.loginForm[input].validators) {
        const validationResult = validator(value);
        isValid = isValid && validationResult;
      }

      // Update form state
      const updatedForm = {
        ...prevState.loginForm,
        [input]: {
          ...prevState.loginForm[input],
          valid: isValid,
          value: value,
        },
      };

      // Check if the entire form is valid
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }

      return {
        loginForm: updatedForm,
        formIsValid: formIsValid, // Set form validity
      };
    });
  };

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

  render() {
    return (
      <Auth>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            if (this.state.formIsValid) {
              this.props.onLogin(e, {
                email: this.state.loginForm.email.value,
                password: this.state.loginForm.password.value,
              });
            } else {
              // Handle form errors
              console.error("Form is invalid!");
            }
          }}
        >
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("email")} // Pass input name correctly
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
            onBlur={() => this.inputBlurHandler("password")} // Pass input name correctly
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
