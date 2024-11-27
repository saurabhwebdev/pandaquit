import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

const PolygonBackground = () => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
    <motion.path
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      d="M0,0 L100,0 L100,100 L0,100Z"
      stroke="url(#gradient)"
      strokeWidth="0.5"
      fill="none"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--color-primary-600)" />
        <stop offset="100%" stopColor="var(--color-secondary-600)" />
      </linearGradient>
    </defs>
  </svg>
);

const CirclePattern = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-primary-600/10 to-secondary-600/10"
        initial={{ scale: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
        animate={{ 
          scale: [0, 1],
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
        }}
        transition={{ 
          duration: 3,
          delay: i * 0.2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          width: `${Math.random() * 100 + 50}px`,
          height: `${Math.random() * 100 + 50}px`,
        }}
      />
    ))}
  </div>
);

const StatBox = ({ value, label, icon }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-4"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-secondary-600/5" />
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative z-10"
    >
      <div className="flex items-center justify-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-primary-600 text-center mb-1">{value}</div>
      <div className="text-sm text-gray-600 text-center">{label}</div>
    </motion.div>
  </motion.div>
);

const ShareProgressCard = ({ 
  daysSmokeFree, 
  cigarettesAvoided, 
  moneySaved, 
  shareUrl 
}) => {
  const formattedMoney = parseFloat(moneySaved).toFixed(3);
  
  // Format time display
  const formatTimeDisplay = (days) => {
    if (days < 1) {
      const hours = Math.floor(days * 24);
      return {
        value: hours,
        label: `Hour${hours !== 1 ? 's' : ''} Free`
      };
    }
    return {
      value: Math.floor(days),
      label: `Day${days !== 1 ? 's' : ''} Free`
    };
  };

  const timeDisplay = formatTimeDisplay(daysSmokeFree);
  const shareText = `🎉 I've been smoke-free for ${timeDisplay.value} ${timeDisplay.label.toLowerCase()}! Avoided ${cigarettesAvoided} cigarettes and saved ₹${formattedMoney}. Join me on my journey with Quitter!`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-secondary-600/5" />
      <CirclePattern />
      <PolygonBackground />
      
      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-full border-2 border-primary-600/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-20 h-20 rounded-full border-2 border-secondary-600/20"
            />
            <span className="relative inline-flex items-center rounded-full px-6 py-2 text-sm font-medium bg-white text-primary-700 ring-1 ring-inset ring-primary-600/20 shadow-lg">
              My Smoke-Free Journey
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatBox 
            value={timeDisplay.value}
            label={timeDisplay.label}
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatBox 
            value={cigarettesAvoided}
            label="Not Smoked"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            }
          />
          <StatBox 
            value={`₹${formattedMoney}`}
            label="Saved"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">Victory Message</span>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Every breath is fresher, every day is stronger! 🌟
          </p>
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-4"
        >
          {[
            { Button: FacebookShareButton, Icon: FacebookIcon, color: '#1877F2' },
            { Button: TwitterShareButton, Icon: TwitterIcon, color: '#1DA1F2' },
            { Button: LinkedinShareButton, Icon: LinkedinIcon, color: '#0A66C2' },
            { Button: WhatsappShareButton, Icon: WhatsappIcon, color: '#25D366' }
          ].map(({ Button, Icon, color }, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button url={shareUrl} quote={shareText} title={shareText}>
                <Icon size={40} round bgStyle={{ fill: color }} />
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-400">
            Shared via{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 font-medium">
              Quitter App
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShareProgressCard;
