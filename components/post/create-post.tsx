"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase"; // Import Firestore and Auth instances
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"; // Firestore functions

export function CreatePost() {
  const [flag, setFlag] = useState(false);
  const [postContent, setPostContent] = useState(""); // State for post content
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState<any[]>([]); // State to store posts from the database

  // Fetch posts from Firestore when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts"); // Reference to the posts collection
        const postsSnapshot = await getDocs(postsRef);
        const postsList = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList); // Update state with the fetched posts
      } catch (error) {
        console.error("Error fetching posts:", error);
        setErrorMessage("An error occurred while fetching posts.");
      }
    };

    fetchPosts(); // Call the function to fetch posts
  }, []);

  const handlePostSubmit = async () => {
    setLoading(true);
    setFlag(false); // Reset flag before submission

    if (postContent.trim()) {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No user is logged in.");
          setLoading(false);
          return;
        }

        // Make the sentiment analysis request to the backend
        const response = await fetch('http://localhost:8000/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post: postContent }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze sentiment');
        }

        const data = await response.json();
        console.log(data);

        if (data.trim() === '1') {
          setFlag(true);
        } else {
          setFlag(false);
        }

        if (flag) {
          const currentUserId = currentUser.uid;
          const postsRef = collection(db, "posts"); // General posts collection reference

          // Add the post to the general posts collection
          await addDoc(postsRef, {
            content: postContent,
            timestamp: serverTimestamp(),
            userName: currentUser.displayName || "Anonymous",
            userId: currentUserId, // Store the userId for general reference
          });

          setPostContent(""); // Clear input field
        }
      } catch (error) {
        console.error("Error processing post:", error);
        setErrorMessage("An error occurred while posting.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Post content is empty.");
      setLoading(false);
    }
  };

  return (
    <div>
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
              <Button size="sm" onClick={handlePostSubmit} disabled={loading}>
                Confess
              </Button>
            </div>
          </div>
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </Card>

      {/* Display the fetched posts */}
      <div className="mt-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="p-4 mb-4">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10" />
                <div className="flex-1">
                  <p className="font-bold">{post.userName}</p>
                  <p className="text-sm text-gray-600">{new Date(post.timestamp?.seconds * 1000).toLocaleString()}</p>
                  <p className="mt-2">{post.content}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
}
