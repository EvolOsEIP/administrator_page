import React, { useState } from 'react';
import CourseHeader from './CourseHeader';
import CourseSteps from './CourseSteps';
import SubmitButton from './SubmitButton';

const CourseForm = ({
  moduleName,
  moduleId,
  onCourseCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isStepValid = (step) =>
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
        let uploadedImageName = "";

        if (step.image) {
          const formData = new FormData();
          formData.append("file", step.image);

        //  try {
        //    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/`, {
        //      method: "POST",
        //      headers: {
        //        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        //      },
        //      body: formData,
        //    });

        //    if (!res.ok) throw new Error("Failed to upload image");

        //    const data = await res.json();
        //    uploadedImageName = data.filename || data.url || "";
        //  } catch (err) {
        //    console.error("Image upload error:", err);
        //  }
        }

        return {
          instruction: step.instruction,
          expectedAnswer: step.expectedAnswer,
          imageName: uploadedImageName || step.image?.name || "",
        };
      })
    );

    const courseSteps = uploadedSteps.map((step, index) => ({
      title: `step ${index + 1}`,
      stepIndex: index + 1,
      widgets: {
        actions: [
          {
            data: step.expectedAnswer,
            type: "input_text",
            description: "j'attends que tu écrives ${expected_value} ici",
          },
        ],
        instructions: step.imageName
          ? [
              {
                type: "image",
                description: "cette image est liée à l'étape",
                expected_value: step.imageName,
              },
            ]
          : [],
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
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      });

      if (moduleRes.ok) {
        const data = await moduleRes.json();
        const currentModule = data.find((mod) => mod.moduleId === moduleId);
        courseIndex = currentModule ? currentModule.courses.length + 1 : 1;
      } else {
        throw new Error("Failed to fetch module data");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to determine course index.");
      return;
    }

    // Submit the course
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
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
            courseSteps,
          },
        ],
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
    <div className="flex items-center justify-center">
      <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-black">{moduleName}</h1>
        <CourseHeader
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          module={moduleName}
          duration={duration}
          setDuration={setDuration}
        />
        <CourseSteps steps={steps} setSteps={setSteps} />
        <SubmitButton
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
};

export default CourseForm;
