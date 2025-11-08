"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";

import { Header } from "@/components/common/Header";
import { AuthForm } from "@/components/auth/AuthForm";
import { QueryInput } from "@/components/dashboard/QueryInput";
import { QueryResponse } from "@/components/dashboard/QueryResponse";
import { QueryHistory } from "@/components/dashboard/QueryHistory";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { PreferencesCard } from "@/components/dashboard/PreferencesCard";

export default function HomePage() {
  const {
    isAuthenticated,
    user,
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
    preferredLanguage: authPreferredLanguage,
    setPreferredLanguage: setAuthPreferredLanguage,
    region: authRegion,
    setRegion: setAuthRegion,
    handleAuth,
    handleGuestAccess,
    handleLogout,
  } = useAuth();

  const {
    query,
    setQuery,
    queryLanguage,
    setQueryLanguage,
    queryLoading,
    queryError,
    response,
    sources,
    queryHistory,
    defaultLanguage,
    setDefaultLanguage,
    defaultRegion,
    setDefaultRegion,
    handleQuerySubmit,
    handleApplyPreferences,
  } = useDashboardData(user);

  const handleSelectHistoryQuery = (selectedQuery: typeof queryHistory[0]) => {
    setQuery(selectedQuery.text);
    setQueryLanguage(selectedQuery.language);
  };

  if (!isAuthenticated) {
    return (
      <AuthForm
        authMode={authMode}
        setAuthMode={setAuthMode}
        authLoading={authLoading}
        authError={authError}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        preferredLanguage={authPreferredLanguage}
        setPreferredLanguage={setAuthPreferredLanguage}
        region={authRegion}
        setRegion={setAuthRegion}
        onSubmit={handleAuth}
        onGuestAccess={handleGuestAccess}
      />
    );
  }

  return (
    // Enhanced background gradient for the main dashboard
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <QueryInput
              query={query}
              setQuery={setQuery}
              queryLanguage={queryLanguage}
              setQueryLanguage={setQueryLanguage}
              queryLoading={queryLoading}
              queryError={queryError}
              onSubmit={handleQuerySubmit}
            />

            <QueryResponse
              response={response}
              sources={sources}
              queryLoading={queryLoading}
            />

            <QueryHistory
              queryHistory={queryHistory}
              onSelectQuery={handleSelectHistoryQuery}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UserProfileCard user={user} onEditPreferences={() => { /* Potentially open a modal */ }} />

            <PreferencesCard
              user={user}
              defaultLanguage={defaultLanguage}
              setDefaultLanguage={setDefaultLanguage}
              defaultRegion={defaultRegion}
              setDefaultRegion={setDefaultRegion}
              onSavePreferences={handleApplyPreferences}
            />
          </div>
        </div>
      </main>
    </div>
  );
}