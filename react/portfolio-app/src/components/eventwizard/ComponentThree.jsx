import React, { useEffect, useState } from "react";
import logger from "debug";
import { Card } from "react-bootstrap";
import { lookUpVenues } from "../../services/eventWizardService";
import eventWizardSchema from "../../schema/eventswizard/eventWizardCFSchema";
import * as wizardPropTypes from "./eventWizardPropTypes";
import { Formik, Form, Field, ErrorMessage, withFormik } from "formik";

const _logger = logger.extend("ComponentThree");

const ComponentThree = (props) => {
  const [eventState, setState] = useState({ venues: [] });

  const {
    //Formik HOC props
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    //Loki props
    onBack,
    backLabel,
    nextLabel,
    onNext,
  } = props;
  _logger(props, "ComponentFour");

  useEffect(() => {
    onChange();
  }, [values]);

  useEffect(() => {
    lookUpVenues().then(onLookUpVenuesSuccess).catch(onLookUpVenuesError);
  }, []);

  const mapEventData = (data) => {
    return (
      <option value={data.id} key={`eventVenue_${data.id}`}>
        {data.name}
      </option>
    );
  };

  const onLookUpVenuesSuccess = (response) => {
    _logger("onLookUpVenuesSuccess", response);
    setState((prevState) => {
      const et = { ...prevState };
      et.venues = response.item.pagedItems;
      return et;
    });
  };

  const onLookUpVenuesError = (error) => {
    _logger("onLookUpVenuesError", error);
  };

  const onChange = () => {
    props.onChange(values);
  };

  const onNextClicked = () => {
    onNext(values);
  };

  return (
    <Card className=" p-4 mx-auto border-lg shadow-md" style={{ width: 950 }}>
      <Card.Header>
        <h3 className="text-center">Add a New Event</h3>
      </Card.Header>
      <Formik initialValues={props}>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="select col-md-6 mb-2">
              <label htmlFor="select">Select Venue</label>
              <Field
                component="select"
                value={values.venueId}
                onChange={handleChange}
                onBlur={handleBlur}
                name="venueId"
                className="form-control"
              >
                {eventState.venues.map(mapEventData)}
              </Field>
              <ErrorMessage
                name="venueId"
                component="div"
                className="has-error"
              />
            </div>

            <div className="button-group pt-3 row">
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onBack}
                >
                  {backLabel}
                </button>
              </div>
              <div className="col-sm-1">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!values.venueId || Boolean(errors.venueId)}
                  onClick={onNextClicked}
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </Card>
  );
};

ComponentThree.propTypes = wizardPropTypes.eventWizardPropTypes;

export default withFormik({
  mapPropsToValues: (props) => ({
    venueId: props.state.venueId,
  }),

  validationSchema: eventWizardSchema,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(ComponentThree);
