import React, { useState } from 'react';
import CourseCreator from "./CourseCreator.tsx";
import CourseDisplay from "./DisplayCourse.tsx";


const ExerciseManager: React.FC = () => {
    const [mode, setMode] = useState<'create' | 'display'>('create');

    return (
        <div className="container multi-choice">
            <div className="toggle-container">
                <div className={`toggle-slider ${mode === 'display' ? 'right' : 'left'}`} />

                <div
                    className={`toggle-option`}
                    onClick={() => setMode('create')}
                >
                    Create Course
                </div>
                <div
                    className={`toggle-option`}
                    onClick={() => setMode('display')}
                >
                    Display Course
                </div>
            </div>

            <div className="container">
                {mode === 'create' ? <CourseCreator /> : <CourseDisplay />}
            </div>
        </div>
    );
};

export default ExerciseManager;
