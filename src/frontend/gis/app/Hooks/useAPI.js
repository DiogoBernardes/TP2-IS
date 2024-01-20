import axios from "axios";
import { API_URL } from "../Utils/constants";

export default (URL = API_URL) => {
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const GET = (route) => {
    return axios.get(`${URL}${route}`, options);
  };

  const POST = (route, data) => {
    return axios.post(`${URL}${route}`, data, options);
  };

  const PUT = (route, data) => {
    return axios.put(`${URL}${route}`, data, options);
  };

  const DELETE = (route) => {
    return axios.delete(`${URL}${route}`, options);
  };

  return {
    GET,
    POST,
    PUT,
    DELETE,
  };
};
