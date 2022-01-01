import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHttpClient } from '../../hooks/http-hook';
import Card from '../../shared/components/Card/Card';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';
import BookingList from '../components/BookingList';

const Bookings = props => {
  const token = useSelector(state => state.token);
  const [loadedBookings, setLoadedBookings] = useState();
  const { isLoading, sendRequest } = useHttpClient();
  useEffect(() => {
    const fetchBookings = async () => {
      const graphqlQuery = {
        query: `
          {
            bookings {
              _id
              event {
                title
              }
              createdAt
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
          Authorization: 'Bearer ' + token,
        }
      );
      setLoadedBookings(data.data.bookings);
    };
    fetchBookings();
  }, [sendRequest, token]);

  const deleteBookingHandler = async id => {
    const graphqlQuery = {
      query: `
        mutation {
          cancelBooking(bookingId: "${id}") {
            _id
            title
          }
        }
      `,
    };
    await sendRequest(
      'http://localhost:5000/graphql',
      'POST',
      JSON.stringify(graphqlQuery),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    );
    setLoadedBookings(prevState => {
      const updatedBookings = prevState.filter(book => book._id !== id);
      return updatedBookings;
    });
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

  return <BookingList items={loadedBookings} onDelete={deleteBookingHandler} />;
};

export default Bookings;
