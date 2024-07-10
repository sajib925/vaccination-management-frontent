"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface Review {
  id: number;
  patient_username: string;
  campaign_name: string;
  comment: string;
}

interface VaccineData {
  name: string;
}

const postReviewData = async (data: ReviewData) => {
  try {
    const token = window.localStorage && window.localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authorization token not found");
    }
    const response = await axios.post(
      "https://vaccination-management-c8s4.onrender.com/api/review/",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting review data:", error);
    throw error;
  }
};

const postVaccineData = async (data: VaccineData) => {
  try {
    const token = window.localStorage && window.localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authorization token not found");
    }
    const response = await axios.post(
      "https://vaccination-management-c8s4.onrender.com/api/campaign/vaccines/",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting vaccine data:", error);
    throw error;
  }
};

interface Campaign {
  id: number;
  name: string;
  description: string;
}

interface ReviewData {
  campaign: number;
  campaign_name: string;
  comment: string;
}

interface Vaccines {
  id: number;
  name: string;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [vaccines, setVaccines] = useState<Vaccines[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReviewData>({
    campaign: 0,
    campaign_name: "",
    comment: "",
  });
  const [formVaccine, setFormVaccine] = useState<VaccineData>({
    name: "",
  });

  useEffect(() => {
    const token = window.localStorage && window.localStorage.getItem("authToken");
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get<Campaign[]>(
          "https://vaccination-management-c8s4.onrender.com/api/campaign/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setCampaigns(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await axios.get<Review[]>(
          "https://vaccination-management-c8s4.onrender.com/api/review/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setReviews(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
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

        const res = await axios.get<Vaccines[]>('https://vaccination-management-c8s4.onrender.com/api/campaign/vaccines/', {
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

    fetchVaccines();
    fetchCampaigns();
    fetchReviews();
  }, []);

  // for vaccine

  const handleChangeVaccine = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormVaccine({ ...formVaccine, [name]: value });
  };

  const handleSubmitVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await postVaccineData(formVaccine);
      toast.success("Vaccine created successfully");
    } catch (error) {
      toast.error("you are not a doctor!, so can't create");
    }
  };

  // for review 
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCampaign = campaigns.find(campaign => campaign.name === formData.campaign_name);
      if (selectedCampaign) {
        const reviewData = { ...formData, campaign: selectedCampaign.id };
        const response = await postReviewData(reviewData);
        toast.success("Review created successfully");
      } else {
        throw new Error("Selected campaign not found");
      }
    } catch (error) {
      toast.error("Error creating review");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  return (
    <div id="campaign" className="max-w-[1200px] w-full mx-auto my-[80px] px-5">
      <div className="flex items-center justify-between pb-4 border-b my-6">
        <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0 text-center">
          All Campaigns
        </h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Add Vaccine</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleSubmitVaccine}>
              <div className="pb-5">
                <Label className="pb-4">Add Vaccine:</Label>
                <Input
                  name="name"
                  value={formVaccine.name}
                  onChange={handleChangeVaccine}
                  required
                  placeholder="Vaccine"
                />
              </div>
              <Button type="submit">Add</Button>
            </form>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="flex items-center gap-4">
        {campaigns.map((item) => (
          <div key={item.id} className="lg:w-[50%] w-full">
            <Card>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              
              <CardFooter className="items-start">
                {/* vaccines */}
              <p className="pr-2">
                <b>Vaccines:</b> 
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {
                  vaccines.map((item) => (
                    
                    <h4 key= {item.id}>{item.name},</h4>
                  ))
                }
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pb-4 border-b my-6">
        <h2 className="text-3xl font-bold ">All Reviews</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Review</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form onSubmit={handleSubmit}>
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
                <Label className="pb-4">Review:</Label>
                <Textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  placeholder="Review"
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        {reviews.map((item) => (
          <div key={item.id} className="p-4 mb-4">
            <h3>
              <b>User:</b> {item.patient_username}
            </h3>
            <p>
              <b>Campaign:</b> {item.campaign_name}
            </p>
            <p>
              <b>Comment:</b> {item.comment}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Campaigns;


