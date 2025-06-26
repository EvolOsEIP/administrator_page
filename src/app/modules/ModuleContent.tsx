import { MinusCircle } from "lucide-react"

interface ModuleContentProps {
  onClose: () => void;
  moduleId: string;
  moduleName: string;
}
const ModuleContent = ({ onClose, moduleId, moduleName }) => {
  const loading = false; // Simulate loading state
  const error = null; // Simulate no error state

  return (
   <div className="flex flex-col h-[600px] w-full bg-white rounded shadow">
      {/* Fixed Header */}
      <div>
        <h1 className="text-xl font-bold text-black">{moduleName}</h1>
      </div>

      {/* Scrollable List */}
      <div className="overflow-y-auto flex-grow">
        {Array.from({ length: 16 }).map((_, index) => (
          <div
            key={index}
            // add margin between items
            className="flex items-center justify-between p-4 bg-gray-100 border-b margin-b-2 last:border-b-0 cursor-pointer hover:bg-gray-200"
            onClick={() => alert(`Cours ${index + 1} clicked`)}
          >
            <h2 className="text-lg font-semibold text-black">Cours {index + 1}</h2>
            <button onClick={onClose} className="text-red-500 hover:text-red-700 cursor-pointer">
              <MinusCircle size={24} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer / Error / Loading */}
      <div className="p-4 border-t bg-gray-100">
        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">Erreur : {error.message}</p>}
      </div>
    </div>
  );
}

export default ModuleContent;
