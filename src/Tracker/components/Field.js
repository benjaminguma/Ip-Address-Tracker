import React, { useReducer, useEffect } from "react";
import validateOneOf from "../utils/validtors";

const reducer = (state, action) => {
  const { type, validators, value, err, isValid, typeOfField } = action;
  switch (type) {
    case "UPDATE": {
      return {
        ...state,
        value: value,
        isValid,
        err,
        type: typeOfField,
        isTouched: value === "" && false,
      };
    }
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

    dispatch({
      type: "UPDATE",
      value,
      validators,
      err: error,
      isValid,
      typeOfField,
    });
    updateParentForm({ value, name, isValid, typeOfField });
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
  }, [value, isValid]);

  return (
    <React.Fragment>
      <div className="form__group" style={{ position: "relative" }}>
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
      </div>
      {state.isTouched && !state.isValid ? (
        <p
          style={{
            justifySelf: "center",
            marginTop: "-.8rem",
            fontSize: "1.3rem",
            color: "#f00",
            backgroundColor: "#fff",
            padding: ".4rem .8rem",
            borderRadius: "5px",
            border: window.innerWidth < 600 ? "1px solid #f2f2f2" : "",
            marginBottom: "1rem",
          }}
        >
          {state.err}
        </p>
      ) : null}
    </React.Fragment>
  );
};

export default Field;
