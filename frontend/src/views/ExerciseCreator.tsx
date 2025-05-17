import React, {useRef, useState} from "react";
import axiosClient from "../axios-client.tsx";

const ExerciseCreator: React.FC = () => {
    const [descriptionFieldValue, setDescriptionFieldValue] = useState("");
    const [titleFieldValue, setTitleFieldValue] = useState("");
    const [uploadedImage, setUploadedImage] = useState<File []>([]);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);
    const [uploadedTestFile, setUploadedTestFile] = useState<File | null>(null);


    // Refs for file inputs
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
            setUploadedTestFile(e.target.files[0]); // Only store one file
        }
    };



    const handleSubmit = (event: React.FormEvent) => {
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
            formData.append('codeFiles[]', file); // Use 'files[]' to send as an array
        });
        if (uploadedTestFile) {
            formData.append('testFile', uploadedTestFile); // Use singular key
        }

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
        <div className="container">
            <div className="user-box">
                <h2 className="form-title">Create Exercise</h2>
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
                    <div className={"file-uploads"}>

                        <div className="form-group form-group-files">
                            <label htmlFor="image-upload">Upload Picture/GIF:</label>
                            <button type="button" className="btn-upload btn-primary" onClick={() => imageInputRef.current?.click()}>
                                Select Image Files
                            </button>
                            <input
                                ref={imageInputRef}
                                id="image-upload"
                                className="input-field-file"
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
                        <div className="form-group form-group-files">
                            <label htmlFor="code-files-upload">Upload Code Files:</label>
                            <button type="button" className="btn-upload btn-primary" onClick={() => codeInputRef.current?.click()}>
                                Select Code Files
                            </button>
                            <input
                                ref={codeInputRef}
                                id="code-files-upload"
                                className="input-field-file"
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
                        <div className="form-group form-group-files">
                            <label htmlFor="test-files-upload">Test Files:</label>
                            <button type="button" className="btn-upload btn-primary" onClick={() => testInputRef.current?.click()}>
                                Select Test Files
                            </button>
                            <input
                                ref={testInputRef}
                                id="test-files-upload"
                                className="input-field-file"
                                type="file"
                                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.json,.php"
                                onChange={handleTestFileUpload}
                            />
                            {uploadedTestFile && (
                                <ul>
                                    <li>{uploadedTestFile.name}</li>
                                </ul>
                            )}

                        </div>

                    </div>


                    <div className="form-group">
                        <button className="btn-primary">Submit</button>
                    </div>
                </form>

            </div>
        </div>
);
};

export default ExerciseCreator;
