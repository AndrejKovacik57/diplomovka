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
                .get("/me/solutions")
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
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 py-8 px-4 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-5xl">
                <h1 className="text-3xl font-bold mb-6">Your Solutions</h1>

                {courses.length === 0 ? (
                    <p>No courses with submitted solutions.</p>
                ) : (
                    <>
                        <div className="mb-6">
                            <label htmlFor="course-select" className="block font-semibold mb-2">Select a course:</label>
                            <select
                                id="course-select"
                                value={selectedCourseId ?? ""}
                                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg p-2"
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
                            <div className="space-y-6">
                                {selectedCourse.exercises.map((exercise) => (
                                    <div key={exercise.id} className="space-y-4">
                                        {exercise.solutions.map((solution) => (
                                            <div key={solution.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                                <h4 className="text-lg font-semibold mb-2">Solution for {exercise.title}</h4>
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                                                    <div><strong>Status:</strong> {solution.test_status}</div>
                                                    <div><strong>Submitted At:</strong> {new Date(solution.submitted_at).toLocaleString()}</div>
                                                    <div><strong>Test result:</strong> {solution.test_output}</div>
                                                </div>

                                                {solution.test_results.length > 0 ? (
                                                    <div className="mt-4 grid grid-cols-2 text-sm border border-gray-300 rounded overflow-hidden">
                                                        {/* Header Row */}
                                                        <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">Test Name</div>
                                                        <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300 text-right">Status</div>

                                                        {/* Result Rows */}
                                                        {solution.test_results.map((result, index) => (
                                                            <React.Fragment key={result.id}>
                                                                <div className={`px-4 py-2 border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    {result.test_name}
                                                                </div>
                                                                <div className={`px-4 py-2 border-t border-gray-200 text-right ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                                    {result.status}
                                                                </div>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 mt-2">No test results found.</p>
                                                )}

                                            </div>
                                        ))}
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