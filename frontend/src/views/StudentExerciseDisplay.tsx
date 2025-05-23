import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import { toast } from "react-toastify";
import FileDropzone from "./FileDropZone.tsx";


const StudentExerciseDisplay = () => {
    const { courseId, exerciseId } = useParams();
    const { user } = useStateContext();
    const [exerciseDetails, setExerciseDetails] = useState<{
        exercise: { title: string; description: string };
        images: { id: number; file_name: string; file_data: string }[];
        files: { id: number; file_name: string; file_data: string }[];
    } | null>(null);
    const [uploadedCodeFile, setUploadedCodeFile] = useState<File | null>(null);

    const [modalImage, setModalImage] = useState<string | null>(null);

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
            .then(() => {
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
                                {exerciseDetails.images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative group cursor-zoom-in"
                                        onClick={() =>
                                            setModalImage(`data:image/${image.file_name.split(".").pop()};base64,${image.file_data}`)
                                        }
                                    >
                                        <img
                                            src={`data:image/${image.file_name.split(".").pop()};base64,${image.file_data}`}
                                            alt={image.file_name}
                                            className="max-w-full h-auto rounded-md object-contain"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            Click to enlarge
                                        </div>
                                    </div>

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
                                <label htmlFor="code-files-upload" className="block font-semibold mb-1">Upload Code File:</label>
                                <FileDropzone
                                    label="Upload Code File"
                                    accept={{
                                        'text/plain': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.json', '.php']
                                    }}
                                    onDrop={(acceptedFiles) => {
                                        if (acceptedFiles.length > 0) {
                                            setUploadedCodeFile(acceptedFiles[0]);
                                        }
                                    }}
                                    files={uploadedCodeFile ? [uploadedCodeFile] : []}
                                    multiple={false}
                                />

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
            {modalImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={() => setModalImage(null)}
                >
                    <div
                        className="max-w-4xl max-h-[90%] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={modalImage} alt="Enlarged" className="rounded-lg shadow-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentExerciseDisplay;