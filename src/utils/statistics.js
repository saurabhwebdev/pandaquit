// Health milestone data based on scientific research
export const healthMilestones = [
  {
    id: 1,
    time: 20, // minutes
    description: "Blood pressure and heart rate return to normal",
    icon: "❤️"
  },
  {
    id: 2,
    time: 480, // 8 hours
    description: "Carbon monoxide levels drop to normal",
    icon: "🫁"
  },
  {
    id: 3,
    time: 1440, // 24 hours
    description: "Risk of heart attack begins to decrease",
    icon: "💪"
  },
  {
    id: 4,
    time: 2880, // 48 hours
    description: "Sense of taste and smell improve",
    icon: "👃"
  },
  {
    id: 5,
    time: 10080, // 1 week
    description: "Breathing becomes easier",
    icon: "🌬️"
  },
  {
    id: 6,
    time: 43200, // 1 month
    description: "Lung function increases up to 30%",
    icon: "🎯"
  },
  {
    id: 7,
    time: 129600, // 3 months
    description: "Circulation improves significantly",
    icon: "🔄"
  },
  {
    id: 8,
    time: 259200, // 6 months
    description: "Coughing and shortness of breath decrease",
    icon: "🏃"
  },
  {
    id: 9,
    time: 525600, // 1 year
    description: "Risk of heart disease drops by 50%",
    icon: "🏆"
  }
];

// Achievement badges data
export const achievements = [
  {
    id: "first_day",
    title: "First 24 Hours",
    description: "Completed your first day smoke-free",
    icon: "🌟",
    requirement: 1440 // minutes
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Stayed smoke-free for a week",
    icon: "🛡️",
    requirement: 10080
  },
  {
    id: "money_saver",
    title: "Money Saver",
    description: "Saved your first $100",
    icon: "💰",
    requirement: 100 // dollars
  },
  {
    id: "breath_master",
    title: "Breath Master",
    description: "Completed 10 breathing exercises",
    icon: "🧘",
    requirement: 10 // exercises
  },
  {
    id: "coping_champion",
    title: "Coping Champion",
    description: "Used 5 different coping strategies",
    icon: "🏅",
    requirement: 5 // strategies
  },
  {
    id: "month_milestone",
    title: "Monthly Milestone",
    description: "Smoke-free for a month",
    icon: "🌙",
    requirement: 43200
  },
  {
    id: "health_hero",
    title: "Health Hero",
    description: "Reached 5 health milestones",
    icon: "⭐",
    requirement: 5 // milestones
  },
  {
    id: "determination",
    title: "Pure Determination",
    description: "Logged in for 30 consecutive days",
    icon: "🔥",
    requirement: 30 // days
  }
];

// Calculate user's current progress and statistics
export const calculateProgress = (startDate, cigarettesPerDay, pricePerPack) => {
  const now = new Date();
  const start = new Date(startDate);
  const minutesQuit = Math.floor((now - start) / (1000 * 60));
  const cigarettesNotSmoked = Math.floor((minutesQuit / (24 * 60)) * cigarettesPerDay);
  const packPrice = pricePerPack;
  const cigarettesPerPack = 20;
  const moneySaved = (cigarettesNotSmoked / cigarettesPerPack) * packPrice;

  return {
    minutesQuit,
    cigarettesNotSmoked,
    moneySaved,
    currentMilestone: getCurrentMilestone(minutesQuit),
    achievedBadges: calculateAchievedBadges({
      minutesQuit,
      moneySaved,
      cigarettesNotSmoked
    })
  };
};

// Get current health milestone
export const getCurrentMilestone = (minutesQuit) => {
  const nextMilestone = healthMilestones.find(
    milestone => milestone.time > minutesQuit
  );
  
  if (!nextMilestone) {
    return healthMilestones[healthMilestones.length - 1];
  }
  
  return nextMilestone;
};

// Calculate achieved badges
export const calculateAchievedBadges = (stats) => {
  return achievements.filter(badge => {
    switch (badge.id) {
      case "first_day":
      case "week_warrior":
      case "month_milestone":
        return stats.minutesQuit >= badge.requirement;
      case "money_saver":
        return stats.moneySaved >= badge.requirement;
      case "breath_master":
        return (stats.breathingExercises || 0) >= badge.requirement;
      case "coping_champion":
        return (stats.copingStrategiesUsed || 0) >= badge.requirement;
      case "health_hero":
        return (stats.milestonesReached || 0) >= badge.requirement;
      case "determination":
        return (stats.consecutiveDays || 0) >= badge.requirement;
      default:
        return false;
    }
  });
};
