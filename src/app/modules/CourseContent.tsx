import { useState, useEffect } from 'react';
import RequireAuth from '../components/utils/RequireAuth';

interface CourseContentProps {
  courseId: number;
  courseTitle: string;
}

const CourseContent = ({ courseId, courseTitle }: CourseContentProps) => {
  const [courseContent, setCourseContent] = useState<any[]>([]);

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
      }
      else {
        console.error('Course content is not an array:', data);
        setCourseContent([]);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      setCourseContent([]);
    }
  }

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

    {/* Scrollable container */}
    <div className="w-full max-w-3xl bg-white rounded shadow p-4 overflow-y-auto" style={{ maxHeight: '40vh' }}>
      {Array.isArray(courseContent) && courseContent.length > 0 ? (
        courseContent.map((course, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-100 border-b mb-2 last:border-b-0 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              console.log(`Clicked on step: ${index}`);
            }}
          >
            <span className="text-black">Step {index + 1}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No content available.</p>
      )}
    </div>
  </div>
</>
);
}

export default CourseContent;
