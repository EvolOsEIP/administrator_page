import React from 'react';

interface SubmitButtonProps {
  onClick?: () => void;
}

const SubmitButton = ({ onClick }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <button type="submit" className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onClick} >
        Enregistrer
      </button>
    </div>
  );
};

export default SubmitButton;
