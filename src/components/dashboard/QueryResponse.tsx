import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QueryResponseProps {
  response: string;
  sources: string[];
  queryLoading: boolean;
}

export function QueryResponse({ response, sources, queryLoading }: QueryResponseProps) {
  if (!response && !queryLoading) return null;

  return (
    <Card className="border-l-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]"> {/* Success border, card hover */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        {queryLoading ? (
          <div className="space-y-3 p-4 bg-gray-50 rounded-md"> {/* Loading skeleton styling */}
            <div className="h-5 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-11/12"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-800 leading-relaxed text-lg">{response}</p> {/* Larger, relaxed text */}
            
            {sources.length > 0 && (
              <div className="pt-2">
                <h4 className="font-semibold text-gray-900 mb-2 text-md">Sources:</h4> {/* Bolder sources title */}
                <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                  {sources.map((source, index) => (
                    <li key={index} className="hover:text-indigo-600 transition-colors duration-200 cursor-pointer"> {/* Source hover effect */}
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}