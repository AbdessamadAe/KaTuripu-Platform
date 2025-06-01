import React from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { redirect } from "next/navigation";
import Logger from './logger';


export const getDifficultyStyle = (difficulty: string | undefined, isBackground = false): string => {
  const colors: Record<any, string> = {
    easy: isBackground ? "bg-[var(--success-color)] hover:bg-[var(--success-color-dark)] text-white" : "border-[var(--success-color)]",
    medium: isBackground ? "bg-[var(--warning-color)] hover:bg-[var(--warning-color-dark)] text-gray-800" : "border-[var(--warning-color)]",
    hard: isBackground ? "bg-[var(--error-color)] hover:bg-[var(--error-color-dark)] text-white" : "border-[var(--error-color)]",
    default: isBackground ? "bg-[var(--info-color)] hover:bg-[var(--info-color-dark)] text-white" : "border-[var(--info-color)]"
  };

  return colors[difficulty?.toLowerCase() || 'default'] || colors.default;
};

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
          background: 'linear-gradient(135deg, var(--warning-color) 0%, var(--primary-color-dark) 100%)',
          color: 'white',
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
          background: 'var(--primary-color-dark)',
          color: 'white',
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
          background: 'var(--info-color-dark)',
          color: 'white',
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
        background: 'linear-gradient(135deg, var(--warning-color) 0%, var(--warning-color-dark) 100%)',
        color: 'white',
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
    colors: ['var(--success-color)', 'var(--info-color)', 'var(--primary-color)', 'var(--secondary-color)']
  };

  // Merge defaults with provided options
  const config = { ...defaults, ...options };
  
  try {
    confetti(config);
  } catch (e) {
    Logger.error("Confetti animation failed:", e);
  }
};

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
