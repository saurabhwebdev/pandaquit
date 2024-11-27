import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons = {
  'Immediate Actions': '⚡',
  'Physical Activities': '💪',
  'Mental Strategies': '🧠',
  'Social Support': '👥',
};

const strategies = [
  {
    category: 'Immediate Actions',
    description: 'Quick techniques to handle sudden cravings',
    items: [
      {
        title: 'Delay Technique',
        description: 'Wait 10 minutes before acting on the urge to smoke. The craving will often pass.',
        steps: [
          'Look at the time when the craving starts',
          'Promise yourself to wait 10 minutes',
          'Do something to distract yourself during this time',
          'After 10 minutes, the urge will likely have decreased',
        ],
        icon: '⏳',
      },
      {
        title: 'Drink Water',
        description: 'Slowly drink a glass of water. This can help reduce cravings and occupy your hands and mouth.',
        steps: [
          'Get a glass of cold water',
          'Take small, mindful sips',
          'Focus on the sensation of the water',
          'Finish the entire glass slowly',
        ],
        icon: '💧',
      },
      {
        title: 'Deep Breathing',
        description: 'Take deep breaths to reduce stress and cravings.',
        steps: [
          'Find a comfortable position',
          'Inhale deeply through your nose',
          'Hold for a few seconds',
          'Exhale slowly through your mouth',
          'Repeat 5-10 times',
        ],
        icon: '🫁',
      },
    ],
  },
  {
    category: 'Physical Activities',
    description: 'Physical activities to help manage cravings and improve mood',
    items: [
      {
        title: 'Quick Exercise',
        description: 'Physical activity can help reduce cravings and improve mood.',
        steps: [
          'Do 10 jumping jacks',
          'Walk briskly for 5 minutes',
          'Stretch your arms and legs',
          'Take deep breaths after exercise',
        ],
        icon: '🏋️‍♀️',
      },
      {
        title: 'Hand Activities',
        description: 'Keep your hands busy to avoid reaching for cigarettes.',
        steps: [
          'Use a stress ball',
          'Try knitting or drawing',
          'Play with a fidget toy',
          'Do some typing or writing',
        ],
        icon: '🖌️',
      },
      {
        title: 'Progressive Relaxation',
        description: 'Systematically tense and relax muscle groups to reduce stress.',
        steps: [
          'Start with your toes',
          'Move up to your legs',
          'Continue to your torso',
          'Finish with your arms and face',
        ],
        icon: '💆‍♀️',
      },
    ],
  },
  {
    category: 'Mental Strategies',
    description: 'Mental techniques to help manage cravings and stay motivated',
    items: [
      {
        title: 'Visualization',
        description: 'Imagine yourself as a non-smoker and visualize the benefits.',
        steps: [
          'Close your eyes',
          'Picture yourself healthy and smoke-free',
          'Imagine the pride of quitting',
          'Think about the money saved',
        ],
        icon: '🔮',
      },
      {
        title: 'Positive Affirmations',
        description: 'Use positive statements to reinforce your commitment to quitting.',
        steps: [
          '"I am in control of my health"',
          '"I choose not to smoke"',
          '"I am becoming healthier each day"',
          '"I am stronger than my cravings"',
        ],
        icon: '💪',
      },
      {
        title: 'Mindfulness',
        description: 'Stay present and observe your cravings without acting on them.',
        steps: [
          'Notice the craving without judgment',
          'Observe how it feels in your body',
          'Remember that cravings are temporary',
          'Let the feeling pass naturally',
        ],
        icon: '🙏',
      },
    ],
  },
  {
    category: 'Social Support',
    description: 'Reach out to others for support and encouragement',
    items: [
      {
        title: 'Call a Friend',
        description: 'Reach out to someone supportive when cravings hit.',
        steps: [
          'Choose a supportive person',
          'Share your struggle',
          'Ask for encouragement',
          'Stay on the call until craving passes',
        ],
        icon: '📞',
      },
      {
        title: 'Online Community',
        description: 'Connect with others who are also quitting smoking.',
        steps: [
          'Visit quit smoking forums',
          'Share your experience',
          'Read success stories',
          'Offer support to others',
        ],
        icon: '🌐',
      },
      {
        title: 'Professional Help',
        description: 'Seek guidance from healthcare providers or counselors.',
        steps: [
          'Contact your doctor',
          'Consider nicotine replacement',
          'Join a support group',
          'Schedule regular check-ins',
        ],
        icon: '👨‍⚕️',
      },
    ],
  },
];

const ProgressRing = ({ progress }) => (
  <div className="relative w-16 h-16">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-gray-200"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
      />
      <circle
        className="text-blue-600 transition-all duration-300"
        strokeWidth="10"
        strokeDasharray={251.2}
        strokeDashoffset={251.2 * (1 - progress)}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
      />
    </svg>
  </div>
);

export default function CopingStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(strategies[0].category);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleStepClick = (stepKey) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepKey)) {
        newSet.delete(stepKey);
      } else {
        newSet.add(stepKey);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
        >
          Coping Strategies
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-3">
              {strategies.map((category) => (
                <motion.button
                  key={category.category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center ${
                    selectedCategory === category.category
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCategory(category.category)}
                >
                  <span className="text-2xl mr-3">{categoryIcons[category.category]}</span>
                  <div>
                    <div className="font-semibold">{category.category}</div>
                    <div className="text-sm opacity-80">{category.description}</div>
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Strategy Cards */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!selectedStrategy ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {strategies
                    .find((cat) => cat.category === selectedCategory)
                    .items.map((strategy, index) => (
                      <motion.div
                        key={strategy.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: index * 0.1 },
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                        onClick={() => setSelectedStrategy(strategy)}
                      >
                        <div className="text-3xl mb-4">{strategy.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {strategy.title}
                        </h3>
                        <p className="text-gray-600">{strategy.description}</p>
                      </motion.div>
                    ))}
                </motion.div>
              ) : (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">{selectedStrategy.icon}</span>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {selectedStrategy.title}
                        </h2>
                        <p className="text-gray-600 mt-1">{selectedStrategy.description}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                      onClick={() => setSelectedStrategy(null)}
                    >
                      <span className="mr-2">←</span>
                      Back to strategies
                    </motion.button>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Step by Step Guide
                      </h3>
                      <ProgressRing
                        progress={
                          completedSteps.size / selectedStrategy.steps.length
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      {selectedStrategy.steps.map((step, index) => {
                        const stepKey = `${selectedStrategy.title}-${index}`;
                        const isCompleted = completedSteps.has(stepKey);

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: { delay: index * 0.1 },
                            }}
                            className={`flex items-start p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                              isCompleted
                                ? 'bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleStepClick(stepKey)}
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                                isCompleted
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <p className={`ml-4 ${isCompleted ? 'text-blue-600' : 'text-gray-600'}`}>
                              {step}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
