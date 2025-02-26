"use client"

import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./CourseProgress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  firstChapterId:  string;
  purchase: boolean;
  price: number;
  progress: number;
  category: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  firstChapterId,
  price,
  progress,
  category,
  purchase,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}/chapters/${firstChapterId}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image 
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">
            {category}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}</span>
            </div>
          </div>
          {progress >= 0 && purchase ? (
            <div>
              <CourseProgress 
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {(price === 0 || price === null) ? "Free" : formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard