import React, { Component } from "react";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button";
import { required, length, email } from "../../util/validators";
import Auth from "./Auth";

class Signup extends Component {
  state = {
    signupForm: {
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
      name: {
        value: "",
        valid: false,
        touched: false,
        validators: [required],
      },
      formIsValid: false,
    },
  };

  // Handle input changes and validate
  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      const updatedForm = {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
          value: value,
          valid: this.validateInput(
            value,
            prevState.signupForm[input].validators
          ),
        },
      };

      const formIsValid = Object.values(updatedForm).every(
        (input) => input.valid
      );

      return {
        signupForm: updatedForm,
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
      signupForm: {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
          touched: true,
        },
      },
    }));
  };

  // Handle form submission
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.signupForm.formIsValid) {
      this.props.onSignup(event, {
        email: this.state.signupForm.email.value,
        password: this.state.signupForm.password.value,
        name: this.state.signupForm.name.value,
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
            value={this.state.signupForm.email.value}
            valid={this.state.signupForm.email.valid}
            touched={this.state.signupForm.email.touched}
          />
          <Input
            id="name"
            label="Your Name"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("name")}
            value={this.state.signupForm.name.value}
            valid={this.state.signupForm.name.valid}
            touched={this.state.signupForm.name.touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("password")}
            value={this.state.signupForm.password.value}
            valid={this.state.signupForm.password.valid}
            touched={this.state.signupForm.password.touched}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>
            Signup
          </Button>
        </form>
      </Auth>
    );
  }
}

export default Signup;
