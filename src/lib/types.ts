export type User = {
  id: string;
  name: string;
  email: string;
  preferredLanguage: string;
  region: string;
};

export type Query = {
  id: string;
  text: string;
  language: string;
  timestamp: Date;
  response: string;
  sources: string[];
};