import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, ChevronDown, LogOut, User, ShieldCheck } from "lucide-react";

import { logout } from "../../redux/slices/authSlice";

export default function Header() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const user = useSelector(
    (state) =>
      state.auth?.user || {
        name: "Admin User",
        role: "Administrator",
        email: "admin@example.com",
      },
  );

  const handleLogout = () => {
    dispatch(logout?.());
  };

  return (
    <header
      className="
sticky
top-0
z-50
flex
h-16
items-center
justify-between
border-b
border-slate-800
bg-slate-950/80
px-6
backdrop-blur-xl
"
    >
      {/* Brand */}

      <div
        className="
flex
items-center
gap-3
"
      >
        <div
          className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
bg-indigo-600
shadow-lg
shadow-indigo-500/20
"
        >
          <ShieldCheck size={22} className="text-white" />
        </div>

        <div>
          <h2
            className="
text-base
font-bold
text-white
"
          >
            Email Delivery Platform
          </h2>

          <p
            className="
hidden
text-xs
text-slate-400
sm:block
"
          >
            Deliverability Control Center
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div
        className="
flex
items-center
gap-4
"
      >
        {/* Notification */}

        <button
          className="
relative
flex
h-9
w-9
items-center
justify-center
rounded-lg
bg-slate-800
text-slate-300
transition
hover:bg-slate-700
hover:text-white
"
        >
          <Bell size={18} />

          <span
            className="
absolute
right-2
top-2
h-2
w-2
rounded-full
bg-emerald-500
"
          />
        </button>

        {/* User */}

        <div
          className="
relative
"
        >
          <button
            onClick={() => setOpen(!open)}
            className="
flex
items-center
gap-3
rounded-xl
px-2
py-1.5
transition
hover:bg-slate-800
"
          >
            <div
              className="
hidden
text-right
sm:block
"
            >
              <p
                className="
text-sm
font-semibold
text-white
"
              >
                {user.name}
              </p>

              <p
                className="
text-xs
capitalize
text-slate-400
"
              >
                {user.role}
              </p>
            </div>

            <div
              className="
flex
h-9
w-9
items-center
justify-center
rounded-full
bg-indigo-500
text-white
font-bold
"
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <ChevronDown
              size={16}
              className="
text-slate-400
"
            />
          </button>

          {/* Dropdown */}

          {open && (
            <div
              className="
absolute
right-0
mt-3
w-56
overflow-hidden
rounded-xl
border
border-slate-700
bg-slate-900
shadow-xl
"
            >
              <div
                className="
border-b
border-slate-800
p-4
"
              >
                <div
                  className="
flex
items-center
gap-2
text-sm
text-slate-200
"
                >
                  <User size={15} />
                  Account
                </div>

                <p
                  className="
mt-1
truncate
text-xs
text-slate-400
"
                >
                  {user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="
flex
w-full
items-center
gap-2
px-4
py-3
text-sm
font-medium
text-red-400
transition
hover:bg-slate-800
"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
