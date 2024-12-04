"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Use the correct import for your firestore instance

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

export function PostCard({
  author,
  role,
  content,
  time,
  likes,
  comments,
  shares,
}: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10" />
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>

        <p className="mb-4">{content}</p>

        {/* Post interactions */}
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>{shares}</span>
          </div>
        </div>

        {/* Interaction buttons */}
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
