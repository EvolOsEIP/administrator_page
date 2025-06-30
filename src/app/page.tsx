"use client"; // if you're in app/ directory

import { useEffect, useState } from "react";
import Card from "./components/utils/Card";
import { LayoutWithNavbar } from "./components/layout-with-navbar";
import RequireAuth from "./components/utils/RequireAuth";

const Modal = ({name, id}: { name?: string | null, id?: number | null }) => {
  console.log("Modal rendered with name:", name, "and id:", id);
  const delUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/learners/me/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use localStorage to get the token
        },
        body: JSON.stringify({
          unlink: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4 text-black">Supprimer {name}?</h2>
      <p className="mb-4 text-black">Voulez-vous vraiment supprimer cet utilisateur ?</p>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => window.location.reload()}
        >
          Annuler
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            delUser().then(() => {
              window.location.reload();
            }).catch((error) => {
              console.error("Error deleting user:", error);
            });
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [Name, setUserArrayName] = useState<string[]>([]);
  const [Id, setUserArrayId] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/learners/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use localStorage to get the token
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

        const userId = Array.isArray(data)
          ? data.map((item) => item.userid)
          : [data.userid];

        setUserArrayName(userName);
        setUserArrayId(userId);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    getUser();
  }, []);

return (
  <>
  <RequireAuth />
  <div>
    {(
      <>
        <LayoutWithNavbar>
          <div className="p-8">
            <div className="flex flex-wrap gap-8 gap-x-10 gap-y-10">
              {Name.map((username, index) => (
                Id[index] !== undefined && (
                  <Card
                    key={index}
                    title={username}
                    imageSrc="/avatar.jpeg"
                    description="desc"
                    onDelete={() => {
                      setIsModalOpen(true);
                      setSelectedUserName(username);
                      setSelectedUserId(Id[index]);
                    }}
                    canBeDeleted={true}
                  />
                )
              ))}
            </div>
          </div>
        </LayoutWithNavbar>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            {/* Modal with name and id */}
            <Modal name={selectedUserName ?? ""} id={selectedUserId} />
          </div>
        )}
      </>
    )}
  </div>
  </>
);
}
