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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/common/button';
import { setup } from '@/lib/user';

const setupFormSchema = z.object({
  token: z.string().trim().min(1, { message: 'Token is required' }),
  username: z.string().trim().min(1, { message: 'Username or email is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const query = useSearchParams();
  const token = query.get('token');
  const router = useRouter();
  const setupForm = useForm<z.infer<typeof setupFormSchema>>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      token: token ?? '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof setupFormSchema>) => {
    setLoading(true);
    console.log(values);
    try {
      const status = await setup(values);
      if (status) {
        router.push('/login');
        notify.success('Setup successful');
      } else {
        notify.error('Setup failed');
      }
    } catch (e: any) { }

    setLoading(false);
  }

  if (!token) {
    return <div className='flex items-center justify-center h-screen'>
      <div className='p-4 space-y-4 text-center'>
        <h1 className='text-2xl'>Invalid setup token</h1>
        <p className='text-gray-500'>The setup token is invalid or has expired.</p>
        <Button onClick={() => router.push('/login')}>Go to login</Button>
      </div>
    </div>;
  }

  return <>
    <title>Setup - Fastschema</title>
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <Form {...setupForm}>
        <form onSubmit={setupForm.handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='w-full max-w-sm'>
            <CardHeader>
              <CardTitle className='text-2xl'>Setup - Fastschema</CardTitle>
              <CardDescription>
                Please provide the following details to setup your application.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <FormField
                control={setupForm.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Admin username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={setupForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Admin email address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={setupForm.control}
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
            </CardContent>
            <CardFooter>
              <Button type='submit' className='w-full' loading={loading}>Setup</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  </>;
}
