export const siteConfig = {
  name: "CalledIt",
  description: "WNBA pick'em. Make your picks each week, see who called it.",
  tagline: "Call it. Prove it.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://calledit.app",
  ogImage: "/og-image.png",

  // Shown in a strip at the top of every page. Set to null to remove it.
  devNotice: "In development · Questions use sample data from past games" as string | null,

  links: {
    twitter: "https://twitter.com/calleditapp",
  },

  contact: {
    email: "hello@calledit.app",
    support: "support@calledit.app",
  },

  author: {
    name: "CalledIt",
    email: "hello@calledit.app",
  },
} as const;
