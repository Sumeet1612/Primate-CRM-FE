import { toast } from "react-toastify";

export const showNotification = (message, type = "info") => {
    toast[type](message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
};