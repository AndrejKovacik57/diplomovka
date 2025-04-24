import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";

const CourseDisplay: React.FC = () => {
    const [courses, setCourses] = useState<{ id: number; name: string; semester: string; year: number;}[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [courseDetails, setCourseDetails] = useState<{
        description: string;
        uids: { uid: string; enrolled: boolean }[];
    } | null>(null);
    const [exercises, setExercises] = useState<{ id: number; title: string; description: string }[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [exerciseMessage, setExerciseMessage] = useState<string | null>(null);

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

    useEffect(() => {
        axiosClient.get('/course')
            .then(({ data }) => {
                console.log('Courses data:', data);
                setCourses(data.courses);
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Selected Course ID:", selectedCourseId);

        axiosClient.get(`/course/${selectedCourseId}`)
            .then(({ data }) => {
                console.log("Course Details:", data);
                setCourseDetails({
                    description: data.course.description,  // assuming course has a description field
                    uids: data.uids
                });
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };
    const handleExerciseSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Selected Course ID:", selectedCourseId);
        console.log("Selected Exercise ID:", selectedExerciseId);
        axiosClient.post(`/course/${selectedCourseId}/exercise/${selectedExerciseId}`)
            .then(({ data }) => {
                console.log("Course Details:", data.message);
                setExerciseMessage(data.message);
            })
            .catch(error => {
                const response = error.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="container">
            <div className="user-box">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="course">Select a Course:</label>
                        <select
                            id="course"
                            className="form-control"
                            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                            required
                        >
                            <option value="">-- Select --</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name + " " + course.semester + " " + course.year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <button className="btn-primary">View Details</button>
                    </div>

                </form>
                {courseDetails && (
                    <div className="course-details">
                        <strong>Course Description:</strong> {courseDetails.description}
                        <div className="user-list">
                            <h4>Users:</h4>
                            <ul>
                                {courseDetails.uids.map(user => (
                                    <li key={user.uid}>
                                        UID: {user.uid} - {user.enrolled ? "🟢" : "🔴"}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* New Exercise Selection Form */}
                        <form onSubmit={handleExerciseSubmit}>
                            <div className="form-group">
                                <label htmlFor="exercise">Select an Exercise:</label>
                                <select
                                    id="exercise"
                                    className="form-control"
                                    onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
                                    required
                                >
                                    <option value="">-- Select Exercise --</option>
                                    {exercises.map((exercise) => (
                                        <option key={exercise.id} value={exercise.id}>
                                            {exercise.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn-primary">Submit Exercise</button>
                            </div>
                        </form>
                        {exerciseMessage && (
                            <div style={{ color: 'green', marginTop: '10px' }}>
                                {exerciseMessage}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDisplay;
