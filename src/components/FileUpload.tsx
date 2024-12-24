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
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Uploaded File"
          className="rounded-full object-cover border border-muted shadow-md"
          unoptimized // Add this to bypass Next.js image optimization
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm hover:bg-rose-600 transition"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 stroke-indigo-400 fill-indigo-200" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value.split("/").pop()}
        </a>
        <button
          onClick={() => onChange("")}
          className="ml-auto bg-rose-500 text-white p-1 rounded-full shadow-sm hover:bg-rose-600 transition"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-all duration-300 
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
          className="w-full ut-label:text-primary ut-allowed-content:text-muted-foreground 
          ut-button:bg-primary ut-button:hover:bg-primary/90 
          ut-button:transition-colors ut-button:duration-300"
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Drag and drop your file here or click to browse
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {endPoint === "messageFile"
              ? "Support for images and PDFs up to 4MB"
              : "Support for images up to 4MB"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
