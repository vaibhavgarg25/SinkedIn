import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Link2, ThumbsDown, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export function CreatePost() {
  const [flag, setFlag] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [dislikedPosts, setDislikedPosts] = useState<string[]>([]);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, orderBy("timestamp", "desc"));
      const postsSnapshot = await getDocs(postsQuery);
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage("An error occurred while fetching posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    setLoading(true);
    setFlag(false);
    if (postContent.trim()) {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No user is logged in.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: postContent }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze sentiment");
        }

        const data = await response.json();

        if (data.result === "1") {
          setFlag(true);

          const currentUserId = currentUser.uid;
          const postsRef = collection(db, "posts");

          await addDoc(postsRef, {
            content: postContent,
            timestamp: serverTimestamp(),
            userName: currentUser.displayName || "Anonymous",
            userId: currentUserId,
          });

          await fetchPosts();
          toast.success("Your voice shall be heard");
          setPostContent("");
        } else {
          toast.error("ooo nice...how informative");
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

  const handleDislike = (postId: string) => {
    if (dislikedPosts.includes(postId)) {
      setDislikedPosts(dislikedPosts.filter((id) => id !== postId));
    } else {
      setDislikedPosts([...dislikedPosts, postId]);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 top-0 h-[20%] flex items-center justify-center z-50">
          <HashLoader size={50} color="#ffffff" />
        </div>
      )}

      <Card className="p-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt={"User's avatar"}
              className="rounded-full"
            />
          </Avatar>
          <div className="flex-1 w-[50%]">
            <Textarea
              placeholder="Share your latest failure..."
              className="min-h-[100px]"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="justify-between items-center mt-4 md:flex">
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
              <Button size="sm" onClick={handlePostSubmit} disabled={loading} className="my-2">
                Confess
              </Button>
            </div>
          </div>
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </Card>

      <div className="mt-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="p-4 mb-4">
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

            </Card>
          ))
        ) : (
          <div className="flex h-screen justify-center items-center">
            <HashLoader color="white" />
          </div>
        )}
      </div>
    </div>
  );
}
