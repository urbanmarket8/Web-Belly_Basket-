import { notification } from "antd";
import React, { useState } from "react";
import { LOGINDATA, userLogin } from "../../services/api/auth";
import "./style.css"; // Assuming the styles are shared

interface LoginProps {
  toggleLoginModal: () => void;
  switchToSignUpModal: () => void;
  switchToForgotPassModal: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({
  toggleLoginModal,
  switchToSignUpModal,
  switchToForgotPassModal,
  onLoginSuccess,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const loginData: LOGINDATA = {
      email: email,
      password: password,
    };
    try {
      const response = await userLogin(loginData);

      // Show success notification
      notification.success({
        message: "Login successfully",
      });

      localStorage.setItem("user", JSON.stringify(response));
      console.log("local");

      console.log(localStorage);

      onLoginSuccess();
      toggleLoginModal();

      // Reload the browser after a short delay (e.g., 1 second)
      setTimeout(() => {
        // window.location.reload();
      }, 500); // 1 second delay to allow notification to be visible
    } catch (error) {
      notification.error({
        message: "Login failed. Please try again.",
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={toggleLoginModal}>
          ×
        </button>
        <div className="modal-header">
          <h2>Welcome</h2>
          <p>Log in to your account</p>
        </div>

        <div className="login-form">
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
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="forgot-password">
              <a
                href="#"
                onClick={switchToForgotPassModal}
                className="forgot-password-link"
              >
                Forgot password?
              </a>
            </div>
            <div className="password-toggle">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="sign-in-button"
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>

        <div className="login-links">
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={switchToSignUpModal} className="sign-up-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
