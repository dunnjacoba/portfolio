import React, { useEffect } from "react";
import logger from "debug";
import { Card } from "react-bootstrap";
import eventWizardSchema from "../../schema/eventswizard/eventWizardDateSchema";
import * as wizardPropTypes from "./eventWizardPropTypes";
import { Form, Field, ErrorMessage, withFormik } from "formik";

const _logger = logger.extend("ComponentFour");

const ComponentFour = (props) => {
  const {
    //Formik HOC props
    values,
    //Loki props
    onBack,
    backLabel,
    nextLabel,
    onNext,
  } = props;

  _logger(props);

  useEffect(() => {
    onChange();
  }, [values]);

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
      <Form>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="dateStart">Event Start Date</label>
            <Field type="date" name="dateStart" className="form-control" />
            <ErrorMessage
              name="dateStart"
              component="div"
              className="has-error"
            />{" "}
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="dateEnd">Event End Date</label>
            <Field type="date" name="dateEnd" className="form-control" />
            <ErrorMessage
              name="dateEnd"
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
                type="button"
                className="btn btn-primary"
                onClick={onNextClicked}
              >
                {nextLabel}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};

ComponentFour.propTypes = wizardPropTypes.eventWizardPropTypes;

export default withFormik({
  mapPropsToValues: (props) => ({
    dateStart: props.state.dateStart,
    dateEnd: props.state.dateEnd,
  }),

  validationSchema: eventWizardSchema,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(ComponentFour);
