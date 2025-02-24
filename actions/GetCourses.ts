import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client"
import getprogress from "./GetProgress";

type CourseWithProgressWithCategory = Course & {
  category: Category |  null;
  chapters: { id: string }[];
  purchases: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if(course.purchases.length === 0 && (course.price !== 0 && course.price !== null)) {
          return {
            ...course,
            progress: null,
          }
        }

        const progressPercentage = await getprogress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );
    return coursesWithProgress;
  }
   catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}