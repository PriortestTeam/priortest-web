import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken, removeToken, setToken } from "@/utils/auth";
import router from "../router/index.js";
import { set } from "nprogress";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000000, // request timeout
});

export { service as axios };

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers["Authorization"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (response.headers.authorization) {
      setToken(response.headers.authorization);
      store.commit("user/SET_TOKEN", response.headers.authorization);
    }
    if (res.code !== "200") {
      Message({
        message: res.message || res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      if (res.code === "401") {
        console.log("401");
        removeToken();
        router.replace(`/login?redirect=${router.app.$route.fullPath}`);
        return;
      }
      if (res.code === "403") {
        console.log("403");
        return;
      }
      if (res.code === "-1") {
        console.log("-1");
        return;
      }

      return res;
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err---", error); // for debug
    if (error.response.status === 401) {
      router.replace(`/login?redirect=${router.app.$route.fullPath}`);
      return;
    }
    if (error.config.url.indexOf("testCaseTemplate/importTestCase") === -1) {
      Message({
        message: error.response.data.data || error.response.data.error,
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
