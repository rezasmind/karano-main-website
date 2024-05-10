import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API, BACKEND_API } from 'src/config-global';

// ----------------------------------------------------------------------
const axiosInstance = axios.create({ baseURL: HOST_API });
const backend_axios = axios.create({ baseURL: BACKEND_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

backend_axios.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const server_axios = backend_axios;
export default axiosInstance;


// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    user: {
      check_phone: '/api/authentication/user/check-phone',
      login: '/api/authentication/user/login',
      verify: '/api/authentication/user/verify',
      add_password: (id: any) => '/api/authentication/user/add-password/' + id,
    },
    me: '/api/authentication/me',
    register: '/api/authentication/user/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
