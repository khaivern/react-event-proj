import React, { useEffect, useReducer } from 'react';

import { validate } from '../../utils/input-validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'BLUR':
      return {
        ...state,
        isTouched: true,
      };
    default: {
      return state;
    }
  }
};

const Input = props => {
  const [inputState, dispatchInputAction] = useReducer(inputReducer, {
    value: '',
    isValid: false,
    isTouched: false,
  });

  const { value, isValid } = inputState;
  const { onInput, id } = props;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [value, isValid, id, onInput]);

  const inputChangeHandler = event => {
    dispatchInputAction({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const inputBlurHandler = () => {
    dispatchInputAction({ type: 'BLUR' });
  };

  const content =
    props.element === 'input' ? (
      <input
        id={id}
        type={props.type}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        value={value}
      />
    ) : (
      <textarea
        id={id}
        rows={props.rows || 3}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        value={value}
      />
    );

  const hasError = inputState.isTouched && !inputState.isValid;

  return (
    <div className={`form-control ${hasError ? 'form-control--invalid' : ''}`}>
      <label>{props.label}</label>
      {content}
      {hasError && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
