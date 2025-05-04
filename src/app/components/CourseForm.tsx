import React from 'react';
import CourseHeader from './CourseHeader';
import CourseSteps from './CourseSteps';
import SubmitButton from './SubmitButton';

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting form...");

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
    },
    body: JSON.stringify({
      courses: [{
          courseIndex: 6,
          title: "Introduction to Digital Literacy",
          description: "Learn the basics of using a digital device.",
          instruction: "Follow the instructions to get started.",
          courseLevel: "eclaireur",
          coursesteps: [{
            title: "step 1",
            stepid: 1,
            widgets: {
              actions: [{
                  data: "je veux ca et pas autre chose.",
                  type: "input_text",
                  description: "jattends que tu écrives ${expected_value} ici"
                }],
              instructions: [{
                type: "image",
                description: "cette image montre un singe qui se pendouille 1",
                expected_value: "unNaffaire.png"
              }],
            },
            instruction: "blabla 1"
          }]
        },
      ],
    }),
  }).then((res) => {
    console.log("Response: ", res);
    return res.json();
  });
};

const CourseForm = () => {
  console.log("URL: ", process.env.NEXT_PUBLIC_HOST_URL);
  console.log(`Authorization: ${process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`);
  return (
    <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6" onSubmit={handleSubmit}>
      <CourseHeader />
      <CourseSteps />
      <SubmitButton />
    </form>
  );
};

export default CourseForm;
