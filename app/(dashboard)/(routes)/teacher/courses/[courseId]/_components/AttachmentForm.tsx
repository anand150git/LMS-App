'use client';

import FileUpload from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, ImageIcon, Loader2, PencilIcon, PlusCircle, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course is updated');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id:string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses${courseId}/attachments/${id}`);
      toast.success("Attachment deleted")
      router.refresh()
    } 
    catch {
      toast.error("Something went wrong");
    } 
    finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Course attachments
        <Button variant={'ghost'} onClick={toggleIsEditing}>
          {isEditing && <>Cancel</>}


          {!isEditing && (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>No attachments yet</p>
          )}

          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
            >
              <File className='h-4 w-4 mr-2 flex-shrink-0'/>
              <p className='text-xs line-clamp-1'>
                {attachment.name}
              </p>

              {deletingId === attachment.id && (
                <div>
                  <Loader2 className='h-4 w-4 animate-spin'/>
                </div>
              )}
              {deletingId !== attachment.id && (
                <button
                  onClick={() => onDelete(attachment.id)}
                  className='ml-auto hover:opacity-75 transition'
                >
                  <X className='h-4 w-4'/>
                </button>
              )}
            </div>
          ))}
        </>
      )}
      {isEditing && (
        <>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Add anything your students might need to complete the course.
          </p>
        </>
      )}
    </div>
  );
};

export default AttachmentForm;