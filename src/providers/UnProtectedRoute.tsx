import React from 'react';
import { 
  Navigate, 
  Outlet, 
  useLocation 
} from 'react-router-dom';
import { useBrowserStorage } from './BrowserStorageProvider';

// Utility function to check if a value is null or undefined
const isNullOrUndefined = (value: any): boolean => 
  value === null || value === undefined;

// Define authentication-related routes as constants to prevent typos
const AUTH_ROUTES = {
  HOME: '/auth/home',
  CREATE_PASSWORD: '/auth/create-password',
  VERIFY_PASSWORD: '/auth/verify-password',
  IMPORT_ACCOUNT: '/auth/import-account',
  CREATE_ACCOUNT: '/auth/create-account',
  ACCOUNT_HOME: '/account/home'
};


const UnProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { 
    localStorageState, 
    sessionStorageState 
  } = useBrowserStorage(); // Assuming this hook exists

  // Destructure and define clear boolean checks
  const hasEncryptedAccounts = !isNullOrUndefined(localStorageState.encryptedAccounts);
  const hasEncryptionKey = !isNullOrUndefined(sessionStorageState.encryptionKey);
  const currentPath = location.pathname;
  const isAuthenticationRoute = currentPath.startsWith('/auth/');

  if(hasEncryptedAccounts){

    if(hasEncryptionKey){
      if (!isAuthenticationRoute)return children;
      else return <Navigate to={AUTH_ROUTES.ACCOUNT_HOME} state={{ from: location }} replace />;
    }
    else if(!hasEncryptionKey){
      return currentPath !== AUTH_ROUTES.VERIFY_PASSWORD ?   <Navigate to={AUTH_ROUTES.VERIFY_PASSWORD} state={{ from: location }} replace /> : children;
    }
  }
  else if(!hasEncryptedAccounts){
    return currentPath !== AUTH_ROUTES.CREATE_PASSWORD ?   <Navigate to={AUTH_ROUTES.CREATE_PASSWORD} state={{ from: location }} replace /> : children;

    if(hasEncryptionKey){

    }
    else if(!hasEncryptionKey){
      
    }
  }
  // // Routing logic with clear, mutually exclusive conditions
  // if (hasEncryptionKey && hasEncryptedAccounts) {
  //   // If both encryption key and accounts exist, redirect to account home
  //   return currentPath !== AUTH_ROUTES.ACCOUNT_HOME 
  //     ? <Navigate to={AUTH_ROUTES.ACCOUNT_HOME} state={{ from: location }} replace /> 
  //     : <>{children}</>;
  // }

  // // If accounts exist but no encryption key, force verify password
  // if (hasEncryptedAccounts && !hasEncryptionKey) {
  //   return currentPath !== AUTH_ROUTES.VERIFY_PASSWORD 
  //     ? <Navigate to={AUTH_ROUTES.VERIFY_PASSWORD} state={{ from: location }} replace /> 
  //     :   
  // }

  // // If no accounts exist, force create password
  // if (!hasEncryptedAccounts) {
  //   return currentPath !== AUTH_ROUTES.CREATE_PASSWORD 
  //     ? <Navigate to={AUTH_ROUTES.CREATE_PASSWORD} state={{ from: location }} replace /> 
  //     : <>{children}</>;
  // }

  // // Default: render children (current route)
  return <>{children}</>;
};


export default UnProtectedRoute;