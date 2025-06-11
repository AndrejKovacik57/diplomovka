import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useTranslation } from "react-i18next";
import FileDropzone from "./FileDropZone.tsx";
import {toast} from "react-toastify";

export interface Exercise {
    id: number;
    title: string;
    description: string;
}

export interface ExerciseDetail {
    exercise: {
        title: string;
        description: string;
    };
    images: FileData[];
    files: FileData[];
}

export interface FileData {
    id: number;
    file_name: string;
    file_data: string;
}


const ExerciseDisplay: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableExercise, setEditableExercise] = useState<ExerciseDetail | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File[]>([]);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);
    const [uploadedTestFile, setUploadedTestFile] = useState<File | null>(null);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        axiosClient.get("/exercises")
            .then(({ data }) => {
                console.log(data);
                setExercises(data.exercises);
            })
            .catch((error) => console.error(error.response?.data.errors));
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedExerciseId !== null) {
            axiosClient.get(`/exercises/${selectedExerciseId}`)
                .then(({ data }) => {
                    setExerciseDetails(data);
                    setEditableExercise(JSON.parse(JSON.stringify(data)));
                    setIsEditMode(false);
                })
                .catch((error) => console.error(error.response?.data.errors));
        }
    };

    const handleEditToggle = () => {
        if (isEditMode) {
            setEditableExercise(JSON.parse(JSON.stringify(exerciseDetails)));
        }
        setIsEditMode(!isEditMode);
    };

    const handleChange = (field: string, value: string) => {
        setEditableExercise((prev: ExerciseDetail | null) => {
            if (!prev) return prev;

            return {
                ...prev,
                exercise: {
                    ...prev.exercise,
                    [field]: value
                }
            };
        });
    };


    const handleSaveChanges = async () => {
        if (!editableExercise || selectedExerciseId === null) return;

        const formData = new FormData();
        formData.append('title', editableExercise.exercise.title);
        formData.append('description', editableExercise.exercise.description);

        uploadedImage.forEach((file) => formData.append('images[]', file));
        console.log(uploadedImage)

        uploadedCodeFiles.forEach((file) => formData.append('codeFiles[]', file));
        if (uploadedTestFile) {
            formData.append('testFile', uploadedTestFile);
        }
        console.log(uploadedImage)
        console.log(uploadedTestFile)
        console.log(uploadedCodeFiles)

        formData.append('_method', 'PUT');
        axiosClient.post(`/exercises/${selectedExerciseId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                setExerciseDetails(data.exercise);
                setIsEditMode(false);
                console.log("Exercise updated successfully:", data.exercise);
                toast.success("Exercise updated successfully!");
            })
            .catch(error => {
                const response = error.response;

                if (response) {
                    if (response.status === 422) {
                        console.log('Validation error:', response.data.errors);
                    } else if (response.status === 413) {
                        console.error('File too large. Please upload a smaller file.');
                        toast.error('The uploaded file is too large. Please reduce the file size.');
                    } else {
                        console.error('An unexpected error occurred:', response);
                    }
                } else {
                    console.error('No response from server. Possible network error or CORS issue.');
                }
            });

    };


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="exercise" className="block text-lg font-semibold mb-2">{t('selectExercise')}</label>
                        <select
                            id="exercise"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring focus:ring-blue-300"
                            onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
                            required
                        >
                            <option value="">-- Select --</option>
                            {exercises.map((exercise) => (
                                <option key={exercise.id} value={exercise.id}>{exercise.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-lg hover:bg-blue-600 transition"
                        >
                            {t('submit')}
                        </button>
                    </div>
                </form>

                {exerciseDetails && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-2">{isEditMode ? (
                                <input
                                    type="text"
                                    value={editableExercise?.exercise.title ?? ""}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            ) : (
                                exerciseDetails.exercise.title
                            )}</h2>
                            <button
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                onClick={handleEditToggle}
                            >
                                {isEditMode ? t('cancel') : t('edit')}
                            </button>
                        </div>

                        {isEditMode ? (
                            <textarea
                                value={editableExercise?.exercise.description ?? ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="w-full border rounded px-3 py-2 mb-4"
                            />
                        ) : (
                            <p style="white-space: pre-wrap;" className="mb-4">{exerciseDetails.exercise.description}</p>
                        )}

                        {isEditMode ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <FileDropzone
                                    label={t('uploadPictureGif')}
                                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                                    onDrop={setUploadedImage}
                                    files={uploadedImage}
                                />
                                <FileDropzone
                                    label={t('uploadCodeFiles')}
                                    accept={{ 'text/plain': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.json', '.php'] }}
                                    onDrop={setUploadedCodeFiles}
                                    files={uploadedCodeFiles}
                                />
                                <FileDropzone
                                    label={t('uploadTestFiles')}
                                    accept={{ 'text/plain': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.json', '.php'] }}
                                    multiple={false}
                                    onDrop={(files) => setUploadedTestFile(files[0])}
                                    files={uploadedTestFile ? [uploadedTestFile] : []}
                                />
                            </div>
                        ) : (
                            <div className="mb-6">
                                <h4 className="text-xl font-semibold mb-2">{t('images')}</h4>
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
                        )}

                        {!isEditMode && (
                            <div className="text-center">
                                <h4 className="text-xl font-semibold mb-2">{t('attachedFiles')}</h4>
                                <ul className="list-disc list-inside inline-block text-left">
                                    {exerciseDetails.files.map((file) => (
                                        <li key={file.id}>
                                            <a
                                                href={`data:application/octet-stream;base64,${file.file_data}`}
                                                download={file.file_name}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {file.file_name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {isEditMode && (
                            <div className="mt-4 text-center">
                                <button
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-lg hover:bg-blue-600 transition"
                                    onClick={handleSaveChanges}
                                >
                                    {t('submit')}
                                </button>
                            </div>
                        )}
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

export default ExerciseDisplay;
