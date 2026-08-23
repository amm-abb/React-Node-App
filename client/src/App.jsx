import { NavLink, Routes, Route } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
} from "lucide-react";

import Overview from "./pages/Overview";
import Customers from "./pages/Customers";
import Products from "./pages/Products";

import "./App.css";

const menuItems = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">A</div>
        <span>AA</span>
      </div>

      <nav className="nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </div>
  );
}