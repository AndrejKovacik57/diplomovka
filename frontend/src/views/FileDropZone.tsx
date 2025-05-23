// components/FileDropzone.tsx
import React from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    files: File[];
    label: string;
    accept: Record<string, string[]>;
    multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, files, label, accept, multiple = true }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    });

    return (
        <div
            className={`flex flex-col items-center justify-center h-40 border-4 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer bg-blue-50 hover:bg-blue-100 transition duration-300 ease-in-out text-blue-700`}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <p className="text-center font-semibold">
                {isDragActive ? '📂 Drop the files here...' : `📎 ${label}`}
            </p>
            {files.length > 0 && (
                <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
                    {files.map((file: File, index: number) => <li key={index}>{file.name}</li>)}
                </ul>
            )}
        </div>
    );
};

export default FileDropzone;
