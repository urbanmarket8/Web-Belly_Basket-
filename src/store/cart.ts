import { createSlice } from "@reduxjs/toolkit";
import { CartItem, CartProduct } from "../utils/types";

type InitialState = {
  cartItems: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  billAmount: number;
  discount: number;
};

const initialState: InitialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
  billAmount: 0,
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload as CartProduct;
      const existingItem = state.cartItems.find(
        (item) => item.product.id === newItem.id
      );
      if (existingItem) {
        existingItem.quantity++;
        existingItem.discount = existingItem.discount + newItem.discount;
        existingItem.billPrice = existingItem.billPrice + newItem.price;
        // console.log(existingItem.discount, "existingItem.discount");
      } else {
        state.cartItems.push({
          product: newItem,
          quantity: 1,
          discount: newItem.price - newItem.discount,
          billPrice: newItem.price,
        });
      }
      state.totalQuantity++;
      state.totalAmount = state.cartItems.reduce(
        (total, item) => state.billAmount - state.discount,
        0
      );
      console.log(state.totalAmount, "state.totalAmount line 47");

      state.billAmount = state.cartItems.reduce(
        (total, item) => state.billAmount + item.product.price,
        0
      );

      console.log(state.billAmount, "existingItem.billamount");

      state.discount = state.cartItems.reduce(
        (total, item) =>
          (item.product.price - item.product.discount) * item.quantity,
        0
      );
      console.log(state.discount, "existingItem.discount");

      // console.log(
      //   state.cartItems.reduce((total, item) => item.product.discount, 0),
      //   "state.discount line 59"
      // );
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.product.id === id
      );
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter(
            (item) => item.product.id !== id
          );
        } else {
          existingItem.quantity--;
          existingItem.totalPrice =
            existingItem.totalPrice - existingItem.product.mrp;
          existingItem.discount =
            existingItem.discount -
            (existingItem.product.mrp - existingItem.product.price);
          existingItem.billPrice =
            existingItem.billPrice - existingItem.product.price;
        }
      }

      state.totalQuantity--;
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.product.mrp * item.quantity,
        0
      );

      state.billAmount = state.cartItems.reduce(
        (total, item) => state.billAmount - item.product.price,
        0
      );

      state.discount = state.cartItems.reduce(
        (total, item) =>
          total + (item.product.mrp - item.product.price) * item.quantity,
        0
      );
    },

    setTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },

    setBillAmount: (state, action) => {
      state.billAmount = action.payload;
    },
  },
});

export default cartSlice.reducer;
export const { addItem, removeItem, setTotalQuantity, setBillAmount } =
  cartSlice.actions;
