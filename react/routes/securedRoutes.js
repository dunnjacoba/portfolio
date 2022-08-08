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
    roles: ["SysAdmin", "Admin", "User"],
    isAnonymous: true,
  },
];

const allRoutes = [...eventRoutes];

export default allRoutes;
