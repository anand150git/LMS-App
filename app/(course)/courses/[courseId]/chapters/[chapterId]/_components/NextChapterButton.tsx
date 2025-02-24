"use client";

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface NextChapterButtonProps {
  courseId: string;
  nextChapterId: string;
}

const NextChapterButton = ({
  courseId,
  nextChapterId
}: NextChapterButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = () => {
    try {
      if (nextChapterId) {
        setIsLoading(true)
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      else {
        toast.error("No next chapter found");
      }
    }
    catch {
      toast.error("Something went wrong");
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant={"outline"}
      className='w-full md:w-auto'
    >
      Next Chapter
      <ArrowRight className='ml-2 h-4 w-4' />
    </Button>
  )
}

export default NextChapterButton