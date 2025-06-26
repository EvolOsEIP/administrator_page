import ModuleForm from "./ModuleForm";
import { LayoutWithNavbar } from "../components/layout-with-navbar";

export default function Page() {
  return (
    <LayoutWithNavbar>
    <div className="flex flex-col justify-center min-h-screen py-2 w-full h-full">
         <ModuleForm />
    </div>
    </LayoutWithNavbar>
  );
}
