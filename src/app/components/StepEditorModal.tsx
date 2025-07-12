// components/StepEditorModal.tsx
import React from 'react';

interface Step {
  instruction: string;
  expectedAnswer: string;
  image: File | null;
}

interface StepEditorModalProps {
  index: number;
  step: Step;
  onClose: () => void;
  onChange: (field: keyof Step, value: any) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (index: number, updatedStep: Step) => void;
}

const StepEditorModal = ({
  index,
  step,
  onClose,
  onChange,
  onImageChange,
  onSave,
}: StepEditorModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Modifier l’étape {index + 1}</h2>

        <label className="block text-gray-700">
          Instruction :
          <input
            type="text"
            value={step.instruction}
            onChange={(e) => onChange('instruction', e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block text-gray-700">
          Réponse attendue :
          <input
            type="text"
            value={step.expectedAnswer}
            onChange={(e) => onChange('expectedAnswer', e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block text-gray-700">
          Image :
          <input type="file" onChange={onImageChange} className="mt-1" />
          {step.image && (
            <img
              src={URL.createObjectURL(step.image)}
              alt="Uploaded"
              className="mt-2 w-full h-32 object-cover rounded"
            />
          )}
        </label>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(index, step)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepEditorModal;

