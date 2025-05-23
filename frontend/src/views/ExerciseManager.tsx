import React, { useState } from 'react';
import ExerciseCreator from './ExerciseCreator';
import ExerciseDisplay from './ExerciseDisplay';
import {useTranslation} from "react-i18next";

const ExerciseManager: React.FC = () => {
    const [mode, setMode] = useState<'create' | 'display'>('create');
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center px-4 py-8 md:py-12 bg-gray-100 min-h-screen">
            {/* Toggle Switch */}
            <div className="relative flex w-full max-w-md border border-gray-300 rounded-lg overflow-hidden mb-8 bg-white cursor-pointer">
                <div
                    className={`absolute top-0 bottom-0 w-1/2 bg-gray-100 transition-transform duration-300 ${
                        mode === 'display' ? 'translate-x-full' : 'translate-x-0'
                    }`}
                />
                <div
                    className="flex-1 text-center py-3 font-medium z-10"
                    onClick={() => setMode('create')}
                >
                    {t('createExercise')}
                </div>
                <div
                    className="flex-1 text-center py-3 font-medium z-10"
                    onClick={() => setMode('display')}
                >
                    {t('displayExercise')}
                </div>
            </div>

            <div className="w-full max-w-5xl">
                {mode === 'create' ? <ExerciseCreator /> : <ExerciseDisplay />}
            </div>
        </div>
    );
};

export default ExerciseManager;