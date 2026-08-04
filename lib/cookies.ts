/**
 * Cookie Utilities for Local Personalization
 */

export interface SessionPreferences {
  consentAccepted: boolean;
  accentColor: string; // 'cyan' | 'blue' | 'orange' | 'lightorange'
  username: string;
  userEmail: string;
  likedFaqs: string[]; // List of FAQ IDs
  recentSearches: string[];
}

export const DEFAULT_PREFERENCES: SessionPreferences = {
  consentAccepted: false,
  accentColor: "cyan",
  username: "",
  userEmail: "",
  likedFaqs: [],
  recentSearches: [],
};

// Color lookup dictionary suited for Blue & Light Orange theme
export const ACCENT_COLORS: Record<
  string,
  { bg: string; text: string; hex: string; name: string }
> = {
  cyan: {
    bg: "bg-[#00D1FF]",
    text: "text-black",
    hex: "#00D1FF",
    name: "Hyper Cyan Blue",
  },
  blue: {
    bg: "bg-[#2563EB]",
    text: "text-white",
    hex: "#2563EB",
    name: "Deep Electric Blue",
  },
  orange: {
    bg: "bg-[#FF5C00]",
    text: "text-white",
    hex: "#FF5C00",
    name: "Vapor Orange",
  },
  lightorange: {
    bg: "bg-[#FFAE33]",
    text: "text-black",
    hex: "#FFAE33",
    name: "Soft Peach Orange",
  },
};

export function setCookie(name: string, value: string, days = 365) {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    expires +
    "; path=/; SameSite=Strict";
}

export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export function savePreferencesToCookies(prefs: SessionPreferences) {
  setCookie("neo_faq_prefs", JSON.stringify(prefs));
}

export function loadPreferencesFromCookies(): SessionPreferences {
  const cookieVal = getCookie("neo_faq_prefs");
  if (!cookieVal) return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(cookieVal);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}
