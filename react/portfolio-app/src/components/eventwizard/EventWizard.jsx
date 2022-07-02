import React, { useState } from "react";
import debug from "debug";
import Loki from "react-loki";
import { useNavigate } from "react-router-dom";
import "./eventwizard.css";
import ComponentOne from "./ComponentOne";
import ComponentTwo from "./ComponentTwo";
import ComponentThree from "./ComponentThree";
import ComponentFour from "./ComponentFour";
import { FaHome, FaLocationArrow, FaImages } from "react-icons/fa";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { MdOutlinePreview } from "react-icons/md";
import { addEvent } from "../../services/eventWizardService";
import EventPreview from "./EventPreview.";

const _logger = debug.extend("EventWizard");

function EventWizard() {
  const [state, setState] = useState({
    name: "",
    eventTypeId: 1,
    summary: "",
    shortDescription: "",
    imageUrl: "",
    isFree: false,
    venueId: 1,
    eventStatusId: 1,
    externalSiteUrl: "",
    dateStart: "",
    dateEnd: "",
  });
  _logger(state, "State Test");

  const onChange = (values) => {
    _logger(values, "onchange");
    setState((prevState) => {
      const newState = { ...prevState, ...values };
      return newState;
    });
  };

  const onFinish = () => {
    _logger("Finish button clicked", state);
    prepareEvent(state);
  };

  const navigate = useNavigate();

  const prepareEvent = (newEvent) => {
    let nE = {};
    nE.name = newEvent.name;
    nE.eventTypeId = parseInt(newEvent.eventTypeId);
    nE.summary = newEvent.summary;
    nE.shortDescription = newEvent.shortDescription;
    nE.imageUrl = newEvent.imageUrl;
    nE.isFree = newEvent.isFree;
    nE.venueId = parseInt(newEvent.venueId);
    nE.eventStatusId = parseInt(newEvent.eventStatusId);
    nE.externalSiteUrl = newEvent.externalSiteUrl;
    nE.dateStart = newEvent.dateStart;
    nE.dateEnd = newEvent.dateEnd;

    addEvent(nE).then(onAddEventSuccess).catch(onAddEventError);
    navigate("/event");
  };
  const onAddEventSuccess = (response) => {
    _logger(response);
  };
  const onAddEventError = (error) => {
    _logger(error);
  };

  const mySteps = [
    {
      label: "Step 1",
      icon: <FaHome className="mt-2 text-center" />,
      component: <ComponentOne state={state} onChange={onChange} />,
    },
    {
      label: "Step 2",
      icon: <FaImages className="mt-2 text-center" />,
      component: <ComponentTwo state={state} onChange={onChange} />,
    },
    {
      label: "Step 3",
      icon: <FaLocationArrow className="mt-2 text-center" />,
      component: <ComponentThree state={state} onChange={onChange} />,
    },
    {
      label: "Step 4",
      icon: <BsFillCalendar2DateFill className="mt-2 text-center" />,
      component: <ComponentFour state={state} onChange={onChange} />,
    },
    {
      label: "Step 5",
      icon: <MdOutlinePreview className="mt-2 text-center" />,
      component: <EventPreview state={state} onChange={onChange} />,
    },
  ];

  return (
    <div className="eventWizard">
      <Loki
        steps={mySteps}
        onNext={onChange}
        onBack={onChange}
        onFinish={onFinish}
        noActions
      />
    </div>
  );
}

export default EventWizard;
