import React from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';


export const formatYouTubeUrl = (url: string): string => {
  if (!url) return '';

  // Handle youtu.be short links
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Handle standard youtube.com links
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // If it's already an embed link or another format, return as is
  return url;
};

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .trim();
}


// Progress celebration
export const celebrateProgress = (percentage: number) => {
  // Custom styles for different milestone levels
  if (percentage === 100) {
    // Complete mastery
    toast.success(
      React.createElement(
        'div',
        { className: "flex flex-col items-center" },
        React.createElement(
          'span',
          { className: "text-xl font-bold mb-1" },
          'You did it! 🎉'
        ),
        React.createElement(
          'span',
          null,
          'You\'ve completed 100% of this roadmap!'
        )
      ),
      {
        duration: 5000,
        icon: '🏆',
        style: {
          background: 'linear-gradient(135deg, #f97316 0%, #7e22ce 100%)',
          color: '#fff',
          padding: '16px',
          fontWeight: 'bold',
        },
      }
    );
    fireConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  } else if (percentage >= 75) {
    // Major milestone
    toast.success(
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          { className: "text-lg font-bold" },
          'Amazing progress!'
        ),
        React.createElement(
          'span',
          { className: "block text-sm mt-1" },
          `You've completed ${percentage}% of this roadmap!`
        )
      ),
      { icon: '🌟' }
    );
  } else if (percentage >= 50) {
    // Halfway milestone
    toast(
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          { className: "font-bold" },
          'Halfway there!'
        ),
        React.createElement(
          'span',
          { className: "block text-sm mt-1" },
          `You've completed ${percentage}% of this roadmap`
        )
      ),
      {
        icon: '🔥',
        style: {
          background: '#3730a3',
          color: '#fff',
        }
      }
    );
  } else if (percentage >= 25) {
    // Quarter milestone
    toast(
      React.createElement(
        'div',
        null,
        `Great start! ${percentage}% completed`
      ),
      {
        icon: '👍',
        style: {
          background: '#1e40af',
          color: '#fff',
        }
      }
    );
  }
};

// Achievement unlocked notification
export const showAchievement = (title: string, description: string) => {
  toast.success(
    React.createElement(
      'div',
      { className: "flex flex-col" },
      React.createElement(
        'span',
        { className: "text-lg font-bold" },
        'Achievement Unlocked!'
      ),
      React.createElement(
        'span',
        { className: "font-semibold mt-1" },
        title
      ),
      React.createElement(
        'span',
        { className: "text-sm mt-1" },
        description
      )
    ),
    {
      duration: 5000,
      icon: '🏅',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
        padding: '16px',
      }
    }
  );
  
  // Small confetti burst for achievements
  fireConfetti({
    particleCount: 80,
    spread: 50,
    origin: { y: 0.8 }
  });
};

// Error notification
export const showError = (message: string) => {
  toast.error(
    React.createElement('div', null, message),
    { 
      duration: 4000,
      style: {
        padding: '12px',
      }
    }
  );
};

// Confetti animation
export const fireConfetti = (options = {}) => {
  const defaults = {
    particleCount: 100,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#4ade80', '#3b82f6', '#a855f7', '#ec4899']
  };

  // Merge defaults with provided options
  const config = { ...defaults, ...options };
  
  try {
    confetti(config);
  } catch (e) {
    console.error("Confetti animation failed:", e);
  }
};