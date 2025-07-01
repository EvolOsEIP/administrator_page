import { useState } from 'react';
import EvalSteps from './EvalSteps';
import EvalHeader from './EvalHeader';
import SubmitButton from './SubmitButton';
import { getEvaluation, createEval } from '../components/utils/eval';

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
         <SubmitButton onClick={(e) => {
          createEval(moduleId, moduleName, title, description, steps)
        }}
        />
      </form>
    </div>
  );
}

export default EvaluationForm;
