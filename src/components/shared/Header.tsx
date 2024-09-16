import {
  BorderOuterOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons"; // Corrected import
import { notification } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import image from "../../assets/images/logo-default-231x49.png";
import { CartButton } from "../cart";
import LocationPicker from "../LocationPicker";
import SearchBox from "../SearchBox";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import Order from "./Order";
import SignUp from "./SignUp";
import "./style.css";
import "./style1.css";

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPassModalOpen, setIsForgotPassModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsSignUpModalOpen(false);
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
    setIsLoginModalOpen(false);
  };

  const toggleForgotPassModal = () => {
    setIsForgotPassModalOpen(!isForgotPassModalOpen);
    setIsLoginModalOpen(false);
  };

  const toggleOrderModal = () => {
    setIsOrderModalOpen(!isOrderModalOpen);
  };

  const handleLogout = () => {
    notification.success({
      message: "Log-out successfully",
    });
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const renderModals = () => {
    return (
      <>
        {isLoginModalOpen && (
          <Login
            toggleLoginModal={toggleLoginModal}
            switchToSignUpModal={toggleSignUpModal}
            switchToForgotPassModal={toggleForgotPassModal}
            onLoginSuccess={() => setIsLoggedIn(true)}
          />
        )}
        {isSignUpModalOpen && (
          <SignUp
            toggleSignUpModal={toggleSignUpModal}
            switchToLoginModal={toggleLoginModal}
          />
        )}
        {isForgotPassModalOpen && (
          <ForgotPassword
            toggleForgotPassModal={toggleForgotPassModal}
            switchToLoginModal={toggleLoginModal}
          />
        )}
        {isOrderModalOpen && (
          <Order
            toggleOrderModal={toggleOrderModal}
            onOrderSuccess={() => {
              notification.success({ message: "Order successful!" });
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <header className="_nav px-2 sm:px-0">
        <div className="_header sm:flex h-full">
          <div className="hidden sm:flex max-w-[150px] md:max-w-[178px] w-full cursor-pointer sm:hover:bg-gray-50 items-center justify-center border-r _border-light">
            <Link to={"/"}>
              <span className="font-black text-[32px] md:text-[38px] text-yellow-400 tracking-tight flex justify-center items-center">
                <img src={image} alt="logo" style={{ width: "60px" }} />
                <strong className="text-green-600 text-2xl">Bazaar</strong>
              </span>
            </Link>
          </div>
          <div className="w-full sm:w-[240px] xl:w-[320px] py-4 px-1 sm:p-0 _header_loc flex items-center sm:justify-center cursor-pointer sm:hover:bg-gray-50">
            <LocationPicker />
          </div>
          <div className="flex-1 relative _header_search">
            <SearchBox />
          </div>
          <div className="flex items-center _header_login justify-center cursor-pointer sm:hover:bg-gray-50 max-w-[80px] w-full group">
            <span className="font-medium _text-default hidden sm:block">
              {isLoggedIn ? (
                <div className="flex justify-center items-center">
                  <div className="rounded-full flex justify-center items-center bg-white">
                    <HomeOutlined className="text-[20px] p-2" />
                  </div>
                  <div className="signin-card hidden group-hover:block absolute bg-white rounded-lg shadow-lg">
                    <ul>
                      <li className="hover:bg-red-500 rounded p-2 transition-colors duration-200">
                        <p className="p-[5px]">
                          <a
                            href="#"
                            onClick={toggleOrderModal}
                            className="text-black"
                          >
                            <BorderOuterOutlined className="mr-1" />
                            My Orders
                          </a>
                        </p>
                      </li>
                      <li className="hover:bg-red-500 rounded p-2 transition-colors duration-200 group">
                        <p
                          onClick={isLoggedIn ? handleLogout : toggleLoginModal}
                          className="flex items-center text-black p-[5px] transition-colors duration-200"
                        >
                          <LogoutOutlined className="mr-1" />
                          Logout
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div onClick={toggleLoginModal} className="flex items-center">
                  <LoginOutlined className="mr-1 text-[20px]" />
                  Login
                </div>
              )}
            </span>
          </div>

          <div className="py-2 hidden md:flex h-full items-center mr-8 ml-3">
            <CartButton />
          </div>
        </div>
      </header>

      {/* Render Modals */}
      {renderModals()}
    </>
  );
};

export default Header;
