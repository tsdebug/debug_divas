import { User, Query } from "./types";

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "en-hi", label: "Hinglish" },
  { value: "en-bn", label: "Benglish" },
];

export const REGIONS = [
  "Delhi", "Mumbai", "Kolkata", "Bangalore", "Chennai", 
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow"
];

export const EXAMPLE_QUERIES = [
  { text: "What are the local health services available?", language: "en" },
  { text: "स्थानीय स्वास्थ्य सेवाएं क्या हैं?", language: "hi" },
  { text: "স্থানীয় স্বাস্থ্য পরিষেবা কী কী?", language: "bn" },
];

export const MOCK_RESPONSES = [
  {
    text: "Local health services include primary health centers, community health centers, and specialized clinics. These services are available in multiple languages including Hindi, Bengali, and English.",
    sources: ["Ministry of Health Guidelines", "Local Health Department Report"]
  },
  {
    text: "स्थानीय स्वास्थ्य सेवाएं प्राथमिक स्वास्थ्य केंद्र, सामुदायिक स्वास्थ्य केंद्र और विशेषज्ञ क्लिनिक शामिल हैं। ये सेवाएं हिंदी, बंगाली और अंग्रेजी सहित कई भाषाओं में उपलब्ध हैं।",
    sources: ["स्वास्थ्य मंत्रालय दिशानिर्देश", "स्थानीय स्वास्थ्य विभाग रिपोर्ट"]
  },
  {
    text: "স্থানীয় স্বাস্থ্য পরিষেবাগুলি প্রাথমিক স্বাস্থ্য কেন্দ্র, কমিউনিটি স্বাস্থ্য কেন্দ্র এবং বিশেষ ক্লিনিকগুলি অন্তর্ভুক্ত করে। এই পরিষেবাগুলি হিন্দি, বাংলা এবং ইংরেজি সহ বিভিন্ন ভাষায় পাওয়া যায়।",
    sources: ["স্বাস্থ্য মন্ত্রণালয় নির্দেশিকা", "স্থানীয় স্বাস্থ্য বিভাগ প্রতিবেদন"]
  }
];

// Mock user for initial setup
export const MOCK_USER: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  preferredLanguage: "en",
  region: "Delhi"
};

// Mock query history for initial setup
export const MOCK_QUERY_HISTORY: Query[] = [
  {
    id: "1",
    text: "What are local health services?",
    language: "en",
    timestamp: new Date(Date.now() - 3600000),
    response: MOCK_RESPONSES[0].text,
    sources: MOCK_RESPONSES[0].sources
  },
  {
    id: "2",
    text: "स्थानीय स्वास्थ्य सेवाएं क्या हैं?",
    language: "hi",
    timestamp: new Date(Date.now() - 86400000),
    response: MOCK_RESPONSES[1].text,
    sources: MOCK_RESPONSES[1].sources
  }
];