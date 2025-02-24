"use client";

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface CourseEnrollForFreeProps {
  courseId: string;
}

const EnrollCourseForFree = ({
  courseId,
}: CourseEnrollForFreeProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.post(`/api/courses/${courseId}/purchaseforfree`);
      router.refresh();
    } 
    catch (error) {
      toast.error(`Something went wrong ${error}`);
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
    >
      Enroll for Free
    </Button>
  )
}

export default EnrollCourseForFree