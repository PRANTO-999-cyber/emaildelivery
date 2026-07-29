import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector(
    (state) =>
      state.auth?.user || { name: "Admin User", role: "Administrator" },
  );

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-100">
          Email Delivery Platform
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-slate-200">{user.name}</div>
          <div className="text-xs text-slate-400 capitalize">{user.role}</div>
        </div>

        <button
          onClick={() => dispatch(logout?.())}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
