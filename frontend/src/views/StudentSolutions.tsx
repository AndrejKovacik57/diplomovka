import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
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

interface CourseWithSolutions {
    id: number;
    name: string;
    exercises: ExerciseWithSolutions[];
}

const StudentSolutions: React.FC = () => {
    const { user } = useStateContext();
    const [courses, setCourses] = useState<CourseWithSolutions[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const selectedCourse = courses.find((course) => course.id === selectedCourseId);

    useEffect(() => {
        if (user) {
            setLoading(true);
            axiosClient
                .get("/user/courses/exercises/solutions")
                .then(({ data }) => {
                    setCourses(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    console.error("Error loading user solutions:", err);
                });
        }
    }, [user]);

    if (loading) {
        return (
            <div className="container">
                <div className="user-box">
                     <Spinner/>
                </div>
            </div>
        );
    }
    return (
        <div className="container">
            <div className="user-box">
                <h1>Your Solutions</h1>

                {courses.length === 0 ? (
                    <p>No courses with submitted solutions.</p>
                ) : (
                    <>
                        <div className="course-choose">
                            <label htmlFor="course-select">Select a course:</label>
                            <select
                                id="course-select"
                                value={selectedCourseId ?? ""}
                                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                            >
                                <option value="" disabled>Select a course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedCourse && (
                            <div className="course-solutions">
                                {selectedCourse.exercises.map((exercise) => (
                                    <div key={exercise.id} className="exercise-block">
                                        {exercise.solutions.map((solution) => (
                                            <div className="solution-card">
                                                <h4>Solution for {exercise.title}</h4>
                                                <div className="solution-title">
                                                    <div><strong>Status:</strong> {solution.test_status}</div>
                                                    <div><strong>Submitted At:</strong> {new Date(solution.submitted_at).toLocaleString()}</div>
                                                    <div>
                                                        <strong>Message:</strong>
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
                                        ))}

                                        <hr/>

                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentSolutions;
