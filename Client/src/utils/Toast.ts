import toast from "react-hot-toast";

export const toastFn = (message: string, code: string) => {
    const toastOptions = {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      duration: 2000,
    };
  
    code === "error"
      ? toast.error(message, {
          ...toastOptions,
        })
      : toast.success(message, {
          ...toastOptions,
        });
  };