import { useParams } from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import axiosClient from "../axios-client.tsx";
import {useStateContext} from "../contexts/ContextProvider.tsx";

const StudentExerciseDisplay = () => {
    const { courseId, exerciseId } = useParams();
    const { user } = useStateContext();
    const [exerciseDetails, setExerciseDetails] = useState<{ exercise: { title: string; description: string }; images: { id: number; file_name: string; file_data: string }[]; files: { id: number; file_name: string; file_data: string }[] } | null>(null);
    const [uploadedCodeFile, setUploadedCodeFile] = useState<File | null>(null);

    const solutionInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (user) {
            axiosClient.get(`user/course/${courseId}/exercise/${exerciseId}/`)
                .then(({ data }) => {
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
    }, [user, courseId, exerciseId]); // Include dependencies


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
            formData.append('codeFile', uploadedCodeFile); // singular
        }


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
        <div className="container">
            <div className="user-box">

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
                        <div className="exercise-solution">

                            <form onSubmit={handleSubmitSolution}>
                                <div className="form-group">
                                    <label htmlFor="code-files-upload">Upload Code Files:</label>
                                    <button type="button" className="btn-upload btn-primary" onClick={() => solutionInputRef.current?.click()}>
                                        Select Solution Files
                                    </button>
                                    <input
                                        ref={solutionInputRef}
                                        id="code-files-upload"
                                        className="input-field-file"
                                        type="file"
                                        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json,.php"
                                        onChange={handleCodeFileUpload}

                                    />
                                    {uploadedCodeFile && (
                                        <ul>
                                            <li>{uploadedCodeFile.name}</li>
                                        </ul>
                                    )}

                                </div>
                                <div className="form-group">
                                    <button className="btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentExerciseDisplay;
