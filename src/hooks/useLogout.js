import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useLogout = () => {
  const showToast = useShowToast();
  const [signOut, isLoggingOut, error] = useSignOut(auth);
  const logoutUser = useAuthStore((state) => state.logout);
  
  const handleLogout = () => {
    try {
      signOut();
      localStorage.removeItem('user-info');
      logoutUser();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { handleLogout, isLoggingOut, error };
}
export default useLogout