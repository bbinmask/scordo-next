"use client";

import { AxiosProps } from "@/types/index.props";
import { AxiosResponse } from "axios";
import AxiosRequest from "@/utils/AxiosResponse";
import { useCallback } from "react";

export interface ResponseData {
  status: number;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

const useAxios = () => {
  const fetchData: AxiosProps = useCallback(async (url, method, body, options) => {
    try {
      const response: AxiosResponse = await AxiosRequest({
        url,
        method,
        data: body,
        ...options,
      });

      console.log(response.data);

      return response.data as ResponseData;
    } catch (err: any) {
      return err?.response?.data as ResponseData;
    }
  }, []);

  return { fetchData };
};

export default useAxios;
