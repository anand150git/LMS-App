import { getChapter } from "@/actions/GetChapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import CourseProgressButton from "./_components/CourseProgressButton";
import NextChapterButton from "./_components/NextChapterButton";
import EnrollCourseForFree from "./_components/EnrollCourseForFree";


const page = async ({
  params
}: {
  params: { courseId: string; chapterId: string; }
}
) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

  if (!userId) {
    return redirect("/");
  };

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId,
    chapterId
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;


  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter!"
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to access this chapter!"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            chapter={chapter}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>

            <div
              className="flex flex-col gap-2 w-full md:w-fit"
            >
              {purchase && (
                <CourseProgressButton
                  chapterId={chapterId}
                  courseId={courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              )}

              {nextChapter && purchase && (
                <NextChapterButton
                  courseId={courseId}
                  nextChapterId={nextChapter?.id!}
                />
              )}

              {!purchase && (course.price !== 0 && course.price !== null) && (
                <CourseEnrollButton
                  courseId={courseId}
                  price={course.price!}
                />
              )}

              {!purchase && (course.price === 0 || course.price === null) && (
                <div className={!purchase && (course.price === 0 || course.price === null) ? "block" : "hidden"}>
                  <EnrollCourseForFree courseId={courseId} />
                </div>
              )}
            </div>
          </div>
          <Separator />
          <div className="p-4 text-justify font-medium">
            {/* <Preview 
              value={chapter.description!}
            /> */}
            {chapter.description}
          </div>
          {(!!purchase && !!attachments.length) && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default page