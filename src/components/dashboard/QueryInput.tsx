import { Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, EXAMPLE_QUERIES } from "@/lib/constants";

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
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]"> {/* Card hover effect */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800"> {/* Larger title, more gap */}
          <Send className="w-6 h-6 text-indigo-600" />
          Ask Localized Questions
        </CardTitle>
        <CardDescription className="text-gray-600">
          Get information tailored to your region and language
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about local services, regulations, or events..."
                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
              />
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

        <div className="mt-5"> {/* Increased top margin */}
          <p className="text-sm text-gray-600 mb-3 font-medium">Try these examples:</p> {/* Bolder text */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 shadow-sm" // More stylized example buttons
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