
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
