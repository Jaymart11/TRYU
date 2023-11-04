import { AxiosRequestHeaders, ResponseType } from "axios";

export interface IAxios<P, B> {
  url: string;
  params?: P;
  body?: B;
  data?: B;
  headers?: AxiosRequestHeaders;
  responseType?: ResponseType;
}
