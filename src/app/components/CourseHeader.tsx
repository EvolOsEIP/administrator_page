import React from 'react';

const CourseHeader = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Titre du cours</label>
        <input
          type="text"
          id="title"
          placeholder="ex: Les caractères spéciaux"
          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-300"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description du cours</label>
        <input
          type="text"
          id="description"
          placeholder="ex: Apprendre à utiliser les caractères spéciaux"
          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-300"
        />
      </div>
      <div>
        <label htmlFor="module" className="block text-gray-700 font-medium mb-1">Modules</label>
        <select id="module" className="w-full p-2 rounded bg-gray-600 text-white">
          <option>Module</option>
        </select>
      </div>
      <div>
        <label htmlFor="duration" className="block text-gray-700 font-medium mb-1">Temps estimé</label>
        <div className="flex">
          <input
            type="number"
            id="duration"
            className="w-20 p-2 rounded bg-gray-600 text-white mr-2"
            placeholder="5"
          />
          <span className="text-gray-700 mt-2">minutes (optionel)</span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
