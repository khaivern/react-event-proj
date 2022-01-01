import React from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';

const Backdrop = props => {
  return <div className='backdrop' onClick={props.onCancel}></div>;
};

const Modal = props => {
  const content = (
    <>
      <Backdrop onCancel={props.onCancel}></Backdrop>
      <div className='modal'>
        <header
          className={`modal__header ${
            props.error ? 'modal__header--error' : ''
          }`}
        >
          <h1>{props.title}</h1>
        </header>
        <section className='modal__content'>{props.children}</section>
        <section className='modal__actions'>
          {props.canCancel && (
            <button className='btn' onClick={props.onCancel}>
              Cancel
            </button>
          )}
          {props.canConfirm && (
            <button
              className='btn'
              onClick={props.onConfirm}
              disabled={props.disabled}
            >
              {props.confirmText}
            </button>
          )}
        </section>
      </div>
    </>
  );
  return ReactDOM.createPortal(
    content,
    document.querySelector('#modal-overlay')
  );
};

export default Modal;
