import React, { useRef, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { toast } from 'react-toastify';

const ExerciseCreator: React.FC = () => {
    const [descriptionFieldValue, setDescriptionFieldValue] = useState("");
    const [titleFieldValue, setTitleFieldValue] = useState("");
    const [uploadedImage, setUploadedImage] = useState<File[]>([]);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);
    const [uploadedTestFile, setUploadedTestFile] = useState<File | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const codeInputRef = useRef<HTMLInputElement>(null);
    const testInputRef = useRef<HTMLInputElement>(null);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescriptionFieldValue(e.target.value);
    };
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleFieldValue(e.target.value);
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedImage(Array.from(e.target.files));
        }
    };
    const handleCodeFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedCodeFiles(Array.from(e.target.files));
        }
    };
    const handleTestFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedTestFile(e.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', titleFieldValue);
        formData.append('description', descriptionFieldValue);

        uploadedImage.forEach((image) => {
            formData.append('images[]', image);
        });

        uploadedCodeFiles.forEach((file) => {
            formData.append('codeFiles[]', file);
        });

        if (uploadedTestFile) {
            formData.append('testFile', uploadedTestFile);
        }

        axiosClient.post('/exercise', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                console.log(data)
                toast.success("Exercise created!");
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold mb-6">Create Exercise</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title-field" className="block text-lg font-medium mb-1">Title:</label>
                        <input
                            id="title-field"
                            type="text"
                            value={titleFieldValue}
                            onChange={handleTitleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="description-field" className="block text-lg font-medium mb-1">Description:</label>
                        <textarea
                            id="description-field"
                            value={descriptionFieldValue}
                            rows={6}
                            onChange={handleDescriptionChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-lg font-medium mb-1">Upload Picture/GIF:</label>
                            <button type="button" onClick={() => imageInputRef.current?.click()} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2 w-full">Select Image Files</button>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*,image/gif"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                {uploadedImage.map((file, index) => <li key={index}>{file.name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <label className="block text-lg font-medium mb-1">Upload Code Files:</label>
                            <button type="button" onClick={() => codeInputRef.current?.click()} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2 w-full">Select Code Files</button>
                            <input
                                ref={codeInputRef}
                                type="file"
                                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json,.php"
                                multiple
                                onChange={handleCodeFilesUpload}
                                className="hidden"
                            />
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                {uploadedCodeFiles.map((file, index) => <li key={index}>{file.name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <label className="block text-lg font-medium mb-1">Test Files:</label>
                            <button type="button" onClick={() => testInputRef.current?.click()} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2 w-full">Select Test Files</button>
                            <input
                                ref={testInputRef}
                                type="file"
                                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json,.php"
                                onChange={handleTestFileUpload}
                                className="hidden"
                            />
                            {uploadedTestFile && (
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                    <li>{uploadedTestFile.name}</li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-blue-600 text-white text-lg py-2 px-4 rounded-md hover:bg-blue-700 transition">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExerciseCreator;