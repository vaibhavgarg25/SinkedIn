"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { HashLoader } from "react-spinners";

type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string; // Optional field for avatar
};

export default function NetworkPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const defaultAvatar = "/default-avatar.png"; // Path to your placeholder avatar image

  useEffect(() => {
    const fetchUsers = async () => {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(userList);
        setFilteredUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <HashLoader color="white" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Network</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by username or email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/networkpost/${user.id}`)} // Navigate to user posts
            >
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.username}'s avatar`}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                      <span className="text-gray-600 text-lg font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Avatar>
                <h2 className="text-lg font-semibold">
                  {user.username || "Anonymous"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user.email || "No email available"}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No users match your search query.
        </p>
      )}
    </div>
  );
}
