import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { healthMilestones, achievements, calculateProgress } from '../utils/statistics';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import format from 'date-fns/format';
import { currencies } from '../utils/currencies';
import moment from 'moment';

const Progress = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currency, setCurrency] = useState({ symbol: '$', name: 'USD' });
  const [realtimeMoneySaved, setRealtimeMoneySaved] = useState(0);
  const [realtimeSmokeFreeTime, setRealtimeSmokeFreeTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [realtimeCigarettesAvoided, setRealtimeCigarettesAvoided] = useState(0);
  const [realtimeMilestones, setRealtimeMilestones] = useState([]);

  // Function to calculate money saved in real-time
  const calculateMoneySaved = () => {
    if (!userData?.quitDate) return 0;
    
    const quitDate = moment(userData.quitDate);
    const now = moment();
    const daysSinceQuit = now.diff(quitDate, 'seconds') / (24 * 60 * 60);
    const cigarettesNotSmoked = daysSinceQuit * userData.cigarettesPerDay;
    const packsNotBought = cigarettesNotSmoked / userData.cigarettesPerPack;
    return packsNotBought * userData.pricePerPack;
  };

  // Function to calculate smoke-free time in real-time
  const calculateSmokeFreeTime = () => {
    if (!userData?.quitDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const quitDate = moment(userData.quitDate);
    const now = moment();
    const duration = moment.duration(now.diff(quitDate));
    
    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    };
  };

  // Function to calculate cigarettes avoided in real-time
  const calculateCigarettesAvoided = () => {
    if (!userData?.quitDate || !userData?.cigarettesPerDay) return 0;
    
    const quitDate = moment(userData.quitDate);
    const now = moment();
    const daysSinceQuit = now.diff(quitDate, 'seconds') / (24 * 60 * 60);
    return daysSinceQuit * userData.cigarettesPerDay;
  };

  // Function to calculate milestone progress in real-time
  const calculateMilestoneProgress = () => {
    if (!userData?.quitDate) return [];
    
    const quitDate = moment(userData.quitDate);
    const now = moment();
    const minutesSinceQuit = now.diff(quitDate, 'minutes');
    
    return healthMilestones.map(milestone => {
      const targetMinutes = milestone.time; 
      const progress = Math.min((minutesSinceQuit / targetMinutes) * 100, 100);
      const isCompleted = minutesSinceQuit >= targetMinutes;
      
      return {
        ...milestone,
        progress: isNaN(progress) ? 0 : progress,
        isCompleted,
        minutesSinceQuit
      };
    });
  };

  // Function to update stats in real-time
  const updateStats = () => {
    if (!userData) return;

    const progress = calculateProgress(
      userData.quitDate,
      userData.cigarettesPerDay,
      userData.pricePerPack
    );
    setStats(progress);
    setRealtimeMoneySaved(calculateMoneySaved());
    setRealtimeSmokeFreeTime(calculateSmokeFreeTime());
    setRealtimeCigarettesAvoided(calculateCigarettesAvoided());
    setRealtimeMilestones(calculateMilestoneProgress());
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          
          // Set currency
          const userCurrency = currencies.find(c => c.id === data.currency) || { symbol: '$', name: 'USD' };
          setCurrency(userCurrency);

          // Initial stats calculation
          const progress = calculateProgress(
            data.quitDate,
            data.cigarettesPerDay,
            data.pricePerPack
          );
          setStats(progress);

          // Fetch cravings logs for the chart
          const cravingsRef = collection(db, 'users', currentUser.uid, 'cravings');
          const cravingsQuery = query(
            cravingsRef,
            orderBy('timestamp', 'desc'),
            limit(7)
          );
          const cravingsSnap = await getDocs(cravingsQuery);
          
          const cravingsData = cravingsSnap.docs.map(doc => ({
            date: format(doc.data().timestamp.toDate(), 'MM/dd'),
            cravings: doc.data().intensity || 0,
            cigarettes: doc.data().smoked || 0
          })).reverse();

          setChartData(cravingsData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser.uid]);

  // Effect for real-time updates
  useEffect(() => {
    if (!userData) return;
    
    // Initial update
    updateStats();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      updateStats();
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!stats || !userData) return null;

  const formatDuration = (minutes) => {
    const duration = moment.duration(minutes, 'minutes');
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const mins = duration.minutes();
    
    return {
      days,
      hours,
      minutes: mins
    };
  };

  const smokeFreeTime = formatDuration(stats.minutesQuit);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Quit Journey</h1>
        <p className="text-gray-600">
          Started on {format(new Date(userData.quitDate), 'MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Time Smoke Free</h3>
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{realtimeSmokeFreeTime.days}</p>
                <p className="text-xs text-green-600">days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{realtimeSmokeFreeTime.hours}</p>
                <p className="text-xs text-green-500">hrs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">{realtimeSmokeFreeTime.minutes}</p>
                <p className="text-xs text-green-400">min</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-300">{realtimeSmokeFreeTime.seconds}</p>
                <p className="text-xs text-green-300">sec</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Keep going strong!</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Money Saved</h3>
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-3xl font-bold text-blue-600">
              {currency.symbol}{Math.floor(realtimeMoneySaved)}
            </p>
            <p className="text-xl font-semibold text-blue-400">
              .{(realtimeMoneySaved % 1).toFixed(2).split('.')[1]}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Based on {currency.symbol}{Number(userData.pricePerPack).toFixed(2)}/pack
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cigarettes Avoided</h3>
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-3xl font-bold text-purple-600">
              {Math.floor(realtimeCigarettesAvoided)}
            </p>
            <p className="text-xl font-semibold text-purple-400">
              .{(realtimeCigarettesAvoided % 1).toFixed(2).split('.')[1]}
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Based on {userData?.cigarettesPerDay || 0} per day
          </p>
        </motion.div>
      </div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Weekly Progress</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCravings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCigarettes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="cigarettes"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorCigarettes)"
                name="Cigarettes"
              />
              <Area
                type="monotone"
                dataKey="cravings"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCravings)"
                name="Craving Intensity"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((badge, index) => {
            const isAchieved = stats.achievedBadges.some(
              (achieved) => achieved.id === badge.id
            );

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl text-center transform transition-all duration-300 hover:scale-105 ${
                  isAchieved
                    ? 'bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-semibold mb-2">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Health Journey */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Journey</h2>
        <div className="space-y-4">
          {realtimeMilestones.map((milestone) => (
            <motion.div
              key={`milestone-${milestone.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: milestone.id * 0.1 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{milestone.icon}</span>
                  <h3 className={`font-semibold ${milestone.isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
                    {milestone.time >= 1440 
                      ? `${Math.floor(milestone.time / 1440)} days` 
                      : milestone.time >= 60 
                        ? `${Math.floor(milestone.time / 60)} hours`
                        : `${milestone.time} minutes`}
                  </h3>
                </div>
                <span className={`text-sm ${milestone.isCompleted ? 'text-green-500' : 'text-gray-500'}`}>
                  {milestone.isCompleted ? 'Completed!' : `${Math.floor(milestone.progress)}%`}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    milestone.isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}
                />
              </div>
              
              <p className="mt-2 text-sm text-gray-600">
                {milestone.description}
              </p>
              
              {milestone.isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="mt-2 inline-flex items-center gap-1 text-green-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Achievement unlocked!</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
