"use client"; // if you're in app/ directory

import { useEffect, useState } from "react";
import Card from "../components/utils/Card";
import { LayoutWithNavbar } from "../components/layout-with-navbar";

// add a new component with a form by the name
const Modal = ({name, id}: { name?: string | null, id?: number | null }) => {
  const addUser = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/learners/me/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          unlink: false,
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log("User added:", data);
    } catch (error) {
      console.error("Add user failed:", error);
    }
  }
  console.log("Modal rendered with name:", name, "and id:", id);
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4 text-black">Ajouter {name} ?</h2>
      <p className="mb-4 text-black">Voulez-vous vraiment ajouter cet utilisateur ?</p>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => window.location.reload()}
        >
          Annuler
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            if (id !== null && id !== undefined) {
              addUser(id)
              window.location.reload();
            } else {
              console.error("User ID is null, cannot add user.");
            }
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}


export default function Home() {
  const [userArray, setUserArray] = useState<string[]>([]);
  const [userIdArray, setUserIdArray] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUser] = useState<number | null>(null);


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/learners/available`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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


        setUserArray(userName);
        setUserIdArray(userId);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <LayoutWithNavbar>
        <div className="p-8">
          <div className="flex flex-wrap gap-8 gap-x-10 gap-y-10">

            {userArray.map((username, index) => (
              userIdArray[index] !== undefined && (
                <Card
                  key={index}
                  title={username ?? "Unknown User"}
                  imageSrc="/avatar.jpeg"
                  description="desc"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedUserName(username);
                    setSelectedUser(userIdArray[index]);
                  }}
                  canBeDeleted={false}
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
    </div>
  );
}
