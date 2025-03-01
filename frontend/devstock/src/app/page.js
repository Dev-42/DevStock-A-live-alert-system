import Cover from "@/components/Cover";

export const metadata = {
  title: "DevStock - AI-powered stock insights at your fingertips 🚀 📈",
  description:
    "Get AI-powered stock insights instantly with DevStock. Analyze, predict, and stay ahead in the market with real-time stock data.",
  keywords:
    "AI stock insights, stock market analysis, stock predictions, DevStock, finance, trading",
  authors: [{ name: "Dev Bhattacharya" }],
  openGraph: {
    title: "DevStock - AI-powered stock insights 🚀📈",
    description:
      "Get AI-powered stock insights instantly with DevStock. Analyze, predict, and stay ahead in the market with real-time stock data.",
    url: "https://yourdomain.com", // Replace with your actual domain
    siteName: "DevStock",
    images: [
      {
        url: "/logo.webp", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "DevStock - AI-powered stock insights",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevStock - AI-powered stock insights 🚀📈",
    description:
      "AI-powered stock insights at your fingertips. Get real-time data and predictions to make informed trading decisions.",
    images: ["/logo.webp"], // Replace with your actual image URL
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function Home() {
  return <Cover />;
}
