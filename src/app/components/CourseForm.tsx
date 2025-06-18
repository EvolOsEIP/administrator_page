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
  const [duration, setDuration] = useState('');
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null }
  ]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === ''
      || description.trim() === ''
      || steps.some(step => step.instruction.trim() === ''
      || step.expectedAnswer.trim() === '')) {

      alert("Please fill in all required fields.");
      return;
    }
    if (steps.length < 6) {
      alert("Please add at least 6 steps.");
      return;
    }

    const courseSteps = steps.map((step, index) => ({
      title: `step ${index + 1}`,
      stepIndex: index + 1,
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

    const module = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/roadmap`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
      }
    }).then ((res) => {
      if (res.ok) {
        
        console.log("Module fetched successfully!");
      } else {
        console.error("Error fetching module.");
      }
      return res;
    });
    var courseIndex = 0;
    if (module.ok) {
      const data = await module.json();
      data.forEach((mod) => {
        if (mod.moduleId === moduleId) {
          console.log(`number of courses in module ${mod.name}: ${mod.courses.length}`);
          courseIndex = mod.courses.length + 1; // Increment to get the next course index
        }
      });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
      },
      body: JSON.stringify({
        courses: [
          {
            moduleId: moduleId,
            courseIndex: courseIndex,
            title,
            description,
            instruction: "Follow the instructions to get started.",
            courseLevel: "eclaireur",
            courseSteps: courseSteps
          }
        ]
      }),
    })
    .then ((res) => {
      if (res.ok) {
        alert("Course created successfully!");
      }
      else {
        alert("Error creating course.");
      }
      return res;
    });
  };

  return (
    <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6" onSubmit={handleSubmit}>
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
      <SubmitButton />
    </form>
  );
};

export default CourseForm;
