import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";

interface Exercise {
    id: number;
    title: string;
    description: string;
    pivot: {
        start: string;
        end: string;
    };
}

interface Course {
    id: number;
    name: string;
    semester: string;
    year: number;
    exercises: Exercise[];
}

const formatDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    let result = "";
    if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0 || days > 0) result += `${hours} hour${hours !== 1 ? 's' : ''} `;
    result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;

    return result.trim();
};


const StudentsExercises: React.FC = () => {
    const { user } = useStateContext();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const navigate = useNavigate();
    const [mode, setMode] = useState<'active' | 'ended'>('active');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            axiosClient.get('user/courses/exercises')
                .then(({ data }) => {
                    setCourses(data.courses || []);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Error fetching courses with exercises:', error);
                });
        }
    }, [user]);

    const selectedCourse = courses.find(course => course.id === selectedCourseId);

    const getSortedAndCategorizedExercises = () => {
        if (!selectedCourse) return { active: [], upcoming: [], ended: [] };

        const now = new Date();

        const upcoming = selectedCourse.exercises
            .filter(e => new Date(e.pivot.start) > now)
            .sort((a, b) => new Date(a.pivot.start).getTime() - new Date(b.pivot.start).getTime());

        const active = selectedCourse.exercises
            .filter(e => new Date(e.pivot.start) <= now && new Date(e.pivot.end) > now)
            .sort((a, b) => new Date(a.pivot.start).getTime() - new Date(b.pivot.start).getTime());

        const ended = selectedCourse.exercises
            .filter(e => new Date(e.pivot.end) <= now);

        return { active, upcoming, ended };
    };


    const { active, upcoming, ended } = getSortedAndCategorizedExercises();

    const openExercise = (exerciseId: number, courseId: number) => {
        navigate(`/course/${courseId}/exercise/${exerciseId}`);
    };

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
                <h1>Your Courses & Exercises</h1>
                {courses.length === 0 ? (
                    <p>No courses found.</p>
                ) : (
                    <>
                        <div className={"course-choose"}>
                            <label htmlFor="course-select">Select a course:</label>
                            <select
                                id="course-select"
                                value={selectedCourseId ?? ""}
                                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                            >
                                <option value="" disabled>Select a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} ({course.semester} {course.year})
                                    </option>
                                ))}
                            </select>
                        </div>


                        {selectedCourse && (

                            <div className="course-exercises">
                                <div className="toggle-container">
                                    <div className={`toggle-slider ${mode === 'ended' ? 'right' : 'left'}`} />

                                    <div
                                        className={`toggle-option`}
                                        onClick={() => setMode('active')}
                                    >
                                        Active/Upcoming
                                    </div>
                                    <div
                                        className={`toggle-option`}
                                        onClick={() => setMode('ended')}
                                    >
                                        Ended
                                    </div>
                                </div>

                                <div className="item-list">
                                    {mode === 'active' ? (
                                        <>
                                            {/* 🟢 Active Exercises */}
                                            <div className="item-list">
                                                <h3>🟢 Active Exercises</h3>
                                                {active.length === 0 ? (
                                                    <p>No active exercises.</p>
                                                ) : (
                                                    <div className="item-list-grid">
                                                        <div className="item-list-header">
                                                            <span><strong>Title</strong></span>
                                                            <span><strong>Start</strong></span>
                                                            <span><strong>End</strong></span>
                                                            <span><strong>Duration</strong></span>
                                                            <span></span>
                                                        </div>
                                                        {active.map(exercise => (
                                                            <div className="item-list-row" key={exercise.id}>
                                                                <span>{exercise.title}</span>
                                                                <span>{new Date(exercise.pivot.start).toLocaleString()}</span>
                                                                <span>{new Date(exercise.pivot.end).toLocaleString()}</span>
                                                                <span>{formatDuration(exercise.pivot.start, exercise.pivot.end)}</span>
                                                                <span>
                                                                <button
                                                                    onClick={() => openExercise(exercise.id, selectedCourse.id)}
                                                                >
                                                                    Open
                                                                </button>
                                                            </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* 🟠 Upcoming Exercises */}
                                            <div className="item-list">
                                                <h3>🟠 Upcoming Exercises</h3>
                                                {upcoming.length === 0 ? (
                                                    <p>No upcoming exercises.</p>
                                                ) : (
                                                    <div className="item-list-grid">
                                                        <div className="item-list-header">
                                                            <span><strong>Title</strong></span>
                                                            <span><strong>Start</strong></span>
                                                            <span><strong>End</strong></span>
                                                            <span><strong>Duration</strong></span>
                                                            <span></span>
                                                        </div>
                                                        {upcoming.map(exercise => (
                                                            <div className="item-list-row" key={exercise.id}>
                                                                <span>{exercise.title}</span>
                                                                <span>{new Date(exercise.pivot.start).toLocaleString()}</span>
                                                                <span>{new Date(exercise.pivot.end).toLocaleString()}</span>
                                                                <span>{formatDuration(exercise.pivot.start, exercise.pivot.end)}</span>
                                                                <span>
                                                                <button
                                                                    disabled
                                                                    title="Exercise not yet started"
                                                                >
                                                                    Open
                                                                </button>
                                                            </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        // 🔴 Ended Exercises
                                        <div className="item-list">
                                            <h3>🔴 Ended Exercises</h3>
                                            {ended.length === 0 ? (
                                                <p>No ended exercises.</p>
                                            ) : (
                                                <div className="item-list-grid">
                                                    <div className="item-list-header">
                                                        <span><strong>Title</strong></span>
                                                        <span><strong>Start</strong></span>
                                                        <span><strong>End</strong></span>
                                                        <span><strong>Duration</strong></span>
                                                        <span></span>
                                                    </div>
                                                    {ended.map(exercise => (
                                                        <div className="item-list-row" key={exercise.id}>
                                                            <span>{exercise.title}</span>
                                                            <span>{new Date(exercise.pivot.start).toLocaleString()}</span>
                                                            <span>{new Date(exercise.pivot.end).toLocaleString()}</span>
                                                            <span>{formatDuration(exercise.pivot.start, exercise.pivot.end)}</span>
                                                            <span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}


                                </div>


                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentsExercises;
