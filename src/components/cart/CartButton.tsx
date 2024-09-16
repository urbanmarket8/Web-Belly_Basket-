import { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setBillAmount, setTotalQuantity } from "../../store/cart";
import { showCart } from '../../store/ui';
const CartButton = () => {
  const { totalQuantity, billAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedCart = localStorage.getItem("cartProducts");
    if (storedCart) {
      const cartProducts = JSON.parse(storedCart);
      const quantity = cartProducts.reduce(
        (acc: number, product: any) => acc + product.quantity,
        0
      );
      const amount = cartProducts.reduce(
        (acc: number, product: any) => acc + product.price * product.quantity,
        0
      );
      dispatch(setTotalQuantity(quantity));
      dispatch(setBillAmount(amount));
    }
  }, []);

  return (
    <div
      className="flex items-center rounded-[6px] min-w-[112px] h-[50px] py-2 px-3 gap-2 font-bold text-sm bg-[#0c831f] cursor-pointer text-white"
      onClick={() => dispatch(showCart())}
    >
      <FaShoppingCart size={24} className="_wiggle" />
      <div className="flex flex-col font-bold text-[14px] leading-none">
        {totalQuantity === 0 ? (
          <span className="">My Cart</span>
        ) : (
          <>
            <span className="tracking-tight">{totalQuantity} items</span>
            <span className="tracking-tight mt-0.5">₹{billAmount}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CartButton;
