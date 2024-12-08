import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, MessageCircle, Image } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function PostCard({ post, dislikedPosts, handleDislike }: any) {
  return (
    <div className="p-4 mb-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt={"User's avatar"}
            className="rounded-full"
          />
        </Avatar>
        <div className="flex-1">
          <p className="font-bold">{post.userName}</p>
          <p className="text-sm text-gray-600">
            {new Date(post.timestamp?.seconds * 1000).toLocaleString()}
          </p>
          <p className="mt-2">{post.content}</p>
        </div>
      </div>

      <hr className="my-4 border-secondary" /> {/* Divider line */}

      <div className="flex justify-around text-sm text-gray-500">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDislike(post.id)}
            className="flex items-center gap-2"
          >
            <ThumbsDown
              className={`h-4 w-4 ${
                dislikedPosts.includes(post.id)
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            />
            Dislike
          </Button>
        </motion.div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => console.log(`Commented on post with ID: ${post.id}`)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Share
        </Button>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="User Avatar"
              className="rounded-full"
            />
          </Avatar>
          <Textarea
            placeholder="Write a comment..."
            className="flex-1 min-h-[40px] resize-none text-sm"
          />
          <Button size="sm" className="ml-2">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
