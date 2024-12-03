"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Link2 } from "lucide-react";
import { useState } from "react";
import { db, auth } from "@/lib/firebase"; // Import Firestore and Auth instances
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore"; // Firestore functions

export function CreatePost() {
  const [postContent, setPostContent] = useState(""); 
  const [userId, setUserId] = useState<string>("userId");

  // Function to handle post submission
  const handlePostSubmit = async () => {
    if (postContent.trim()) {
      try {
        // Check if the user is authenticated
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid; // Get the authenticated user's UID

          // Reference to the user's posts subcollection in Firestore
          const postsRef = collection(doc(db, "users", userId), "posts");

          // Add the new post to the user's posts subcollection
          await addDoc(postsRef, {
            content: postContent,
            timestamp: serverTimestamp(), // Automatically set timestamp
            userName: currentUser.displayName || "Anonymous", // Get the user's name or use "Anonymous"
          });

          // Clear the content after posting
          setPostContent("");
        } else {
          console.log("No user is logged in.");
        }
      } catch (error) {
        console.error("Error adding post:", error);
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10" />
        <div className="flex-1">
          <Textarea
            placeholder="Share your latest failure..."
            className="min-h-[100px]"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)} // Update post content
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Image className="h-4 w-4 mr-2" />
                Add Proof
              </Button>
              <Button variant="outline" size="sm">
                <Link2 className="h-4 w-4 mr-2" />
                Rejection Letter
              </Button>
            </div>
            <Button size="sm" onClick={handlePostSubmit}>
              Confess
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
