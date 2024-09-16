import React, { useEffect, useState } from "react";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { addItem, removeItem } from "../../store/cart";
import { CartProduct } from "../../utils/types";

type ButtonProps = {
  product: CartProduct;
  size?: "sm" | "lg";
};

const AddToCartButton = ({ product, size }: ButtonProps) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [itemCount, setItemCount] = useState<number>(0); // Store quantity of the product

  useEffect(() => {
    // Check if product exists in local storage
    const storedProducts = localStorage.getItem("cartProducts");
    if (storedProducts) {
      const cartProducts = JSON.parse(storedProducts);

      // Find the product in local storage
      const storedProduct = cartProducts.find(
        (item: CartProduct) => item.id === product.id
      );

      if (storedProduct) {
        setItemCount(storedProduct.quantity); // Set item count from local storage
      }
    }
  }, [product.id]);

  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(addItem({ ...product }));

    // Update item count and local storage when adding more items
    setItemCount((prevCount) => prevCount + 1);

    const storedProducts = localStorage.getItem("cartProducts");
    let cartProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const productIndex = cartProducts.findIndex(
      (item: CartProduct) => item.id === product.id
    );

    if (productIndex !== -1) {
      cartProducts[productIndex].quantity += 1;
    } else {
      cartProducts.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  };

  const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(removeItem(product.id));

    // Update item count and local storage when removing items
    setItemCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));

    const storedProducts = localStorage.getItem("cartProducts");
    let cartProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const productIndex = cartProducts.findIndex(
      (item: CartProduct) => item.id === product.id
    );

    if (productIndex !== -1) {
      if (cartProducts[productIndex].quantity > 1) {
        cartProducts[productIndex].quantity -= 1;
      } else {
        cartProducts = cartProducts.filter(
          (item: CartProduct) => item.id !== product.id
        );
      }

      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    }
  };

  const handleItemAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("src/components/shared/AddToCartButton.jsx line87");
    
    e.stopPropagation();
    dispatch(addItem({ ...product }));

    setItemCount(1); // Set initial item count

    const storedProducts = localStorage.getItem("cartProducts");
    let cartProducts = storedProducts ? JSON.parse(storedProducts) : [];

    const productExists = cartProducts.find(
      (item: CartProduct) => item.id === product.id
    );

    if (!productExists) {
      cartProducts.push({ ...product, quantity: 1 });
      localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    }

    
  };

  return itemCount > 0 ? (
    <div
      className={`flex h-full w-full justify-around rounded-lg uppercase font-bold text-sm bg-[#0c831f] cursor-pointer ${
        size === "lg" ? "text-lg" : "text-normal"
      }`}
    >
      <button
        onClick={(e) => remove(e)}
        type="button"
        className="flex items-center justify-center w-8"
      >
        <IoRemoveSharp size={18} className="text-white" />
      </button>
      <span className="flex items-center justify-center text-white">
        {itemCount}
      </span>
      <button
        onClick={(e) => add(e)}
        type="button"
        className="flex items-center justify-center w-8"
      >
        <IoAddSharp size={18} className="text-white" />
      </button>
    </div>
  ) : (
    <button
      type="button"
      className={`_add_to_cart ${size === "lg" ? "text-md" : "text-sm"}`}
      onClick={(e) => handleItemAdd(e)}
    >
      Add
    </button>
  );
};

export default AddToCartButton;
