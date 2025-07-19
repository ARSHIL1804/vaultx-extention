import Auth from "@/module/auth/Auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useBrowserStorage } from "./BrowserStorageProvider";
import { Spinner } from "@/components/ui/spinner";
import { isNullOrUndefined } from "@/lib/utils";
import { useAccounts } from "./AccountProvider";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {


  // const { isFetchingBrowserStorage, localStorageState, sessionStorageState } = useBrowserStorage();
  // const { isSignerReady } = useAccounts();
  // const location = useLocation();
  // const currPath = location.pathname;
  // const hasEncryptedAccounts = !isNullOrUndefined(localStorageState.encryptedAccounts);
  // const hasEncryptionKey = !isNullOrUndefined(sessionStorageState.encryptionKey);

  // if (isFetchingBrowserStorage) {
  //   return <Spinner size="small" className="w-full overflow-hidden" />;
  // }

  // // if (hasEncryptedAccounts && !hasEncryptionKey) {
  // //   return <Navigate to="/auth/verify-password" state={{ from: location }} replace />;
  // // }

  // // if (!hasEncryptedAccounts) {
  // //   const path = hasEncryptionKey ? "/account/create-new" : "/auth/create-password";
  // //   return <Navigate to={path} state={{ from: location }} replace />;
  // // }

  // if(currPath.startsWith('/account/add-new')){
  //   return children;
  // }

  // if(!isSignerReady) {
  //   return <Spinner size="small" className="w-full overflow-hidden" />;
  // }

  return children;
};

export default ProtectedRoute;
