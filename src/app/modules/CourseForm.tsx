import React, { useState } from 'react';
import CourseHeader from './CourseHeader';
import CourseSteps from './CourseSteps';
import SubmitButton from './SubmitButton';
import StepEditorModal from '../components/StepEditorModal';
import RequireAuth from '../components/utils/RequireAuth';

interface Step {
  instruction: string;
  expectedAnswer: string;
  image: File | null;
}

interface CourseFormProps {
  moduleName: string;
  moduleId: number;
  onCourseCreated: () => void;
}

const CourseForm = ({ moduleName, moduleId, onCourseCreated }: CourseFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditStep = (index: number) => {
    setEditingIndex(index);
  };
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
    setEditingIndex(steps.length); // ouvre la modale pour le nouveau step
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isStepValid = (step: Step) =>
      step.instruction.trim() !== '' && step.expectedAnswer.trim() !== '';

    if (!title.trim() || !description.trim() || steps.some((s) => !isStepValid(s))) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    if (steps.length < 6) {
      alert('Ajoutez au moins 6 étapes.');
      return;
    }

    const uploadedSteps = await Promise.all(
      steps.map(async (step) => {
        let uploadedImageName = '';

        if (step.image) {
          const formData = new FormData();
          formData.append('file', step.image);

          const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });

          if (uploadRes.ok) {
            const data = await uploadRes.json();
            uploadedImageName = data.filename;
          }
        }

        return {
          instruction: step.instruction,
          expectedAnswer: step.expectedAnswer,
          imageName: uploadedImageName || step.image?.name || '',
        };
      })
    );

    const courseSteps = uploadedSteps.map((step, index) => ({
      title: `step ${index + 1}`,
      stepindex: index + 1,
      type: 'course',
      widgets: {
        actions: [
          {
            type: 'input_text',
            description: `j'attends que tu écrives ${step.expectedAnswer} ici`,
            expected_value: step.expectedAnswer,
          },
        ],
        instructions: step.imageName
          ? [
              {
                data: step.imageName,
                type: 'image',
                description: 'cette image montre comment faire',
              },
            ]
          : [],
      },
      instruction: step.instruction,
    }));

    let courseIndex = 0;
    try {
      const moduleRes = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/roadmap`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (moduleRes.ok) {
        const data = await moduleRes.json();
        const currentModule = data.find((mod: { moduleId: number }) => mod.moduleId === moduleId);
        courseIndex = currentModule ? currentModule.courses.length + 1 : 1;
      } else {
        throw new Error('Échec lors de la récupération du module.');
      }
    } catch (err) {
      console.error(err);
      alert('Impossible de récupérer le numéro du cours.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        courses: [
          {
            moduleId,
            courseIndex,
            title,
            description,
            instruction: 'Follow the instructions to get started.',
            courseLevel: 'eclaireur',
            Steps: courseSteps,
          },
        ],
      }),
    });

    if (res.ok) {
      alert('Cours créé avec succès !');
      onCourseCreated();
    } else {
      alert("Erreur lors de la création du cours.");
    }
  };

  return (
    <>
      <RequireAuth />
      <div className="flex items-center justify-center">
        <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
          <h1 className="text-2xl font-bold mb-4 text-black">{moduleName}</h1>

          <CourseHeader
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            duration={duration}
            setDuration={setDuration}
          />

          <div className="max-h-[50vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-2">
  {steps.map((step, index) => (
    <div key={index} className="relative bg-white rounded-xl shadow-md p-4">
      <button
        onClick={() => handleRemoveStep(index)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Supprimer cette étape"
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

          <SubmitButton onClick={(e) => handleSubmit(e)} />
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

export default CourseForm;
