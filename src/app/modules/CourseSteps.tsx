import React, { useState } from 'react';
import StepEditorModal from '../components/StepEditorModal';

interface Step {
  instruction: string;
  expectedAnswer: string;
  image: File | null;
}

interface CourseStepsProps {
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
}

const CourseSteps = ({ steps, setSteps }: CourseStepsProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openEditor = (index: number) => {
    setEditingIndex(index);
  };

  const closeEditor = () => {
    setEditingIndex(null);
  };

  const handleChange = (field: keyof Step, value: any) => {
    if (editingIndex === null) return;
    const updatedSteps = [...steps];
    updatedSteps[editingIndex] = {
      ...updatedSteps[editingIndex],
      [field]: value,
    };
    setSteps(updatedSteps);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingIndex === null) return;
    const file = e.target.files?.[0] || null;
    handleChange('image', file);
  };

  const addStep = () => {
    setSteps([...steps, { instruction: '', expectedAnswer: '', image: null }]);
    setEditingIndex(steps.length); 
  };

  const deleteStep = (index: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette étape ?')) return;
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
    if (editingIndex === index) {
      closeEditor();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1); 
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="relative bg-white p-4 rounded shadow-md min-h-[180px] flex flex-col">
            <button
              onClick={() => deleteStep(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg hover:bg-red-600"
              title="Supprimer cette étape"
              type="button"
            >
              &minus;
            </button>

            <div
              onClick={() => openEditor(index)}
              className="cursor-pointer flex-1 flex flex-col"
              title="Modifier cette étape"
            >
              <h3 className="font-semibold mb-2">Étape {index + 1}</h3>
              {step.image ? (
                <img
                  src={URL.createObjectURL(step.image)}
                  alt={`Step ${index + 1}`}
                  className="w-full max-h-32 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-400">
                  Pas d’image
                </div>
              )}
              <p className="break-words whitespace-normal"><strong>Instruction :</strong> {step.instruction || '—'}</p>
              <p className="break-words whitespace-normal"><strong>Réponse :</strong> {step.expectedAnswer || '—'}</p>
            </div>
          </div>
        ))}

        <div
          onClick={addStep}
          className="flex items-center justify-center cursor-pointer bg-gray-200 rounded shadow-md text-4xl font-bold text-gray-600 hover:bg-gray-300 min-h-[180px]"
          title="Ajouter une étape"
        >
          +
        </div>
      </div>

      {editingIndex !== null && (
        <StepEditorModal
          index={editingIndex}
          step={steps[editingIndex]}
          onClose={closeEditor}
          onChange={handleChange}
          onImageChange={handleImageChange}
        />
      )}
    </div>
  );
};

export default CourseSteps;
