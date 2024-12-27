"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image"; 

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endPoint: "messageFile" | "serverImage";
}

const FileUpload = ({ onChange, value, endPoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop()?.toLowerCase();

  if (value && fileType && !["pdf"].includes(fileType)) {
    return (
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32">
        <Image
          fill
          src={value}
          alt="Uploaded File"
          className="rounded-full object-cover border border-muted shadow-md"
          unoptimized
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm hover:bg-rose-600 transition"
          type="button"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-8 w-8 sm:h-10 sm:w-10 stroke-indigo-400 fill-indigo-200" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm sm:text-base text-indigo-500 dark:text-indigo-400 hover:underline truncate max-w-[200px] sm:max-w-xs"
        >
          {value.split("/").pop()}
        </a>
        <button
          onClick={() => onChange("")}
          className="ml-auto bg-rose-500 text-white p-1 rounded-full shadow-sm hover:bg-rose-600 transition"
          type="button"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 transition-all duration-300 
        hover:border-primary bg-muted/5 dark:bg-muted/10 
        hover:bg-muted/10 dark:hover:bg-muted/20"
      >
        <UploadDropzone
          endpoint={endPoint}
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) {
              onChange(res[0].url);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload Error:", error);
          }}
          className="max-w-[200px]"
        />
      </div>
    </div>
  );
};

export default FileUpload;
