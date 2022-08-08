import React from "react";
import { withFormik, Form } from "formik";
import { Card, Container, Col, Row } from "react-bootstrap";
import * as wizardPropTypes from "./eventWizardPropTypes";

const EventPreview = (props) => {
  const {
    //Formik HOC props
    values,
    handleSubmit,
    //Loki props
    onBack,
    backLabel,
    nextLabel,
    onNext,
  } = props;

  const onNextClicked = () => {
    onNext(values);
  };

  return (
    <Card className=" p-4 mx-auto border-lg shadow-md" style={{ width: 950 }}>
      <div className="row">
        <Form className="col" onSubmit={handleSubmit}>
          <div className="pt-2 pt-sm-5 pb-4 pb-sm-5">
            <Container>
              <Row className="justify-content-center">
                <Col md={8} lg={6} xl={5} xxl={4}>
                  <Card
                    className="p-2 m-2 justify-content-center border shadow-md"
                    style={{ width: "32rem" }}
                  >
                    <Card.Header>
                      <h3 className="text-center">Add a New Event</h3>
                    </Card.Header>
                    <Card.Title className="text-center">
                      {props.state.name}
                    </Card.Title>
                    <Card.Img
                      variant="top"
                      src={props.state.imageUrl}
                    ></Card.Img>
                    <Card.Text className="text-center">
                      {props.state.summary}
                    </Card.Text>
                    <Card.Link
                      className="text-center"
                      href={props.state.externalSiteUrl}
                    >
                      {props.state.externalSiteUrl}
                    </Card.Link>
                    <Card.Body className="p-4 text-center">
                      {props.state.shortDescription}
                    </Card.Body>
                    <Card.Text className="text-center">
                      Start Date:{props.state.dateStart}, End Date:{" "}
                      {props.state.dateEnd}
                    </Card.Text>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="button-group justify-content-center pt-3 row">
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
        </Form>
      </div>
    </Card>
  );
};

EventPreview.propTypes = wizardPropTypes.eventWizardPropTypes;

export default withFormik({
  mapPropsToValues: (props) => ({
    name: props.state.name,
    summary: props.state.summary,
    shortDescription: props.state.shortDescription,
    imageUrl: props.state.imageUrl,
    isFree: props.state.isFree,
  }),

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(EventPreview);
