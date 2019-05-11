import React from 'react';

const FIELD_VALIDATE = Symbol('validate');
const FORM_SUBMITTING = Symbol('submitting');

const Action = {
  ERROR: 'error',
  VALUE: 'value',
  VALIDATE: 'validate',
};

function reducer(state, action) {
  switch (action.type) {
    case Action.ERROR: {
      const fieldState = getFieldState(state, action);

      return {
        ...state,
        [action.payload.field]: { ...fieldState, error: action.payload.error },
      };
    }

    case Action.VALUE: {
      const fieldState = getFieldState(state, action);
      const { value } = action.payload;
      const validate = fieldState[FIELD_VALIDATE];
      const error = validate ? !validate(value) : null;

      return {
        ...state,
        [action.payload.field]: {
          ...fieldState,
          value: value,
          error,
        },
      };
    }

    case Action.VALIDATE: {
      return action.payload.validatedState;
    }
    default:
      return state;
  }
}

function init(rules) {
  const keys = Object.keys(rules);
  const state = {
    [FORM_SUBMITTING]: false,
  };

  keys.forEach(field => {
    const rule = rules[field];
    const info = {};
    info.value = rule.default;
    info.error = null;
    info[FIELD_VALIDATE] = rule.validate;

    state[field] = info;
  });

  return state;
}

function getFieldState(state, action) {
  const fieldState = state[action.payload.field];
  return fieldState;
}

function validate(state) {
  const fields = Object.keys(state);

  return fields.reduce((acc, field) => {
    const fieldState = state[field];
    const validate = fieldState[FIELD_VALIDATE];
    const error = validate ? !validate(fieldState.value) : null;
    acc[field] = {
      ...fieldState,
      error,
    };
    return acc;
  }, {});
}

export default function useForm(rules = {}) {
  const [state, dispatch] = React.useReducer(reducer, rules, init);
  const getFieldProps = React.useCallback(
    field => {
      const { value, error } = state[field];
      return {
        value,
        error,
        onChange(value) {
          dispatch({ type: Action.VALUE, payload: { field, value } });
        },
      };
    },
    [state, dispatch],
  );
  // const handleSubmit = React.useCallback(
  //   e => {
  //     if (e && e.preventDefault) {
  //       return e.preventDefault();
  //     }

  //     const fields = Object.keys(state);
  //     const errors = fields.reduce(() => {});
  //   },
  //   [state],
  // );
  const internalState = state;
  const getErrors = (state = internalState) => {
    const fields = Object.keys(state);
    const errors = fields.reduce((acc, field) => {
      const { error } = state[field];
      if (error) {
        acc[field] = error;
      }
      return acc;
    }, {});

    return Object.keys(errors).length === 0 ? null : errors;
  };
  const isSubmitting = React.useCallback(() => {
    return state[FORM_SUBMITTING];
  }, [state]);
  const validateState = () => {
    const validatedState = validate(state);
    dispatch({ type: Action.VALIDATE, payload: { validatedState } });
    return getErrors(validatedState);
  };
  return [state, { getFieldProps, getErrors, validate: validateState }];
}
