import { useState, useEffect } from 'react';
import EvalSteps from './EvalSteps';
import EvalHeader from './EvalHeader';
import SubmitButton from './SubmitButton';

const FormHeader = ({ title, setTitle, description, setDescription, module, duration, setDuration }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-black mb-2">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-gray-400"
        placeholder="Enter evaluation title"
      />
      <label className="block text-sm font-medium text-black mt-4 mb-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-gray-400"
        placeholder="Enter evaluation description"
      />
      <label className="block text-sm font-medium text-black mt-4 mb-2">Module</label>
      <input
        type="text"
        value={module}
        readOnly
        className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed text-gray-400"
      />
      <label className="block text-sm font-medium text-black mt-4 mb-2">Duration (minutes)</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-gray-400"
        placeholder="Enter duration in minutes"
      />
    </div>
  );
}

interface EvalutaionFormProps {
  moduleName: string;
}

const EvaluationForm = ({ moduleName }: EvalutaionFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30); // Default duration in minutes
  const [steps, setSteps] = useState([
    { instruction: '', expectedAnswer: '', image: null as File | null }
  ])

  return (
    <div className="flex items-center justify-center">
      <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6" onSubmit={() => alert("eval created")}>
        <h1 className="text-2xl font-bold mb-4 text-black">{moduleName}</h1>
        <EvalHeader />
        <EvalSteps 
          steps={steps}
          setSteps={setSteps}
        />
        <SubmitButton />
      </form>
    </div>
  );
}

export default EvaluationForm;
