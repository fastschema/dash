'use client';
import '@/assets/globals.css';
import '@/assets/style.scss';
import '@/components/common/editor/editor.scss';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextNProgress from 'nextjs-progressbar';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { SystemMessage } from '@/components/common/message';
import { usePathname, useRouter } from 'next/navigation';
import { getUserInfo, isStandaloneRoute } from '@/lib/user';
import { useEffect, useMemo, useState } from 'react';
import { Loading } from '@/components/common/loading';
import { AppConfig, User } from '@/lib/types';
import { AppContext, AppContextType, AuthContext, defaultAppState } from '@/lib/context';
import { fontSans } from '@/components/font';
import { isAuthError } from '@/lib/request';
import { getAppConfig } from '@/lib/app';
import { createWindowObject } from '@/components/browser';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Layout } from '@/components/layout';

const bodyClassName = cn(
  'min-h-screen bg-background font-sans antialiased',
  '[&_.slate-selected]:!bg-primary/20 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary [&_.slate-selection-area]:bg-primary/10',
  fontSans.variable
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const standaloneRoute = isStandaloneRoute(usePathname());
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [user, setUser] = useState<User>();
  const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppState.appConfig);
  const queryClient = new QueryClient();

  useEffect(() => {
    createWindowObject();
  }, []);

  useEffect(() => {
    if (standaloneRoute) {
      setReady(true);
      return;
    }

    (async () => {
      try {
        const userInfo = await getUserInfo();
        const appConfigData = await getAppConfig();
        setAppConfig(appConfigData);
        setUser(userInfo);
        setReady(true);
      } catch (e: any) {
        isAuthError(e) ? router.push('/login') : setError(e.message);
      }
    })();
  }, [standaloneRoute]);

  const authContextValue = useMemo(() => ({ ...AuthContext, user, setUser }), [user]);
  const appContextValue = useMemo<AppContextType>(() => ({
    ...AppContext,
    appConfig,
    setAppConfig,
    reloadAppConfig: async () => {
      try {
        const appConfigData = await getAppConfig();
        setAppConfig(appConfigData);
      } catch (e: any) {
        setError(e.message);
      }
    },
  }), [appConfig]);

  if (!ready && !error) {
    return <html lang='en'>
      <body>
        <div className={bodyClassName}><Loading full /></div>
      </body>
    </html>
  }

  return (
    <html lang='en'>
      <body
        className={bodyClassName}
        suppressHydrationWarning
      >
        <ThemeProvider attribute='class' defaultTheme='light'>
          <AuthContext.Provider value={authContextValue}>
            <AppContext.Provider value={appContextValue}>
              <QueryClientProvider client={queryClient}>
                <TooltipProvider delayDuration={50}>
                  <SystemMessage />
                  {standaloneRoute
                    ? children
                    : <Layout>{children}</Layout>}
                  <Toaster />
                </TooltipProvider>
              </QueryClientProvider>
            </AppContext.Provider>
          </AuthContext.Provider>
          <NextNProgress color='#facc15' />
        </ThemeProvider>
      </body>
    </html>
  )
}
