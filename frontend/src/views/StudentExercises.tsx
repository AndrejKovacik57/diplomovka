import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.tsx";
import { useStateContext } from "../contexts/ContextProvider.tsx";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation();

    useEffect(() => {
        if (user) {
            setLoading(true);
            axiosClient.get('me/exercises')
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
            <div className="flex flex-col items-center bg-gray-100 flex-grow pt-8">
                <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-3xl">
                    <Spinner/>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 flex-grow pt-8 px-4 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-5xl">
                <h1 className="text-3xl font-bold mb-6">{t('yourCourseExercise')}</h1>
                {courses.length === 0 ? (
                    <p>{t('yourCourseExercise')}</p>
                ) : (
                    <>
                        <div className="w-full mb-6 text-left">
                            <label htmlFor="course-select" className="block font-bold text-lg mb-2">{t('selectCourse')}:</label>
                            <select
                                id="course-select"
                                value={selectedCourseId ?? ""}
                                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                                className="w-full text-base p-2 border border-gray-300 rounded-lg"
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
                            <div>
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white mb-4 cursor-pointer">
                                    <div className={`flex-1 py-3 text-center font-medium transition-colors ${mode === 'active' ? 'bg-gray-100' : ''}`} onClick={() => setMode('active')}>
                                        {t('activeUpcoming')}
                                    </div>
                                    <div className={`flex-1 py-3 text-center font-medium transition-colors ${mode === 'ended' ? 'bg-gray-100' : ''}`} onClick={() => setMode('ended')}>
                                        {t('ended')}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {mode === 'active' ? (
                                        <>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-8">🟢 {t('activeExercises')}</h3>
                                                {active.length === 0 ? (
                                                    <p>{t('noActiveExercises')}</p>
                                                ) : (
                                                    <>
                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 font-semibold text-gray-700 border-b pb-2">
                                                            <span>{t('exercise')}</span>
                                                            <span>{t('start')}</span>
                                                            <span>{t('end')}</span>
                                                            <span>{t('duration')}</span>
                                                            <span></span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {active.map(exercise => (
                                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center border-b pb-2" key={exercise.id}>
                                                                    <span>{exercise.title}</span>
                                                                    <span>{new Date(exercise.pivot.start).toLocaleString()}</span>
                                                                    <span>{new Date(exercise.pivot.end).toLocaleString()}</span>
                                                                    <span>{formatDuration(exercise.pivot.start, exercise.pivot.end)}</span>
                                                                    <button onClick={() => openExercise(exercise.id, selectedCourse.id)} className="text-blue-600 hover:underline">{t('open')}</button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mt-6 mb-8">🟠 {t('upcomingExercises')}</h3>
                                                {upcoming.length === 0 ? (
                                                    <p>{t('noUpcomingExercises')}</p>
                                                ) : (
                                                    <>
                                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 font-semibold text-gray-700 border-b pb-2">
                                                            <span>{t('exercise')}</span>
                                                            <span>{t('start')}</span>
                                                            <span>{t('end')}</span>
                                                            <span>{t('duration')}</span>
                                                            <span></span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {upcoming.map(exercise => (
                                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center border-b pb-2" key={exercise.id}>
                                                                    <span>{exercise.title}</span>
                                                                    <span>{new Date(exercise.pivot.start).toLocaleString()}</span>
                                                                    <span>{new Date(exercise.pivot.end).toLocaleString()}</span>
                                                                    <span>{formatDuration(exercise.pivot.start, exercise.pivot.end)}</span>
                                                                    <button disabled title="Exercise not yet started" className="text-gray-400">{t('open')}</button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-8">🔴 {t('endedExercises')}</h3>
                                            {ended.length === 0 ? (
                                                <p>{t('noEndedExercises')}</p>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 font-semibold text-gray-700 border-b pb-2">
                                                        <span>{t('exercise')}</span>
                                                        <span>{t('start')}</span>
                                                        <span>{t('end')}</span>
                                                        <span>{t('duration')}</span>
                                                        <span></span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {ended.map(exercise => (
                                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center border-b pb-2" key={exercise.id}>
                                                                <span>{exercise.title}</span>
                                                                <span>{new Date(exercise.pivot.start).toLocaleString()}</span>
                                                                <span>{new Date(exercise.pivot.end).toLocaleString()}</span>
                                                                <span>{formatDuration(exercise.pivot.start, exercise.pivot.end)}</span>
                                                                <span></span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
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