import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHttpClient } from '../../hooks/http-hook';
import Card from '../../shared/components/Card/Card';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';
import Modal from '../../shared/components/Modal/Modal';

import EventForm from '../components/EventForm';
import EventsList from '../components/EventsList';

import './Events.css';
const Events = () => {
  const token = useSelector(state => state.token);
  const userId = useSelector(state => state.userId);
  const [loadedEvents, setLoadedEvents] = useState();
  const { isLoading, error, sendRequest, resetError } = useHttpClient();

  useEffect(() => {
    const fetchEvents = async () => {
      const graphqlQuery = {
        query: `
        {
          events{
            _id
            title
            description
            price
            date
            creator{
              _id
            }
          }
        }
        `,
      };
      const data = await sendRequest(
        'http://localhost:5000/graphql',
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
        }
      );
      const events = data.data.events;

      setLoadedEvents(events);
    };
    fetchEvents();
  }, [sendRequest]);
  const [createEvent, setCreateEvent] = useState(false);
  const createEventHandler = () => {
    setCreateEvent(true);
  };

  const modalCancelHandler = () => {
    setCreateEvent(false);
  };

  const updateDataHandler = event => {
    setLoadedEvents(state => {
      const updatedEvents = [...state];
      updatedEvents.push({
        _id: event._id,
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date,
        creator: {
          _id: userId,
        },
      });
      return updatedEvents;
    });
  };

  if (isLoading) {
    <div className='center'>
      <Card>
        <LoadingSpinner />
      </Card>
    </div>;
  }

  return (
    <>
      {error && (
        <Modal
          canConfirm
          title='Failed to fetch events'
          onConfirm={resetError}
          onCancel={resetError}
          error={error}
          confirmText='Confirm'
        >
          <p>{error}</p>
        </Modal>
      )}
      {createEvent && (
        <EventForm
          onDataUpdate={updateDataHandler}
          onCancel={modalCancelHandler}
        />
      )}
      {token && (
        <div className='events-control'>
          <p>Post an Event</p>
          <button className='btn' onClick={createEventHandler}>
            Create Event
          </button>
        </div>
      )}
      <div className='events-content'>
        {!isLoading && loadedEvents && <EventsList items={loadedEvents} />}
      </div>
    </>
  );
};

export default Events;
