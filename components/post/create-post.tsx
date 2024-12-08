import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link2, ThumbsDown, MessageCircle } from "lucide-react";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
type User = {
  id: string;
  username: string;
  email: string;
  profilepic?: string; 
};

export function CreatePost() {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const router =useRouter()
  const [dislikedPosts, setDislikedPosts] = useState<string[]>([]);
  const [commentBoxStates, setCommentBoxStates] = useState<{ [key: string]: boolean }>({});
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

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
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersMap: Record<string, User> = {};
      usersSnapshot.forEach((doc) => {
        usersMap[doc.id] = { id: doc.id, ...doc.data() } as User;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchCurrentUserProfile = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      const userDoc = await getDocs(collection(db, "users"));
      const userData = userDoc.docs.find((doc) => doc.id === currentUser.uid)?.data();

      if (userData && userData.profilepic) {
        setCurrentUserProfilePic(userData.profilepic);
      } else {
        setCurrentUserProfilePic(
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        );
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setCurrentUserProfilePic(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      );
    }
  }, [router]);
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPosts(),    fetchCurrentUserProfile(),      fetchUsers()]).finally(() => setLoading(false));
  }, [fetchCurrentUserProfile]);
  const handlePostComment = async (postId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User not logged in.");
      return;
    }
  
    const commentText = commentInputs[postId];
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
  
    try {
      const postRef = doc(db, "posts", postId);
  
      // Get the current comments from the document
      const postSnapshot = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
      const postDoc = postSnapshot.docs.find((doc) => doc.id === postId);
  
      const postComments = postDoc?.data()?.comments || [];
  
      // Manually create the timestamp (client-side)
      const newComment = {
        userId: currentUser.uid,
        text: commentText,
        timestamp: Date.now(),
      };
  
      await updateDoc(postRef, {
        comments: [...postComments, newComment],
      });
  
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
  
      toast.success("Comment posted successfully.");
    } catch (error) {
      console.error("Posting Comment Error:", error);
      toast.error("Failed to post comment.");
    }
  };
  
  
  const handlePostSubmit = async () => {
    setLoading(true);
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

  const toggleCommentBox = (postId: string) => {
    setCommentBoxStates((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
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
            <Image
            loading="lazy"
              src={currentUserProfilePic || ""}
              width={100}
              height={100}
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
          posts.map((post) => {
            const user = users[post.userId];
            const profilePic = user?.profilepic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
            return (
            <Card key={post.id} className="p-4 mb-4">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <Image
                      src={profilePic}
                      height={100}
                      width={100}
                      alt={`${user?.username || "Anonymous"}'s avatar`}
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
                    onClick={() => toggleCommentBox(post.id)}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="items-center gap-2">
                    {/* <Image className="h-4 w-4" /> */}
                    Share
                  </Button>
                
              </div>
              <hr className="my-4 border-secondary" /> {/* Divider line */}

              {commentBoxStates[post.id] && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <Image
                        src={currentUserProfilePic || ""}
                        height={100}
                        width={100}
                        alt="User Avatar"
                        className="rounded-full"
                      />
                    </Avatar>
                    <Textarea
                      placeholder="Write a comment..."
                      className="flex-1 min-h-[40px] resize-none text-sm"
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                    />
                    <Button size="sm" className="ml-2" onClick={() => handlePostComment(post.id)}>
                      Post
                    </Button>
                  </div>
                </div>
              )}
              <hr className="my-4 border-secondary" /> {/* Divider line */}
              {post.comments && post.comments.length > 0 && (
          <div className="mt-4">
            {post.comments.map((comment:any, index:any) => (
              <div key={index} className="flex items-center gap-2 mt-2 p-2 rounded-md bg-gray-100 dark:bg-slate-300 dark:text-black">
                <Avatar className="w-8 h-8">
                  <Image
                    src={users[comment.userId]?.profilepic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                    width={100}
                    height={100}
                    alt="Commenter's Avatar"
                    className="rounded-full"
                  />
                </Avatar>
                <div>
                  <p className="font-bold text-sm">{users[comment.userId]?.username || "Anonymous"}</p>
                  <p>{comment.text}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
            </Card>)
})
        ) : (
          <div className="flex h-screen justify-center items-center">
            <HashLoader color="white" />
          </div>
        )}
      </div>
    </div>
  );
}
