import React from 'react';
import {
  func,
  string,
  node,
  bool,
} from 'prop-types';
import '../styles/Modal.css';

const Modal = ({
  onClose,
  buttonText,
  children,
  shouldCloseOnOverlayClick = false,
}) => (
  <>
    <div
      className="modal-background"
      onClick={shouldCloseOnOverlayClick ? onClose : null}
      role="button"
      aria-label="Modal overlay"
      tabIndex={0}
      onKeyDown={
        shouldCloseOnOverlayClick
          ? (e) => {
            if (e.key === 'Enter') {
              onClose();
            }
          } : null
      }
    />
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
  shouldCloseOnOverlayClick: bool,
};

export default Modal;
