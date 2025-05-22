import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import { toast } from "react-toastify";

const StudentExerciseDisplay = () => {
    const { courseId, exerciseId } = useParams();
    const { user } = useStateContext();
    const [exerciseDetails, setExerciseDetails] = useState<{
        exercise: { title: string; description: string };
        images: { id: number; file_name: string; file_data: string }[];
        files: { id: number; file_name: string; file_data: string }[];
    } | null>(null);
    const [uploadedCodeFile, setUploadedCodeFile] = useState<File | null>(null);

    const solutionInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (user) {
            axiosClient.get(`me/courses/${courseId}/exercises/${exerciseId}/`)
                .then(({ data }) => {
                    setExerciseDetails(data);
                })
                .catch(error => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                    }
                });
        }
    }, [user, courseId, exerciseId]);

    const handleCodeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedCodeFile(e.target.files[0]);
        }
    };

    const handleSubmitSolution = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('exerciseId', `${exerciseId}`);
        formData.append('courseId', `${courseId}`);

        if (uploadedCodeFile) {
            formData.append('codeFile', uploadedCodeFile);
        }

        axiosClient.post('/solutions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(({ }) => {
                toast.success("Solution submitted!");
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 py-8 px-4 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
                {exerciseDetails && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{exerciseDetails.exercise.title}</h2>
                            <p className="text-gray-700">{exerciseDetails.exercise.description}</p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-2">Images</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {exerciseDetails.images.map(image => (
                                    <img
                                        key={image.id}
                                        src={`data:image/${image.file_name.split('.').pop()};base64,${image.file_data}`}
                                        alt={image.file_name}
                                        className="rounded-lg shadow-sm object-contain w-full h-auto"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-2">Attached Files</h4>
                            <ul className="list-disc list-inside text-blue-600">
                                {exerciseDetails.files.map(file => (
                                    <li key={file.id}>
                                        <a href={`data:application/octet-stream;base64,${file.file_data}`} download={file.file_name} className="hover:underline">
                                            {file.file_name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <form onSubmit={handleSubmitSolution} className="space-y-4">
                            <div>
                                <label htmlFor="code-files-upload" className="block font-semibold mb-1">Upload Code Files:</label>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                    onClick={() => solutionInputRef.current?.click()}
                                >
                                    Select Solution Files
                                </button>
                                <input
                                    ref={solutionInputRef}
                                    id="code-files-upload"
                                    type="file"
                                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json,.php"
                                    onChange={handleCodeFileUpload}
                                    className="hidden"
                                />
                                {uploadedCodeFile && (
                                    <p className="mt-2 text-gray-700">Selected file: {uploadedCodeFile.name}</p>
                                )}
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentExerciseDisplay;