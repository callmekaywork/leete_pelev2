export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isPopular: boolean;
  likes: number;
}

export const INITIAL_FAQS: FAQ[] = [
  {
    id: "faq_1",
    question: "What is this Neo-Brutalist FAQ System built with?",
    answer:
      "It is built with Next.js 15+ (App Router), Tailwind CSS v4, and Lucide React. The style is inspired by modern web design interfaces featuring high-contrast stark shadows, chunky black borders, saturated accent color fills, and bold asymmetrical buttons.",
    category: "General",
    tags: ["general", "framework", "tech", "style"],
    isPopular: true,
    likes: 142,
  },
  {
    id: "faq_2",
    question: "Is my data saved when I sign up through the Interest button?",
    answer:
      "Yes, fully! Your name and email are persisted dynamically in our local file database (submissions_db.json) safe on the application container server, and also cached in your secure local browser cache for layout personalization.",
    category: "General",
    tags: ["general", "data", "database", "security"],
    isPopular: true,
    likes: 98,
  },
  {
    id: "faq_3",
    question: "How does the site's Cookie Consent and Preference engine work?",
    answer:
      "On your first visit, you are prompted with our custom Neo-Brutalist banner. Accepting the banner sets a highly secure cookie 'neo_faq_prefs' storing your preferred accent theme (Canary Yellow, Hyper Cyan, Radio Lime, Brutal Pink, Acid Violet), your liked FAQ questions list, and recent searches. This allows us to deliver a tailor-made interface immediately when you return.",
    category: "Cookies & Security",
    tags: ["cookies", "security", "consent", "preferences"],
    isPopular: true,
    likes: 85,
  },
  {
    id: "faq_4",
    question: "Why does this layout use such thick, black borders?",
    answer:
      "This is a key signature of Neo-Brutalism! By removing traditional gradients, pastel blurs, and soft radius corners, we create a high-hierarchy layout that respects accessibility, looks extremely distinct, and works great on any device resolution.",
    category: "General",
    tags: ["general", "design", "borders", "accessibility"],
    isPopular: false,
    likes: 45,
  },
  {
    id: "faq_5",
    question: "Can I use these cookies on my mobile device?",
    answer:
      "Absolutely. Cookies are compliant with standard mobile web specifications. They are stored local to your mobile device browser with SameSite=Strict protection to ensure unauthorized sites cannot access your session information.",
    category: "Cookies & Security",
    tags: ["cookies", "security", "mobile", "compliant"],
    isPopular: false,
    likes: 31,
  },
  {
    id: "faq_6",
    question: "How can I integrate this FAQ layout into my own workspace?",
    answer:
      "Easy! All components are designed as atomic units. You can import our cookies controller, search engines, and Tailwind configuration directly into any Next.js app that supports pure Tailwind styles without additional package overload.",
    category: "Integration",
    tags: ["integration", "setup", "tailwind", "nextjs"],
    isPopular: false,
    likes: 56,
  },
  {
    id: "faq_7",
    question: "How secure is the local database storage?",
    answer:
      "We use server-side JSON files managed under standard Next.js file access paradigms. Unlike direct client-side databases that could be altered in third-party environments, our server endpoints inspect input correctness and schema validations before modifying the local database.",
    category: "Cookies & Security",
    tags: ["cookies", "security", "database", "backend"],
    isPopular: true,
    likes: 119,
  },
  {
    id: "faq_8",
    question: "Is there an offline mode available for reading answers?",
    answer:
      "Yes! Because the core list of frequent guidelines is bundle-optimized, once the page successfully renders the first time, you can lose internet connectivity entirely and still search, browse, open cards, and toggle preferences.",
    category: "Performance",
    tags: ["performance", "offline", "speed", "cache"],
    isPopular: false,
    likes: 29,
  },
  {
    id: "faq_9",
    question: "Can we submit custom questions to this system?",
    answer:
      "Yes! Simply use the Search bar to look for queries first. If no relevant item is found, the system offers an interactive widget to post details or express interest to the maintainers, instantly registering your voice.",
    category: "Integration",
    tags: ["integration", "community", "submission", "custom"],
    isPopular: true,
    likes: 72,
  },
];
