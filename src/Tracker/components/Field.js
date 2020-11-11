import React, { useReducer, useEffect } from "react";
import validateOneOf from "../utils/validtors";

const reducer = (state, action) => {
  const { type, validators, value, err, isValid, typeOfField } = action;
  switch (type) {
    case "UPDATE":
      return {
        ...state,
        value: value,
        isValid,
        err,
        type: typeOfField,
        isTouched: value === "" && false,
      };

    case "TOUCHED":
      return {
        ...state,
        isTouched: true,
      };

    default:
      return state;
  }
};
const init = {
  value: "",
  isValid: false,
  isTouched: false,
};
const Field = ({
  type,
  placeholder,
  label,
  disabled,
  name,
  value,
  validators,
  error,
  updateParentForm,
  isValid,
  children,
  typeOfField,
  isSubmitting,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...init,
    value: value ? value : "",
  });
  const handleTouched = (e) => {
    dispatch({ type: "TOUCHED", value: e.target.value });
  };
  const handleUpdate = (e) => {
    const { value } = e.target;
    const { isValid, typeOfField } = validateOneOf(validators, value);
    updateParentForm({ value, name, isValid, typeOfField });
    dispatch({
      type: "UPDATE",
      value,
      validators,
      err: error,
      isValid,
      typeOfField,
    });
  };
  useEffect(() => {
    dispatch({
      type: "UPDATE",
      value,
      validators,
      err: error,
      isValid,
      typeOfField,
    });
  }, [value]);

  return (
    <div className="form__group">
      <input
        style={{
          color: state.isTouched && !state.isValid && "#f00",
          backgroundColor: isSubmitting && "#f2f2f2",
        }}
        className="form__input"
        type={type}
        placeholder={placeholder}
        label={label}
        disabled={disabled}
        value={state.value}
        onBlur={handleTouched}
        onChange={handleUpdate}
        name={name}
        disabled={isSubmitting}
      />
      {children}
      {/* {state.isTouched && !state.isValid && <p>{error}</p>} */}
    </div>
  );
};

export default Field;
