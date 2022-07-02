import React, { useEffect, useState } from "react";
import logger from "debug";
import { lookUps } from "../../services/eventWizardService";
import { Card } from "react-bootstrap";
import eventWizardValidation from "../../schema/eventswizard/eventWizardCTwSchema";
import * as wizardPropTypes from "./eventWizardPropTypes";
import { Formik, Form, Field, ErrorMessage, withFormik } from "formik";

const _logger = logger.extend("ComponentTwo");

const ComponentTwo = (props) => {
  const [eventState, setState] = useState({ types: [], status: [] });
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
  _logger(props, "Event props");

  const mapEventData = (data) => {
    return (
      <option value={data.id} key={`eventType_${data.id}`}>
        {data.name}
      </option>
    );
  };

  useEffect(() => {
    onChange();
  }, [values]);

  useEffect(() => {
    lookupEventTypes();
    lookupEventStatus();
  }, []);

  const onChange = () => {
    props.onChange(values);
  };

  const lookupEventTypes = () => {
    lookUps(["EventTypes"])
      .then(onLookupEventTypesSuccess)
      .catch(onLookupEventTypesError);
  };

  const onLookupEventTypesSuccess = (response) => {
    _logger("EventType", response);

    setState((prevState) => {
      const et = { ...prevState };
      et.types = response.item.eventTypes;
      return et;
    });
  };

  const onLookupEventTypesError = (error) => {
    _logger(error);
  };

  const lookupEventStatus = () => {
    lookUps(["EventStatus"])
      .then(onLookupEventStatusSuccess)
      .catch(onLookupEventStatusError);
  };

  const onLookupEventStatusSuccess = (response) => {
    _logger("EventStatus", response);
    setState((prevState) => {
      const et = { ...prevState };
      et.status = response.item.eventStatus;
      return et;
    });
  };

  const onLookupEventStatusError = (error) => {
    _logger(error);
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
            <div className="select col-md-6">
              <label htmlFor="select">Event Type</label>
              <Field
                component="select"
                value={values.eventTypeId}
                onChange={handleChange}
                onBlur={handleBlur}
                name="eventTypeId"
                className="form-control"
              >
                {eventState.types.map(mapEventData)}
              </Field>
              <ErrorMessage
                name="eventTypeId"
                component="div"
                className="has-error"
              />
            </div>
            <div className="select col-md-6">
              <label htmlFor="select">Event Status</label>
              <Field
                component="select"
                value={values.eventStatusId}
                onChange={handleChange}
                onBlur={handleBlur}
                name="eventStatusId"
                className="form-control"
              >
                {eventState.status.map(mapEventData)}
              </Field>
              <ErrorMessage
                name="eventStatusId"
                component="div"
                className="has-error"
              />
            </div>
            <div className="form-group col-md-6 mb-2">
              <label htmlFor="externalSiteUrl">Event Site Url</label>
              <Field
                type="url"
                value={values.externalSiteUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                name="externalSiteUrl"
                className="form-control"
              />
              <ErrorMessage
                name="externalSiteUrl"
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
                  disabled={
                    !values.eventTypeId ||
                    Boolean(errors.eventTypeId) ||
                    !values.externalSiteUrl ||
                    Boolean(errors.externalSiteUrl)
                  }
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

ComponentTwo.propTypes = wizardPropTypes.eventWizardPropTypes;

export default withFormik({
  mapPropsToValues: (props) => ({
    eventTypeId: props.state.eventTypeId,
    externalSiteUrl: props.state.externalSiteUrl,
  }),

  validationSchema: eventWizardValidation,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(ComponentTwo);
