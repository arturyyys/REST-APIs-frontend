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

  // Handle input change
  inputChangeHandler = (input, value) => {
    this.setState((prevState) => {
      let isValid = true;

      // Validate input using defined validators
      for (const validator of prevState.signupForm[input].validators) {
        const validationResult = validator(value);
        isValid = isValid && validationResult;
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

  // Handle input blur event
  inputBlurHandler = (input) => {
    console.log(`Input blurred: ${input}`); // Debugging log
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

  // Handle signup submission
  signupHandler = (event) => {
    event.preventDefault(); // Prevent the default form submission

    if (!this.state.formIsValid) {
      this.setState({ error: "Please fill in the form correctly." });
      return;
    }

    const { email, password, name } = this.state.signupForm;

    fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        name: name.value,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || "Request failed!");
          });
        }
        return res.json();
      })
      .then((resData) => {
        console.log("User created successfully:", resData);
        this.setState({ error: null });
        this.props.onSignup(); // Handle successful signup
      })
      .catch((err) => {
        console.error("Signup error:", err);
        this.setState({ error: err.message || "Something went wrong!" });
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
