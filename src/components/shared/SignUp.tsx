import { notification } from "antd";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { REGISTERDATA, userRegister } from "../../services/api/auth";
import "./style.css"; // Assuming the styles are shared

interface SignUpProps {
  toggleSignUpModal: () => void;
  switchToLoginModal: () => void;
}

const SignUp: React.FC<SignUpProps> = ({
  toggleSignUpModal,
  switchToLoginModal,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
  };

  // const handleRegister = async () => {
  //   if (
  //     !firstName ||
  //     !lastName ||
  //     !email ||
  //     !userName ||
  //     !phoneNumber ||
  //     !password ||
  //     !confirmPassword
  //   ) {
  //     notification.error({
  //       message: "Please input all field",
  //     });
  //     return;
  //   }

  //   if (password != confirmPassword) {
  //     notification.error({
  //       message: "Please check password again",
  //     });
  //     return;
  //   }

  //   const registerData: REGISTERDATA = {
  //     first_name: firstName,
  //     last_name: lastName,
  //     email: email,
  //     userName: userName,
  //     phone_number: phoneNumber,
  //     password: password,
  //     is_owner: false,
  //   };

  //   const response: any = await userRegister(registerData);

  //   if (response === "success") {
  //     notification.success  ({
  //       message: "Sign up successfully!",
  //     });
  //     switchToLoginModal();
  //   }
  // };


  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !userName || // Ensure this matches the backend expected key
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      notification.error({
        message: "Please input all field",
      });
      return;
    }

    if (password != confirmPassword) {
      notification.error({
        message: "Please check password again",
      });
      return;
    }

    const registerData: REGISTERDATA = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: firstName + lastName, // Ensure this matches the backend expected key
      phone_number: phoneNumber,
      password: password,
      is_owner: false,
    };

    const response: any = await userRegister(registerData);

    if (response === "success") {
      notification.success({
        message: "Sign up successfully!",
      });
      switchToLoginModal();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-signup">
        <button className="modal-close" onClick={toggleSignUpModal}>
          ×
        </button>
        <div className="modal-header">
          <h2>Sign Up</h2>
          <p>Create a new account</p>
        </div>

        <div className="sign-up-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="First name"
              className="input-field"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Last name"
              className="input-field"
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="User name"
              className="input-field"
              required
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            {/* Phone number input with country code */}
            <PhoneInput
              country={"us"}
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputClass="phone-input-field"
              placeholder="Phone number"
              enableSearch={true}
              inputStyle={{ width: "100%", padding: "21px 50px" }} // Enable search within country dropdown
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Repeat Password"
              className="input-field"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <div
            className="password-toggle"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <button
            type="submit"
            className="sign-up-button"
            onClick={handleRegister}
          >
            Sign up
          </button>
        </div>

        <div className="login-links">
          <p>
            Already have an account?{" "}
            <a href="#" onClick={switchToLoginModal} className="sign-in-link">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
