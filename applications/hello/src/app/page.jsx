import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HelloApp from '@/components/HelloApp';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#F5F4F0] dark:bg-[#121212]">
        <HelloApp />
      </div>
    </QueryClientProvider>
  );
}
