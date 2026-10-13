import { House, LogOut, Package, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import Brand from "./Brand";

const desktopLinkClass = (active) =>
  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
    active ? "bg-emerald-900 text-white" : "text-gray-200 hover:bg-emerald-900/70 hover:text-white"
  }`;

const mobileLinkClass = (active) =>
  `flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition ${
    active ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"
  }`;

function Sidebar({ user, onLogout }) {
  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || "S";

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#061c19] px-4 py-5 text-white sm:flex">
        <NavLink to="/products" className="mb-10 px-2" aria-label="MyStock home">
          <Brand />
        </NavLink>

        <nav aria-label="Main navigation" className="flex flex-col gap-2">
          <NavLink to="/" end className={({ isActive }) => desktopLinkClass(isActive)}>
            <House size={19} /><span>Home</span>
          </NavLink>
          <NavLink to="/products" end className={({ isActive }) => desktopLinkClass(isActive)}>
            <Package size={19} /><span>Products</span>
          </NavLink>
          <NavLink to="/products/new" end className={({ isActive }) => desktopLinkClass(isActive)}>
            <Plus size={21} /><span>Add product</span>
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-emerald-900 pt-5">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-800 text-sm font-bold" aria-hidden="true">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-200 transition hover:bg-emerald-900/70 hover:text-white">
            <LogOut size={19} /><span>Log out</span>
          </button>
        </div>
      </aside>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 sm:hidden"
      >
        <NavLink to="/" end className={({ isActive }) => mobileLinkClass(isActive)}>
          <House size={20} /><span>Home</span>
        </NavLink>
        <NavLink to="/products" end className={({ isActive }) => mobileLinkClass(isActive)}>
          <Package size={20} /><span>Products</span>
        </NavLink>
        <NavLink to="/products/new" end className={({ isActive }) => mobileLinkClass(isActive)}>
          <Plus size={21} /><span>Add</span>
        </NavLink>
        <button type="button" onClick={onLogout} className={mobileLinkClass(false)}>
          <LogOut size={20} /><span>Log out</span>
        </button>
      </nav>
    </>
  );
}

export default Sidebar;
