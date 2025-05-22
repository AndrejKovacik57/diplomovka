import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { toast } from "react-toastify";
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
interface Exercise {
    id: number;
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string
}
const CourseDisplay: React.FC = () => {
    const [courses, setCourses] = useState<{ id: number; name: string; semester: string; year: number }[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [courseDetails, setCourseDetails] = useState<{
        description: string;
        uids: { uid: string; enrolled: boolean; user_id: number; first_name: string; last_name: string }[];
        exercises: Exercise[];
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    useEffect(() => {
        axiosClient.get("/exercise").then(({ data }) => {
            if (courseDetails) {
                const existingIds = new Set(courseDetails.exercises.map((e) => e.id));
                setExercises(data.exercises.filter((ex: Exercise) => !existingIds.has(ex.id)));
            } else {
                setExercises(data.exercises);
            }
        });
    }, [courseDetails]);

    useEffect(() => {
        axiosClient.get("/course").then(({ data }) => {
            setCourses(data.courses);
        });
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedUserId !== null ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedUserId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserExercises([]);
        axiosClient.get(`/course/${selectedCourseId}`).then(({ data }) => {
            setCourseDetails({
                description: data.course.description,
                uids: data.uids,
                exercises: data.exercises,
            });
        });
    };

    const handleExerciseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axiosClient
            .post(`/course/${selectedCourseId}/exercise/${selectedExerciseId}`)
            .then(({ data }) => {
                setExerciseMessage(data.message);
                setCourseDetails((prev) => prev && { ...prev, exercises: [...prev.exercises, data.exercise] });
                toast.success("Exercise added!");
            })
            .catch((error) => {
                const response = error.response;
                if (response) {
                    if (response.status === 409) {
                        setErrorExerciseMessage("Exercise already added.");
                    } else if (response.status === 422) {
                        setErrorExerciseMessage("Validation error.");
                    } else {
                        setErrorExerciseMessage("Unexpected error.");
                    }
                } else {
                    setErrorExerciseMessage("Network error.");
                }
            });
    };

    const handleDatetimeChange = (id: number, field: "start_datetime" | "end_datetime", value: string) => {
        if (!courseDetails) return;
        const updated = courseDetails.exercises.map((ex) =>
            ex.id === id ? { ...ex, [field]: value } : ex
        );
        setCourseDetails({ ...courseDetails, exercises: updated });
    };

    const handleUpdateExerciseDates = async (id: number) => {
        const exercise = courseDetails?.exercises.find((ex) => ex.id === id);
        if (!exercise) return;

        axiosClient
            .post("/course/exercise/updateDates", {
                id,
                start: exercise.start_datetime,
                end: exercise.end_datetime,
            })
            .then(() => {
                setExerciseMessage(`Exercise ${id} updated.`);
                toast.success("Dates updated!");
            })
            .catch(() => setErrorExerciseMessage("Error updating exercise."));
    };

    const handleUserClick = (id: number) => {
        setSelectedUserId(id);
        setLoading(true);

        const user = courseDetails?.uids.find((u) => u.user_id === id);
        if (user) {
            setSelectedUserUid(user.uid);
            setSelectedUserName({ firstName: user.first_name, lastName: user.last_name });
        }

        axiosClient
            .get(`/course/${selectedCourseId}/user/${id}/exercise/solutions`)
            .then(({ data, status }) => {
                if (status === 204) {
                    setSelectedUserId(null);
                    toast.error("No exercises.");
                } else {
                    setUserExercises(data);
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex justify-center p-4 md:p-8">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="course" className="mb-2 font-semibold text-lg">
                            Select a Course:
                        </label>
                        <select
                            id="course"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                            required
                        >
                            <option value="">-- Select --</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {`${course.name} ${course.semester} ${course.year}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        View Details
                    </button>
                </form>

                {courseDetails && (
                    <>
                        <div className="mt-8">
                            <h4 className="text-xl font-bold mb-4">Users</h4>

                            <div className="grid grid-cols-4 text-sm border border-gray-300 rounded overflow-hidden">
                                {/* Header Row */}
                                <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">UID</div>
                                <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">First Name</div>
                                <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">Last Name</div>
                                <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">In Course</div>

                                {/* User Rows */}
                                {courseDetails.uids
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((user, index) => {
                                        const realIndex = (currentPage - 1) * itemsPerPage + index;
                                        return (
                                            <React.Fragment key={user.uid}>
                                                <div className={`px-4 py-2 border-t border-gray-200 ${realIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    {user.user_id ? (
                                                        <button
                                                            onClick={() => handleUserClick(user.user_id)}
                                                            className="text-blue-600 underline hover:text-blue-800 text-left"
                                                        >
                                                            {user.uid}
                                                        </button>
                                                    ) : (
                                                        <span>{user.uid}</span>
                                                    )}
                                                </div>
                                                <div className={`px-4 py-2 border-t border-gray-200 ${realIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    {user.first_name}
                                                </div>
                                                <div className={`px-4 py-2 border-t border-gray-200 ${realIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    {user.last_name}
                                                </div>
                                                <div className={`px-4 py-2 border-t border-gray-200 ${realIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                    {user.enrolled ? "🟢" : "🔴"}
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}


                            </div>
                            <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                                {/* Page size selector on the left */}
                                <div className="flex items-center space-x-2 mx-auto">
                                    <label htmlFor="itemsPerPage" className="font-medium whitespace-nowrap">
                                        Users per page:
                                    </label>
                                    <select
                                        id="itemsPerPage"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border border-gray-300 rounded px-2 py-1"
                                    >
                                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Pagination controls in center */}
                                <div className="flex items-center gap-2 mx-auto">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <span className="px-2 py-1 whitespace-nowrap">Page {currentPage}</span>
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                prev < Math.ceil(courseDetails.uids.length / itemsPerPage) ? prev + 1 : prev
                                            )
                                        }
                                        disabled={currentPage >= Math.ceil(courseDetails.uids.length / itemsPerPage)}
                                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>



                        {courseDetails.exercises.length > 0 && (
                            <div className="mt-8">
                                <h4 className="text-xl font-bold mb-4">Exercises</h4>
                                <div className="grid grid-cols-4 text-sm border border-gray-300 rounded overflow-hidden">
                                    {/* Header Row */}
                                    <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">Exercise</div>
                                    <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">Start</div>
                                    <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">End</div>
                                    <div className="font-bold bg-gray-100 px-4 py-2 border-b border-gray-300">Actions</div>

                                    {/* Data Rows */}
                                    {courseDetails.exercises.map((ex, index) => (
                                        <React.Fragment key={ex.id}>
                                            <div className={`px-4 py-2 border-t border-gray-200 justify-center content-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                {ex.id} - {ex.title}
                                            </div>
                                            <div className={`px-4 py-2 border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <input
                                                    type="datetime-local"
                                                    value={ex.start_datetime ? ex.start_datetime.slice(0, 16) : ""}
                                                    onChange={(e) => handleDatetimeChange(ex.id, "start_datetime", e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                            </div>
                                            <div className={`px-4 py-2 border-t border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <input
                                                    type="datetime-local"
                                                    value={ex.end_datetime ? ex.end_datetime.slice(0, 16) : ""}
                                                    onChange={(e) => handleDatetimeChange(ex.id, "end_datetime", e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                            </div>
                                            <div className={`px-4 py-2 border-t border-gray-200 flex items-center  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <button
                                                    onClick={() => handleUpdateExerciseDates(ex.id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>


                            </div>

                        )}
                        <div className="mt-8">
                            <h4 className="text-xl font-bold mb-4">Add Exercise</h4>
                            <form onSubmit={handleExerciseSubmit} className="space-y-4">
                                <select
                                    className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                                >
                                    Submit Exercise
                                </button>
                            </form>
                            {exerciseMessage && <div className="text-green-600 mt-2">{exerciseMessage}</div>}
                            {exerciseErrorMessage && <div className="text-red-600 mt-2">{exerciseErrorMessage}</div>}
                        </div>
                    </>
                )}

                {selectedUserId && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 min-w-[400px]">
                        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-300">
                                <div className="relative flex justify-center items-center ">
                                    {/* Inline Centered Name + UID */}
                                    <div className="flex gap-6">
                                        {selectedUserName && (
                                            <p><strong>Name:</strong> {selectedUserName.firstName} {selectedUserName.lastName}</p>
                                        )}
                                        <p><strong>User UID:</strong> {selectedUserUid}</p>
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        className="absolute top-0 right-0 text-xl text-gray-600 hover:text-black"
                                        onClick={() => setSelectedUserId(null)}
                                    >
                                        ✖
                                    </button>
                                </div>
                            </div>


                            {/* Scrollable Content */}
                            <div className="overflow-y-auto px-6 py-4">
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    userExercises.length > 0 ? (
                                        userExercises.map((exercise) =>
                                            exercise.solutions.map((solution: Solution) => (
                                                <div key={solution.id} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 ">
                                                    <h4 className="font-bold mb-2">Solution for {exercise.title}</h4>
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap gap-6">
                                                            <div><strong>Status:</strong> {solution.test_status}</div>
                                                            <div><strong>Submitted At:</strong> {new Date(solution.submitted_at).toLocaleString()}</div>
                                                            <div><strong>Test Result:</strong> {solution.test_output}</div>
                                                            <div>
                                                                <a
                                                                    href={`data:application/octet-stream;base64,${solution.file_data}`}
                                                                    download={solution.file_name}
                                                                    className="text-blue-600 underline"
                                                                >
                                                                    {solution.file_name}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {solution.test_results.length > 0 ? (
                                                        <div className="mt-4">
                                                            <div className="grid grid-cols-2">
                                                                {/* Header row */}
                                                                <div className="bg-gray-100 px-3 py-2 font-semibold border-b border-gray-300">
                                                                    Test Name
                                                                </div>
                                                                <div className="bg-gray-100 px-3 py-2 font-semibold border-b border-gray-300">
                                                                    Status
                                                                </div>

                                                                {/* Data rows */}
                                                                {solution.test_results.map((res: TestResult) => (
                                                                    <React.Fragment key={res.id}>
                                                                        <div className="px-3 py-2 border-b border-gray-200">
                                                                            {res.test_name}
                                                                        </div>
                                                                        <div className="px-3 py-2 border-b border-gray-200">
                                                                            {res.status}
                                                                        </div>
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p>No test results found.</p>
                                                    )}

                                                </div>
                                            ))
                                        )
                                    ) : (
                                        <p>No solutions found.</p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CourseDisplay;