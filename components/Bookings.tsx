"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";

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
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userData, setUserData] = useState<UserData>({
    pk: 0,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://vaccination-management-c8s4.onrender.com/api/auth/user/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.get<Booking[]>(
          "https://vaccination-management-c8s4.onrender.com/api/bookings/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setBookings(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    fetchBookings();
  }, []);

  const bookingsData = bookings.filter(
    (item) => item.patient_username === userData.username
  );

  if (loading) return <p className="text-center text-green-800">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error fetching data: {error}</p>;

  return (
    <div className="max-w-[600px] w-full mx-auto mt-8 px-5">
      {bookingsData.length > 0 ? (
        <>
          <h3 className="py-3 mb-3 border-b border-gray-400 text-2xl font-semibold text-center">
            Booking List
          </h3>
          {bookingsData.map((item) => (
            <Card className="mb-4" key={item.id}>
              <div className="p-4 mb-4">
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
        </>
      ) : (
        <p className="text-center text-red-600">No Booking yet</p>
      )}
    </div>
  );
};

export default Bookings;
