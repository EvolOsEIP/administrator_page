import ModuleForm from "../components/ModuleForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Course Registration</h1>
         <ModuleForm />
      <p className="mt-4 text-gray-600">
        &copy; {new Date().getFullYear()} EvolOs. All rights reserved.
      </p>
      <p className="mt-2 text-gray-600">
        Built with Next.js, TypeScript, and Tailwind CSS.
        <br />
      </p>
    </div>
  );
}
