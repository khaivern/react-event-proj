import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import Input from '../../shared/components/Input/Input';
import Modal from '../../shared/components/Modal/Modal';
import Card from '../../shared/components/Card/Card';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';
import {
  VALIDATOR_MIN,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/input-validators';

const EventForm = props => {
  const token = useSelector(state => state.token);
  const { isLoading, error, sendRequest, resetError } = useHttpClient();
  const { formState, inputHandler } = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      price: {
        value: null,
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      date: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const modalConfirmHandler = async () => {
    const graphqlQuery = {
      query: `
        mutation {
            createEvent(eventInput: {
                title: "${formState.inputs.title.value}", 
                price: ${+formState.inputs.price.value}, 
                description: "${formState.inputs.description.value}",
                date: "${formState.inputs.date.value}"
            }) {
                _id
                title
                description
                price
                date
            }
        }
      `,
    };

    try {
      const data = await sendRequest(
        'http://localhost:5000/graphql',
        'POST',
        JSON.stringify(graphqlQuery),
        { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      );

      props.onDataUpdate(data.data.createEvent);
      props.onCancel();
    } catch (error) {
      throw error;
    }
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
          title='Form Error'
          canConfirm
          onConfirm={resetError}
          error={error}
          confirmText='Confirm'
        >
          <p>Creating an event failed!</p>
          <p>Cause: {error}</p>
        </Modal>
      )}
      <Modal
        title='Add Event'
        canCancel
        canConfirm
        onCancel={props.onCancel}
        onConfirm={modalConfirmHandler}
        disabled={!formState.overall}
        confirmText='Confirm'
      >
        <form>
          <Input
            element='input'
            type='text'
            id='title'
            label='Title'
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title'
          />
          <Input
            element='input'
            type='number'
            id='price'
            label='Price'
            onInput={inputHandler}
            validators={[VALIDATOR_MIN(1)]}
            errorText='Please enter a valid price'
          />
          <Input
            element='textarea'
            id='description'
            label='Description'
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid description'
            rows={4}
          />
          <Input
            element='input'
            type='datetime-local'
            id='date'
            label='Date'
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid date'
          />
        </form>
      </Modal>
    </>
  );
};

export default EventForm;
