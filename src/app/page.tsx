"use client"; // if you're in app/ directory

import { useEffect, useState } from "react";
import Card from "./components/utils/Card";
import { LayoutWithNavbar } from "./components/layout-with-navbar";

export default function Home() {
  const [userArray, setUserArray] = useState<string[]>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/learners/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        console.log("Data fetched:", data);

        const userName = Array.isArray(data)
          ? data.map((item) => item.username)
          : [data.username];

        setUserArray(userName);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    getUser();
  }, []);

  return (
    <LayoutWithNavbar>
      <div className="p-8">
        <div className="flex flex-wrap gap-8 gap-x-10 gap-y-10">
          {userArray.map((id) => (
            <Card
              key={id}
              title={id}
              imageSrc="/avatar.jpeg"
              description="desc"
            />
          ))}
        </div>
      </div>
    </LayoutWithNavbar>
  );
}
