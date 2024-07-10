"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface UserData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const UserProfile: React.FC = () => {

  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [authToken , setAuthToken] = useState<string>('')
  useEffect(() => {


   
  
        if(window !== undefined){
            setAuthToken(window.localStorage.getItem("authToken")??'')
        }
    

    const fetchUserData = async () => {
  
      if (!authToken) {
        setError('Authorization token not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://vaccination-management-c8s4.onrender.com/api/auth/user/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authToken) {
      toast.error('Authorization token not found');
      return;
    }

    try {
      const response = await axios.patch('http://127.0.0.1:8000/api/auth/user/', userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${authToken}`,
        },
      });
      toast.success('User data updated successfully');
      router.push('/'); 
    } catch (error) {
      toast.error('Error updating user data');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className="max-w-[600px] w-full mx-auto mt-20 px-5">
        <h3 className='py-3 mb-3 border-b border-gray-400 text-2xl font-semibold text-center'>Upadate Profile</h3>
      <Card>
          <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="pb-5">
              <Label className="mb-4">Username:</Label>
              <Input  
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                required
              />
          </div>
            <div className="pb-5">
              <Label className="mb-4">Email:</Label>
              <Input  type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required 
              />
          </div>
            <div className="pb-5">
              <Label className="mb-4">Password:</Label>
              <Input  
                id="first_name"
                name="first_name"
                type="text"
                value={userData.password1}
                onChange={handleChange}
              />
          </div>
            <div className="mb-4">
              <Label className="pb-4">Confirm Password:</Label>
              <Input  
                 id="last_name"
                 name="last_name"
                 type="text"
                 value={userData.password2}
                 onChange={handleChange}
              />
          </div>
          <Button type="submit">Update Profile</Button>
          </form>
          </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
