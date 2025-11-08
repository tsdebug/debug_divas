import { Globe, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm"> {/* Added transparency, blur, sticky, and shadow */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Globe className="text-indigo-600 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">KSHETRA</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Region:</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium"> 
              {user?.region}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`} />
              <AvatarFallback className="bg-indigo-500 text-white font-semibold"> {/* Avatar background */}
                {user?.name?.charAt(0) || <UserIcon className="w-5 h-5 text-indigo-200" />}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.id === "guest" ? "Guest User" : user?.email}</p>
            </div>   
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="hover:shadow-md transition-shadow duration-200" // Added shadow on hover
          >
            {user?.id === "guest" ? "Exit Guest" : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}