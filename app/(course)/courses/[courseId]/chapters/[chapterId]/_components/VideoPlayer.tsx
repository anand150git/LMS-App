'use client'

import { useConfettiStore } from "@/hooks/useConfettiStore";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  chapter: Chapter;
  isLocked: boolean;
}

const VideoPlayer = ({
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  chapter,
}: VideoPlayerProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {

        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          { isCompleted: true }
        );

        if (!nextChapterId) {
          confetti.onOpen();
        };

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      
    }
    catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="relative aspect-video">
      {/* {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )} */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            Purchase the course to unlock this chapter.
          </p>
        </div>
      )}
      {!isLocked && (
        <video
          width="auto"
          height="auto"
          src={chapter.videoUrl!}
          controls
          autoPlay
          muted
          className={cn(
            "h-full w-full object-cover",
            // !isReady && "hidden",
          )}
          onEnded={onEnd}
        ></video>
      )}
    </div>
  )
}

export default VideoPlayer;