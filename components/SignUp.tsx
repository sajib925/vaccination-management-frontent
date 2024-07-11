"use client"
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';

interface FormData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const RegisterForm = () => {
    const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [response, setResponse] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('https://vaccination-management-c8s4.onrender.com/api/auth/registration/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((data)=> {
      toast.success('Account created successfully')
      router.push('/signin')
    });
    
  };

  return (
      <div className="max-w-[600px] w-full mx-auto mt-20 px-5">
      <Card>
        <CardHeader>
          <CardTitle className='text-center'>Register</CardTitle>
          <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="pb-5">
              <Label className="mb-4">Username:</Label>
              <Input  type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required 
                placeholder="Username" 
              />
          </div>
            <div className="pb-5">
              <Label className="mb-4">Email:</Label>
              <Input  type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="Email" 
              />
          </div>
            <div className="pb-5">
              <Label className="mb-4">Password:</Label>
              <Input  type="text"
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                required 
                placeholder="Password" 
              />
          </div>
            <div className="mb-4">
              <Label className="pb-4">Confirm Password:</Label>
              <Input  type="text"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required 
                placeholder="Confirm Password" 
              />
          </div>
          <Button type="submit">Register</Button>
          </form>
          </CardContent>
        </CardHeader>
        <CardFooter>
          <p className='mr-2'>Already have an account</p> 
          <Button asChild>
             <Link href="/signin">Login</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
      
  );
};

export default RegisterForm;
