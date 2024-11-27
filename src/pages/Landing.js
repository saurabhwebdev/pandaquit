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
    benefits: [
      "Get personalized insights into your progress",
      "Set and achieve milestones with our customizable goals system",
      "Stay motivated with our community of supportive quitters",
    ],
  },
  {
    title: "Breathing Exercises",
    description: "Access guided breathing exercises to help manage cravings and reduce stress.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    benefits: [
      "Reduce stress and anxiety with our guided breathing exercises",
      "Improve your mood and overall well-being",
      "Stay focused and motivated with our customizable exercise plans",
    ],
  },
  {
    title: "Community Support",
    description: "Connect with others on the same journey and share experiences and tips.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    benefits: [
      "Connect with others who understand your journey",
      "Share your experiences and tips with the community",
      "Get support and motivation from our community of quitters",
    ],
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
        {/* Background Elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
        </div>

        <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
          <motion.div className="text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-8" variants={containerVariants}>
            <motion.div variants={titleVariants} className="lg:col-span-7 space-y-4 sm:space-y-8">
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

              <motion.div 
                className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6"
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
            </motion.div>

            <motion.div 
              className="mt-12 lg:mt-0 lg:col-span-5 bg-white/50 backdrop-blur-lg rounded-2xl p-6 lg:p-8 shadow-xl"
              variants={fadeInUpVariants}
            >
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Impact</h3>
                </div>
                <div className="space-y-6">
                  <FlipStat stat={stats[0]} />
                  <FlipStat stat={stats[2]} />
                </div>
                <div className="space-y-6">
                  <AnimatedMoneyStat />
                  <FlipStat stat={stats[3]} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-16 sm:py-24 lg:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/95 backdrop-blur-sm"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/20 mb-6">
                Everything You Need
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Your Complete Quit-Smoking Companion
              </h2>
              <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
                We've crafted a powerful suite of tools and features designed to support every step of your journey towards a smoke-free life.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="relative flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-secondary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="p-6 sm:p-8 relative z-10">
                    <div className="flex items-center gap-x-4">
                      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold leading-7 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <div className="mt-6 flex flex-col gap-4">
                      <p className="text-base leading-7 text-gray-600">
                        {feature.description}
                      </p>
                      <div className="h-px w-full bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
                      <ul className="space-y-3 text-sm text-gray-600">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative isolate"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-16 sm:px-16 sm:py-24 lg:flex lg:gap-x-20 lg:px-24 lg:py-32">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:flex-auto lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Change Your Life?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-100">
                Join thousands of successful quitters who took the first step towards a healthier life.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  to="/signup"
                  className="rounded-full bg-white px-6 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
                >
                  Get started today
                </Link>
                <Link to="/about" className="text-base font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <div className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10">
                {/* Add some decorative elements or illustration here */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
