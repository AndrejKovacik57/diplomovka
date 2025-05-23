import React, { useState } from "react";
import axiosClient from "../axios-client.tsx";
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import FileDropzone from "./FileDropZone.tsx";



const ExerciseCreator: React.FC = () => {
    const [descriptionFieldValue, setDescriptionFieldValue] = useState("");
    const [titleFieldValue, setTitleFieldValue] = useState("");
    const [uploadedImage, setUploadedImage] = useState<File[]>([]);
    const [uploadedCodeFiles, setUploadedCodeFiles] = useState<File[]>([]);
    const [uploadedTestFile, setUploadedTestFile] = useState<File | null>(null);
    const { t } = useTranslation();


    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescriptionFieldValue(e.target.value);
    };
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleFieldValue(e.target.value);
    };


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', titleFieldValue);
        formData.append('description', descriptionFieldValue);

        uploadedImage.forEach((image) => {
            formData.append('images[]', image);
        });

        uploadedCodeFiles.forEach((file) => {
            formData.append('codeFiles[]', file);
        });

        if (uploadedTestFile) {
            formData.append('testFile', uploadedTestFile);
        }

        axiosClient.post('/exercises', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                console.log(data)
                toast.success("Exercise created!");
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold mb-6">{t('createExercise')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title-field" className="block text-lg font-medium mb-1">{t('title')}:</label>
                        <input
                            id="title-field"
                            type="text"
                            value={titleFieldValue}
                            onChange={handleTitleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="description-field" className="block text-lg font-medium mb-1">{t('description')}:</label>
                        <textarea
                            id="description-field"
                            value={descriptionFieldValue}
                            rows={6}
                            onChange={handleDescriptionChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FileDropzone
                            label={t('uploadPictureGif')}
                            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                            onDrop={(acceptedFiles) => setUploadedImage(acceptedFiles)}
                            files={uploadedImage}
                        />
                        <FileDropzone
                            label={t('uploadCodeFiles')}
                            accept={{
                                'text/plain': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.json', '.php']
                            }}
                            onDrop={(acceptedFiles) => setUploadedCodeFiles(acceptedFiles)}
                            files={uploadedCodeFiles}
                        />
                        <FileDropzone
                            label={t('uploadTestFiles')}
                            accept={{
                                'text/plain': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.json', '.php']
                            }}
                            multiple={false}
                            onDrop={(acceptedFiles) => setUploadedTestFile(acceptedFiles[0])}
                            files={uploadedTestFile ? [uploadedTestFile] : []}
                        />
                    </div>

                    <div>
                        <button type="submit" className="w-full bg-blue-600 text-white text-lg py-2 px-4 rounded-md hover:bg-blue-700 transition">{t('submit')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExerciseCreator;