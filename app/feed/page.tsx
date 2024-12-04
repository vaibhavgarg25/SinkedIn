"use client";

import { CreatePost } from "@/components/post/create-post";
import { PostCard } from "@/components/post/post-card";
import { LeftSidebar } from "@/components/sidebar/leftsidebar";
import { RightSidebar } from "@/components/sidebar/rightsidebar";

export default function Feed() {
  const samplePosts = [
    
     
  ];

  return (
    <div className="container max-h-screen mx-auto px-4 py-8">
      <div className="lg:block">
          <LeftSidebar />
        </div>
        
        <main className="flex-1 ml-96 h-screen overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide max-w-2xl no-scrollbar">
        <CreatePost />
        
        </main>
        
        <div className="lg:block">
          <RightSidebar />
        </div>
    </div>
  );
}