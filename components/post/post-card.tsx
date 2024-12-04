"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { firebaseApp, db } from "@/lib/firebase"; // Make sure to import your Firestore instance

interface PostCardProps {
  author: string;
  role: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
}

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
}

export function PostCard({ author, role, content, time, likes, comments, shares }: PostCardProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  // Fetch posts from Firestore for the logged-in user (from the general "posts" collection)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Reference to the "posts" collection (not user-specific)
        const postsRef = collection(db, "posts");
        const postsQuery = query(postsRef);
        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          fetchedPosts.push({
            id: doc.id,
            author: postData.author || "Anonymous", // Display author from post data
            role: postData.role || "User", // Default to "User" if role is not defined
            content: postData.content,
            time: postData.time || "Unknown", // Default to "Unknown" if time is missing
            likes: postData.likes || 0, // Fetch likes from Firestore (default to 0)
            comments: postData.comments || 0, // Fetch comments from Firestore (default to 0)
            shares: postData.shares || 0, // Fetch shares from Firestore (default to 0)
          } as Post);
        });

        setUserPosts(fetchedPosts); // Update the state with the fetched posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Fetch posts when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10" />
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>

        <p className="mb-4">{content}</p>

        {/* Displaying posts fetched from Firestore */}
        <div className="mt-6">
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <p>No posts yet</p>
            ) : (
              userPosts.map((post) => (
                <Card key={post.id} className="p-4">
                  <h4 className="font-semibold text-lg">{post.author}</h4>
                  <p className="text-sm text-muted-foreground">{post.content}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>{post.shares}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button variant="ghost" size="sm">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Relate
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Sympathize
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Pain
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
