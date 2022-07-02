import axios from "axios";

import * as helper from "./serviceHelpers";

const addEvent = (payload) => {
  const config = {
    method: "POST",
    url: `${helper.API_HOST_PREFIX}/api/events`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${helper.API_HOST_PREFIX}/api/events/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getById = (id) => {
  const config = {
    method: "POST",
    url: `${helper.API_HOST_PREFIX}/api/events/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const update = (payload) => {
  const config = {
    method: "PUT",
    url: `${helper.API_HOST_PREFIX}/api/events/${payload.id}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const pagination = (payload) => {
  const config = {
    method: "GET",
    url: `${helper.API_HOST_PREFIX}/api/events/${payload.id}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const lookUps = (payload) => {
  const config = {
    method: "POST",
    url: `${helper.API_HOST_PREFIX}/api/lookups`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const lookUpVenues = () => {
  const config = {
    method: "GET",
    url: `${helper.API_HOST_PREFIX}/api/venues/paginate?pageIndex=0&pageSize=100`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { update, pagination, lookUps, addEvent, getById, getAll, lookUpVenues };
