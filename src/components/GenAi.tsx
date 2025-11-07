"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  Check, 
  AlertTriangle, 
  Info, 
  Users, 
  Leaf, 
  Landmark, 
  GraduationCap, 
  Heart, 
  Shield 
} from "lucide-react";

export default function LocalizedGenAISystem() {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [selectedDomain, setSelectedDomain] = useState("civic");
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "unverified" | "disputed">("unverified");
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Domain options with icons
  const domains = [
    { id: "civic", name: "Civic", icon: Landmark },
    { id: "agriculture", name: "Agriculture", icon: Leaf },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "healthcare", name: "Healthcare", icon: Heart },
    { id: "legal", name: "Legal", icon: Shield },
    { id: "community", name: "Community", icon: Users },
  ];

  // Language options
  const languages = [
    { code: "en-IN", name: "English (India)" },
    { code: "hi-IN", name: "Hindi (India)" },
    { code: "bn-IN", name: "Bengali (India)" },
    { code: "te-IN", name: "Telugu (India)" },
    { code: "mr-IN", name: "Marathi (India)" },
    { code: "ta-IN", name: "Tamil (India)" },
  ];

  // Mock response data
  const mockResponses: Record<string, { text: string; sources: string[] }> = {
    "civic": {
      text: "The Right to Information Act (RTI) in India allows citizens to request information from public authorities. You can file an RTI application to any government department by submitting a written request with your details and the information required. The response should be provided within 30 days.",
      sources: [
        "Right to Information Act, 2005 - Government of India",
        "Ministry of Personnel, Public Grievances & Pensions Guidelines",
        "State RTI Portal - Maharashtra"
      ]
    },
    "agriculture": {
      text: "For soil health improvement in your region, consider crop rotation with legumes, adding organic compost, and using neem cake as a natural fertilizer. The local Krishi Vigyan Kendra recommends soil testing every 2 years to maintain optimal pH levels.",
      sources: [
        "ICAR - Indian Council of Agricultural Research",
        "Krishi Vigyan Kendra - Regional Guidelines",
        "State Agricultural Department - Soil Health Manual"
      ]
    },
    "education": {
      text: "The Right to Education Act guarantees free and compulsory education to children aged 6-14. For admission issues, contact your local Elementary Education Officer. Scholarships for SC/ST students are available through the state scholarship portal.",
      sources: [
        "RTE Act 2009 - Ministry of Education",
        "State Education Department Guidelines",
        "National Scholarship Portal"
      ]
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
        };
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  // Handle voice input toggle
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Handle query submission
  const handleSubmit = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResponse = mockResponses[selectedDomain as keyof typeof mockResponses] || {
        text: "I can help you with information related to civic services, agriculture, education, healthcare, legal matters, and community resources. Please ask a specific question in your preferred language.",
        sources: ["General Knowledge Base"]
      };
      
      setResponse(mockResponse.text);
      setSources(mockResponse.sources);
      setVerificationStatus(Math.random() > 0.7 ? "verified" : "unverified");
      setIsLoading(false);
    }, 1500);
  };

  // Get verification status icon and text
  const getVerificationInfo = () => {
    switch (verificationStatus) {
      case "verified":
        return { icon: Check, text: "Verified Information", color: "text-green-600" };
      case "disputed":
        return { icon: AlertTriangle, text: "Disputed Information", color: "text-red-600" };
      default:
        return { icon: Info, text: "Unverified Information", color: "text-yellow-600" };
    }
  };

  const VerificationIcon = getVerificationInfo().icon;
  const verificationText = getVerificationInfo().text;
  const verificationColor = getVerificationInfo().color;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            KSHETRA
          </h1>
          <p className="text-gray-600">
            INDIA’S KNOWLEDGE, REIMAGINED THROUGH AI
          </p>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Knowledge Query</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Ask questions about local topics in your preferred language
              </p>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label htmlFor="language-select" className="text-sm font-medium">
                Language & Region
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="language-select" className="w-full sm:w-48">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Domain Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Knowledge Domain</Label>
              <Tabs value={selectedDomain} onValueChange={setSelectedDomain}>
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 h-auto p-1">
                  {domains.map((domain) => {
                    const IconComponent = domain.icon;
                    return (
                      <TabsTrigger 
                        key={domain.id} 
                        value={domain.id} 
                        className="flex flex-col items-center justify-center h-16 cursor-pointer"
                      >
                        <IconComponent className="h-5 w-5 mb-1" />
                        <span className="text-xs">{domain.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
            
            {/* Query Input */}
            <div className="mb-6">
              <Label htmlFor="query-input" className="text-sm font-medium mb-2 block">
                Your Question
              </Label>
              <div className="flex gap-2">
                <Textarea
                  id="query-input"
                  placeholder="Type your question here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 min-h-[100px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={`self-end mb-1 ${isListening ? "bg-red-100" : ""}`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  <Mic className={`h-5 w-5 ${isListening ? "text-red-600" : "text-gray-600"}`} />
                </Button>
              </div>
              {isListening && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <span className="flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                  Listening... Speak now
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button 
              onClick={handleSubmit} 
              className="w-full sm:w-auto"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Processing..." : "Get Localized Answer"}
            </Button>
          </CardContent>
        </Card>
        
        {/* Response Section */}
        {response && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-xl">Response</CardTitle>
                <div className={`flex items-center text-sm ${verificationColor}`}>
                  <VerificationIcon className="h-4 w-4 mr-1" />
                  <span>{verificationText}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{response}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Sources & Citations
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {sources.map((source, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                <Button variant="outline" size="sm">
                  Request Clarification
                </Button>
                <Button variant="outline" size="sm">
                  Report Issue
                </Button>
                <Button variant="outline" size="sm">
                  Share Response
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-8">
          <p>
            This system provides localized information based on your region and language preferences.
            Responses are generated using regional knowledge bases and may require verification.
          </p>
        </footer>
      </div>
    </div>
  );
}