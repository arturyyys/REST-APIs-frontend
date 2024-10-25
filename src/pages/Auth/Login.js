import React, { Component } from "react";
import Input from "../../components/Form/Input/Input"; // Ensure this path is correct
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
    errorMessage: null, // To store error messages
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

  // Function to handle login submission
  handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (this.state.formIsValid) {
      const { email, password } = this.state.loginForm;
      try {
        await this.props.onLogin(event, {
          email: email.value,
          password: password.value,
        });
        this.setState({ errorMessage: null }); // Clear any previous error message
      } catch (error) {
        this.setState({ errorMessage: error.message }); // Set the error message
      }
    } else {
      this.setState({ errorMessage: "Form is invalid!" }); // Handle form errors
      console.error("Form is invalid!");
    }
  };

  render() {
    return (
      <Auth>
        <form onSubmit={this.handleLogin}>
          {this.state.errorMessage && (
            <p style={{ color: "red" }}>{this.state.errorMessage}</p>
          )}
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
