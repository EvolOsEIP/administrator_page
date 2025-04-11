import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MinusCircle } from 'lucide-react';

const CourseSteps = () => {
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null, isOpen: false }
  ]);

  const addStep = () =>
    setSteps([...steps, { instruction: '', expectedAnswer: '', image: null, isOpen: false }]);

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const toggleStep = (index: number) => {
    setSteps(prev =>
      prev.map((step, i) =>
        i === index ? { ...step, isOpen: !step.isOpen } : step
      )
    );
  };

  return (
    <div className="space-y-4 bg-gray-200 p-4 rounded">
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-white p-3 rounded shadow relative group"
        >
          <button
            type="button"
            onClick={() => removeStep(index)}
            className="absolute top-3 left-2 text-red-500 hidden group-hover:block"
            title="Supprimer l'étape"
          >
            <MinusCircle size={20} />
          </button>
          <div
            className="flex items-center justify-between ml-6 cursor-pointer"
            onClick={() => toggleStep(index)}
          >
            <p className="text-gray-800 font-medium">
              Step {index + 1}: {step.instruction || 'Cliquez pour ajouter une instruction'}
            </p>
            {step.isOpen ? (
              <ChevronUp className="text-gray-600" />
            ) : (
              <ChevronDown className="text-gray-600" />
            )}
          </div>
          {step.isOpen && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  placeholder="ex: Tapez le mot affiché à l'écran en utilisant uniquement le clavier..."
                  value={step.instruction}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index].instruction = e.target.value;
                    setSteps(newSteps);
                  }}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Réponse attendue</label>
                <input
                  type="text"
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                  placeholder="ex: Bonjour Pierre"
                  value={step.expectedAnswer}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index].expectedAnswer = e.target.value;
                    setSteps(newSteps);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1"
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index].image = e.target.files?.[0] || null;
                    setSteps(newSteps);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <div
        className="border-2 border-dashed border-gray-400 p-4 rounded flex justify-center items-center cursor-pointer hover:bg-gray-100"
        onClick={addStep}
      >
        <span className="text-xl text-gray-600">+</span>
        <span className="ml-2 text-gray-600">Ajouter une étape</span>
      </div>
    </div>
  );
};

export default CourseSteps;
