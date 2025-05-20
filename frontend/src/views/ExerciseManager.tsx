import React, { useState } from 'react';
import ExerciseCreator from './ExerciseCreator';
import ExerciseDisplay from './ExerciseDisplay';

const ExerciseManager: React.FC = () => {
    const [mode, setMode] = useState<'create' | 'display'>('create');

    return (
        <div className="flex flex-col items-center py-6 px-4 bg-gray-100 min-h-screen">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-6">
                <div
                    className={`w-1/2 text-center py-2 cursor-pointer font-medium transition-colors ${mode === 'create' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => setMode('create')}
                >
                    Create Exercise
                </div>
                <div
                    className={`w-1/2 text-center py-2 cursor-pointer font-medium transition-colors ${mode === 'display' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => setMode('display')}
                >
                    Display Exercise
                </div>
            </div>

            <div className="w-full max-w-5xl">
                {mode === 'create' ? <ExerciseCreator /> : <ExerciseDisplay />}
            </div>
        </div>
    );
};

export default ExerciseManager;