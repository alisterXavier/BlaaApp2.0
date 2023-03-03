import LoginCreate from "../components/LoginAndCreate/LoginCreate";
import LoginPage from "../components/LoginAndCreate/Login";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginCreateWrapper = () => {
  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState(false);
  const [loginResponse, setLoginResponse] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSwitch = () => {
    setTimeout(() => {
      setIsCreate(!isCreate);
    }, 3000);
    
  };

  useEffect(() => {
    loginResponse &&
      setTimeout(() => {
        navigate("/");
      }, 3000);
  }, [loginResponse]);

  return (
    <LoginCreate loading={loading} loginResponse={loginResponse}>
      <LoginPage
        handleSwitch={handleSwitch}
        loginResponse={setLoginResponse}
        loading={setLoading}
      />
    </LoginCreate>
  );
};

export default LoginCreateWrapper;
