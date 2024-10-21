import React from "react";
import ReactDOM from "react-dom"; // Importing ReactDOM to use its createPortal method for rendering the backdrop outside of the component tree

import "./Backdrop.css"; // Importing the CSS file for styling the backdrop

// The backdrop functional component uses React portals to render the backdrop in a specific DOM node
const backdrop = (props) =>
  ReactDOM.createPortal(
    // The <div> representing the backdrop. Conditional class 'open' is added based on the 'open' prop
    <div
      className={["backdrop", props.open ? "open" : ""].join(" ")} // Dynamically setting the CSS classes for the backdrop. 'open' class is added when props.open is true
      onClick={props.onClick} // Adding an onClick event listener that triggers a function passed through props (e.g., to close the backdrop)
    />,
    document.getElementById("backdrop-root") // Rendering the backdrop div into the DOM element with the id 'backdrop-root' using React portals
  );

// Exporting the backdrop component so it can be used in other parts of the application
export default backdrop;
