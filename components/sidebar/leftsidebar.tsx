import React, { useState } from "react";
import Link from "next/link";
import { Users, Briefcase, BookOpen } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";

export function LeftSidebar() {
  const [user, setUser] = useState({
    name: "John Doe",
    bio: "Sharing failures to achieve success 🚀",
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  });

  return (
    <div className="hidden w-80 absolute left-0 top-16 h-screen bg-background border-r border-border p-4 transition-colors md:block">
      <div className="space-y-6">
      <div className="p-4 rounded-lg border border-border bg-card shadow-md text-center">
        <Avatar className="w-16 h-16 mx-auto mb-4">
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="rounded-full"
          />
        </Avatar>
        <h3 className="font-semibold text-lg text-primary">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.bio}</p>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={() => alert("Profile Edit Modal")}
        >
          Edit Profile
        </Button>
      </div>


        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            href="/network"
            className={buttonVariants({
              variant: "ghost",
              className: "flex items-center w-full p-3",
            })}
          >
            <Users className="h-5 w-5 mr-3" />
            <span>Network</span>
          </Link>
          <Link
            href="/jobs"
            className={buttonVariants({
              variant: "ghost",
              className: "flex items-center w-full p-3",
            })}
          >
            <Briefcase className="h-5 w-5 mr-3" />
            <span>Failed Jobs</span>
          </Link>
          <Link
            href="/learning"
            className={buttonVariants({
              variant: "ghost",
              className: "flex items-center w-full p-3",
            })}
          >
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Learning</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
