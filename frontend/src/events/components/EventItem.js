import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../../shared/components/Card/Card';

import './EventItem.css';

const EventItem = props => {
  const userId = useSelector(state => state.userId);
  const admin = userId === props.userId;
  return (
    <li className='event-item'>
      <Card className='event-item__main-content'>
        <div className='event-item__info'>
          <h2>{props.title}</h2>
          <hr />
          <h3>
            ${props.price} ({new Date(props.date).toLocaleDateString()})
          </h3>
        </div>
        <div className='event-item__action'>
          {admin && <p>User is event admin</p>}
          {!admin && (
            <button onClick={props.onDetail.bind(this, props.id)}>
              View Details
            </button>
          )}
        </div>
      </Card>
    </li>
  );
};

export default EventItem;
