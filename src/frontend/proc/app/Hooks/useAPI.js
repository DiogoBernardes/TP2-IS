import axios from "axios";
import { API_PROC_URL } from "../Utils/constants";

if (!API_PROC_URL) {
  console.error("REACT_APP_API_PROC_URL não definido no ambiente.");
}

export default (URL = API_PROC_URL) => {
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
