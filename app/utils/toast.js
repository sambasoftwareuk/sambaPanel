import { toast } from "react-toastify";

const defaultOptions = {
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function showError(message) {
  toast.error(message, defaultOptions);
}

export function showSuccess(message) {
  toast.success(message, defaultOptions);
}

export function showWarning(message) {
  toast.warn(message, defaultOptions);
}

export function showInfo(message) {
  toast.info(message, defaultOptions);
}
