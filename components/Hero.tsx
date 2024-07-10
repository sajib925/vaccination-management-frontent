"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import img from "@/images/hero.png";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {};

function Hero({}: Props) {
    const [authToken , setAuthToken] = useState<string>('')
    useEffect(() => {
        if(window !== undefined){
            setAuthToken(window.localStorage.getItem("authToken")??'')
        }
    },[])
  
  return (
    <div className="max-w-[1200px] w-full mx-auto px-5">
      <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-[50%]">
          <Image
            src={img}
            alt="banner image"
            width={700}
            height={400}
            className="w-full"
          />
        </div>
        <div className="w-full lg:w-[50%]">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to vaccination management
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
          </p>
          {!authToken && (
            <div className="flex items-center gap-x-3 mt-4">
              <Button asChild>
                <Link href="/signin">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
