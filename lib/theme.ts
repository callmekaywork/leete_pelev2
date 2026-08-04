// theme.ts

export type ThemeColors = {
  primaryBlue: string;
  accentOrange: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

export type TextStyles = {
  heading: {
    fontSize: string;
    fontWeight: number;
    color: string;
  };
  body: {
    fontSize: string;
    fontWeight: number;
    color: string;
  };
  caption: {
    fontSize: string;
    fontWeight: number;
    color: string;
  };
};

export type Theme = {
  colors: ThemeColors;
  text: TextStyles;
};

export const lightMode: Theme = {
  colors: {
    primaryBlue: "#1E3A8A", // Deep navy blue
    accentOrange: "#F59E0B", // Light amber orange
    background: "#FFFFFF", // Pure white
    surface: "#F1F5F9", // Light gray-blue surface
    textPrimary: "#0F172A", // Dark slate text
    textSecondary: "#475569", // Muted gray-blue
    border: "#E2E8F0", // Soft gray
  },
  text: {
    heading: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#0F172A",
    },
    body: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#475569",
    },
    caption: {
      fontSize: "0.875rem",
      fontWeight: 300,
      color: "#64748B",
    },
  },
};

export const darkMode: Theme = {
  colors: {
    primaryBlue: "#60A5FA", // Bright sky blue
    accentOrange: "#FDBA74", // Soft peach orange
    background: "#0F172A", // Near-black slate
    surface: "#1E293B", // Dark slate surface
    textPrimary: "#F8FAFC", // Off-white text
    textSecondary: "#CBD5E1", // Light gray-blue
    border: "#334155", // Dark gray-blue
  },
  text: {
    heading: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#F8FAFC",
    },
    body: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#CBD5E1",
    },
    caption: {
      fontSize: "0.875rem",
      fontWeight: 300,
      color: "#94A3B8",
    },
  },
};

// Utility to switch themes
export const getTheme = (mode: "light" | "dark"): Theme =>
  mode === "light" ? lightMode : darkMode;
