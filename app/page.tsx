import CreateBooking from "@/components/BookingsForm";
import Campaigns from "@/components/campaign";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Campaigns />
      <CreateBooking  />
    </>
    
  );
}
