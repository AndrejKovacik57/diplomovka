import React, { useCallback, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import Spinner from "../components/Spinner.tsx";
import { useTranslation } from "react-i18next";

interface TestResultOutput {
    id: number;
    input: any;
    expected_output: any;
    actual_output: any;
    subtest_status: string;
}

interface TestResult {
    id: number;
    test_name: string;
    status: string;
    message: string;
    outputs: TestResultOutput[];
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
    const [openTestResultId, setOpenTestResultId] = useState<number | null>(null);
    const { t } = useTranslation();

    const selectedCourse = courses.find((course) => course.id === selectedCourseId);

    const loadSolutions = useCallback(() => {
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

    useEffect(() => {
        loadSolutions();
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{t('yourSolutions')}</h1>
                </div>

                {courses.length === 0 ? (
                    <p>{t('noCoursersWithSolutions')}</p>
                ) : (
                    <>
                        <div className="mb-6">
                            <label htmlFor="course-select" className="block font-semibold mb-2">{t('selectCourse')}:</label>
                            <select
                                id="course-select"
                                value={selectedCourseId ?? ""}
                                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            >
                                <option value="" disabled>{t('selectCourse')}</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={loadSolutions}
                                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
                            >
                                {t('reloadSolutions')}
                            </button>
                        </div>

                        {selectedCourse && (
                            <div className="space-y-6">
                                {selectedCourse.exercises.map((exercise) => (
                                    <div key={exercise.id} className="space-y-4">
                                        {exercise.solutions.map((solution) => (
                                            <div key={solution.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                                <h4 className="text-lg font-semibold mb-2">Solution for {exercise.title}</h4>
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                                                    <div><strong>{t('status')}:</strong> {solution.test_status}</div>
                                                    <div><strong>{t('submittedAt')}:</strong> {new Date(solution.submitted_at).toLocaleString()}</div>
                                                    <div><strong>{t('testResult')}:</strong> {solution.test_output}</div>
                                                </div>

                                                {solution.test_results.length > 0 ? (
                                                    <div className="mt-4 grid grid-cols-2 text-sm border border-gray-300 rounded overflow-hidden">
                                                        <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">{t('testName')}</div>
                                                        <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300 text-right">{t('status')}</div>

                                                        {solution.test_results.map((result, index) => {
                                                            const isOpen = openTestResultId === result.id;
                                                            return (
                                                                <React.Fragment key={result.id}>
                                                                    <div
                                                                        className={`px-4 py-2 border-t border-gray-200 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                                        onClick={() => setOpenTestResultId(isOpen ? null : result.id)}
                                                                    >
                                                                        {result.test_name}
                                                                    </div>
                                                                    <div
                                                                        className={`px-4 py-2 border-t border-gray-200 text-right cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                                        onClick={() => setOpenTestResultId(isOpen ? null : result.id)}
                                                                    >
                                                                        {result.status}
                                                                    </div>

                                                                    {isOpen && (
                                                                        <div className="col-span-2 border-t border-gray-200 p-4 bg-gray-100">
                                                                            <h5 className="font-semibold mb-2">{t('testDetails')}</h5>
                                                                            {result.outputs.length > 0 ? (
                                                                                <table className="w-full text-sm table-auto border border-gray-300">
                                                                                    <thead className="bg-gray-200">
                                                                                    <tr>
                                                                                        <th className="border p-2 text-left">{t('input')}</th>
                                                                                        <th className="border p-2 text-left">{t('expectedOutput')}</th>
                                                                                        <th className="border p-2 text-left">{t('actualOutput')}</th>
                                                                                        <th className="border p-2 text-left">{t('status')}</th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    {result.outputs.map((output) => (
                                                                                        <tr key={output.id}>
                                                                                            <td className="border p-2">{JSON.stringify(output.input)}</td>
                                                                                            <td className="border p-2">{JSON.stringify(output.expected_output)}</td>
                                                                                            <td className="border p-2">{JSON.stringify(output.actual_output)}</td>
                                                                                            <td className={`border p-2 font-semibold ${output.subtest_status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                                                                                                {output.subtest_status}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                    </tbody>
                                                                                </table>
                                                                            ) : (
                                                                                <p className="text-gray-500">{t('noOutputsFound')}</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 mt-2">{t('noTestFound')}</p>
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
