import { Outlet } from 'react-router';
import Sidebar from "../components/Sidebar";
export default function RootLayout() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}
