import React, { useState } from 'react';
import CourseHeader from './CourseHeader';
import CourseSteps from './CourseSteps';
import SubmitButton from './SubmitButton';

const CourseForm = ({
  moduleName,
  moduleId
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // const [module, setModule] = useState('');
  const [duration, setDuration] = useState('');
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null }
  ]);

  //console.log("Adding a new course to module: ", selectedModuleId);
  console.log("Adding a new course to module: ", moduleName + " " + moduleId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseSteps = steps.map((step, index) => ({
      title: `step ${index + 1}`,
      stepid: index + 1,
      widgets: {
        actions: [
          {
            data: step.expectedAnswer,
            type: "input_text",
            description: "jattends que tu écrives ${expected_value} ici"
          }
        ],
        instructions: [
          {
            type: "image",
            description: "cette image montre un singe qui se pendouille 1",
            expected_value: "unNaffaire.png" // keep as-is for now
          }
        ]
      },
      instruction: step.instruction
    }));

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
      },
      body: JSON.stringify({
        courses: [
          {
            moduleId: moduleId,
            courseIndex: 6,
            title,
            description,
            instruction: "Follow the instructions to get started.",
            courseLevel: "eclaireur",
            coursesteps: courseSteps
          }
        ]
      }),
    });

    console.log(await res.json());
  };

  return (
    <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6" onSubmit={handleSubmit}>
      <CourseHeader
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        module={moduleName}
        //setModule={setModule}
        duration={duration}
        setDuration={setDuration}
      />
      <CourseSteps steps={steps} setSteps={setSteps} />
      <SubmitButton />
    </form>
  );
};

export default CourseForm;
