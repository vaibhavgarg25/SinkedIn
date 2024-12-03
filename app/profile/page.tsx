"use client";
import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Pencil, MapPin, Building2, GraduationCap, ThumbsDown } from "lucide-react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { firebaseApp, db } from "@/lib/firebase"; // Correctly import firebaseApp and db

// Define the type for the user data
interface UserData {
  username: string;
  email: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(firebaseApp); // Get the authentication instance
        const user = auth.currentUser; // Get the currently authenticated user

        if (user) {
          const userDoc = doc(db, "users", user.uid); // Use user's UID from Firebase Auth
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            console.log("Fetched data:", data);
            setUserData(data);
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                    <h1 className="text-2xl font-bold">
                      {userData?.username || "Loading..."}
                    </h1>
                    <p className="text-muted-foreground">
                      {userData?.email || "Loading..."}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Parents' Basement, Somewhere</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Failures
                  </Button>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    Professional failure enthusiast. Expert at missing deadlines and
                    making things awkward in meetings. Proud holder of 0 achievements
                    and countless rejections.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Failed Experience
                    </h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-muted-foreground">
                        • Almost Junior Developer (Rejected) - Tech Corp
                      </li>
                      <li className="text-sm text-muted-foreground">
                        • Coffee Spiller (Fired) - Startup Inc
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Mis-Education
                    </h3>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-muted-foreground">
                        • Dropped Out - University of Life
                      </li>
                      <li className="text-sm text-muted-foreground">
                        • Failed Online Courses - YouTube University
                      </li>
                    </ul>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Failure Highlights
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {["Missed Deadlines", "Bug Creation", "Meeting Mishaps", 
                      "Failed Interviews", "Awkward Small Talk", "Code Disasters"]
                      .map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-muted rounded-full text-sm">
                          {skill}
                        </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
