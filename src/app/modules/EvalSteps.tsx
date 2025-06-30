import React from 'react';
import { ChevronDown, ChevronUp, MinusCircle } from 'lucide-react';

const EvalSteps = ({ steps, setSteps }) => {
  const addStep = () => {
    setSteps([...steps, { instruction: '', expectedAnswer: '', image: null, isOpen: false }]);
  };

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
      <div className="overflow-y-auto max-h-[400px] space-y-4 pr-2">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-3 rounded shadow relative group">
            {/* Remove Step Button */}
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="absolute top-3 left-2 text-red-500 hidden group-hover:block"
              title="Supprimer l'étape"
            >
              <MinusCircle size={20} />
            </button>

            {/* Toggleable Step Header */}
            <div
              className="flex items-center justify-between ml-6 cursor-pointer"
              onClick={() => toggleStep(index)}
            >
              <p className="text-gray-800 font-medium">
                Step {index + 1}: {
                  step.instruction.length > 30
                    ? `${step.instruction.substring(0, 30)}...`
                    : step.instruction || ' Ajouter une instruction'
                }
              </p>
              {step.isOpen ? (
                <ChevronUp className="text-gray-600" />
              ) : (
                <ChevronDown className="text-gray-600" />
              )}
            </div>

            {/* Step Content */}
            {step.isOpen && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black">Instructions</label>
                  <textarea
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded text-black"
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
                  <label className="block text-sm font-medium text-black">Réponse attendue</label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 mt-1 border border-gray-300 rounded text-black"
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

        {/* Add Step Button - keep this inside the scrollable area */}
        <div
          className="border-2 border-dashed border-gray-400 p-4 rounded flex justify-center items-center cursor-pointer hover:bg-gray-100"
          onClick={addStep}
        >
          <span className="text-xl text-gray-600">+</span>
          <span className="ml-2 text-gray-600">Ajouter une étape</span>
        </div>
      </div>
    </div>
  );
};

export default EvalSteps;
