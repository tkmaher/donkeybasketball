import { Metadata } from "next";

export const staticMetadata: Metadata = {
    metadataBase: new URL("https://donkeybasketballpla.net/"),
    applicationName: "Tom Maher",
    title: {
      template: 'donkey basketball | %s',
      default: 'donkey basketball', 
    },
    description: "Donkey Basketball is the Chicago-based hardware performance and recording project of Isaac Tomas Lowenstein.",
    keywords: ["media", "techno", "sound", "electronic music", "portfolio", "Chicago", "experimental", "performance", "recording", "sound objects"],
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: "index, follow"
    },
    openGraph: {
      locale: "en_US",
      siteName: "donkeybasketballpla.net",
      url: "https://donkeybasketballpla.net",
      type: "website",
      images: [
        {
          url: "https://donkeybasketballpla.net/logo.png",
          width: 1200,
          height: 630,
          alt: "Donkey Basketball"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "donkey basketball",
      
      images: [
        {
            url: "https://donkeybasketballpla.net/logo.png",
            width: 1200,
          height: 630,
          alt: "Donkey Basketball"
        }
      ]
    }
  };