"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "../ui/navbar-menu";
import { cn } from "../../utils/cn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/FavIcon.png";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div className="flex items-center space-x-2 mr-4">
          <img src={logo} alt="ClipConnect" className="h-6 w-6" />
          <span className="text-card-title text-black dark:text-white">ClipConnect</span>
        </div>
        
        <MenuItem setActive={setActive} active={active} item="Dashboard">
          <div className="flex flex-col space-y-4">
            <HoveredLink to="/creator/dashboard">Creator Dashboard</HoveredLink>
            <HoveredLink to="/clipper/dashboard">Clipper Dashboard</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Gigs">
          <div className="flex flex-col space-y-4">
            <HoveredLink to="/gigs">Browse Gigs</HoveredLink>
            <HoveredLink to="/my-gigs">My Gigs</HoveredLink>
            <HoveredLink to="/create-gig">Create Gig</HoveredLink>
          </div>
        </MenuItem>
        
        <MenuItem setActive={setActive} active={active} item="Account">
          <div className="flex flex-col space-y-4">
            <HoveredLink to="/profile">Profile</HoveredLink>
            <HoveredLink to="/settings">Settings</HoveredLink>
            <button
              onClick={handleLogout}
              className="text-body text-left text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
