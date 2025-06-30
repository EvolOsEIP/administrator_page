
interface ModuleCreationProps {
  onClose: () => void;
}

const ModuleCreation = ({ onClose }: ModuleCreationProps) => {

  const createModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const title = form.elements.namedItem('title') as HTMLInputElement | null;
    const level = form.elements.namedItem('level') as HTMLSelectElement | null;

    if (!title || !level || !title.value || !level.value) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      body: JSON.stringify({
        name: title.value.trim(),
        levelRequired: level.value.toLowerCase(),
      }),
    });

    if (response.ok) {
      alert('Module created successfully!');
    } else {
      alert('Error creating module');
    }
    onClose();
  }

  return (
    <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6" onSubmit={createModule}>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Titre du module</label>
        <input
          type="text"
          id="title"
          placeholder="ex: Les caractères spéciaux"
          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-300"
          onChange={(e) => e.target.value = e.target.value.trim()}
        />
      </div>
      <div>
        <label htmlFor="level" className="block text-gray-700 font-medium mb-1">Level</label>
        {    <select
          id="level"
          className="w-full p-2 rounded bg-gray-600 text-white"
          defaultValue=""
          onChange={(e) => e.target.value = e.target.value.trim()}
        >
          <option value="">Sélectionner un niveau</option>
          <option value="eclaireur">Eclaireur</option>
          <option value="explorateur">Explorateur</option>
          <option value="conquerant">Conquérant</option>
        </select>
        }
      </div>
      <div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
        Ajouter le module
        </button>
      </div>
    </div>
    </form>
  );
};

export default ModuleCreation;
