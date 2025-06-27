import { MinusCircle, CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";

interface ModuleContentProps {
  onClose: () => void;
  moduleId: string;
  moduleName: string;
}

const ModuleContent = ({ onClose, moduleId, moduleName }: ModuleContentProps) => {
  const [courses, setCourses] = useState([]);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  const getCourses = async (moduleId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/${moduleId}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.error("Error fetching courses");
      throw new Error("Network response was not ok");
    }

    return await res.json();
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(moduleId);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [moduleId]);

  return (
    <div className="flex flex-col h-[600px] w-full bg-white rounded shadow">
      {isCreatingCourse ? (
        <CourseForm moduleName={moduleName} moduleId={moduleId} />
      ) : (
        <>
          {/* Fixed Header */}
          <div>
            <h1 className="text-xl font-bold text-black">{moduleName}</h1>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto flex-grow">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 border-b mb-2 last:border-b-0 cursor-pointer hover:bg-gray-200"
              >
                <h2 className="text-lg font-semibold text-black">Cours {index + 1}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Removing course:", course.name);
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <MinusCircle size={24} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setIsCreatingCourse(true);
              }}
              className="w-full text-left flex items-center justify-center p-4 bg-gray-100 border-2 border-dashed border-blue-500 mb-2 hover:bg-gray-200 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-blue-500">
                <CirclePlus /> Add New Course
              </span>
            </button>
          </div>

          {/* Footer / Optional content */}
          <div className="p-4 border-t bg-gray-100"></div>
        </>
      )}
    </div>
  );
};

export default ModuleContent;
