"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";



export default function ConditionalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathName = usePathname();
    const isSignInOrSignUp = pathName === "/signin" || pathName === "/signup";
    
    return (
        <>
            {!isSignInOrSignUp && <Navbar />}
                {children}
            {!isSignInOrSignUp && <Footer />}
        </>
      
    );
}