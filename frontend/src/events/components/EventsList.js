import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHttpClient } from '../../hooks/http-hook';
import Card from '../../shared/components/Card/Card';
import Modal from '../../shared/components/Modal/Modal';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

import EventItem from './EventItem';
import './EventList.css';

const EventsList = props => {
  const token = useSelector(state => state.token);
  const { isLoading, sendRequest } = useHttpClient();
  const [selectedEvent, setSelectedEvent] = useState();
  if (props.items.length === 0) {
    return (
      <div className='center events-list'>
        <Card className='events-list__background'>
          <h1>No Events have been created yet.</h1>
        </Card>
      </div>
    );
  }

  const showDetailHandler = id => {
    setSelectedEvent(state => {
      const event = props.items.find(event => event._id === id);
      return { ...event };
    });
  };

  const cancelModalDetailHandler = () => {
    setSelectedEvent();
  };

  const bookingHandler = async () => {
    if (!token) {
      setSelectedEvent();
      return;
    }
    const graphqlQuery = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            event{
              title
            }
            user{
              email
            }
          }
        }
      `,
    };

    try {
      const data = await sendRequest(
        'http://localhost:5000/graphql',
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
    cancelModalDetailHandler();
  };

  if (isLoading) {
    return (
      <div className='center'>
        <Card>
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  return (
    <>
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canConfirm
          canCancel
          confirmText={token ? 'Book Event' : 'Confirm'}
          onConfirm={bookingHandler}
          onCancel={cancelModalDetailHandler}
        >
          <div className='event-modal__details'>
            <h2>{selectedEvent.description}</h2>
            <hr />
            <div className='event-modal__admission'>
              <div className='detail--header'>
                <p>Price :</p>
                <p>Date : </p>
              </div>
              <div className='detail--values'>
                <p>${selectedEvent.price}</p>
                <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <ul className='events-list events-list__background'>
        <h1>Events Available</h1>

        {props.items.map(event => (
          <EventItem
            key={event._id}
            id={event._id}
            title={event.title}
            description={event.description}
            price={event.price}
            date={event.date}
            userId={event.creator._id}
            onDetail={showDetailHandler}
          />
        ))}
      </ul>
    </>
  );
};

export default EventsList;
