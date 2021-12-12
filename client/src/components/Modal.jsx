import React from 'react';
import {
  func,
  string,
  node,
} from 'prop-types';
import '../styles/Modal.css';

const Modal = ({
  onClose,
  buttonText,
  children,
}) => (
  <>
    <div className="modal-background" />
    <div className="modal-content">
      {children}
      <div className="modal-btn-area">
        <button
          type="button"
          className="update-btn"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  </>
);

Modal.propTypes = {
  onClose: func.isRequired,
  buttonText: string.isRequired,
  children: node,
};

export default Modal;
