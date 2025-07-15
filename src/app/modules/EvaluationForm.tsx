import React, { useState } from 'react';
import EvalHeader from './EvalHeader';
import SubmitButton from './SubmitButton';
import StepEditorModal from '../components/StepEditorModal';
import RequireAuth from '../components/utils/RequireAuth';
import { createEval } from '../components/utils/eval';

interface Step {
  instruction: string;
  expectedAnswer: string;
  image: File | null;
}

interface EvaluationFormProps {
  moduleName: string;
  moduleId: number;
}

const EvaluationForm = ({ moduleName, moduleId }: EvaluationFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditStep = (index: number) => setEditingIndex(index);

  const handleStepChange = (field: keyof Step, value: any) => {
    if (editingIndex === null) return;
    const updated = [...steps];
    updated[editingIndex] = { ...updated[editingIndex], [field]: value };
    setSteps(updated);
  };

  const handleStepImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || editingIndex === null) return;
    const updated = [...steps];
    updated[editingIndex].image = e.target.files[0];
    setSteps(updated);
  };

  const handleRemoveStep = (indexToRemove: number) => {
    const updatedSteps = steps.filter((_, i) => i !== indexToRemove);
    setSteps(updatedSteps);
    if (editingIndex !== null && editingIndex > indexToRemove) {
      setEditingIndex(editingIndex - 1);
    } else if (editingIndex === indexToRemove) {
      setEditingIndex(null);
    }
  };

  const handleUpdateStep = (index: number, updatedStep: Step) => {
    const updated = [...steps];
    updated[index] = updatedStep;
    setSteps(updated);
    setEditingIndex(null);
  };

  const handleAddStep = () => {
    const newStep: Step = { instruction: '', expectedAnswer: '', image: null };
    setSteps((prev) => [...prev, newStep]);
    setEditingIndex(steps.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || steps.length < 6) {
      alert('Veuillez remplir tous les champs et ajouter au moins 6 étapes.');
      return;
    }

    const uploadedSteps = await Promise.all(
      steps.map(async (step) => {
        let uploadedImageName = '';

        if (step.image) {
          const formData = new FormData();
          formData.append('file', step.image);

          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/upload/image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            uploadedImageName = data.filename;
          }
        }

        return {
          instruction: step.instruction,
          expectedAnswer: step.expectedAnswer,
          image: uploadedImageName || '',
        };
      })
    );

    try {
      await createEval(moduleId, moduleName, title, description, uploadedSteps);
      alert('Évaluation créée avec succès !');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'évaluation.");
    }
  };

  return (
    <>
      <RequireAuth />
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
          <h1 className="text-2xl font-bold mb-4 text-black">{moduleName}</h1>

          <EvalHeader
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            module={moduleName}
            duration={duration}
            setDuration={setDuration}
          />

          <div className="max-h-[50vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-2">
            {steps.map((step, index) => (
              <div key={index} className="relative bg-white rounded-xl shadow-md p-4">
                <button
                  onClick={() => handleRemoveStep(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  type="button"
                >
                  &minus;
                </button>
                <p className="font-bold text-gray-800 mb-2">Étape {index + 1}</p>
                <p className="text-sm text-gray-600">{step.instruction || 'Aucune instruction'}</p>
                {step.image && (
                  <img
                    src={URL.createObjectURL(step.image)}
                    alt="Image étape"
                    className="w-full h-40 object-cover rounded mt-2"
                  />
                )}
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={() => handleEditStep(index)}
                >
                  Modifier
                </button>
              </div>
            ))}

            <div
              onClick={handleAddStep}
              className="cursor-pointer flex items-center justify-center rounded-xl border-2 border-dashed border-gray-400 hover:border-blue-400 transition p-4"
            >
              <span className="text-4xl text-gray-400 font-bold">+</span>
            </div>
          </div>

          <SubmitButton onClick={() => {}} />
        </form>
      </div>

      {editingIndex !== null && (
        <StepEditorModal
          step={steps[editingIndex]}
          index={editingIndex}
          onClose={() => setEditingIndex(null)}
          onChange={handleStepChange}
          onImageChange={handleStepImageChange}
          onSave={handleUpdateStep}
        />
      )}
    </>
  );
};

export default EvaluationForm;
