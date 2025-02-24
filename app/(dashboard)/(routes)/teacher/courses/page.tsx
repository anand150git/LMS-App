import React from 'react'
import { DataTable } from './_components/DataTable'
import { columns } from './_components/Column'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

const page = async () => {
  const { userId } = await auth();

  if(!userId) {
    return redirect('/sign-in');
  }

  const courses = await db.course.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default page