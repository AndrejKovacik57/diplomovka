import React, {useEffect, useState} from "react";
import axiosClient from "../axios-client.tsx";

const ExerciseDisplay: React.FC = () => {
    const [exercises, setExercises] = useState<{ id: number; title: string; description: string }[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [exerciseDetails, setExerciseDetails] = useState<{ exercise: { title: string; description: string }; images: { id: number; file_name: string; file_data: string }[]; files: { id: number; file_name: string; file_data: string }[] } | null>(null);


    useEffect(() => {axiosClient.get('/exercise',)
        .then(({data}) => {
            console.log(data);
            setExercises(data.exercises);
        })
        .catch(error =>{
            const response = error.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
            }
        })
    }, []);



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


    return (
        <div className="container">
            <div className="user-box">
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
                        <button className="btn-primary">Submit</button>
                    </div>
                </form>
                <hr/>

                {exerciseDetails && (
                    <div className="exercise-details">
                        <h2>{exerciseDetails.exercise.title}</h2>
                        <p>{exerciseDetails.exercise.description}</p>

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

                            <h4>Attached Files</h4>
                            <ul className="file-list">
                                {exerciseDetails.files.map(file => (
                                    <li key={file.id}>
                                        <a href={`data:application/octet-stream;base64,${file.file_data}`} download={file.file_name}>{file.file_name}</a>
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
