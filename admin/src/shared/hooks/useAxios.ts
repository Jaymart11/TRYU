import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IAxios } from "../interface/IAxios";
import { CONFIG } from "../config/config";

interface IApiInstance {
  instance: AxiosInstance;
  GET: <R, P = unknown, B = unknown>(
    args: IAxios<P, B>
  ) => Promise<AxiosResponse<R>>;
  POST: <R, P = unknown, B = unknown>(
    args: IAxios<P, B>
  ) => Promise<AxiosResponse<R>>;
  PUT: <P, B>(args: IAxios<P, B>) => Promise<AxiosResponse>;
  DELETE: <P, B>(args: IAxios<P, B>) => Promise<AxiosResponse>;
}

export const useAxios = (): IApiInstance => {
  const instance = axios.create({
    baseURL: CONFIG.API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  //   instance.interceptors.request.use(
  //     async (request) => {
  //       if (CONFIG.isDevelopment) {
  //         console.log(
  //           `%c ${request?.method} request for ${request.url}\n`,
  //           'color:white;background-color:#fa8c16;padding:5px;border-radius:5px;',
  //           request.data,
  //         );
  //         console.log({ params: request.params });
  //       }
  //       return request;
  //     },
  //     async (error) => {
  //       if (CONFIG.isDevelopment) console.log(error);
  //       return Promise.reject(error);
  //     },
  //   );

  //   instance.interceptors.response.use(
  //     async (response) => {
  //       if (CONFIG.isDevelopment) {
  //         console.log(
  //           `%c response from ${response.config.url}\n`,
  //           'color:white;background-color:#1890ff;padding:5px;border-radius:5px;',
  //           response.data,
  //         );
  //       }
  //       return response;
  //     },
  //     async (error) => {
  //       // Handle specific error cases, e.g., token expiration
  //       if (error.response && error.response.status === 401) {
  //         // Handle token expiration or unauthorized
  //         // You can use Alert or any other error handling mechanism
  //       }

  //       if (CONFIG.isDevelopment) console.log(error);
  //       return Promise.reject(error);
  //     },
  //   );

  const GET = async <R, P = unknown, B = unknown>(
    args: IAxios<P, B>
  ): Promise<AxiosResponse<R>> => {
    return await instance.get<R>(args.url, { params: args.params });
  };

  const POST = async <R, P = unknown, B = unknown>(
    args: IAxios<P, B>
  ): Promise<AxiosResponse<R>> => {
    return await instance.post<R>(args.url, args.body, { params: args.params });
  };

  const PUT = async <P, B>(args: IAxios<P, B>): Promise<AxiosResponse> => {
    return await instance.put(args.url, args.body, { params: args.params });
  };

  const DELETE = async <P, B>(args: IAxios<P, B>): Promise<AxiosResponse> => {
    return await instance.delete(args.url, { params: args.params });
  };

  return {
    instance,
    GET,
    POST,
    PUT,
    DELETE,
  };
};
