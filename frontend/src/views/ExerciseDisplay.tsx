import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";

const ExerciseDisplay: React.FC = () => {
    const [exercises, setExercises] = useState<{ id: number; title: string; description: string }[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [exerciseDetails, setExerciseDetails] = useState<{ title: string; description: string; images: { id: number; file_name: string; file_data: string }[]; files: { id: number; file_name: string; file_data: string }[] } | null>(null);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);


    useEffect(() => {axiosClient.get('/exercise',)
        .then(({data}) => {
            console.log(data);
            setExercises(data);
        })
        .catch(error =>{
            const response = error.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
            }
        })
    }, []);

    const handleCodeFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedCodeFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedExerciseId !== null) {

            axiosClient.get(`/exercise/${selectedExerciseId}`)
                .then(({data}) => {
                    console.log(data);
                    setExerciseDetails(data);
                })
                .catch(error =>{
                    const response = error.response;
                    if(response && response.status === 422){
                        console.log(response.data.errors);
                    }
                })

        }
    };
    const handleSubmitSolution = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('exerciseId', `${selectedExerciseId}`);

        uploadedCodeFiles.forEach((file) => {
            console.log(file.name, file.type);
            formData.append('codeFiles[]', file); // Use 'files[]' to send as an array
        });

        axiosClient.post('/solution', formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({data}) => {
                console.log(data)
            })
            .catch(error =>{
                const response = error.response;
                if(response && response.status === 422){
                    console.log(response.data.errors);
                }
            })
        console.log("handleSubmitSolution");
    };

    return (
        <div className="exercise-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exercise">Select an Exercise:</label>
                    <select
                        id="exercise"
                        className="form-control"
                        onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
                        required
                    >
                        <option value="">-- Select --</option>
                        {exercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>{exercise.title}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <button className="btn">Submit</button>
                </div>
            </form>

            {exerciseDetails && (
                <div className="exercise-details">
                    <h3>{exerciseDetails.title}</h3>
                    <p>{exerciseDetails.description}</p>

                    <div className="exercise-media">
                        <h4>Images</h4>
                        <div className="image-gallery">
                            {exerciseDetails.images.map(image => (
                                <img
                                    key={image.id}
                                    src={`data:image/${image.file_name.split('.').pop()};base64,${image.file_data}`}
                                    alt={image.file_name}
                                    className="exercise-image"
                                />
                            ))}
                        </div>

                        <h4>Files</h4>
                        <ul className="file-list">
                            {exerciseDetails.files.map(file => (
                                <li key={file.id}>
                                    <a href={`data:application/octet-stream;base64,${file.file_data}`} download={file.file_name}>{file.file_name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="exercise-solution">

                        <form onSubmit={handleSubmitSolution}>
                            <div className="form-group">
                                <label htmlFor="code-files-upload">Upload Code Files:</label>
                                <input
                                    id="code-files-upload"
                                    type="file"
                                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json,.php"
                                    multiple
                                    onChange={handleCodeFilesUpload}
                                />
                                {uploadedCodeFiles.length > 0 && (
                                    <ul>
                                        {uploadedCodeFiles.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="form-group">
                                <button className="btn">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseDisplay;
