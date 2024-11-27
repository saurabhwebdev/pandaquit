import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useState, useEffect } from 'react';
import FlipNumbers from 'react-flip-numbers';

// Hero section animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.8,
    },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 10,
      duration: 0.5,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const gradientTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const currencies = [
  { symbol: '$', value: 2190 },
  { symbol: '₹', value: 180000 },
  { symbol: '£', value: 1750 },
  { symbol: '€', value: 2000 },
];

const stats = [
  { 
    id: 'success',
    number: "95", 
    suffix: "%",
    label: "Success Rate",
    duration: 2,
  },
  { 
    id: 'money',
    number: "2190",
    prefix: "$",
    label: "Avg. Money Saved",
    duration: 2,
  },
  { 
    id: 'users',
    number: "50",
    suffix: "K+",
    label: "Active Users",
    duration: 2,
  },
  { 
    id: 'rating',
    number: "4.9",
    suffix: "/5",
    label: "App Rating",
    duration: 2,
  },
];

const features = [
  {
    title: "Track Your Progress",
    description: "Monitor your smoke-free days, health improvements, and money saved in real-time.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Breathing Exercises",
    description: "Access guided breathing exercises to help manage cravings and reduce stress.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Community Support",
    description: "Connect with others on the same journey and share experiences and tips.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const FlipStat = ({ stat }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("0");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setCurrentNumber(stat.number);
    }, 500);
    return () => clearTimeout(timer);
  }, [stat.number]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold text-gray-900 flex items-center">
        {stat.prefix && <span className="mr-1">{stat.prefix}</span>}
        <FlipNumbers
          height={35}
          width={25}
          color="black"
          background="white"
          play={isVisible}
          perspective={500}
          numbers={currentNumber}
        />
        {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
      </div>
      <div className="mt-1 text-base text-gray-600">{stat.label}</div>
    </div>
  );
};

const AnimatedMoneyStat = () => {
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrencyIndex((prev) => (prev + 1) % currencies.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold text-gray-900 flex items-center">
        <span className="mr-1">{currencies[currencyIndex].symbol}</span>
        <FlipNumbers
          height={35}
          width={25}
          color="black"
          background="white"
          play={isVisible}
          perspective={500}
          numbers={currencies[currencyIndex].value.toString()}
        />
      </div>
      <div className="mt-1 text-base text-gray-600">Avg. Money Saved</div>
    </div>
  );
};

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex w-full items-center justify-between py-4 sm:py-6">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 hover:opacity-90 transition-opacity"
              >
                Quitter
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-white shadow-sm hover:shadow-xl transition-all"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.div
        className="relative isolate px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-3xl py-24 sm:py-32 lg:py-40">
          <motion.div className="text-center space-y-6 sm:space-y-8" variants={containerVariants}>
            <motion.div variants={titleVariants} className="space-y-4 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
                <span className="block mb-2 sm:mb-4">Sometimes,</span>
                <span className="hidden sm:block">
                  <TypeAnimation
                    sequence={[
                      'being a quitter...',
                      1500,
                      'takes courage.',
                      2000,
                      'shows strength.',
                      2000,
                      'changes lives.',
                      2000,
                      'makes you a winner.',
                      3000,
                    ]}
                    wrapper="span"
                    speed={50}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600"
                    repeat={Infinity}
                  />
                </span>
                <span className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                  being a quitter makes you a winner.
                </span>
              </h1>
              
              <div className="hidden sm:block space-y-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
                <TypeAnimation
                  sequence={[
                    1000,
                    'Every journey begins with a decision.',
                    1500,
                    'Your decision to quit smoking is not a sign of weakness.',
                    1500,
                    "It's a bold step towards a healthier, better you.",
                    1500,
                    'Join thousands who chose to be proud quitters.',
                    1500,
                  ]}
                  wrapper="p"
                  speed={65}
                  className="font-medium"
                  repeat={0}
                />
              </div>
              <div className="sm:hidden text-base text-gray-600 leading-relaxed">
                <p className="font-medium">Take the first step towards a healthier, smoke-free life today.</p>
              </div>
            </motion.div>

            <motion.div 
              className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
              variants={containerVariants}
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-block text-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-6 sm:px-8 py-2.5 sm:py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Your Journey
                </Link>
              </motion.div>
              <Link
                to="/login"
                className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            <motion.div 
              className="mt-12 sm:mt-16 grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4"
              variants={fadeInUpVariants}
            >
              <FlipStat stat={stats[0]} />
              <AnimatedMoneyStat />
              <FlipStat stat={stats[2]} />
              <FlipStat stat={stats[3]} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:block bg-gradient-to-r from-primary-600 to-secondary-600 py-16"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-white">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.prefix}{stat.number}{stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Everything You Need
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Complete Quit-Smoking Companion
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600">
              Our comprehensive toolkit helps you stay on track with your quit smoking goals.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-y-8 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg bg-primary-600 text-white">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-3 sm:mt-4 flex flex-auto flex-col text-sm sm:text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Change Your Life?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-100">
              Join our community of successful quitters and take the first step towards a healthier,
              smoke-free life today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 text-white hover:text-gray-100 transition-colors"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
