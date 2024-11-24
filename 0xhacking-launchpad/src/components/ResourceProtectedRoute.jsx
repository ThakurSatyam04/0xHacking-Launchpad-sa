import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ResourceLayout from "./ResourceLayout";

const ResourceProtectedRoute = () => {
  const navigate = useNavigate();

//   useEffect(() => {
//     async function authenticationCheck() {
//       try {
//   const isAuthenticated = await axios.get("/api/user/login-validate", { withCredentials: true });
  
//         if (!isAuthenticated && !isAuthenticated.status === 200) {
//           navigate("/login", { replace: true });
//         }
//       } catch (error) {
//         navigate("/login", { replace: true });
//         console.log("Not authenticated, staying on login page");
//       }
//     }
//     authenticationCheck();
//   },[navigate]); 


  return (
    <ResourceLayout>
      <Outlet />
    </ResourceLayout>
  );
};

export default ResourceProtectedRoute;
