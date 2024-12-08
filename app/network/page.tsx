"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
type User = {
  id: string;
  username: string;
  email: string;
  profilepic?: string; 
};

export default function NetworkPage() {
  const [users, setUsers] = useState<User[]>([]); // Explicitly typing the state
  const router =useRouter()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    const fetchUsers = async () => {
      const auth = getAuth(firebaseApp)
    const user = auth.currentUser
    if(!user){
      router.push("/login");
      return
    } 
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]; 
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <HashLoader color="white"/>
    </div>
  );
  const defaultAvatar = "/default-avatar.png"; // Path to your default avatar image

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Network</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                <Image
                    src={`${user?.profilepic||"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}`}
                    height={100} 
                    width={100}
                    loading="lazy"
                    alt={`${user?.username || "User"}'s avatar`}
                    className="rounded-full"
                  />

                </Avatar>
                <h2 className="text-lg font-semibold">{user.username || "Anonymous"}</h2>
                <p className="text-sm text-muted-foreground">{user.email || "No email available"}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
