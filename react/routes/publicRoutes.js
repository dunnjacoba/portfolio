import { lazy } from "react";

const EventWizard = lazy(() =>
  import("../components/eventwizard/EventWizardSA")
);

const eventRoutes = [
  {
    path: "/eventwizard/:eventId",
    name: "EventWizard",
    exact: true,
    element: EventWizard,
    roles: [],
    isAnonymous: true,
  },
];
const errorRoutes = [
  {
    path: "/error-500",
    name: "Error - 500",
    element: ErrorServerError,
    roles: [],
    exact: true,
    isAnonymous: true,
  },
  {
    path: "*",
    name: "Error - 404",
    element: ErrorPageNotFound,
    roles: [],
    exact: true,
    isAnonymous: true,
  },
];

var allRoutes = [...errorRoutes, ...eventRoutes];

export default allRoutes;
