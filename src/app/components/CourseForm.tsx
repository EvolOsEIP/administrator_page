import React from 'react';
import CourseHeader from './CourseHeader';
import CourseSteps from './CourseSteps';
import SubmitButton from './SubmitButton';

const CourseForm = () => {
  return (
    <form className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
      <CourseHeader />
      <CourseSteps />
      <SubmitButton />
    </form>
  );
};

export default CourseForm;
