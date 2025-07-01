import { MinusCircle, CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
import CourseContent from "./CourseContent";
import EvaluationForm from "./EvaluationForm";

import RequireAuth from '../components/utils/RequireAuth';
interface ModuleContentProps {
  onClose: () => void;
  moduleId: string;
  moduleName: string;
}

const ModuleContent = ({ onClose, moduleId, moduleName }: ModuleContentProps) => {
  const [courses, setCourses] = useState([]);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);

  const getCourses = async (moduleId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/modules/${moduleId}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use localStorage to get the token
      },
    });
    if (res.status === 204) {
      console.log("No courses found for this module");
      return [];
    }
    if (!res.ok) {
      console.error("Error fetching courses");
      throw new Error("Network response was not ok");
    }

    return await res.json();
  };

  const deleteCourse = async (courseId: string) => {
    console.log("Deleting course with ID:", courseId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses/me/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use localStorage to get the token
      },
    });
    if (!res.ok) {
      console.error("Error deleting course "+ courseId);
      throw new Error("Network response was not ok");
    }
    console.log("Course deleted successfully");
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

<>
  <RequireAuth />
  <div className="flex flex-col h-[600px] w-full bg-white rounded shadow overflow-hidden">
    {isCreatingCourse ? (
      <CourseForm
        moduleName={moduleName}
        moduleId={moduleId}
        onCourseCreated={() => {
          setIsCreatingCourse(false);
          getCourses(moduleId).then(setCourses).catch(console.error);
        }}
      />
    ) : isCreatingEvaluation ? (
      <EvaluationForm
        moduleName={moduleName}
        moduleId={moduleId}
        onEvaluationCreated={() => {
          setIsCreatingEvaluation(false);
        }}
      />
    ) : selectedCourse && !isDeletingCourse ? (
      <div className="flex-grow h-full overflow-auto">
        <CourseContent
          courseId={selectedCourse.courseid}
          courseTitle={selectedCourse.title}
        />
      </div>
    ) : (
      <>
        {/* Header */}
        <div className="px-4 py-2">
          <h1 className="text-xl font-bold text-black">{moduleName}</h1>
        </div>

        {/* Scrollable List */}

{/* Scrollable Course List - Only shown when no course is selected */}
        {!selectedCourse && (
          <div className="overflow-y-auto flex-grow px-4">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 border-b mb-2 last:border-b-0 cursor-pointer hover:bg-gray-200"
                onClick={() => setSelectedCourse(course)}
              >
                <h2 className="text-lg font-semibold text-black">{course.title}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeletingCourse(true);
                    setSelectedCourse(course);
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <MinusCircle size={24} />
                </button>
              </div>
            ))}

            <button
              onClick={() => setIsCreatingCourse(true)}
              className="w-full flex items-center justify-center p-4 bg-gray-100 border-2 border-dashed border-blue-500 mb-2 hover:bg-gray-200 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-blue-500">
                <CirclePlus /> Add New Course
              </span>
            </button>
            <button
              onClick={() => setIsCreatingEvaluation(true)}
              className="w-full flex items-center justify-center p-4 bg-gray-100 border-2 border-dashed border-orange-500 mb-2 hover:bg-gray-200 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-orange-500">
                <CirclePlus /> Add New Evaluation
              </span>
            </button>
          </div>
        )}
      </>
    )}

    {/* 🔴 Deletion Modal */}
    {isDeletingCourse && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={() => {
            setSelectedModule(null);
            setShowModuleCreation(false);
          }}
        ></div>
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md z-10">
          <h2 className="text-xl text-black font-bold mb-4">Supprimer le cours</h2>
          <p className="text-black">Es-tu sûr de vouloir supprimer ce cours ?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsDeletingCourse(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                deleteCourse(selectedCourse.courseid)
                  .then(() => {
                    setIsDeletingCourse(false);
                    setSelectedCourse(null);
                    getCourses(moduleId).then(setCourses).catch(console.error);
                  })
                  .catch((error) => {
                    console.error("Error deleting course:", error);
                  });
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</>
  );
};

export default ModuleContent;
