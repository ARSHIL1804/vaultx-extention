import React from "react";
import { Spinner } from "./ui/spinner";

export default function LoadingScreen() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner size="P" className="w-full overflow-hidden" />;
    </div>
  );
}
