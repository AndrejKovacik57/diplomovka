import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";

const ExerciseDisplay: React.FC = () => {
    const [exercises, setExercises] = useState<{ id: number; title: string; description: string }[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [exerciseDetails, setExerciseDetails] = useState<{
        exercise: { title: string; description: string };
        images: { id: number; file_name: string; file_data: string }[];
        files: { id: number; file_name: string; file_data: string }[];
    } | null>(null);

    useEffect(() => {
        axiosClient.get("/exercise")
            .then(({ data }) => {
                setExercises(data.exercises);
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedExerciseId !== null) {
            axiosClient.get(`/exercise/${selectedExerciseId}`)
                .then(({ data }) => {
                    setExerciseDetails(data);
                })
                .catch((error) => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                    }
                });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="exercise" className="block text-lg font-semibold mb-2">Select an Exercise:</label>
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
                            Submit
                        </button>
                    </div>
                </form>

                {exerciseDetails && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-2">{exerciseDetails.exercise.title}</h2>
                        <p className="mb-4">{exerciseDetails.exercise.description}</p>

                        <div className="mb-6">
                            <h4 className="text-xl font-semibold mb-2">Images</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {exerciseDetails.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={`data:image/${image.file_name.split(".").pop()};base64,${image.file_data}`}
                                        alt={image.file_name}
                                        className="w-full h-auto rounded-md object-contain"
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xl font-semibold mb-2">Attached Files</h4>
                            <ul className="list-disc list-inside">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseDisplay;
