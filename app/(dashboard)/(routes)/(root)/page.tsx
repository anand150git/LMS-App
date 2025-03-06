import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDashboardCourses } from '@/actions/GetDashboardCourses';
import CoursesList from '@/components/CoursesList';
import { CheckCircle, Clock } from 'lucide-react';
import InfoCard from './_components/InfoCard';

const page = async () => {
  const { userId } = await auth();

  if(!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId);

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant='success'
        />
      </div>
      <CoursesList 
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}

export default page