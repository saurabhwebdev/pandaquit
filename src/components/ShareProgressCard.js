import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import html2canvas from 'html2canvas';

const StatBox = ({ value, label, icon }) => (
  <div className="flex flex-col items-center p-3 bg-primary-50 rounded-lg">
    <div className="p-2 bg-primary-500 rounded-full mb-2">
      {icon}
    </div>
    <div className="text-xl font-bold text-primary-700">{value}</div>
    <div className="text-sm text-primary-600">{label}</div>
  </div>
);

const ShareProgressCard = ({ 
  timeSinceQuit,
  cigarettesAvoided, 
  moneySaved, 
  shareUrl,
  currencySymbol = '₹'
}) => {
  const cardRef = useRef(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Format time display based on hours
  const formatTimeDisplay = () => {
    if (!timeSinceQuit) return { value: 0, label: 'Hours Free' };
    
    if (timeSinceQuit.totalHours < 24) {
      const hours = Math.floor(timeSinceQuit.totalHours);
      return {
        value: hours,
        label: `Hour${hours !== 1 ? 's' : ''} Free`
      };
    }
    const days = Math.floor(timeSinceQuit.totalHours / 24);
    return {
      value: days,
      label: `Day${days !== 1 ? 's' : ''} Free`
    };
  };

  const timeDisplay = formatTimeDisplay();
  const formattedMoney = parseFloat(moneySaved).toFixed(3);
  const shareText = `🎉 I've been smoke-free for ${timeDisplay.value} ${timeDisplay.label.toLowerCase()}! Avoided ${Math.floor(cigarettesAvoided)} cigarettes and saved ${currencySymbol}${formattedMoney}. Join me on my journey with Quitter!`;

  const generateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const card = cardRef.current;
      const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShare = async (platform) => {
    const imageUrl = await generateImage();
    if (!imageUrl) return;

    const shareData = {
      files: [
        new File(
          [await (await fetch(imageUrl)).blob()],
          'quitter-progress.png',
          { type: 'image/png' }
        )
      ],
      text: shareText
    };

    if (navigator.share && platform === 'whatsapp') {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to WhatsApp share button if navigator.share fails
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <div ref={cardRef} className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 opacity-50" />
        <div className="relative p-6">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">My Smoke-Free Journey 🌟</h2>
          
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
              value={Math.floor(cigarettesAvoided)}
              label="Not Smoked"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
            />
            <StatBox 
              value={`${currencySymbol}${formattedMoney}`}
              label="Saved"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Motivational Text */}
          <div className="text-center mb-6">
            <p className="text-primary-700 font-medium">
              Every breath is fresher, every day is stronger! 🌟
            </p>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex justify-center space-x-4 p-4 bg-white">
        <FacebookShareButton url={shareUrl} quote={shareText} className="transform transition hover:scale-110">
          <div className="p-3 bg-blue-600 text-white rounded-full">
            <FaFacebook size={24} />
          </div>
        </FacebookShareButton>
        
        <TwitterShareButton url={shareUrl} title={shareText} className="transform transition hover:scale-110">
          <div className="p-3 bg-sky-500 text-white rounded-full">
            <FaTwitter size={24} />
          </div>
        </TwitterShareButton>
        
        <button 
          onClick={() => handleShare('whatsapp')} 
          className="transform transition hover:scale-110"
          disabled={isGeneratingImage}
        >
          <div className="p-3 bg-green-500 text-white rounded-full">
            <FaWhatsapp size={24} />
          </div>
        </button>
      </div>

      {isGeneratingImage && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
    </motion.div>
  );
};

export default ShareProgressCard;
