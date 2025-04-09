module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d47a1", // Replace with the dark blue you want for the background
        secondary: "#1565c0", // Lighter blue for cards
        accent: "#1e88e5", // Button hover effects
        neutral: "#ffffff", // Neutral white for text
        success: "#4caf50", // Green for success labels
        warning: "#ff9800", // Orange for warnings
        error: "#f44336", // Red for errors
      },
    },
  },
  plugins: [],
};
