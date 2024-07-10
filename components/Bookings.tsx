"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';

interface Booking {
  id: number;
  campaign: number;
  campaign_name: string;
  created_at: string;
  updated_at: string;
  first_dose_date: string;
  second_dose_date: string;
  vaccine: number;
  vaccine_name: string;
  nid: string;
  age: string;
  medical_info: string;
  patient_username: string;
}
interface UserData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  const [authToken , setAuthauthToken] = useState<string>('')

  useEffect(() => {
        if(window !== undefined){
            setAuthauthToken(window.localStorage.getItem("authauthToken")??'')
        }
  

    const fetchUserData = async () => {
      if (!authToken) {
        setError('Authorization authToken not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://vaccination-management-c8s4.onrender.com/api/auth/user/', {
          headers: {
            Authorization: `authToken ${authToken}`,
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
    const fetchBookings = async () => {
      try {
        const res = await axios.get<Booking[]>('https://vaccination-management-c8s4.onrender.com/api/bookings/', 
          {
            headers: {
              Authorization: `authToken ${authToken}`,
            },
          }
        );
        setBookings(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [authToken]);

  const bookingsData = bookings.filter((item) => item.patient_username === userData.username)

  console.log(bookingsData);
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  return (
    <div className="max-w-[600px] w-full mx-auto mt-8 px-5">
      <h3 className='py-3 mb-3 border-b border-gray-400 text-2xl font-semibold text-center'>Booking List</h3>
        {bookingsData.map((item) => (
          <Card className="mb-4" key={item.id}>
            <div  className="p-4 mb-4">
              <h3>
                <b>User:</b> {item.patient_username}
              </h3>
              <p>
                <b>Campaign:</b> {item.campaign_name}
              </p>
              <p>
                <b>Age:</b> {item.age}
              </p>
              <p>
                <b>Vaccine Name:</b> {item.vaccine_name}
              </p>
              <p>
                <b>NID:</b> {item.nid}
              </p>
              <p>
                <b>Medical Info:</b> {item.medical_info}
              </p>
              <p>
                <b>First Dose Date:</b> {item.first_dose_date}
              </p>
              <p>
                <b>Second Dose Date:</b> {item.second_dose_date}
              </p>
              </div>
        </Card>
        ))}
    </div>
  );
};

export default Bookings;
