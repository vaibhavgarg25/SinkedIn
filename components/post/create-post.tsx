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
  const [flag, setFlag] = useState(false)
  const [post, setPost] = useState('');
  const [isSad, setIsSad] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
    const [val, setVal] = useState<string>("")
  const [postContent, setPostContent] = useState(""); // State for post content
  // const [userId, setUserId] = useState<string>("userId"); // Set userId (replace with actual user ID)

  const handlePostSubmit = async () => {
    setLoading(true);
    setIsSad(null); // Reset sad state
    
    if (postContent.trim()) {
      try {
        const currentUser = auth.currentUser;
  
        if (!currentUser) {
          console.error("No user is logged in.");
          setLoading(false);
          return;
        }
  
        // const userId = currentUser.uid; 
  
        const response = await fetch('http://localhost:8000/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post: postContent }), // Ensure the correct data is sent
        });
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to analyze sentiment');
        }
        
        let data = await response.json();
        console.log(data)
        console.log(typeof(data))
        if (data.trim() === '0') {
          setFlag(false);
        } else if (data.trim() === '1') {
          setFlag(true);
        } else {
          setFlag(false);
          console.log("bak")
        }
  
        console.log("Flag value:", flag);
  
        if (flag) {
          const postsRef = collection(doc(db, "users", currentUser.uid), "posts");
  
          await addDoc(postsRef, {
            content: postContent,
            timestamp: serverTimestamp(),
            userName: currentUser.displayName || "Anonymous",
          });
          setFlag(!flag)
          setPostContent(""); // Clear input field
        }
        else{
          alert("Happy post not Allowed")
        }
        
        console.log("Current User:", currentUser);
      } catch (error) {
        console.error("Error processing post:", error);
      } finally { 
        setLoading(false);
      }
    } else {
      console.error("Post content is empty.");
      setLoading(false);
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
