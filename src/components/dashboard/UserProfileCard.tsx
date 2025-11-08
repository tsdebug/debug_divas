import { User as UserIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types";
import { LANGUAGES } from "@/lib/constants";

interface UserProfileCardProps {
  user: User | null;
  onEditPreferences: () => void; // Optional handler for editing
}

export function UserProfileCard({ user, onEditPreferences }: UserProfileCardProps) {
  if (!user) return null;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.005]"> {/* Card hover effect */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
          <UserIcon className="w-6 h-6 text-indigo-600" />
          Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5"> {/* Increased spacing */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-indigo-300 shadow-md"> {/* Larger avatar, border, shadow */}
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`} />
            <AvatarFallback className="bg-indigo-500 text-white font-bold text-xl">
              {user?.name?.charAt(0) || <UserIcon className="w-8 h-8 text-indigo-200" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-600">
              {user?.id === "guest" ? "Guest User" : user?.email}
            </p>
            {user?.id === "guest" && (
              <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800 font-medium border-yellow-200"> {/* Stylized badge */}
                Limited Access
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-3 text-gray-700"> {/* Increased spacing, text color */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Preferred Language:</span>
            <span className="font-semibold text-indigo-700">
              {LANGUAGES.find(l => l.value === user?.preferredLanguage)?.label}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Region:</span>
            <span className="font-semibold text-indigo-700">{user?.region}</span>
          </div>
        </div>
        
        {user?.id !== "guest" && (
          <Button 
            variant="outline" 
            className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={onEditPreferences}
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Preferences
          </Button>
        )}
      </CardContent>
    </Card>
  );
}