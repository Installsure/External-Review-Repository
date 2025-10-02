import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '../components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>ZeroStack - AWS-Ready Monorepo Platform</title>
        <meta
          name="description"
          content="Deploy scalable React and Node.js applications with ZeroStack's AWS-ready infrastructure."
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set theme before page renders to prevent flash
              if (typeof window !== 'undefined') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }
            `,
          }}
        />
      </head>
      <body className="h-full bg-[#F3F3F3] dark:bg-[#0A0A0A] transition-colors duration-200">
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <div className="h-full">
              {/* Consolidated Google Fonts Import for ZeroStack */}
              <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=Sora:wght@400;600;700&family=Open+Sans:wght@400;600&family=JetBrains+Mono:wght@700&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@600&display=swap');

                .font-inter {
                  font-family: 'Inter', sans-serif;
                }
                .font-plus-jakarta {
                  font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .font-sora {
                  font-family: 'Sora', sans-serif;
                }
                .font-opensans {
                  font-family: 'Open Sans', sans-serif;
                }
                .font-jetbrains {
                  font-family: 'JetBrains Mono', monospace;
                }
                .font-bricolage {
                  font-family: 'Bricolage Grotesque', sans-serif;
                }
                .font-montserrat {
                  font-family: 'Montserrat', sans-serif;
                }
                .font-poppins {
                  font-family: 'Poppins', sans-serif;
                }
              `}</style>
              {children}
            </div>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
