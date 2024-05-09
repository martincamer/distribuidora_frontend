import axios from "axios";
import { API_URL } from "../config";

const instance = axios.create({
  baseURL: "https://distribuidorabackend-production-1769.up.railway.app/api",
  withCredentials: true,
});

export default instance;
