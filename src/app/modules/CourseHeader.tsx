
import React from 'react';

import RequireAuth from '../components/utils/RequireAuth';
interface CourseHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  //module?: string; // Uncomment if module is needed
  //setModule?: (module: string) => void; // Uncomment if module is needed
  duration: number;
  setDuration: (duration: number) => void;
}

const CourseHeader = ({
  title,
  setTitle,
  description,
  setDescription,
 // module,
  //setModule,
  duration,
  setDuration
}: CourseHeaderProps) => {
  return (
    <>
      <RequireAuth/>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Titre du cours</label>
        <input
          type="text"
          id="title"
          placeholder="ex: Les caractères spéciaux"
          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description du cours</label>
        <input
          type="text"
          id="description"
          placeholder="ex: Apprendre à utiliser les caractères spéciaux"
          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="duration" className="block text-gray-700 font-medium mb-1">Temps estimé</label>
        <div className="flex">
          <input
            type="number"
            id="duration"
            className="w-20 p-2 rounded bg-gray-600 text-white mr-2"
            placeholder="5"
            value={duration}
            onChange={(e) => {
              setDuration(Number(e.target.value))
              console.log(`Duration set to: ${duration} minutes`);
            }}
          />
          <span className="text-gray-700 mt-2">minutes (optionel)</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default CourseHeader;
