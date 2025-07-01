
import { useState, useEffect } from 'react';
import RequireAuth from '../components/utils/RequireAuth';
import { MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import CourseForm from './CourseForm';

interface CourseContentProps {
  courseId: number;
  courseTitle: string;
  courseDescription?: string;
}

const CourseContent = ({ courseId, courseTitle, courseDescription }: CourseContentProps) => {
  const [courseContent, setCourseContent] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [steps, setSteps] = useState<any[]>([]);

  const getCourseContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses/${courseId}/steps`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course content');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setCourseContent(data);
        setIsOpen(data.map(() => false)); // one isOpen per step
      } else {
        console.error('Course content is not an array:', data);
        setCourseContent([]);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      setCourseContent([]);
    }
  };

  const toggleStep = (index: number) => {
    setIsOpen((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const removeStep = (index: number) => {
    // Optional: remove step logic
    console.log('Remove step at index:', index);
  };

  useEffect(() => {
    getCourseContent();
  }, [courseId]);


  return (
    <>
      <RequireAuth />
      <div className="flex flex-col items-center justify-start h-screen p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-black">{courseTitle}</h1>
          <h3 className="text-sm text-gray-500">Course ID: {courseId}</h3>
        </div>

        <div className="w-full max-w-3xl bg-white rounded shadow p-4 overflow-y-auto" style={{ maxHeight: '40vh' }}>
         <CourseForm
          courseContent={courseContent}
          courseTitle={courseTitle}
          courseDescription={courseDescription}
          />
        </div>
      </div>
    </>
  );
};

export default CourseContent;
