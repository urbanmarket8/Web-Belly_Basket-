"use client";

import axios from "axios";
import { LIST_PRODUCTS } from "../url.js";

export interface ProductSearchPayload {
  searchText: string;
  shopId?: string;
  category: string;
  nearby: boolean;
  page: number;
  limit: number;
}

function getLocation() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
}

export const listProductsApi = async (payload: ProductSearchPayload) => {
  try {
    console.log(payload, ": payload data");

    const position: any = await getLocation();
    const { longitude, latitude } = position?.coords || {};
    console.log(longitude, latitude, ": position");

    // Ensure the payload is properly formatted
    const response = await axios.post(LIST_PRODUCTS, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-User-Longitude": longitude,
        "X-User-Latitude": latitude,
      },
    });

    console.log(response.data.products, ": response data");

    return response.data.products;
  } catch (error: any) {
    console.error(
      "Error in sending request: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
