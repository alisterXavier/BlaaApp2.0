import NewUsername from "../NewUsername";

const SelectUser = () => {
  return (
    <div className="select-username w-screen h-screen flex justify-center items-center">
      <div className="login-wrapper flex py-5">
        <div className="p-5 flex flex-col items-start">
          <div>
            <h1 className="text-4xl  font-bold">Enter Username</h1>
          </div>
          <NewUsername />
        </div>
      </div>
    </div>
  );
};

export default SelectUser;
