import { Outlet } from 'react-router';
import Sidebar from "../components/Navbar/Sidebar";
export default function RootLayout() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}
