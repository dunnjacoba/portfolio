import React, { useEffect } from "react";
import { Form, Field, ErrorMessage, withFormik } from "formik";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import eventWizardSchema from "../../schema/eventswizard/eventWizardCOSchema";
import * as wizardPropTypes from "./eventWizardPropTypes";
import debug from "debug";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const _logger = debug.extend("ComponentOne");

const ComponentOne = (props) => {
  const {
    //Formik HOC props
    values,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    //Loki props
    nextLabel,
    onNext,
  } = props;
  _logger(props, "props");

  useEffect(() => {
    onChange();
  }, [values]);

  const onChange = () => {
    props.onChange(values);
  };

  const onEditorChange = (event, editor) => {
    setFieldValue("shortDescription", editor.getData());
  };

  const onNextClicked = () => {
    onNext(values);
  };

  return (
    <Card className=" p-4 mx-auto border shadow-sm" style={{ width: 950 }}>
      <Card.Header>
        <h3 className="text-center">Add a New Event</h3>
      </Card.Header>

      <Form onSubmit={handleSubmit}>
        <div className="row mt-2">
          <div className="form-group  col-md-6">
            <label htmlFor="name">Event Name</label>
            <Field
              type="text"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              className="form-control"
            />
            <ErrorMessage name="name" component="div" className="has-error" />{" "}
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="summary">Event Summary</label>
            <Field
              type="text"
              value={values.summary}
              onChange={handleChange}
              onBlur={handleBlur}
              name="summary"
              className="form-control"
            />
            <ErrorMessage
              name="summary"
              component="div"
              className="has-error"
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="shortDescription">Event Short Description</label>
            <CKEditor
              editor={ClassicEditor}
              value={values.shortDescription}
              onChange={onEditorChange}
              name="shortDescription"
            />
            <ErrorMessage
              name="shortDescription"
              component="div"
              className="has-error"
            />
          </div>
          <div className="form-group mb-2 col-md-6">
            <label htmlFor="imageUrl">Event Image Url</label>
            <Field
              type="text"
              value={values.imageUrl}
              onChange={handleChange}
              onBlur={handleBlur}
              name="imageUrl"
              className="form-control"
            />
            <ErrorMessage
              name="imageUrl"
              component="div"
              className="has-error"
            />
          </div>
          <div className="form-check">
            <label htmlFor="form-check">Is this a free event?</label>
            <Field
              type="checkbox"
              value={values.isFree}
              onChange={handleChange}
              onBlur={handleBlur}
              name="isFree"
              className="form-check-input"
            />
            <ErrorMessage name="isFree" component="div" className="has-error" />
          </div>
          <div className="button-group pt-3 row">
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-primary ml-2"
                disabled={
                  !values.name ||
                  Boolean(errors.name) ||
                  !values.summary ||
                  Boolean(errors.summary) ||
                  !values.shortDescription ||
                  Boolean(errors.shortDescription) ||
                  !values.isFree ||
                  Boolean(errors.isFree)
                }
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

ComponentOne.propTypes = wizardPropTypes.eventWizardPropTypes;

export default withFormik({
  mapPropsToValues: (props) => ({
    name: props.state.name,
    summary: props.state.summary,
    shortDescription: props.state.shortDescription,
    imageUrl: props.state.imageUrl,
    isFree: props.state.isFree,
  }),

  validationSchema: eventWizardSchema,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(ComponentOne);
