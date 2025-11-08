import { History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Query } from "@/lib/types";
import { LANGUAGES } from "@/lib/constants";

interface QueryHistoryProps {
  queryHistory: Query[];
  onSelectQuery: (query: Query) => void;
}

export function QueryHistory({ queryHistory, onSelectQuery }: QueryHistoryProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]"> {/* Card hover effect */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <History className="w-6 h-6 text-indigo-600" />
          Query History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {queryHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-6 italic">No queries yet. Start asking!</p> 
        ) : (
          <div className="space-y-4"> {/* Increased spacing */}
            {queryHistory.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200" // Enhanced history item styling
                onClick={() => onSelectQuery(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-800 text-base leading-snug">{item.text}</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {LANGUAGES.find(l => l.value === item.language)?.label || item.language}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <p>
                    {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">
                    View Response
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}