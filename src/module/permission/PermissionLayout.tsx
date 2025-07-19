import { Spinner } from '@/components/ui/spinner';
import { useAccounts } from '@/providers/AccountProvider';
import { useBrowserStorage } from '@/providers/BrowserStorageProvider';
import React from 'react'
import { Outlet } from 'react-router-dom';

export default function PermissionLayout() {
  const { localStorageState } = useBrowserStorage();
  const { activeAccount } = localStorageState;

    
    return (
      <>
        {!activeAccount  ? (
          <div className="flex w-full h-full justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <Outlet/>
        )}
      </>
    );
}
