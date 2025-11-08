import { Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES, REGIONS } from "@/lib/constants"; // Import constants

interface AuthFormProps {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  authLoading: boolean;
  authError: string;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  preferredLanguage: string;
  setPreferredLanguage: (lang: string) => void;
  region: string;
  setRegion: (region: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGuestAccess: () => void;
}

export function AuthForm({
  authMode,
  setAuthMode,
  authLoading,
  authError,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  preferredLanguage,
  setPreferredLanguage,
  region,
  setRegion,
  onSubmit,
  onGuestAccess,
}: AuthFormProps) {
  return (
    // Enhanced background gradient for a more dynamic look
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-indigo-600 rounded-lg"> {/* Stronger shadow, indigo top border */}
        <CardHeader className="text-center pb-0"> {/* Adjusted padding */}
          <div className="mx-auto bg-linear-to-br from-indigo-200 to-purple-200 p-3 rounded-full w-20 h-20 flex items-center justify-center mb-4 transform hover:scale-105 transition-transform duration-300"> {/* Larger, gradient icon background */}
            <Globe className="text-indigo-700 w-10 h-10" /> {/* Darker, more prominent icon */}
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-900 leading-tight"> {/* Larger, bolder title */}
            {authMode === "login" ? "Welcome to KSHETRA" : "Create Your KSHETRA Account"} {/* More engaging text */}
          </CardTitle>
          <CardDescription className="text-md text-gray-600 pt-2"> {/* Slightly larger description */}
            {authMode === "login"
              ? "Sign in to access personalized local knowledge"
              : "Join KSHETRA to unlock region-specific insights"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6"> {/* Adjusted padding */}
          <form onSubmit={onSubmit} className="space-y-5"> {/* Increased spacing */}
            {authMode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label> {/* Stylized label */}
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramnath Paul"
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>

            {authMode === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700">Preferred Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200">
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
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700">Preferred Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200">
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
              </>
            )}

            {authError && (
              <div className="text-red-600 text-sm py-2 font-medium bg-red-50 rounded-md px-3 border border-red-200">
                {authError}
              </div>
            )}

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-all duration-200 transform hover:scale-[1.01]"
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? "Processing..." : (authMode === "login" ? "Sign In" : "Create Account")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6"> {/* Increased spacing */}
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div> {/* Lighter divider */}
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-500 font-medium">Or continue as</span> {/* Muted foreground for text */}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.005]"
            onClick={onGuestAccess}
          >
            Guest User
          </Button>

          <Button
            variant="link"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 text-sm"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}