// import React from 'react';
// import { Outlet } from 'react-router-dom'; // Outlet is used to render the child routes

// const Auth: React.FC = () => {
//   return (
//     <div className="px-2 w-full h-full">
//       <Outlet />
//     </div>
//   );
// };

// export default Auth;

import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the path if needed
import { Outlet, useNavigate } from "react-router-dom";


export default function Auth() {

  const navigate = useNavigate();

  return (
    <div className="px-2 w-full h-full">
      <Outlet />
    </div>
  );
}
