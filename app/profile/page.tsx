"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, MapPin, Building2, GraduationCap, ThumbsDown, LogOut } from "lucide-react";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp, db } from "@/lib/firebase";
import Loadingbar from "@/components/ui/loadingbar";

// Define the type for user data and posts
interface UserData {
  username: string;
  email: string;
  location?: string;
  bio?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          console.error("No user document found!");
        }

        // Fetch posts created by the user
        const postsQuery = query(collection(doc(db, "users", user.uid), "posts"));

        const querySnapshot = await getDocs(postsQuery);
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) return "loading";

  return (
    <div className="container mx-auto mt-20 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative">
            <div className="h-32 bg-gradient-to-r from-red-400 to-red-600 rounded-t-lg"></div>
            <div className="p-6">
              <Avatar className="w-32 h-32 border-4 border-background absolute -top-16 left-6" />
              <div className="mt-16">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{userData?.username || "User"}</h1>
                    <p className="text-muted-foreground">{userData?.email}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{userData?.location || "Unknown location"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleOpenModal}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">{userData?.bio || "No bio available"}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Failed Experience
                    </h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-muted-foreground">• Almost Junior Developer - Tech Corp</li>
                      <li className="text-sm text-muted-foreground">• Coffee Spiller - Startup Inc</li>
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Mis-Education
                    </h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-muted-foreground">• Dropped Out - University of Life</li>
                      <li className="text-sm text-muted-foreground">• Failed Online Courses - YouTube University</li>
                    </ul>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Failure Highlights
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {["Missed Deadlines", "Bug Creation", "Meeting Mishaps"].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* User Posts Section */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-3">Your Posts</h3>
                  <div className="space-y-4">
                    {posts.length === 0 ? (
                      <p>No posts yet</p>
                    ) : (
                      posts.map((post) => (
                        <Card key={post.id} className="p-4">
                          <h4 className="font-semibold text-lg">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">{post.content}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-[rgba(0,0,0,0.83)] flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ margin: 0, padding: 0 }}
            >
              <motion.div
                className="bg-background p-6 rounded-lg w-96 shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full p-2 border border-border rounded-lg"
                      defaultValue={userData?.username}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="mt-1 block w-full p-2 border border-border rounded-lg"
                      defaultValue={userData?.bio}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button>Save</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
