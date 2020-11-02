import React from 'react';
import '../styles/Error.css';

const Error = ({ message, setError }) => (
  <div id="error-container">
    <div id="error">
      <div>
        <p>
          {message || "An error occurred. Please start a new session and try again. If that does not resolve the issue, please send an email with the details to cost.sharing.for.ynab@gmail.com. Thank you for your patience!"}
        </p>
        <button
          className="exit-btn"
          onClick={() => setError({ occurred: false, status: 0 })}
        >
          X
        </button>
      </div>
      <button
        className="close-btn"
        onClick={() => setError({ occurred: false, status: 0 })}
      >
        Close
      </button>
    </div>
  </div>
);

export default Error;
