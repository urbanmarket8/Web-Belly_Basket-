import { notification } from "antd";
import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import delivery from "../../assets/fast-delivery.png";
import gross from "../../assets/gross.png";
import handing from "../../assets/handing.png";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { orderCreate } from "../../services/api/order";
import {
  listProductsApi,
  ProductSearchPayload,
} from "../../services/api/products";
import { hideCart } from "../../store/ui";
import { shuffleItems } from "../../utils/helper";
import { CartItem, ProductItem } from "../../utils/types";
import AddToCartButton from "../shared/AddToCartButton";
import Login from "../shared/Login";
import SignUp from "../shared/SignUp";

const getCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const CartPanelItem = (props: CartItem) => {
  const { image, title, price } = props.product;
  return (
    <div className="flex p-4 gap-4 border-t _border-muted">
      <div>
        <div className="h-[72px] w-[72px] border rounded-[4px] overflow-hidden">
          <img
            src={`http://localhost:8080/${image}`}
            alt=""
            className="h-full w-full"
          />
        </div>
      </div>
      <div className="text-left flex flex-col flex-1">
        <div className="_text-default text-[15px] leading-tight mb-2">
          {title}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-[14px] _text-default">₹{price}</span>
          </div>
          <div className="h-9 w-[90px]">
            <AddToCartButton product={props.product} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPanel = () => {
  const dispatch = useAppDispatch();
  const { totalAmount, totalQuantity, cartItems, billAmount, discount } =
    useAppSelector((state) => state.cart);

  const [topProducts, setTopProducts] = useState<ProductItem[]>([]);
  const [loadedCartItems, setLoadedCartItems] = useState<CartItem[]>([]);
  const [isUserInfo, setIsUserInfo] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);

  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  useEffect(() => {
    const storedCartItems = getCartFromLocalStorage();
    if (storedCartItems.length > 0) {
      setLoadedCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      saveCartToLocalStorage(cartItems);
    }
  }, [cartItems]);

  useEffect(() => {
    const userInformation = localStorage.getItem("userInfo");

    if (userInformation) {
      try {
        const parsedUserInfo = JSON.parse(userInformation);
        setIsUserInfo(parsedUserInfo);
      } catch (error) {
        console.error(
          "Failed to parse user information from localStorage:",
          error
        );
      }
    } else {
      setIsUserInfo(null);
    }
  }, []);

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsSignUpModalOpen(false); // Ensure the sign-up modal is closed
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
    setIsLoginModalOpen(false); // Ensure the login modal is closed
  };

  const switchToSignUpModal = () => {
    setIsLoginModalOpen(false); // Close login modal
    setIsSignUpModalOpen(true); // Open sign-up modal
  };

  const switchToLoginModal = () => {
    setIsSignUpModalOpen(false); // Close sign-up modal
    setIsLoginModalOpen(true); // Open login modal
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const data: ProductSearchPayload = {
        searchText: "",
        shopId: "",
        category: "",
        nearby: false,
        page: 1,
        limit: 50,
      };
      try {
        const productItems = await listProductsApi(data); // Await the promise
        const allProducts: ProductItem[] = [];

        productItems.forEach((obj: any) => {
          const items = obj.products.map((product: any) => product);
          allProducts.push(...items);
        });

        const addedProducts = cartItems.map((item) => item.product.id);
        const otherProducts = allProducts.filter(
          (item) => !addedProducts.includes(item._id.toString())
        );
        const shuffledProducts = shuffleItems(otherProducts).slice(0, 10);
        setTopProducts(shuffledProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [cartItems]);

  const initiatePayment = async () => {
    const data = await orderCreate(adjustedBillAmount);

    const options = {
      key: "rzp_test_FChFjA06oHTdte",
      amount: data.amount,
      currency: data.currency,
      name: "Your Company",
      description: "Test Transaction",
      order_id: data.id,
      handler: (response: { razorpay_payment_id: any }) => {
        console.log(response);
        notification.success({
          message: "Payment successful",
        });

        // Clear cart items from local storage after payment is successful
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartProducts");

        // Optionally reset state in the app
        setLoadedCartItems([]);
        dispatch({ type: "cart/clearCart" });
      },
      prefill: {
        name: isUserInfo?.username || "Guest",
        email: isUserInfo?.email,
        contact: isUserInfo?.phone_number,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const loginData = localStorage.getItem("user");

    if (loginData) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, []);

  const adjustedBillAmount = billAmount < 100 ? billAmount + 15 : billAmount;

  return (
    <div className="fixed inset-0 h-screen w-screen z-50 overflow-hidden p-4">
      <div
        className="absolute z-10 inset-0 bg-black bg-opacity-[.65]"
        onClick={() => dispatch(hideCart())}
      />
      <aside
        className="_drawer flex flex-col overflow-y-auto overflow-x-hidden"
        style={{ right: "15px" }}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between p-4">
          <h2 className="font-extrabold text-2xl _text-default">My Cart</h2>
          <IoClose
            size={24}
            className="cursor-pointer"
            onClick={() => dispatch(hideCart())}
          />
        </div>
        {totalQuantity === 0 && cartItems.length === 0 ? (
          <div className="flex-1 bg-white p-6">
            <div className="flex flex-col gap-3 justify-center items-center text-center">
              <img src="empty-cart.webp" alt="" className="h-36 w-36" />
              <h3 className="font-bold text-lg leading-tight">
                You don't have any items in your cart
              </h3>
              <p className="text-sm _text-default mb-2">
                Your favourite items are just a click away
              </p>
              <button
                type="button"
                onClick={() => dispatch(hideCart())}
                className="bg-[#0c831f] text-white rounded-[8px] px-4 py-3 leading-none text-[13px] font-medium cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1" style={{ padding: "15px" }}>
              <div className="space-y-3 my-3">
                <div
                  className="bg-white border-y _border-muted"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0.5px 0.1px 1px 1px #ede7e7",
                  }}
                >
                  <div className="flex flex-col px-4 pt-5">
                    <div className="flex justify-between _text-muted text-xs">
                      <span>shipment of&nbsp;{totalQuantity} items</span>
                    </div>
                    <p className="text-sm _text-default font-bold mb-1">
                      Delivery in some times
                    </p>
                  </div>
                  <div className="divide-y-1">
                    {cartItems.length > 0
                      ? cartItems.map((item) => (
                          <CartPanelItem key={item.product.id} {...item} />
                        ))
                      : loadedCartItems.map((item) => (
                          <CartPanelItem key={item.product.id} {...item} />
                        ))}
                  </div>
                </div>
                <div
                  className="bg-white"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0.5px 0.1px 1px 1px #ede7e7",
                  }}
                >
                  <div
                    className="font-bold text-xl text-black pt-5 px-4"
                    style={{ fontSize: "17px" }}
                  >
                    Bill Details
                  </div>
                  <div className="px-4 text-xs space-y-2 py-2">
                    <div className="flex items-start justify-between _text-default">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={gross}
                          alt="gross"
                          style={{ width: "18px", marginRight: "5px" }}
                        />
                        <span>Items total</span>
                      </div>
                      <span>
                        <span>₹{billAmount}</span>
                      </span>
                    </div>
                    <div className="flex items-start justify-between _text-default">
                      <p className="flex flex-col">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={delivery}
                            alt="delivery"
                            style={{ width: "20px", marginRight: "5px" }}
                          />
                          <span>Delivery charge</span>
                        </div>
                      </p>
                      {billAmount > 100 ? (
                        <span>
                          <span
                            style={{
                              textDecorationLine: "line-through",
                              marginRight: "5px",
                            }}
                          >
                            ₹15
                          </span>
                          <span
                            className="text-[#0c831f]"
                            style={{ fontSize: "13px" }}
                          >
                            Free
                          </span>
                        </span>
                      ) : (
                        <span>₹15</span>
                      )}
                    </div>
                    <div className="flex items-start justify-between _text-default">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={handing}
                          alt="Handing charge"
                          style={{ width: "17px", marginRight: "5px" }}
                        />
                        <span>Handling charge</span>
                      </div>
                      <span>₹2</span>
                    </div>
                    <div className="flex items-start justify-between text-[14px] text-black font-bold py-2">
                      <span style={{ color: "#404040" }}>Grand total</span>
                      <span>₹{adjustedBillAmount + 2}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="bg-white border-y _border-muted"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0.5px 0.1px 1px 1px #ede7e7",
                  }}
                >
                  <div className="flex flex-col px-4 pt-2">
                    <p className="text-sm _text-default font-bold mb-1">
                      Delivery in some times
                    </p>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        fontStyle: "normal",
                        fontFamily: "Okra",
                        lineHeight: "15px",
                        paddingBottom: "12px",
                        color: "#828282",
                      }}
                    >
                      Orders cannot be cancelled once packed for delivery. In
                      case of unexpected delays, a refund will be provided, if
                      applicable.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="sticky bottom-0 bg-white px-4 pt-2 pb-4 min-h-[68px] _shadow_sticky"
              onClick={() => {
                if (!loginStatus) {
                  toggleLoginModal();
                } else {
                  initiatePayment();
                }
              }}
            >
              <div className="bg-[#0c831f] cursor-pointer text-white flex items-center px-3 py-3 rounded-[4px] font-medium text-[14px]">
                <div className="font-bold">{totalQuantity} Items</div>
                <div className="font-bold">&nbsp; &middot; &nbsp;</div>
                <div>
                  <span className="font-extrabold">
                    ₹{adjustedBillAmount + 2}
                  </span>
                </div>
                <div className="ml-auto flex items-center font-bold">
                  Proceed <FiChevronRight size={18} className="ml-2" />
                </div>
              </div>
            </div>
            {/* Render Login Modal */}
            {isLoginModalOpen && (
              <Login
                toggleLoginModal={toggleLoginModal}
                switchToSignUpModal={switchToSignUpModal}
              />
            )}

            {/* Render Sign Up Modal */}
            {isSignUpModalOpen && (
              <SignUp
                toggleSignUpModal={toggleSignUpModal}
                switchToLoginModal={switchToLoginModal}
              />
            )}
          </>
        )}
      </aside>
    </div>
  );
};

export default CartPanel;
