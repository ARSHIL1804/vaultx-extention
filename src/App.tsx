import React from "react";
import logo from "./logo.svg";
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import Auth from "./module/auth/Auth";
import CreatePassword from "./module/auth/components/CreatePassword";
import AuthProvider from "./providers/AuthProvider";
import VerifyPassword from "./module/auth/components/VerifyPassword";
import ImportAccount from "./module/account/components/ImportAccount";
import SettingsHome from "./module/settings/SettingsHome";
import GeneralSettings from "./module/settings/components/GeneralSettings";
import ManageAccounts from "./module/settings/components/AccountsSettings";
import AccountsSettings from "./module/settings/components/AccountsSettings";
import NetworkSettings from "./module/settings/components/NetworkSetting";
import AuthHome from "./module/account/components/NewAccountHome";
import CreateAccount from "./module/account/components/CreateAccount";
import AccountHome from "./module/account/components/AccountHome";
import AccountAddress from "./module/account/components/AccountAddress";
import AccountLayout from "./module/account/AccountLayout";
import AccountTransfer from "./module/account/components/AccountTransfer";
import AccountConfirmTransfer from "./module/account/components/AccountConfirmTransfer";
import PermissionLayout from "./module/permission/PermissionLayout";
import ConnectDapp from "./module/permission/components/ConnectDapp";
import BrowserStorageProvider from "./providers/BrowserStorageProvider";
import ProtectedRoute from "./providers/ProtectedRoute";
import NewAccountHome from "./module/account/components/NewAccountHome";
import LoadingScreen from "./components/LoadingScreen";
import AccountCallContract from "./module/account/components/AccountCallContract";
import SettingLayout from "./module/settings/SettingLayout";
import AccountSignMessage from "./module/account/components/AccountSignMessage";

function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <BrowserStorageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/account/home" replace />} />

            <Route path="auth" element={<Auth />}>
              <Route path="create-password" element={<CreatePassword />} />
              <Route path="verify-password" element={<VerifyPassword />} />
            </Route>

            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<AccountHome />} />
              <Route path="address-listing" element={<AccountAddress />} />
              <Route path="transfer" element={<AccountTransfer />} />
              <Route
                path="confirm-transfer"
                element={<AccountConfirmTransfer />}
              />
              <Route path="add-new" element={<NewAccountHome />} />
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="import-account" element={<ImportAccount />} />
              <Route path="call-contract" element={<AccountCallContract />} />
              <Route path="sign-message" element={<AccountSignMessage />} />

            </Route>

            <Route
              path="permission"
              element={
                <ProtectedRoute>
                  <PermissionLayout />
                </ProtectedRoute>
              }
            >
              <Route path="connect-dapp" element={<ConnectDapp />} />
            </Route>

            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <SettingLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<SettingsHome/>}/>
              <Route path="general" element={<GeneralSettings />} />
              <Route path="accounts" element={<AccountsSettings />} />
              <Route path="network" element={<NetworkSettings />} />
            </Route>

            <Route path="/loading" element={<LoadingScreen />} />
          </Routes>
        </AuthProvider>
      </BrowserStorageProvider>
    </BrowserRouter>
  );
}
function App() {
  return (
    <div className="w-[380px] h-[600px] bg-gradient-to-b from-indigo-950 to-slate-900 b-2 relative">
      <AppRouter />
    </div>
  );
}
export default App;
