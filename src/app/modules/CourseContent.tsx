import { useState, useEffect } from 'react';

interface CourseContentProps {
  courseId: number;
  courseName: string;
}

const CourseContent = ({ courseId, courseName }: CourseContentProps) => {
  const [courseContent, setCourseContent] = useState([]);

  const getCourseContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/courses/${courseId}/steps`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCourseContent(data.content);
    } catch (error) {
      console.error('Error fetching course content:', error);
      setCourseContent('Failed to load course content.');
    }
  }

  useEffect(() => {
    getCourseContent();
  }, [courseId]);

  return (
    <div className="flex items-center justify-center">
      <div>
        <h1 className="text-xl font-bold text-black">{courseName}</h1>
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
  );
}

export default CourseContent;
