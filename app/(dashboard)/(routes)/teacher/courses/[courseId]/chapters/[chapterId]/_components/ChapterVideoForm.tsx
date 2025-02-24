'use client';

import FileUpload from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Chapter, MuxData } from '@prisma/client';
import axios from 'axios';
import { PencilIcon, PlusCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  VideoUrl: z.string().min(1)
})

const ChapterVideoForm = ({ 
  initialData, 
  courseId,
  chapterId,
 }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Chapter updated');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Chapter video
        <Button variant={'ghost'} onClick={toggleIsEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && initialData.videoUrl && (
            <>
              <PencilIcon className='mr-2 h-4 w-4' />
              Change video
            </>
          )}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add video
            </>
          )}
        </Button>
      </div>
      {!isEditing && !initialData.videoUrl && (
        <div className='flex h-60 items-center justify-center rounded-md bg-slate-200'>
          <Video className='h-10 w-10 text-slate-500' />
        </div>
      )} 
      { !isEditing && initialData.videoUrl &&(
        <div className='relative aspect-video mt-2'>
          <video src={initialData.videoUrl} controls className='rounded-md border w-full bg-black'></video>
        </div>
      )}

      {!isEditing && initialData.videoUrl && (
        <div className='relative mt-2'>
          Video uploaded
        </div>
      )}
      {isEditing && (
        <>
          <FileUpload
            endpoint='chapterVideo'
            onChange={(url) => {
              if (url) {
                onSubmit({ VideoUrl: url });
              }
            }}
          />
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Upload this chapter&apos;s video
          </p>
        </>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className='text-xs text-muted-foreground mt-2'>
          Videos can take a some time to process. Refresh the page if video does no appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;