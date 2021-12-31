import React, { useState } from 'react';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import Card from '../../shared/components/Card/Card';
import Input from '../../shared/components/Input/Input';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/utils/input-validators.js';

import './Auth.css';

const Auth = () => {
  const [isLoginMode, setisLoginMode] = useState(false);
  const { isLoading, error, sendRequest, resetError } = useHttpClient();
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async event => {
    event.preventDefault();
    resetError();
    if (!isLoginMode) {
      const graphqlQuery = {
        query: `
                mutation{
                    createUser(userInput:{email:"${formState.inputs.email.value}", password:"${formState.inputs.password.value}"}) {
                        _id
                        email
                        password
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
          }
        );

        console.log(data);
      } catch (error) {}
    } else {
      try {
        const graphQlQuery = {
          query: `
            {
              login(email: "${formState.inputs.email.value}", password: "${formState.inputs.password.value}"){
                userId
                token
                tokenExpiration
              }
            }
          `,
        };
        const data = await sendRequest(
          'http://localhost:5000/graphql',
          'POST',
          JSON.stringify(graphQlQuery),
          {
            'Content-Type': 'application/json',
          }
        );
        console.log(data);
      } catch (error) {}
    }
  };

  const switchModeHandler = () => {
    setisLoginMode(prevState => !prevState);
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

  const errorModal = (
    <div className='center' onClick={resetError}>
      <Card>
        <p style={{ color: 'red' }}>The operation failed!</p>
      </Card>
    </div>
  );

  return (
    <>
      {error && errorModal}
      <form className='auth-form' onSubmit={submitHandler}>
        <Input
          element='input'
          type='email'
          id='email'
          label='E-mail'
          onInput={inputHandler}
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter a valid email!'
        />
        <Input
          element='input'
          type='password'
          id='password'
          label='Password'
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(4)]}
          errorText='Please enter a valid email!'
        />
        <div className='form-actions'>
          <button type='button' onClick={switchModeHandler}>
            Switch to {isLoginMode ? 'Signup' : 'Login'}
          </button>
          <button disabled={!formState.overall} type='submit'>
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Auth;
