import React, { useState } from 'react';

import Modal from '../../shared/components/Modal/Modal';

import './Events.css';
const Events = () => {
  const [createEvent, setCreateEvent] = useState(false);
  const createEventHandler = () => {
    setCreateEvent(true);
  };

  const modalCancelHandler = () => {
    setCreateEvent(false);
  };

  const modalConfirmHandler = () => {};

  return (
    <>
      {createEvent && (
        <Modal
          title='Add Event'
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <p>Modal Content</p>
        </Modal>
      )}
      <div className='events-control'>
        <p>Share an Event</p>
        <button className='btn' onClick={createEventHandler}>
          Create Event
        </button>
      </div>
    </>
  );
};

export default Events;
