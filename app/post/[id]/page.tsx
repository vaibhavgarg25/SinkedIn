"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { HashLoader } from "react-spinners";

const PostPage = () => {
  const { id } = useParams(); // Correct way to get dynamic route params in App Router
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, "posts", id as string);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          setPost(postDoc.data());
        } else {
          console.error("Post not found");
          router.push("/404"); // Redirect to a 404 page if post not found
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <HashLoader size={50} color="#ffffff" />
      </div>
    );
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="p-4">
      <Card className="p-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <Image
              src={
                post.userProfilePic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              height={100}
              width={100}
              alt={`${post.userName || "Anonymous"}'s avatar`}
              className="rounded-full"
            />
          </Avatar>
          <div className="flex-1">
            <p className="font-bold">{post.userName || "Anonymous"}</p>
            <p className="text-sm text-gray-600">
              {post.timestamp
                ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                : "No timestamp available"}
            </p>
            <p className="mt-2">{post.content}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostPage;
