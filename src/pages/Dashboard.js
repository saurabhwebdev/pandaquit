import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { motion } from 'framer-motion';
import { currencies } from '../utils/currencies';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring", stiffness: 50 }
  },
};

const healthMilestones = [
  { time: 20, unit: 'minutes', description: 'Your heart rate and blood pressure drop' },
  { time: 12, unit: 'hours', description: 'Carbon monoxide levels in your blood drop to normal' },
  { time: 2, unit: 'weeks', description: 'Your circulation improves and lung function increases' },
  { time: 1, unit: 'month', description: 'Many of the nicotine receptors in your brain have returned to normal' },
  { time: 1, unit: 'year', description: 'Your risk of heart disease is about half compared to a smoker' },
];

const motivationalQuotes = [
  "Every cigarette you don't smoke is a victory.",
  "Your lungs are healing more with each passing day.",
  "You're proving that you're stronger than the addiction.",
  "Each craving defeated makes you stronger.",
  "Focus on progress, not perfection.",
];

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [timeSinceQuit, setTimeSinceQuit] = useState(null);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState('');
  const [stats, setStats] = useState({
    moneySaved: 0,
    cigarettesAvoided: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Set random motivational quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          navigate('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          navigate('/onboarding');
        }
      } catch (error) {
        setError('Failed to load your data. Please try again later.');
        console.error('Dashboard error:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!userData?.quitDate) return;

    const updateStats = () => {
      const newTimeSinceQuit = calculateTimeDifference(userData.quitDate);
      setTimeSinceQuit(newTimeSinceQuit);
      
      setStats({
        moneySaved: calculateMoneySaved(userData, newTimeSinceQuit),
        cigarettesAvoided: calculateCigarettesNotSmoked(userData, newTimeSinceQuit),
      });
    };

    // Initial update
    updateStats();

    // Determine update frequency based on quit duration
    const now = moment();
    const quitMoment = moment(userData.quitDate);
    const hoursSinceQuit = moment.duration(now.diff(quitMoment)).asHours();

    // Update every second in the first hour, then every minute
    const updateInterval = hoursSinceQuit < 1 ? 1000 : 60000;

    const interval = setInterval(updateStats, updateInterval);
    return () => clearInterval(interval);
  }, [userData]);

  if (!userData || !timeSinceQuit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const nextMilestone = getNextMilestone(timeSinceQuit);
  const currency = currencies.find(c => c.id === userData.currency)?.symbol || userData.currency;

  // Calculate streak and progress
  const totalDays = Math.floor(timeSinceQuit.totalHours / 24);
  const hoursIntoCurrentDay = timeSinceQuit.totalHours % 24;
  const currentDayProgress = (hoursIntoCurrentDay / 24) * 100;

  // Generate sample data for cravings chart (you can replace this with real data)
  const cravingsData = Array.from({ length: 7 }, (_, i) => ({
    day: moment().subtract(6 - i, 'days').format('ddd'),
    cravings: Math.max(10 - i, 2), // Simulated decreasing cravings
  }));

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Motivational Quote */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <p className="text-xl font-medium text-gray-600 italic">{quote}</p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Streak Progress */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <CircularProgressbar
                value={currentDayProgress}
                text={`${totalDays}d`}
                styles={buildStyles({
                  pathColor: `rgba(99, 102, 241, ${Math.max(0.3, currentDayProgress / 100)})`,
                  textColor: '#4F46E5',
                  trailColor: '#F3F4F6',
                  pathTransition: 'stroke-dashoffset 0.5s ease 0s',
                })}
              />
            </div>
            <h3 className="text-center text-lg font-semibold text-gray-900">Quit Streak</h3>
            <p className="text-center text-sm text-gray-600">
              {currentDayProgress < 50 ? 
                `${Math.floor(hoursIntoCurrentDay)}h to next day` : 
                `${24 - Math.floor(hoursIntoCurrentDay)}h remaining`}
            </p>
          </motion.div>

          {/* Money Saved */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {currency}{Number(stats.moneySaved).toFixed(2)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Money Saved</h3>
              <p className="text-sm text-gray-600">
                That's about {Math.round(stats.moneySaved / 50)} coffee dates!
              </p>
            </div>
          </motion.div>

          {/* Health Impact */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.cigarettesAvoided}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cigarettes Avoided</h3>
              <p className="text-sm text-gray-600">
                Your lungs thank you!
              </p>
            </div>
          </motion.div>

          {/* Time Milestone */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {timeSinceQuit.totalHours < 1 ? (
                  `${timeSinceQuit.minutes}m ${timeSinceQuit.seconds}s`
                ) : timeSinceQuit.days > 0 ? (
                  `${timeSinceQuit.days}d ${timeSinceQuit.hours}h`
                ) : (
                  `${timeSinceQuit.hours}h ${timeSinceQuit.minutes}m`
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Smoke Free</h3>
              <p className="text-sm text-gray-600">
                Every moment counts!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Cravings Chart */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Craving Intensity Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cravingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cravings" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Your cravings typically decrease over time. Stay strong!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link
            to="/breathing"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">Breathing Exercise</h3>
            <p className="text-sm opacity-90">Feel a craving? Try a quick breathing exercise.</p>
          </Link>

          <Link
            to="/coping"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">Coping Strategies</h3>
            <p className="text-sm opacity-90">Access your personalized coping techniques.</p>
          </Link>

          <Link
            to="/progress"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-sm opacity-90">View detailed progress and achievements.</p>
          </Link>
        </motion.div>

        {/* Next Health Milestone */}
        {nextMilestone && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl shadow-lg p-8 text-white mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">Next Health Milestone</h3>
            <p className="text-lg mb-2">{nextMilestone.milestone.description}</p>
            <p className="text-sm opacity-90">Coming up {nextMilestone.timeLeft}</p>
          </motion.div>
        )}

        {/* Daily Tips */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Stay hydrated - drink water when you feel a craving
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Take a 5-minute walk when stress builds up
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Practice deep breathing during your usual smoke break times
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

function calculateTimeDifference(startDate) {
  if (!startDate) return null;
  const start = moment(startDate);
  const now = moment();
  const duration = moment.duration(now.diff(start));

  return {
    years: Math.floor(duration.asYears()),
    months: Math.floor(duration.asMonths()) % 12,
    days: Math.floor(duration.asDays()) % 30,
    hours: Math.floor(duration.asHours()) % 24,
    minutes: Math.floor(duration.asMinutes()) % 60,
    seconds: Math.floor(duration.asSeconds()) % 60,
    totalDays: duration.asDays(),
    totalHours: duration.asHours(),
    totalMinutes: duration.asMinutes(),
  };
}

function calculateMoneySaved(userData, timeDiff) {
  if (!userData || !timeDiff) return 0;
  
  const cigarettesPerDay = parseFloat(userData.cigarettesPerDay) || 0;
  const pricePerPack = parseFloat(userData.pricePerPack) || 0;
  const cigarettesPerPack = parseFloat(userData.cigarettesPerPack) || 20; // default to 20 if not set
  
  const totalDays = timeDiff.totalDays;
  const cigarettesNotSmoked = cigarettesPerDay * totalDays;
  const packsNotBought = cigarettesNotSmoked / cigarettesPerPack;
  const moneySaved = packsNotBought * pricePerPack;

  return isNaN(moneySaved) ? 0 : Number(moneySaved);
}

function calculateCigarettesNotSmoked(userData, timeDiff) {
  if (!userData || !timeDiff) return 0;
  
  const cigarettesPerDay = parseFloat(userData.cigarettesPerDay) || 0;
  const totalDays = timeDiff.totalDays;
  const cigarettesNotSmoked = cigarettesPerDay * totalDays;
  
  return isNaN(cigarettesNotSmoked) ? 0 : Math.floor(cigarettesNotSmoked);
}

function getNextMilestone(timeSinceQuit) {
  const durationInHours = moment.duration(timeSinceQuit).asHours();
  
  for (const milestone of healthMilestones) {
    let milestoneHours;
    switch (milestone.unit) {
      case 'minutes':
        milestoneHours = milestone.time / 60;
        break;
      case 'hours':
        milestoneHours = milestone.time;
        break;
      case 'weeks':
        milestoneHours = milestone.time * 24 * 7;
        break;
      case 'month':
        milestoneHours = milestone.time * 24 * 30;
        break;
      case 'year':
        milestoneHours = milestone.time * 24 * 365;
        break;
      default:
        milestoneHours = 0;
    }

    if (durationInHours < milestoneHours) {
      const timeLeft = milestoneHours - durationInHours;
      return {
        milestone,
        timeLeft: moment.duration(timeLeft, 'hours').humanize(true)
      };
    }
  }

  return null;
}
