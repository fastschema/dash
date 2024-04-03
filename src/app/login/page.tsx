'use client';

import * as z from 'zod';
import * as notify from '@/lib/notify';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getUserInfo, login, setAccessToken } from '@/lib/user';
import { Button } from '@/components/common/button';

const loginFormSchema = z.object({
  login: z.string().trim().min(1, { message: 'Username or email is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getUserInfo(true);
        if (currentUser.id) {
          window.location.href = '/dash';
        }
      } catch (e: any) { }
    })();
  }, []);

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    try {
      const loginData = await login(values);
      loginData.token && setAccessToken(loginData.token);
      router.push('/');
      notify.success('Login successful');
    } catch (e: any) { }

    setLoading(false);
  }

  return <>
    <title>Login - Fastschema</title>
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='w-full max-w-sm'>
            <CardHeader>
              <CardTitle className='text-2xl'>Login - Fastschema</CardTitle>
              <CardDescription>
                Enter your username to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <FormField
                  control={loginForm.control}
                  name='login'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder='Username or email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-2'>
                <FormField
                  control={loginForm.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder='••••••••' type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit' className='w-full' loading={loading}>Sign in</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  </>;
}
