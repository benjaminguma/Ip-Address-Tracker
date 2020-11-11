import React, { useReducer, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import Client from "./utils/client";
import Map from "./components/Mapp";
import Field from "./components/Field";
import Header from "./components/Header";
import ResultItem from "./components/ResultItem";
import validate, { validateDomain, validateIp } from "./utils/validtors";
import "./css/main.css";
import arrow from "./images/icon-arrow.svg";
const locationX = {
  ipaddress: {
    detail: "",
  },
  location: {
    detail: "",
  },
  timezone: {
    detail: "",
  },
  isp: {
    detail: "",
  },
};
const init = {
  fields: {
    query: {
      value: "",
      isValid: false,
      typeOfValue: "none",
    },
  },
  formISValid: false,
};
const generateLocationData = ({
  ip,
  isp,
  location: { country, region, timezone },
}) => ({
  ipaddress: {
    detail: ip,
  },
  location: {
    detail: country + " - " + region,
  },
  timezone: {
    detail: "UTC " + timezone,
  },
  isp: {
    detail: isp,
  },
});

const App = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, dispatch] = useReducer(Appreducer, init);
  const [locationData, setLocationData] = useState(locationX);
  const handleFormUpdate = ({ value, name, isValid, typeOfField }) =>
    dispatch({ type: "UPDATE_FIELD", value, name, isValid, typeOfField });

  const [coordinates, setCoordinates] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      fields: {
        query: { typeOfField, value },
      },
      formISValid,
    } = state;
    if (!formISValid) return;

    const previousData = locationData; // previous location data
    setIsSubmitting(true);
    setLocationData(locationX);
    let userInfo;
    try {
      userInfo = await Client.getGeoInfo({
        type: typeOfField,
        value,
      });
    } catch (error) {
      setLocationData(previousData);
      return;
    }
    const { lat, lng } = userInfo.location;
    setLocationData(generateLocationData(userInfo));
    setCoordinates({ lat, lng });
    dispatch({ type: "RESET" });
    setIsSubmitting(false);
  };
  useEffect(() => {
    (async function () {
      try {
        const { ip } = await Client.getUserIp();
        const userInfo = await Client.getGeoInfo({
          type: "ipAddress",
          value: ip,
        });
        const { lat, lng } = userInfo.location;

        setLocationData(generateLocationData(userInfo));
        setCoordinates({ lat, lng });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const data = Object.keys(locationData);
  const UI = (
    <>
      <Header>
        <form
          className="header__form"
          action=""
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <h1 className="head__pri light cap">IP address Tracker</h1>
          <div className="form__group">
            <Field
              className="form-input"
              type="text"
              name="query"
              placeholder="search for an ip address or domain"
              value={state.fields.query.value}
              isValid={state.fields.query.isValid}
              typeOfField={state.fields.query.type}
              validators={[validateIp(), validateDomain()]}
              error="please input a valid ip address or domain"
              updateParentForm={handleFormUpdate}
              isSubmitting={isSubmitting}
            >
              <button
                className={`form__submit ${isSubmitting ? " disabled" : null}`}
                type="submit"
                disabled={isSubmitting && true}
              >
                <svg>
                  <use xlinkHref={arrow + "#arrow"}></use>
                </svg>
              </button>
            </Field>
          </div>
        </form>
        <ul className="result">
          {data.map((key, index) => (
            <ResultItem key={index} title={key} {...locationData[key]} />
          ))}
        </ul>
      </Header>

      <Map {...coordinates} ip={locationData.ipaddress.detail} />
    </>
  );

  return createPortal(UI, document.getElementById("grid"));
};

function Appreducer(state, action) {
  const { type, value, name, isValid, typeOfField } = action;
  switch (type) {
    case "UPDATE_FIELD": {
      const fields = {
        ...state.fields,
        [name]: {
          value,
          isValid,
          typeOfField,
        },
      };
      const newState = {
        fields,
        formISValid: validForm(fields),
      };
      return newState;
    }
    case "RESET":
      return init;

    default:
      return state;
  }
}

function validForm(formObject) {
  let formIsValid = true;
  for (let nameField in formObject) {
    formIsValid = formIsValid && formObject[nameField].isValid;
  }
  return formIsValid;
}
export default App;
