"use client"; // Required for the speech recognition hook
import 'regenerator-runtime/runtime'; // Required for speech recognition
import { Send, Mic, MicOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, EXAMPLE_QUERIES } from "@/lib/constants";
import { useEffect } from 'react';

// --- MODIFIED SECTION START ---
// We are adding the speech recognition library
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// --- MODIFIED SECTION END ---

interface QueryInputProps {
  query: string;
  setQuery: (q: string) => void;
  queryLanguage: string;
  setQueryLanguage: (lang: string) => void;
  queryLoading: boolean;
  queryError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function QueryInput({
  query,
  setQuery,
  queryLanguage,
  setQueryLanguage,
  queryLoading,
  queryError,
  onSubmit,
}: QueryInputProps) {

  // --- MODIFIED SECTION START ---
  // Setting up the voice input hooks and logic
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // This effect updates the input field as you speak
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript, setQuery]);

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.log("Browser doesn't support speech recognition.");
    // You could render a message here if you want
  }
  // --- MODIFIED SECTION END ---

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <Send className="w-6 h-6 text-indigo-600" />
          Ask Localized Questions
        </CardTitle>
        <CardDescription className="text-gray-600">
          Get information tailored to your region and language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center"> {/* Added items-center */}
            <div className="relative flex-1 w-full"> {/* Added relative and w-full */}
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask or click the mic to speak..."
                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 shadow-sm pr-10" // Added padding for mic
              />
              {/* --- MODIFIED: Added the Mic Button --- */}
              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  onClick={handleMicClick}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {listening ? (
                    <Mic className="h-5 w-5 text-red-500 animate-pulse" />
                  ) : (
                    <MicOff className="h-5 w-5 text-gray-500 hover:text-indigo-600" />
                  )}
                </button>
              )}
            </div>
            <div className="w-full sm:w-40">
              <Select value={queryLanguage} onValueChange={setQueryLanguage}>
                <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 shadow-sm">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={queryLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              {queryLoading ? "Processing..." : "Ask"}
            </Button>
          </div>

          {queryError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">{queryError}</div>
          )}
        </form>

        <div className="mt-5">
          <p className="text-sm text-gray-600 mb-3 font-medium">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 shadow-sm"
                onClick={() => {
                  setQuery(example.text);
                  setQueryLanguage(example.language);
                }}
              >
                {example.text}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}