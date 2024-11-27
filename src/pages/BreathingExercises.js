import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const breathingExercises = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'A relaxing breath pattern that can help reduce anxiety and cravings.',
    steps: [
      { phase: 'inhale', duration: 4, instruction: 'Inhale through your nose' },
      { phase: 'hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'exhale', duration: 8, instruction: 'Exhale through your mouth' },
    ],
    cycles: 4,
    icon: '🌬️',
    benefits: ['Reduces anxiety', 'Helps with cravings', 'Promotes better sleep'],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'A calming technique used by Navy SEALs to reduce stress.',
    steps: [
      { phase: 'inhale', duration: 4, instruction: 'Inhale slowly' },
      { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
      { phase: 'exhale', duration: 4, instruction: 'Exhale slowly' },
      { phase: 'hold', duration: 4, instruction: 'Hold your breath' },
    ],
    cycles: 4,
    icon: '🎯',
    benefits: ['Reduces stress', 'Improves focus', 'Increases calmness'],
  },
  {
    id: 'deep',
    name: 'Deep Breathing',
    description: 'Simple deep breaths to center yourself and reduce cravings.',
    steps: [
      { phase: 'inhale', duration: 5, instruction: 'Take a deep breath' },
      { phase: 'hold', duration: 2, instruction: 'Pause briefly' },
      { phase: 'exhale', duration: 5, instruction: 'Release slowly' },
    ],
    cycles: 5,
    icon: '🍃',
    benefits: ['Centers mind', 'Reduces cravings', 'Calms nerves'],
  },
];

const BreathingCircle = ({ phase, progress }) => (
  <motion.div
    className="relative w-64 h-64 mx-auto mb-8"
    animate={{
      scale: phase === 'inhale' ? [1, 1.2] : phase === 'exhale' ? [1.2, 1] : 1,
    }}
    transition={{
      duration: phase === 'hold' ? 0 : 1,
      ease: 'easeInOut',
    }}
  >
    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-blue-500"
      style={{
        borderRadius: '50%',
        pathLength: progress,
        rotate: -90,
      }}
      transition={{
        duration: 0.5,
        ease: 'linear',
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="text-4xl"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {phase === 'inhale' ? '⬆️' : phase === 'exhale' ? '⬇️' : '⏸️'}
      </motion.div>
    </div>
  </motion.div>
);

export default function BreathingExercises() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isExercising, setIsExercising] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timer, setTimer] = useState(0);
  const [showPreparation, setShowPreparation] = useState(false);
  const [preparationCount, setPreparationCount] = useState(3);

  const resetExercise = useCallback(() => {
    setIsExercising(false);
    setCurrentStep(0);
    setCurrentCycle(1);
    setTimer(0);
    setShowPreparation(false);
    setPreparationCount(3);
  }, []);

  const startExercise = useCallback(() => {
    resetExercise();
    setShowPreparation(true);
  }, [resetExercise]);

  useEffect(() => {
    let interval;
    
    if (showPreparation && preparationCount > 0) {
      interval = setInterval(() => {
        setPreparationCount((prev) => prev - 1);
      }, 1000);
    } else if (showPreparation && preparationCount === 0) {
      setShowPreparation(false);
      setIsExercising(true);
    }

    return () => clearInterval(interval);
  }, [showPreparation, preparationCount]);

  useEffect(() => {
    if (!isExercising || !selectedExercise) return;

    const currentPhase = selectedExercise.steps[currentStep];
    
    if (timer >= currentPhase.duration) {
      if (currentStep === selectedExercise.steps.length - 1) {
        if (currentCycle === selectedExercise.cycles) {
          resetExercise();
          return;
        }
        setCurrentCycle((prev) => prev + 1);
        setCurrentStep(0);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
      setTimer(0);
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isExercising, selectedExercise, currentStep, currentCycle, timer, resetExercise]);

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-500';
      case 'hold':
        return 'bg-purple-500';
      case 'exhale':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
        >
          Breathing Exercises
        </motion.h1>

        {!selectedExercise ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {breathingExercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:shadow-xl"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="text-4xl mb-4">{exercise.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {exercise.name}
                </h3>
                <p className="text-gray-600 mb-4">{exercise.description}</p>
                <ul className="mb-4 space-y-2">
                  {exercise.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-500 flex items-center">
                      <span className="mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-2 px-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  Start Exercise
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">{selectedExercise.icon}</span>
                  {selectedExercise.name}
                </h2>
                <p className="text-gray-600 mt-1">{selectedExercise.description}</p>
              </div>
              <button
                className="text-gray-600 hover:text-gray-900 flex items-center"
                onClick={() => {
                  resetExercise();
                  setSelectedExercise(null);
                }}
              >
                <span className="mr-2">←</span>
                Back to exercises
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showPreparation ? (
                <motion.div
                  key="preparation"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="text-6xl font-bold text-blue-600 mb-4"
                  >
                    {preparationCount}
                  </motion.div>
                  <p className="text-xl text-gray-600">Get ready to begin...</p>
                </motion.div>
              ) : isExercising ? (
                <motion.div
                  key="exercise"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <BreathingCircle
                    phase={selectedExercise.steps[currentStep].phase}
                    progress={timer / selectedExercise.steps[currentStep].duration}
                  />

                  <motion.div
                    className="mb-8"
                    animate={{
                      opacity: [0.5, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <div className="text-2xl font-semibold text-gray-900 mb-2">
                      {selectedExercise.steps[currentStep].instruction}
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                      {selectedExercise.steps[currentStep].duration - timer}
                    </div>
                  </motion.div>

                  <div className="w-full h-3 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getPhaseColor(
                        selectedExercise.steps[currentStep].phase
                      )}`}
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${(timer / selectedExercise.steps[currentStep].duration) * 100}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="text-gray-600 flex items-center justify-center space-x-2">
                    <span>Cycle</span>
                    <span className="font-semibold text-blue-600">{currentCycle}</span>
                    <span>of</span>
                    <span className="font-semibold text-blue-600">{selectedExercise.cycles}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-4 px-8 text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={startExercise}
                  >
                    Begin Exercise
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
