"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({
  onChange,
  endpoint,
} : FileUploadProps) => {
  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
          toast.success("File uploaded successfully");
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`)
        }}
      />
    </div>
  )
}

export default FileUpload