import React, { useState } from "react";

const ExerciseCreator: React.FC = () => {
    const [textFieldValue, setTextFieldValue] = useState("");
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue(e.target.value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedImage(e.target.files[0]);
        }
    };

    const handleCodeFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedCodeFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = () => {
        // Here you can handle submission logic
        console.log("Text Field Value:", textFieldValue);
        console.log("Uploaded Image:", uploadedImage);
        console.log("Uploaded Code Files:", uploadedCodeFiles);
    };

    return (
        <div className="exercise-creator-container">
            <h1>Create Exercise</h1>
            <div className="form-group">
                <label htmlFor="text-field">Text Field:</label>
                <input
                    id="text-field"
                    type="text"
                    value={textFieldValue}
                    onChange={handleTextChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="image-upload">Upload Picture/GIF:</label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*,image/gif"
                    onChange={handleImageUpload}
                />
                {uploadedImage && <p>Uploaded Image: {uploadedImage.name}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="code-files-upload">Upload Code Files:</label>
                <input
                    id="code-files-upload"
                    type="file"
                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp"
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
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default ExerciseCreator;
