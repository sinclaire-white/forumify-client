import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://forum-server-ten-khaki.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
