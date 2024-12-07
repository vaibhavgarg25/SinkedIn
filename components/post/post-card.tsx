"use client";
import { Avatar } from "@radix-ui/react-avatar";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PostCardProps {
  author: string;
  role: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  time: string;
}

export function PostCard({ author, role, content, time }: PostCardProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const postsQuery = query(postsRef);
        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          fetchedPosts.push({
            id: doc.id,
            author: postData.author || "Anonymous",
            role: postData.role || "User",
            content: postData.content,
            time: postData.time || "Unknown",
          } as Post);
        });

        setUserPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-lg mx-auto my-6"
    >
      <Card className="p-4 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt={"User's avatar"}
            className="rounded-full"
          />
          </Avatar>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>
  
        {/* Content */}
        <div className="flex-1">
          <div className="mb-4">
            <p className="font-bold text-xl text-gray-800">{author}</p>
            <p className="text-sm text-gray-500">{role}</p>
            <p className="text-xs text-gray-400">{time}</p>
          </div>
  
          <p className="text-gray-700 mb-6 leading-relaxed">{content}</p>
  
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ThumbsDown className="h-5 w-5" />
              <span className="text-sm">Relate</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">Sympathize</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share Pain</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
  }
