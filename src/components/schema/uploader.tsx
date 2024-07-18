import { useContext, useEffect, useState } from "react";
import { CircleAlert, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/button";
import { Media } from "@/lib/types";
import { importSchemas } from "@/lib/schema";
import { AppContext } from "@/lib/context";
import { notify } from "@/lib/notify";
import { useRouter } from "next/navigation";

export interface MediaUploaderProps {
  uploadContainerClass?: string;
  minimal?: boolean;
  onMediaUploaded?: (file: Media) => void;
  onUploadComplete?: () => void;
}

export const SchemaUploader = (props: MediaUploaderProps) => {
  const {
    uploadContainerClass,
    minimal,
  } = props;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone();
  const { reloadAppConfig } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!acceptedFiles.length) {
      return;
    }

    (async () => {
      try {
        await importSchemas(acceptedFiles);

        reloadAppConfig();
        router.push("/schemas");
      } catch (e: any) {
        notify.error(e.message);
      }
    })();
  }, [acceptedFiles]);

  return (
    <div className="space-y-5">
      {!minimal ? (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
            uploadContainerClass
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {isDragActive
                ? "Drop the files here ..."
                : "Drag and drop some files here, or click to select files"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">JSON</p>
          </div>
          <input
            {...getInputProps()}
            id="dropzone-file"
            type="file"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-row space-x-2 align-middle items-center">
          <div {...getRootProps()}>
            <input {...getInputProps()} type="file" className="hidden" />
            <Button size="sm" variant="outline">
              <UploadCloud className="mr-2 h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
          
        </div>
      )}
    </div>
  );
};
