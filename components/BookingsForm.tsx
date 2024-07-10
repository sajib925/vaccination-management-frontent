"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';

interface BookingData {
  campaign: number;
  vaccine: number;
  campaign_name: string;
  vaccine_name: string;
  nid: string;
  age: string;
  first_dose_date: string;
  medical_info: string;
}

interface Campaign {
  id: number;
  name: string;
  description: string;
}

interface Vaccine {
  id: number;
  name: string;
}

const postBookingData = async (data: BookingData) => {
  try {
    const token = window.localStorage && window.localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authorization token not found');
    }
    const response = await axios.post('https://vaccination-management-c8s4.onrender.com/api/bookings/', {
      campaign: data.campaign,
      vaccine: data.vaccine,
      nid: data.nid,
      age: data.age,
      first_dose_date: data.first_dose_date,
      medical_info: data.medical_info,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting booking data:', error);
    throw error;
  }
};

const CreateBooking: React.FC = () => {
  const [formData, setFormData] = useState<BookingData>({
    campaign: 0,
    vaccine: 0,
    campaign_name: '',
    vaccine_name: '',
    nid: '',
    age: '',
    first_dose_date: '',
    medical_info: '',
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = window.localStorage && window.localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authorization token not found');
        }

        const res = await axios.get<Campaign[]>('https://vaccination-management-c8s4.onrender.com/api/campaign/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCampaigns(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchVaccines = async () => {
      try {
        const token = window.localStorage && window.localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authorization token not found');
        }

        const res = await axios.get<Vaccine[]>('https://vaccination-management-c8s4.onrender.com/api/campaign/vaccines/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setVaccines(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
    fetchVaccines();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCampaign = campaigns.find(campaign => campaign.name === formData.campaign_name);
      const selectedVaccine = vaccines.find(vaccine => vaccine.name === formData.vaccine_name);

      if (selectedCampaign && selectedVaccine) {
        const response = await postBookingData({
          ...formData,
          campaign: selectedCampaign.id,
          vaccine: selectedVaccine.id,
        });
        toast.success('Booking created successfully');
        router.push('/');
      } else {
        toast.error('Please select valid campaign and vaccine');
      }
    } catch (error) {
      toast.error('Error creating booking');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='max-w-[1200px] w-full mx-auto my-[80px] px-5' id="bookings">
      <h2 className="text-3xl font-bold my-6 text-center">Booking your campaign</h2>
      <Card>
        <CardHeader>
          <CardTitle>Booking</CardTitle>
        </CardHeader>
            <form onSubmit={handleSubmit} className='p-4'>
              <div className="pb-5">
                <Label className="pb-4">Campaign Name:</Label>
                <select
                  name="campaign_name"
                  value={formData.campaign_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-400"
                >
                  <option value="">Select a Campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.name}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-5">
                <Label className="pb-4">Vaccine Name:</Label>
                <select
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-400"
                >
                  <option value="">Select a Vaccine</option>
                  {vaccines.map((vaccine) => (
                    <option key={vaccine.id} value={vaccine.name}>
                      {vaccine.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-5">
                <Label className="pb-4">NID:</Label>
                <Input
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleChange}
                  required
                  placeholder="NID"
                />
              </div>
              <div className="pb-5">
                <Label className="pb-4">Age:</Label>
                <Input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="Age"
                />
              </div>
              <div className="pb-5">
                <Label className="pb-4">First Dose Date:</Label>
                <Input
                  type="date"
                  name="first_dose_date"
                  value={formData.first_dose_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pb-5">
                <Label className="pb-4">Medical Info:</Label>
                <Textarea
                  name="medical_info"
                  value={formData.medical_info}
                  onChange={handleChange}
                  required
                  placeholder="Medical Info"
                />
              </div>
              <Button type="submit">Booking</Button>
            </form>
        
      </Card>
    </div>
  );
};

export default CreateBooking;


