import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import Card from '../../shared/components/Card/Card';
import Input from '../../shared/components/Input/Input';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/utils/input-validators.js';
import { authActions } from '../../store/auth';

import './Auth.css';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoginMode, setisLoginMode] = useState(true);
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
    let graphQlQuery;
    if (!isLoginMode) {
      graphQlQuery = {
        query: `
          mutation{
            createUser(userInput:{email:"${formState.inputs.email.value}", password:"${formState.inputs.password.value}"}) {
              _id
              email
            }   
          }
        `,
      };
    } else {
      graphQlQuery = {
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
    }
    try {
      const data = await sendRequest(
        'http://localhost:5000/graphql',
        'POST',
        JSON.stringify(graphQlQuery),
        {
          'Content-Type': 'application/json',
        }
      );
      if (isLoginMode) {
        const login = data.data.login;
        if (!login) {
          throw new Error('Failed to Authenticate');
        }

        dispatch(
          authActions.login({
            userId: login.userId,
            token: login.token,
            expiration: login.tokenExpiration,
          })
        );
        navigate('/events', { replace: true });
      } else {
        if (data.errors) {
          console.log(data.errors[0].message);
          throw new Error('Failed to authenticate');
        }
        setisLoginMode(true);
      }
    } catch (err) {}
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
        <h1>{isLoginMode ? 'LOGIN' : 'SIGNUP'} </h1>
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
