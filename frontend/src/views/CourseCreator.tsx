import React, { useRef, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { toast } from "react-toastify";

const CourseCreator: React.FC = () => {
    const [nameFieldValue, setNameFieldValue] = useState("");
    const [semester, setSemester] = useState<"summer" | "winter">("summer");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uploadedCSVFiles, setUploadedCSVFiles] = useState<File[]>([]);
    const csvInputRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameFieldValue(e.target.value);
    };

    const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSemester(e.target.value as "summer" | "winter");
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYear(parseInt(e.target.value));
    };

    const handleCSVFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedCSVFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", nameFieldValue);
        formData.append("semester", semester);
        formData.append("year", year.toString());

        uploadedCSVFiles.forEach((file) => {
            formData.append("csvFiles[]", file);
        });

        axiosClient
            .post("/course", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(({ data }) => {
                console.log(data)
                toast.success("Course created!");
            })
            .catch((error) => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="flex justify-center p-4 md:p-8">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6 md:p-12">
                <h2 className="text-2xl font-semibold mb-6 text-center">Create Course</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="name-field" className="block text-lg font-semibold mb-2">
                            Title:
                        </label>
                        <input
                            id="name-field"
                            type="text"
                            value={nameFieldValue}
                            onChange={handleNameChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Semester */}
                    <div>
                        <label htmlFor="semester-field" className="block text-lg font-semibold mb-2">
                            Semester:
                        </label>
                        <select
                            id="semester-field"
                            value={semester}
                            onChange={handleSemesterChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="summer">Summer</option>
                            <option value="winter">Winter</option>
                        </select>
                    </div>

                    {/* Year */}
                    <div>
                        <label htmlFor="year-field" className="block text-lg font-semibold mb-2">
                            Year:
                        </label>
                        <input
                            id="year-field"
                            type="number"
                            value={year}
                            min="2000"
                            max="2100"
                            onChange={handleYearChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* CSV Upload */}
                    <div>
                        <label className="block text-lg font-semibold mb-2">CSV File:</label>
                        <button
                            type="button"
                            onClick={() => csvInputRef.current?.click()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm"
                        >
                            Select CSV File
                        </button>
                        <input
                            ref={csvInputRef}
                            type="file"
                            accept=".csv"
                            multiple
                            onChange={handleCSVFilesUpload}
                            className="hidden"
                        />
                        {uploadedCSVFiles.length > 0 && (
                            <ul className="mt-3 list-disc list-inside text-sm text-gray-700">
                                {uploadedCSVFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md text-lg font-semibold transition duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseCreator;
