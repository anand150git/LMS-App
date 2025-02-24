import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import React from 'react'
import Categories from './_components/Categories'
import SearchInput from '@/components/SearchInput'
import { getCourses } from '@/actions/GetCourses'
import { redirect } from 'next/navigation'
import CoursesList from '@/components/CoursesList'

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

const page = async ({
  searchParams
} : SearchPageProps) => {
  const { userId } = await auth();
  const { title, categoryId } = await searchParams;

  if (!userId) {
    return redirect('/sign-in');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  const courses = await getCourses({
    userId,
    title,
    categoryId,
  });



  return (
    <>
      <div className='px-6 pt-6 md:hidden md:md-0 block'>
        <SearchInput/>
      </div>
      <div className='p-6 space-y-4'>
        <Categories
          items={categories}
        />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default page