"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import Link from "next/link";

interface FormData {
  username: string;
  password: string;
}

const LoginForm = () => {

  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [response, setResponse] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("https://vaccination-management-c8s4.onrender.com/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((data) => data.json());

    if (res.key) {
      setResponse(res);
      window.localStorage.setItem("authToken", res.key);
      toast.success("Login successfully");
      router.push("/");
    } else {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="max-w-[600px] w-full mx-auto mt-20 px-5">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="pb-5">
              <Label className="pb-4">Username:</Label>
              <Input  type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required 
                placeholder="Username" 
              />
          </div>
            <div className="pb-5">
              <Label className="pb-4">Password:</Label>
              <Input  type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required 
                placeholder="Password" 
              />
          </div>
          <Button type="submit">Login</Button>
          </form>
          </CardContent>
        </CardHeader>
        <CardFooter>
          <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
