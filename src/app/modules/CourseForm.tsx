import React, { useState } from 'react';
import CourseHeader from './CourseHeader';
import CourseSteps from './CourseSteps';
import SubmitButton from './SubmitButton';

import RequireAuth from '../components/utils/RequireAuth';
interface CourseFormProps {
  moduleName: string;
  moduleId: number;
  onCourseCreated: () => void;
  courseContent?: any; // optional, can be null or any type
  courseTitle?: string; // optional, can be null or any type
  courseDescription?: string; // optional, can be null or any type
}

const CourseForm = ({
  moduleName,
  moduleId,
  onCourseCreated,
  courseContent = null,
  courseTitle = '',
  courseDescription = ''

}: CourseFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null, isOpen: true },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isStepValid = (step: { instruction: string; expectedAnswer: string; image: File | null }) =>
      step.instruction.trim() !== "" && step.expectedAnswer.trim() !== "";

    if (!title.trim() || !description.trim() || steps.some(step => !isStepValid(step))) {
      alert("Please fill in all required fields.");
      return;
    }

    if (steps.length < 6) {
      alert("Please add at least 6 steps.");
      return;
    }

    const uploadedSteps = await Promise.all(
      steps.map(async (step) => {
        const uploadedImageName = "";

        if (step.image) {
          const formData = new FormData();
          formData.append("file", step.image);

        }

        console.log("Step data:" + step.expectedAnswer);
        return {
          instruction: step.instruction,
          expectedAnswer: step.expectedAnswer,
          imageName: uploadedImageName || step.image?.name || "",
        };
      })
    );

    const courseSteps = uploadedSteps.map((step, index) => ({
      title: `step ${index + 1}`,
      stepindex: index + 1,
      type: "course",
      widgets: {
        actions: [
          {
            type: "input_text",
            description: `j'attends que tu écrives ${step.expectedAnswer} ici`,
            expected_value: step.expectedAnswer,
          },
        ],
        instructions: [
          {
            data: step.imageName || "",
            type: "image",
            description: "cette image montre comment faire",
          }
        ]
      },
      instruction: step.instruction,
    }));

    // Fetch module info to get the next course index
    let courseIndex = 0;
    try {
      const moduleRes = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/roadmap`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`, // Use localStorage to get the token
        },
      });

      if (moduleRes.ok) {
        const data = await moduleRes.json();
        const currentModule = data.find((mod: { moduleId: number }) => mod.moduleId === moduleId);
        courseIndex = currentModule ? currentModule.courses.length + 1 : 1;
      } else {
        throw new Error("Failed to fetch module data");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to determine course index.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`, // Use localStorage to get the token
      },
      body: JSON.stringify({
        courses: [
          {
            moduleId,
            courseIndex,
            title,
            description,
            instruction: "Follow the instructions to get started.",
            courseLevel: "eclaireur",
            Steps: courseSteps
          }
        ]
      }),
    });

    if (res.ok) {
      alert("Course created successfully!");
      onCourseCreated(); // Notify parent to go back to course list
    } else {
      alert("Error creating course.");
    }
  };

  return (
    <>
      <RequireAuth/>
      <div className="flex items-center justify-center">
        <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
          <h1 className="text-2xl font-bold mb-4 text-black">{moduleName}</h1>
          <CourseHeader
            title={courseTitle || title}
            setTitle={setTitle}
            description={courseDescription || description}
            setDescription={setDescription}
            //module={moduleName}
            duration={duration}
            setDuration={setDuration}
          />
          <CourseSteps
            steps={steps}
            setSteps={setSteps}
            courseContent={courseContent}
            />
          <SubmitButton onClick={(e) => {
            handleSubmit(e)
          }}
          />
        </form>
      </div>
    </>
  );
};

export default CourseForm;
