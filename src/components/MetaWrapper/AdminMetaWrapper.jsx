import { useLocation } from "react-router-dom";
import Meta from "../Meta";

const AdminMetaWrapper = ({ children }) => {
  const location = useLocation();
  // All /admin paths are noIndex
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Meta noIndex={isAdmin} />
      {children}
    </>
  );
};

export default AdminMetaWrapper;
