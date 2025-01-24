import React, { useState } from "react";
import axiosClient from "../axios-client.tsx";
import {useStateContext} from "../contexts/ContextProvider.tsx";

const ExerciseCreator: React.FC = () => {
    const [descriptionFieldValue, setDescriptionFieldValue] = useState("");
    const [titleFieldValue, setTitleFieldValue] = useState("");
    const [uploadedImage, setUploadedImage] = useState<File []>([]);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);
    const {setToken}= useStateContext();


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

    const handleSubmit = (event:any) => {
        event.preventDefault()
        const formData = new FormData();

        formData.append('title', titleFieldValue);
        formData.append('description', descriptionFieldValue);

        uploadedImage.forEach((image) => {
            console.log(image.name, image.type);
            formData.append('images[]', image); // Use 'images[]' to send as an array
        });

        uploadedCodeFiles.forEach((file) => {
            console.log(file.name, file.type);
            formData.append('files[]', file); // Use 'files[]' to send as an array
        });

        console.log("formData: ", formData)
        axiosClient.post('/exercise', formData,{
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
    };

    return (
        <div className="exercise-creator-container">
            <h1>Create Exercise</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title-field">Title:</label>
                    <input
                        id="title-field"
                        type="text"
                        value={titleFieldValue}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description-field">Description:</label>
                    <textarea
                        id="description-field"
                        value={descriptionFieldValue}
                        rows={10}
                        cols={30}
                        onChange={handleDescriptionChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image-upload">Upload Picture/GIF:</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*,image/gif"
                        multiple
                        onChange={handleImageUpload}
                    />
                    <ul>
                        {uploadedImage.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="form-group">
                    <label htmlFor="code-files-upload">Upload Code Files:</label>
                    <input
                        id="code-files-upload"
                        type="file"
                        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json"
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
);
};

export default ExerciseCreator;
