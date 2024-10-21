import React, { Fragment } from "react";
import Backdrop from "../Backdrop/Backdrop";
import Modal from "../Modal/Modal";

// Renders an error modal and backdrop when an error occurs
const ErrorHandler = (props) => (
  <Fragment>
    {props.error && (
      <Backdrop onClick={props.onHandle} open={true} /> // Pass `open` prop correctly
    )}
    {props.error && (
      <Modal
        title="An Error Occurred"
        onCancelModal={props.onHandle}
        onAcceptModal={props.onHandle}
        acceptEnabled
      >
        <p>{props.error.message}</p>
      </Modal>
    )}
  </Fragment>
);

export default ErrorHandler;
