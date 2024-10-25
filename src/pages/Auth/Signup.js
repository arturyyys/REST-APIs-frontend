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
    },
    formIsValid: false,
    error: null,
  };

  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      let isValid = true;

      // Validate input using defined validators
      for (const validator of prevState.signupForm[input].validators) {
        isValid = isValid && validator(value);
      }

      // Update form state
      const updatedForm = {
        ...prevState.signupForm,
        [input]: {
          ...prevState.signupForm[input],
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
        signupForm: updatedForm,
        formIsValid: formIsValid,
        error: null, // Reset error on valid input change
      };
    });
  };

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

  signupHandler = (event) => {
    console.log("Signup handler invoked:", { event });

    // Only prevent default if event is defined
    if (event) {
      event.preventDefault();
    } else {
      console.warn("Event is undefined!");
    }

    if (!this.state.formIsValid) {
      this.setState({ error: "Please fill in the form correctly." });
      return;
    }

    const { email, password, name } = this.state.signupForm;

    this.props.onSignup(event, {
      email: email.value,
      password: password.value,
      name: name.value,
    });
  };

  render() {
    return (
      <Auth>
        <form onSubmit={this.signupHandler}>
          {this.state.error && (
            <div style={{ color: "red" }}>{this.state.error}</div>
          )}
          <Input
            id="email"
            label="Your E-Mail"
            type="email"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("email")}
            value={this.state.signupForm["email"].value}
            valid={this.state.signupForm["email"].valid}
            touched={this.state.signupForm["email"].touched}
          />
          <Input
            id="name"
            label="Your Name"
            type="text"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("name")}
            value={this.state.signupForm["name"].value}
            valid={this.state.signupForm["name"].valid}
            touched={this.state.signupForm["name"].touched}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={() => this.inputBlurHandler("password")}
            value={this.state.signupForm["password"].value}
            valid={this.state.signupForm["password"].valid}
            touched={this.state.signupForm["password"].touched}
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
