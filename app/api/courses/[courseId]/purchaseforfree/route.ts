import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {}
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    };

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: courseId
        }
      }
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    const purchaseForFree = await db.purchase.create({
      data: {
        userId: userId,
        courseId: courseId
      }
    });

    return new NextResponse("Purchased", { status: 200 });

  } 
  catch (error) {
    console.log("[COURSE_ID_PURCHASE]", error)
    return new NextResponse("Internal Error", { status: 500 });
  }
}