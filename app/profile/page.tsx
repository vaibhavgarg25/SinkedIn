"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, MapPin, Building2, GraduationCap, ThumbsDown, LogOut } from "lucide-react";
import { getFirestore, doc, getDoc, collection, query, where, getDocs ,updateDoc} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp, db } from "@/lib/firebase";
import { HashLoader } from "react-spinners";
import {toast} from "react-toastify"
interface UserData {
  username: string;
  email: string;
  location?: string;
  bio?: string;
  profilepic?:string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  userId:string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
 const [edit,setedit]=useState({bio:"",name:"",location:"",profilepic:""})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
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
        return;
      }
    
      const postsCollection = collection(db, "posts"); 
      const postsQuery = query(postsCollection); 
    
      const querySnapshot = await getDocs(postsQuery); 
      const fetchedPosts: Post[] = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">), 
      }))
      .filter((post) => post.userId === user.uid); 
    
    
      if (fetchedPosts.length === 0) {
        console.log("No posts found for this user.");
      }
    
      setPosts(fetchedPosts); 
    } catch (error) {
      console.error("Error fetching user data or posts:", error);
    } finally {
      setLoading(false);
    }
  }
    
  useEffect(() => {
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

  const handleedit=(e:any)=>{
    e.preventDefault();
    let name = e.target.id;
    console.log(name)
    let value = e.target.value;
    setedit({
      ...edit,
      [name]: value,
    });
  }

  const handlechange = async (e: any) => {
    e.preventDefault();
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;
  
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }
  
    try {
      const userDoc = doc(db, "users", user.uid);
      const updates: Partial<UserData> = {};
      if (edit.name && edit.name !== userData?.username) {
        updates.username = edit.name;
      }
      if (edit.bio && edit.bio !== userData?.bio) {
        updates.bio = edit.bio;
      }
      if (edit.location && edit.location !== userData?.location) {
        updates.location = edit.location;
      }
      if (edit.profilepic && edit.profilepic !== userData?.profilepic) {
        updates.profilepic = edit.profilepic;
      }
      if (Object.keys(updates).length > 0) {
        await updateDoc(userDoc, updates);
        toast.info("Profile successfully updated!");
        setLoading(true)
        setIsModalOpen(false); 
        await fetchUserData()
      } else {
        toast.info("No changes detected, nothing to update.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  


  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="white"/>
    </div>
  );

  return (
    <div className="container mx-auto mt-0 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative">
            <div className="h-32 bg-gradient-to-r from-red-400 to-red-600 rounded-t-lg"></div>
            <div className="p-6">
              <Avatar className="w-32 h-32 mt-[10%] border-4 border-background absolute -top-16 left-6">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt={"User's avatar"}
                className="rounded-full"
              />
              </Avatar>
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
                      onChange={handleedit}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      className="mt-1 block w-full p-2 border border-border rounded-lg"
                      defaultValue={userData?.location}
                      onChange={handleedit}
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
                      onChange={handleedit}
                    />
                    <div className="mb-4">
                    <label htmlFor="profilepic" className="block text-sm font-medium text-gray-700">
                      Profile Pic
                    </label>
                    <input
                      id="profilepic"
                      type="document"
                      className="mt-1 block w-full p-2 border border-border rounded-lg"
                      defaultValue={userData?.profilepic}
                      onChange={handleedit}
                    />
                  </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button onClick={handlechange}>Save</Button>
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
