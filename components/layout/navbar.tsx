"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Bell, User, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase"; // Ensure this is correctly set up

export function Navbar() {
  const [loggedin, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth(firebaseApp); // Get the Firebase Auth instance
    const user = auth.currentUser; // Check if there's a logged-in user

    if (user) {
      setIsLoggedIn(true); // Set the state to true if the user is logged in
    } else {
      setIsLoggedIn(false); // Set the state to false if no user is logged in
    }
  }, []); // Empty dependency array so this runs only once when the component mounts

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 justify-between mx-auto items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold">SinkedIn</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            <Link href={loggedin?"/feed":"/"}>
              <Button variant="ghost" size="icon" title="Feed">
                <Home className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            <Link href={loggedin?"/messages":"/"}>
              <Button variant="ghost" size="icon" title="Messages">
                <MessageSquare className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            <Link href={loggedin?"/notifications":"/"}>
              <Button variant="ghost" size="icon" title="Notifications">
                <Bell className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            <ThemeToggle />
            <Link href={loggedin ? "/profile" : "/login"}>
              {loggedin ? (
                <Button variant="ghost" size="icon" title="Profile">
                  <User className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              ) : (
                <Button size="sm">Login</Button>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
