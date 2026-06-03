import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function MainLayout({ kids, setKids }) {
  return (
    <>
      <Navbar kids={kids} setKids={setKids} />
      <Outlet />
    </>
  );
}

export default MainLayout;