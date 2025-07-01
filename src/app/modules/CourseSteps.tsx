import React from 'react';
import { ChevronDown, ChevronUp, MinusCircle } from 'lucide-react';

interface CourseStepsProps {
  steps: Array<{
    instruction: string;
    expectedAnswer: string;
    image: File | null;
    isOpen: boolean;
  }>;
  setSteps: React.Dispatch<React.SetStateAction<Array<{
    instruction: string;
    expectedAnswer: string;
    image: File | null;
    isOpen: boolean;
  }>>>;
  courseContent?: any; // Adjust type as needed
}

const CourseSteps = ({ steps, setSteps, courseContent = null }: CourseStepsProps) => {
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

    const [openStates, setOpenStates] = React.useState<boolean[]>([]);

    React.useEffect(() => {
      if (courseContent) {
        setOpenStates(courseContent.map(() => false));
      }
    }, [courseContent]);

    React.useEffect(() => {
      if (courseContent && courseContent.length) {
        const mappedSteps = courseContent.map((step: any) => ({
          instruction: step.instruction || '',
          expectedAnswer: step.widgets?.actions?.[0]?.expected_value || '',
          image: step.image || null,
          isOpen: false,
        }));
        setSteps(mappedSteps);
      }
    }, [courseContent]);

    const renderSteps = courseContent ?? steps;
return (
    <div className="space-y-4 bg-gray-200 p-4 rounded">
      <div className="overflow-y-auto max-h-[400px] space-y-4 pr-2">
        {renderSteps.map((step: any, index: number) => (
          <div key={index} className="bg-white p-3 rounded shadow relative group">
            {/* Remove Step Button (only for editable mode) */}
            {!courseContent && (
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="absolute top-3 left-2 text-red-500 hidden group-hover:block"
                title="Supprimer l'étape"
              >
                <MinusCircle size={20} />
              </button>
            )}
            {/* Toggleable Step Header */}
            <div
              className="flex items-center justify-between ml-6 cursor-pointer"
              onClick={() => {
                if (!courseContent) {
                  toggleStep(index);
                }
                if (courseContent) {
                  setOpenStates(prev => {
                    const updated = [...prev];
                    updated[index] = !updated[index];
                    return updated;
                  });
                } else {
                  toggleStep(index);
                }
              }}
            >
              <p className="text-gray-800 font-medium">
                Step {index + 1}:{' '}
                {step.instruction?.length > 30
                  ? `${step.instruction.substring(0, 30)}...`
                  : step.instruction || ' Ajouter une instruction'}
              </p>

            {(courseContent ? openStates[index] : step.isOpen) ? (
              <ChevronUp className="text-gray-600" />
            ) : (
              <ChevronDown className="text-gray-600" />
            )}
            </div>

            {/* Step Content */}

            {(courseContent ? openStates[index] : step.isOpen) ? (
              <div className="mt-4 space-y-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-black">Instructions</label>
                    <textarea
                      required={!courseContent}
                      className="w-full p-2 mt-1 border border-gray-300 rounded text-black"
                      placeholder={(courseContent ? courseContent[index].instruction : 'ex: Bonjour Pierre')}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].instruction = e.target.value;
                        setSteps(newSteps);
                      }}
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Réponse attendue</label>
                    <input
                      required={!courseContent}
                      type="text"
                      className="w-full p-2 mt-1 border border-gray-300 rounded text-black"
                      placeholder={(courseContent ? courseContent[index].widgets.actions[0].expected_value : step.expectedAnswer) || ''}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].expectedAnswer = e.target.value;
                        setSteps(newSteps);
                      }}
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Image</label>
                  {courseContent ? (
                    step.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_HOST_URL}/uploads/${step.image}`}
                        alt="Étape"
                        className="rounded max-h-60 object-contain"
                      />
                    ) : (
                      <p className="text-gray-500">Aucune image</p>
                    )
                  ) : (
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
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ))}

        {/* Add Step Button (only for editable mode) */}
        {!courseContent && (
          <div
            className="border-2 border-dashed border-gray-400 p-4 rounded flex justify-center items-center cursor-pointer hover:bg-gray-100"
            onClick={addStep}
          >
            <span className="text-xl text-gray-600">+</span>
            <span className="ml-2 text-gray-600">Ajouter une étape</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSteps;
