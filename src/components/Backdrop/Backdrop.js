import React from "react";
import ReactDOM from "react-dom"; // For rendering the backdrop outside of the component tree
import PropTypes from "prop-types"; // For prop type validation
import "./Backdrop.css"; // Importing CSS for backdrop styling

// The Backdrop functional component
const Backdrop = ({ open, onClick }) => {
  // Use React portals to render the backdrop in a specific DOM node
  return ReactDOM.createPortal(
    // The <div> representing the backdrop
    <div
      className={["backdrop", open ? "open" : ""].join(" ")} // Conditionally add 'open' class
      onClick={onClick} // Handle click events with the passed function
    />,
    document.getElementById("backdrop-root") // Rendering into the 'backdrop-root' element
  );
};

// Prop validation to ensure correct data types
Backdrop.propTypes = {
  open: PropTypes.bool.isRequired, // 'open' must be a boolean
  onClick: PropTypes.func.isRequired, // 'onClick' must be a function
};

// Exporting the Backdrop component for use in other parts of the application
export default Backdrop;
