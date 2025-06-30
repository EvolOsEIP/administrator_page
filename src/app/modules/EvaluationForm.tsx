import { useState } from 'react';
import EvalSteps from './EvalSteps';
import EvalHeader from './EvalHeader';
import SubmitButton from './SubmitButton';

interface EvalutaionFormProps {
  moduleName: string;
  moduleId: number;
}

const EvaluationForm = ({ moduleName, moduleId }: EvalutaionFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30); // Default duration in minutes
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null, isOpen: true }
  ])

  const createEval = async () => {
    if (!title || !description || !moduleName) {
      alert('Please fill in all fields');
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
      },
      body: JSON.stringify({
        "evaluations": [{
            "evaluationIndex": 5,
            "moduleId": moduleId,
            "title": "Introduction to Digital Literacy",
            "assistantDiag": {},
            "description": "Learn the basics of using a digital device.",
            "instruction": "Follow the instructions to get started.",
            "Steps": [{
              "title": "step 1",
              "stepid": 1,
              "type": "evaluation",
              "widgets": {
                "actions": [
                  {
                    "data": "je veux ca et pas autre chose.",
                      "type": "input_text",
                      "description": "jattends que tu écrives ${expected_value} ici"
                    }
                  ],
                  "instructions": [{
                    "type": "image",
                    "description": "cette image montre un singe qui se pendouille 1",
                    "expected_value": "unNaffaire.png"
                  }
                ]
              },
              "instruction": "blabla 1"
            }]
          }]
      }),
    }).then((response) => {
      if (!response.ok) {
        alert('Failed to create evaluation. Please try again. ' + response.statusText);
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
    ).catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });

    if (res) {
      alert('Evaluation created successfully!');
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6" >
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
        <EvalSteps
          steps={steps}
          setSteps={setSteps}
        />
         <SubmitButton onClick={() => {
          createEval()
        }}
        />
      </form>
    </div>
  );
}

export default EvaluationForm;
