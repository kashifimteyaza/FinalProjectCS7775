import React from "react";

const AlertModal = ({ message, onProceed, onChange }) => {
  return (
    <div className="alert-modal">
      <p className="warning">{message}</p>
        <p><strong className="warn">Warning:</strong> Potentially sensitive information detected in your input. Consider changing the content to avoid leaking Personally
        Identifiable Information (PII) before sending your prompt to ChatGPT
      </p>
      <button className="proceed" onClick={onProceed}>
        Proceed
      </button>
      <button className="change" onClick={onChange}>
        Change
      </button>
    </div>
  );
};

export default AlertModal;