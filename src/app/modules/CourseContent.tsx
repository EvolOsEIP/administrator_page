import { useState, useEffect } from 'react';
import RequireAuth from '../components/utils/RequireAuth';

interface CourseContentProps {
  courseId: number;
  courseTitle: string;
}

const CourseContent = ({ courseId, courseTitle }: CourseContentProps) => {
  const [courseContent, setCourseContent] = useState([]);

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
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCourseContent(data.content);
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
      <RequireAuth/>
      <div className="flex items-center justify-center">
        <div>
          <h1 className="text-xl font-bold text-black">{courseTitle}</h1>
          <h3 className="text-sm text-gray-500">Course ID: {courseId}</h3>
        </div>
        <div className="overflow-y-auto flex-grow">
        {courseContent.map((course, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-100 border-b mb-2 last:border-b-0 cursor-pointer hover:bg-gray-200"
            onClick={() => {
            }}
          >

          </div>
        ))}
        </div>
      </div>
    </> 
);
}

export default CourseContent;
