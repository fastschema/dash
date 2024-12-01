/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import '@/assets/globals.scss';
import '@/assets/style.scss';
import '@/components/common/editor/editor.scss';
import NextNProgress from 'nextjs-progressbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { SystemMessage } from '@/components/common/message';
import { usePathname, useRouter } from 'next/navigation';
import { getUserInfo, isStandaloneRoute } from '@/lib/user';
import { useEffect, useMemo, useState } from 'react';
import { Loading } from '@/components/common/loading';
import { AppConfig, User } from '@/lib/types';
import {
  AppContext,
  AppContextType,
  AuthContext,
  defaultAppState,
} from '@/lib/context';
import { fontSans } from '@/components/font';
import { isAuthError } from '@/lib/request';
import { getAppConfig } from '@/lib/app';
import { createWindowObject } from '@/components/browser';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Layout } from '@/components/layout';

const bodyClassName = cn(
  'min-h-screen bg-background font-sans antialiased',
  fontSans.variable
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const standaloneRoute = isStandaloneRoute(usePathname());
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [user, setUser] = useState<User>();
  const queryClient = new QueryClient();
  const [appConfig, setAppConfig] = useState<AppConfig>(
    defaultAppState.appConfig
  );

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
        const [userInfo, appConfigData] = await Promise.all([
          getUserInfo(),
          getAppConfig(),
        ]);
        setAppConfig(appConfigData);
        setUser(userInfo);
        setReady(true);
      } catch (e: any) {
        isAuthError(e) ? router.push('/login') : setError(e.message);
      }
    })();
  }, [standaloneRoute]);

  const authContextValue = useMemo(
    () => ({ ...AuthContext, user, setUser }),
    [user]
  );
  const appContextValue = useMemo<AppContextType>(
    () => ({
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
    }),
    [appConfig]
  );

  if (!ready && !error) {
    return (
      <html lang='en'>
        <body>
          <div className={bodyClassName}>
            <Loading full />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang='en'>
      <body className={bodyClassName} suppressHydrationWarning>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <AuthContext.Provider value={authContextValue}>
            <AppContext.Provider value={appContextValue}>
              <QueryClientProvider client={queryClient}>
                <TooltipProvider delayDuration={50}>
                  <SidebarProvider>
                    <SystemMessage />
                    {standaloneRoute ? children : <Layout>{children}</Layout>}
                    <Toaster />
                  </SidebarProvider>
                </TooltipProvider>
              </QueryClientProvider>
            </AppContext.Provider>
          </AuthContext.Provider>
          <NextNProgress color='#facc15' />
        </ThemeProvider>
      </body>
    </html>
  );
}
