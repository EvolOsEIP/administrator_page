'use client';
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Dashboard() {
  const { register, handleSubmit, reset } = useForm();
  const [fileName, setFileName] = useState("Aucun fichier sélectionné");

const onSubmit = async (data: any) => {
  const files = data.images instanceof FileList ? Array.from(data.images) : [];

  const newCourse = {
    title: data.nomCours,
    stepId: Date.now(),
    instructions: data.consignes,
    widgets: {
      actions: [
        {
          type: "input_text",
          description: " ",
          expected_value: data.reponsesAttendues,
        },
      ],
      instructions: files.map((file) => ({
        type: "image",
        description: " ",
        data: URL.createObjectURL(file),
      })),
    },
  };

  try {
    const response = await fetch("/courses_pages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    });

    if (response.ok) {
      alert("Cours ajouté avec succès !");
      reset();
      setFileName("Aucun fichier sélectionné");
    } else {
      alert("Erreur lors de l'ajout du cours");
    }
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur de connexion");
  }
};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(Array.from(event.target.files).map(file => file.name).join(", "));
    } else {
      setFileName("Aucun fichier sélectionné");
    }
  };

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Dashboard</h1>
        <ul>
          <li className="p-2 bg-gray-700 rounded mb-2">Button 1</li>
          <li className="p-2 bg-gray-700 rounded mb-2">Button 2</li>
          <li className="p-2 bg-gray-700 rounded">Button 3</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un cours</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("nomCours")} placeholder="Nom du cours" className="border p-2 w-full text-black" />
          <textarea {...register("description")} placeholder="Description du cours" className="border p-2 w-full text-black" />
          <select {...register("module")} className="border p-2 w-full text-black">
            <option value="Module 1">Module 1</option>
            <option value="Module 2">Module 2</option>
            <option value="Module 3">Module 3</option>
          </select>
          <input type="number" {...register("nombreExercices", { min: 0, max: 10 })} placeholder="Nombre d'exercices (0-10)" className="border p-2 w-full text-black" />
          <textarea {...register("consignes")} placeholder="Consignes des exercices" className="border p-2 w-full text-black" />
          
          {/* Custom File Input */}
          <div className="border p-2 w-full flex items-center justify-between bg-white text-black">
            <span>{fileName}</span>
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Sélectionner des fichiers
              <input type="file" {...register("images")} multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          
          <textarea {...register("reponsesAttendues")} placeholder="Réponses attendues des exercices" className="border p-2 w-full text-black" />
          <textarea {...register("messageFin")} placeholder="Message à afficher à la fin du cours" className="border p-2 w-full text-black" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Soumettre</button>
        </form>
      </main>
    </div>
  );
}
