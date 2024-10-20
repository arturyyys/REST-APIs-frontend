import React from "react";
import { Link } from "react-router-dom"; // Importing the Link component from react-router-dom for navigation

import "./Button.css"; // Importing the CSS file for button styles

// The button functional component. It conditionally renders either a <button> element or a <Link> element based on the props
const button = (props) =>
  // If props.link is falsy, render a regular <button> element
  !props.link ? (
    <button
      className={[
        "button", // Base 'button' class for styling
        `button--${props.design}`, // Dynamic class based on the 'design' prop (e.g., 'button--raised', 'button--flat')
        `button--${props.mode}`, // Dynamic class based on the 'mode' prop (e.g., 'button--primary', 'button--danger')
      ].join(" ")} // Joining all the class names into a single string for the className attribute
      onClick={props.onClick} // onClick event handler, passed as a prop to handle button clicks
      disabled={props.disabled || props.loading} // Disables the button if either 'disabled' or 'loading' is true
      type={props.type} // Setting the button type (e.g., 'submit', 'button', etc.), passed as a prop
    >
      {props.loading ? "Loading..." : props.children} // Display 'Loading...'
      text if loading is true, otherwise display the button's children content
    </button>
  ) : (
    // If props.link is truthy, render a <Link> element instead
    <Link
      className={[
        "button", // Base 'button' class for styling
        `button--${props.design}`, // Dynamic class based on the 'design' prop
        `button--${props.mode}`, // Dynamic class based on the 'mode' prop
      ].join(" ")} // Joining all the class names into a single string for the className attribute
      to={props.link} // The 'to' prop determines where the Link will navigate when clicked
    >
      {props.children} // Displaying the button's children content inside the
      Link
    </Link>
  );

export default button; // Exporting the button component for use in other parts of the app
