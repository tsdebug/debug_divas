import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { LANGUAGES, REGIONS } from "@/lib/constants";

interface PreferencesCardProps {
  user: User | null;
  defaultLanguage: string;
  setDefaultLanguage: (lang: string) => void;
  defaultRegion: string;
  setDefaultRegion: (region: string) => void;
  onSavePreferences: () => void;
}

export function PreferencesCard({
  user,
  defaultLanguage,
  setDefaultLanguage,
  defaultRegion,
  setDefaultRegion,
  onSavePreferences,
}: PreferencesCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]"> {/* Card hover effect */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <Settings className="w-6 h-6 text-indigo-600" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5"> {/* Increased spacing */}
        <div className="space-y-2">
          <Label htmlFor="pref-language" className="text-sm font-medium text-gray-700">Default Language</Label>
          <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
            <SelectTrigger id="pref-language" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 shadow-sm">
              <SelectValue placeholder="Select language" />
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
        
        <div className="space-y-2">
          <Label htmlFor="pref-region" className="text-sm font-medium text-gray-700">Default Region</Label>
          <Select value={defaultRegion} onValueChange={setDefaultRegion}>
            <SelectTrigger id="pref-region" className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 shadow-sm">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {user?.id !== "guest" ? (
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            onClick={onSavePreferences}
          >
            Save Preferences
          </Button>
        ) : (
          <div className="text-sm text-gray-500 text-center py-3 bg-gray-50 rounded-md border border-gray-200 italic"> {/* Stylized info for guest users */}
            Preferences available for registered users
          </div>
        )}
      </CardContent>
    </Card>
  );
}