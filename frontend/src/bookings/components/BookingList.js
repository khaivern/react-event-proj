import React from 'react';
import Card from '../../shared/components/Card/Card';

import './BookingList.css';
const BookingList = props => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <p>No bookings have been made!</p>
        </Card>
      </div>
    );
  }

  return (
    <ul className='bookings__list'>
      {props.items &&
        props.items.map(book => {
          return (
            <li key={book._id} className='bookings__item'>
              <div className='bookings__item-data'>
                {book.event.title} -{' '}
                {new Date(book.createdAt).toLocaleDateString()}
              </div>
              <div className='bookings_item-actions'>
                <button onClick={props.onDelete.bind(this, book._id)}>
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default BookingList;
