import React, { useState } from 'react';
import ExerciseCreator from './ExerciseCreator';
import ExerciseDisplay from './ExerciseDisplay';

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
                    Create Exercise
                </div>
                <div
                    className={`toggle-option`}
                    onClick={() => setMode('display')}
                >
                    Display Exercise
                </div>
            </div>

            <div className="container">
                {mode === 'create' ? <ExerciseCreator /> : <ExerciseDisplay />}
            </div>
        </div>
    );
};

export default ExerciseManager;
