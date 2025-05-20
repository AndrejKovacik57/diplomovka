    import React, { useEffect, useState } from "react";
    import axiosClient from "../axios-client.tsx";
    import {toast} from "react-toastify";
    import Spinner from "../components/Spinner.tsx";

    interface TestResult {
        id: number;
        test_name: string;
        status: string;
        message: string;
    }

    interface Solution {
        id: number;
        file_name: string;
        file_data: string
        test_status: string;
        test_output: string;
        submitted_at: string;
        test_results: TestResult[];
    }

    interface ExerciseWithSolutions {
        id: number;
        title: string;
        description: string;
        solutions: Solution[];
    }

    const CourseDisplay: React.FC = () => {
        const [courses, setCourses] = useState<{ id: number; name: string; semester: string; year: number;}[]>([]);
        const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
        const [courseDetails, setCourseDetails] = useState<{
            description: string;
            uids: { uid: string; enrolled: boolean ; user_id: number; first_name:string; last_name:string}[];
            exercises: { id: number; title: string; description: string; start_datetime: string; end_datetime: string;}[];
        } | null>(null);

        const [userExercises, setUserExercises] = useState<ExerciseWithSolutions[]>([]);
        const [exercises, setExercises] = useState<{ id: number; title: string; description: string }[]>([]);
        const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
        const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
        const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);
        const [selectedUserName, setSelectedUserName] = useState<{ firstName: string; lastName: string } | null>(null);
        const [exerciseMessage, setExerciseMessage] = useState<string | null>(null);
        const [exerciseErrorMessage, setErrorExerciseMessage] = useState<string | null>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            axiosClient.get('/exercise')
                .then(({ data }) => {
                    // If courseDetails exist, filter out already added exercises
                    if (courseDetails) {
                        const existingExerciseIds = new Set(courseDetails.exercises.map(e => e.id));
                        const filteredExercises = data.exercises.filter(
                            (exercise: { id: number }) => !existingExerciseIds.has(exercise.id)
                        );
                        setExercises(filteredExercises);
                    } else {
                        // If no course selected, just show all
                        setExercises(data.exercises);
                    }
                })
                .catch(error => {
                    const response = error.response;
                    if (response && response.status === 422) {
                        console.log(response.data.errors);
                    }
                });
        }, [courseDetails]); // Re-run when courseDetails change


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

        useEffect(() => {
            if (selectedUserId !== null) {
                document.body.style.overflow = 'hidden'; // 🚫 Disable background scroll
            } else {
                document.body.style.overflow = ''; // ✅ Restore default scroll
            }

            // Optional cleanup just in case
            return () => {
                document.body.style.overflow = '';
            };
        }, [selectedUserId]);


        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            console.log("Selected Course ID:", selectedCourseId);
            setUserExercises([]);

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

                    setCourseDetails(prevDetails => prevDetails && {
                        ...prevDetails,
                        exercises: [...prevDetails.exercises, data.exercise]
                    });

                    console.log('course details', courseDetails);
                    toast.success("Exercise added!");
                })
                .catch(error => {
                    const response = error.response;

                    if (response) {
                        if (response.status === 409) {
                            // Handle conflict (exercise already added)
                            setErrorExerciseMessage("Exercise has already been added to this course.");
                        } else if (response.status === 422) {
                            // Handle validation errors
                            console.log(response.data.errors);
                            setErrorExerciseMessage("Validation error occurred.");
                        } else {
                            // Handle other errors
                            console.error("Unexpected error:", response.data.message || error.message);
                            setErrorExerciseMessage("An unexpected error occurred.");
                        }
                    } else {
                        setErrorExerciseMessage("Network error or no response received.");
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

            axiosClient.post('/course/exercise/updateDates', {
                id: exerciseId,
                start: exercise.start_datetime,
                end: exercise.end_datetime,
            })
                .then(({ data }) => {
                    console.log("Update Response:", data.message);
                    setExerciseMessage(`Exercise ${exerciseId} updated successfully.`);
                    toast.success("Exercise date changed!");
                })
                .catch(error => {
                    const response = error.response;

                    if (response) {
                        if (response.status === 422) {
                            console.log(response.data.errors);
                            setErrorExerciseMessage("Validation error occurred.");
                        } else {
                            console.error("Error updating exercise:", response.data.message || error.message);
                            setErrorExerciseMessage("An unexpected error occurred.");
                        }
                    } else {
                        setErrorExerciseMessage("Network error or no response received.");
                    }
                });

        };
        const handleUserClick = (userId: number) => {
            console.log(`Clicked User ID: ${userId} Course ID: ${selectedCourseId}`);
            setSelectedUserId(userId);
            setLoading(true);

            // Find user from courseDetails
            if (courseDetails) {
                const user = courseDetails.uids.find(u => u.user_id === userId);
                if (user) {
                    setSelectedUserUid(user.uid);
                    setSelectedUserName({ firstName: user.first_name, lastName: user.last_name });
                }
            }

            axiosClient
                .get(`/course/${selectedCourseId}/user/${userId}/exercise/solutions`)
                .then((response) => {
                    if (response.status === 204) {
                        setSelectedUserId(null);
                        toast.error("No exercises to find solutions for!");
                    } else {
                        setUserExercises(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user solutions:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        const handleCloseUserDialog = () => {
            setSelectedUserId(null);
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
                                        <span><strong>First name</strong></span>
                                        <span><strong>Last name</strong></span>
                                        <span><strong>In Course</strong></span>
                                    </div>
                                    {courseDetails.uids.map(user => (
                                        <div className="item-list-row" key={user.uid}>
                                            {user.user_id ? (
                                                <button
                                                    onClick={() => handleUserClick(user.user_id,)}
                                                    className="user-clickable"
                                                >
                                                    {user.uid}
                                                </button>
                                            ) : (
                                                <span>{user.uid}</span>
                                            )}
                                            <span>{user.first_name}</span>
                                            <span>{user.last_name}</span>
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
                    {exerciseErrorMessage && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            {exerciseErrorMessage}
                        </div>
                    )}
                    {selectedUserId && (

                        <div className="modal-backdrop">
                            <div className="user-dialog">
                                <button className="close-button" onClick={handleCloseUserDialog}>✖</button>
                                <div className="solution-title">
                                    {selectedUserName && (
                                        <p><strong>Name:</strong> {selectedUserName.firstName} {selectedUserName.lastName}</p>
                                    )}
                                    <p><strong>User UID:</strong> {selectedUserUid}</p>
                                </div>

                                <div className="user-dialog-content">

                                    {loading ? (
                                        <Spinner/>
                                    ):(
                                    userExercises.length >= 0 ? (
                                        userExercises.map((exercise) => (
                                            exercise.solutions.map((solution) => (
                                                <div className="solution-card">
                                                    <h4>Solution for {exercise.title}</h4>
                                                    <div className="solution-title">
                                                        <div><strong>Status:</strong> {solution.test_status}</div>
                                                        <div><strong>Submitted At:</strong> {new Date(solution.submitted_at).toLocaleString()}</div>
                                                        <div>
                                                            <strong>Test result:</strong> {solution.test_output}
                                                        </div>
                                                        <div>
                                                            <a href={`data:application/octet-stream;base64,${solution.file_data}`} download={solution.file_name}>{solution.file_name}</a>

                                                        </div>

                                                    </div>


                                                    {solution && solution.test_results.length > 0 ? (
                                                        <div className="course-details">
                                                            <div className="item-list">
                                                                <div className="item-list-grid">
                                                                    <div className="item-list-header">
                                                                        <span><strong>Test Name</strong></span>
                                                                        <span><strong>Status</strong></span>
                                                                    </div>
                                                                    {solution.test_results.map((result) => (
                                                                        <div className="item-list-row" key={result.id}>
                                                                            <span>{result.test_name}</span>
                                                                            <span>{result.status}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p>No test results found.</p>
                                                    )}

                                                </div>
                                            )
                                        ))

                                    )):(
                                        <div>empty</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        );
    };

    export default CourseDisplay;
