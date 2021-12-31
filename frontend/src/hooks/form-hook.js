import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsTrue = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.id) {
          formIsTrue = formIsTrue && action.isValid;
        } else {
          formIsTrue = formIsTrue && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        overall: formIsTrue,
      };
    case 'SET_DATA': {
      return {
        inputs: action.inputs,
        overall: action.overall,
      };
    }
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialOverallValidity) => {
  const initialFormState = {
    inputs: initialInputs,
    overall: initialOverallValidity,
  };
  const [formState, dispatchFormAction] = useReducer(
    formReducer,
    initialFormState
  );

  const inputHandler = useCallback((id, value, isValid) => {
    dispatchFormAction({ type: 'INPUT_CHANGE', value, id, isValid });
  }, []);

  const setFormData = useCallback((inputsData, overallValidData) => {
    dispatchFormAction({
      type: 'SET_DATA',
      inputs: inputsData,
      overall: overallValidData,
    });
  }, []);

  return { formState, inputHandler, setFormData };
};
