import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";

const CourseDisplay: React.FC = () => {
    const [courses, setCourses] = useState<{ id: number; name: string; semester: string; year: number;}[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [courseDetails, setCourseDetails] = useState<{
        description: string;
        uids: { uid: string; enrolled: boolean }[];
        exercises: { id: number; title: string; description: string; start_datetime: string; end_datetime: string;}[];
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
                    uids: data.uids,
                    exercises: data.exercises
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
    const handleDatetimeChange = (
        exerciseId: number,
        field: 'start_datetime' | 'end_datetime',
        value: string
    ) => {
        if (!courseDetails) return;

        const updatedExercises = courseDetails.exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    [field]: value
                };
            }
            return ex;
        });

        setCourseDetails({ ...courseDetails, exercises: updatedExercises });
    };
    const handleUpdateExerciseDates = async (exerciseId: number) => {
        if (!courseDetails) return;

        const exercise = courseDetails.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        try {
            const response = await axiosClient.post('/course/exercise/updateDates', {
                id: exerciseId,
                start: exercise.start_datetime,
                end: exercise.end_datetime,
            });

            console.log(response.data.message);
            setExerciseMessage(`Exercise ${exerciseId} updated successfully.`);
        } catch (error: any) {
            const response = error.response;
            if (response && response.status === 422) {
                console.log(response.data.errors);
            } else {
                console.error("Error updating exercise:", error);
            }
        }
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
                        <div className="item-list">
                            <h4>Users:</h4>
                            <div className="item-list-grid">
                                <div className="item-list-header">
                                    <span><strong>UID</strong></span>
                                    <span><strong>In Course</strong></span>
                                </div>
                                {courseDetails.uids.map(user => (
                                    <div className="item-list-row" key={user.uid}>
                                        <span>{user.uid}</span>
                                        <span>{user.enrolled ? "🟢" : "🔴"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {courseDetails && courseDetails.exercises.length > 0 && (
                    <div className="course-details">
                        <div className="item-list">
                            <h4>Exercises:</h4>
                            <div className="item-list-grid">
                                <div className="item-list-header">
                                    <span><strong>Exercise</strong></span>
                                    <span><strong>Start</strong></span>
                                    <span><strong>End</strong></span>
                                    <span><strong></strong></span>
                                </div>
                                {courseDetails.exercises.map(ex => (
                                    <div className="item-list-row" key={ex.id}>
                                        <span>{ex.id} - {ex.title}</span>
                                        <span>
                                            <input
                                                type="datetime-local"
                                                value={ex.start_datetime?.slice(0, 16) || ""}
                                                onChange={(e) =>
                                                    handleDatetimeChange(ex.id, "start_datetime", e.target.value)
                                                }
                                            />
                                        </span>
                                        <span>
                                            <input
                                                type="datetime-local"
                                                value={ex.end_datetime?.slice(0, 16) || ""}
                                                onChange={(e) =>
                                                    handleDatetimeChange(ex.id, "end_datetime", e.target.value)
                                                }
                                            />
                                        </span>
                                        <span>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleUpdateExerciseDates(ex.id)}
                                                type="button"
                                            >
                                                Save
                                            </button>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {courseDetails && (
                    <form onSubmit={handleExerciseSubmit}>
                        <div className="form-group">
                            <label htmlFor="exercise">Add an Exercise:</label>
                            <select
                                id="exercise"
                                className="form-control"
                                onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
                                required
                            >
                                <option value="">-- Add Exercise --</option>
                                {exercises.map((exercise) => (
                                    <option key={exercise.id} value={exercise.id}>
                                        {exercise.id + " " + exercise.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn-primary">Submit Exercise</button>
                        </div>
                    </form>
                )}
                {exerciseMessage && (
                    <div style={{ color: 'green', marginTop: '10px' }}>
                        {exerciseMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDisplay;
