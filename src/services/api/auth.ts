"use client";

import { notification } from "antd";
import axios from "axios";
import { FORGOTPASSWORD, LOGIN, REGISTER } from "../url.js";

export interface LOGINDATA {
  email: string;
  password: string;
}

export interface REGISTERDATA {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  password: string;
  is_owner: boolean;
}

export const userLogin = async (payload: LOGINDATA) => {
  try {
    console.log(payload, ": login data");

    const loginData: any = {
      data: {
        attributes: payload,
      },
    };

    // Ensure the payload is properly formatted
    const response = await axios.post(LOGIN, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    notification.error({
      message: error.response.data.errors[0].detail,
    });
    console.log(error.response.data.errors[0].detail);

    console.error(
      "Error in sending request: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const userRegister = async (payload: REGISTERDATA) => {
  try {
    console.log(payload, ": login data");

    const loginData: any = {
      data: {
        attributes: payload,
      },
    };

    // Ensure the payload is properly formatted
    const response = await axios.post(REGISTER, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the entire response object to inspect its structure
    console.log(response, ": full response");

    // Check if the response and response.data are defined
    if (response && response.data) {
      // Log the response data
      console.log(response.data.message, ": response data");
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      // Handle the response based on the actual structure
      return (
        response.data.products?.message || response.data.message || "Success"
      );
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error: any) {
    // Check for error response data and show a notification
    const errorMessage =
      error.response?.data?.errors?.[0]?.detail ||
      error.message ||
      "An unknown error occurred";

    notification.error({
      message: errorMessage,
    });

    console.error(
      "Error in sending request: ",
      error.response?.data || error.message
    );

    throw error; // Re-throw the error for further handling upstream
  }
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(FORGOTPASSWORD, JSON.stringify({ email }), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};

export const resetPassword = async (email: string) => {
  const response = await axios.post(FORGOTPASSWORD, JSON.stringify({ email }), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
};
