import React, { useRef, useState } from "react";

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
        formData.append('name', nameFieldValue);
        formData.append('semester', semester);
        formData.append('year', year.toString());

        uploadedCSVFiles.forEach((file) => {
            formData.append('csvFiles[]', file);
        });

        // Example: Send formData to API
        console.log("Submitting:", { nameFieldValue, semester, year, uploadedCSVFiles });
        // axios.post('/api/courses', formData)
    };

    return (
        <div className="container">
            <div className="user-box">
                <h2 className="form-title">Create Course</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name-field">Title:</label>
                        <input
                            id="name-field"
                            className="input-field"
                            type="text"
                            value={nameFieldValue}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="semester-field">Semester:</label>
                        <select
                            id="semester-field"
                            className="input-field"
                            value={semester}
                            onChange={handleSemesterChange}
                        >
                            <option value="summer">Summer</option>
                            <option value="winter">Winter</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="year-field">Year:</label>
                        <input
                            id="year-field"
                            className="input-field"
                            type="number"
                            value={year}
                            min="2000"
                            max="2100"
                            onChange={handleYearChange}
                        />
                    </div>

                    <div className="form-group form-group-files">
                        <label>Csv File:</label>
                        <button type="button" className="btn-upload btn-primary" onClick={() => csvInputRef.current?.click()}>
                            Select CSV File
                        </button>
                        <input
                            ref={csvInputRef}
                            className="input-field-file"
                            type="file"
                            accept=".csv"
                            multiple
                            onChange={handleCSVFilesUpload}
                            style={{ display: 'none' }}
                        />
                        {uploadedCSVFiles.length > 0 && (
                            <ul>
                                {uploadedCSVFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <button className="btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseCreator;
