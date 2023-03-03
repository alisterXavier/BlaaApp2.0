import { ReactNode } from "react";
import { Loading } from "../../Types/type";
import { AiOutlineCheck } from "react-icons/ai";

const LoadingBars = ({ loading }: Loading) => {
  return (
    <>
      <span className={`loading-bar ${loading && "success"}`}></span>
      <span className={`loading-bar ${loading && "success"}`}></span>
      <span className={`loading-bar ${loading && "success"}`}></span>
      <span className={`loading-bar ${loading && "success"}`}></span>
    </>
  );
};

const LoginCreate = ({
  children,
  loading,
  loginResponse,
}: {
  loading: boolean;
  children: ReactNode;
  loginResponse: boolean | null;
}) => {
  return (
    <div
      className={`login-wrapper ${
        loginResponse === false && "border-red-500"
      } flex flex-col items-start justify-center rounded p-5`}
    >
      {loading ? (
        <LoadingBars loading={loading}></LoadingBars>
      ) : loginResponse == true ? (
        <div className="success-log w-full">
          <AiOutlineCheck className="mx-auto fill-green-500" size={100} />
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default LoginCreate;
