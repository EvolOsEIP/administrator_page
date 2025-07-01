
const getEvaluation = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/evaluations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch evaluation');
  }
  return response.json();
}

export default getEvaluation;

const createEval = async (moduleId, moduleName, title, description, steps) => {
  if (!title || !description || !moduleName) {
    alert('Please fill in all fields');
    return;
  }
  const evals = await getEvaluation();
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
    },
    body: JSON.stringify({
      "evaluations": [{
          "evaluationIndex": evals.length + 1,
          "moduleId": moduleId,
          "title": title,
          "assistantDiag": {},
          "description": description,
          "instruction": "Suivez les instructions ci-dessous pour compléter l'évaluation.",
          "Steps": steps.map((step, index) => ({
            title: `Step ${index + 1}`,
            stepid: index + 1,
            type: "evaluation",
            widgets: {
              actions: [
                {
                  data: step.expectedAnswer,
                  type: "input_text",
                  description: `Please write your answer for step ${index + 1} here`,
                  expected_value: step.expectedAnswer
                }
              ],
              instructions: step.image
                ? [
                    {
                      type: "image",
                      description: step.instruction,
                      expected_value: step.image.name
                    }
                  ]
                : []
            },
            instruction: step.instruction
          }))
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
}

export { createEval };

