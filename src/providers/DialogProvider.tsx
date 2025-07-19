// DialogContext.tsx
import React, { createContext, useContext, useState } from "react";

type DialogOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
};

type DialogContextType = {
  confirm: (options: DialogOptions) => Promise<boolean>;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (options: DialogOptions) => {
    setOptions(options);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resolveRef?.(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef?.(true);
  };

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}

      {isOpen && (
        <div className="absolute inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

          {/* Dialog */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] max-h-[200px] bg-white rounded-lg shadow-lg">
            <div className="p-4 bg-card rounded-md">
              <h2 className="text-lg font-semibold mb-2">{options?.title}</h2>
              <p className="text-sm mb-4">{options?.description}</p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleClose}
                  className="px-3 py-2 text-sm rounded-md border"
                >
                  {options?.cancelText || "Cancel"}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-3 py-2 text-sm rounded-md text-white ${
                    options?.variant === "danger"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {options?.confirmText || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
