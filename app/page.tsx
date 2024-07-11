import CreateBooking from "@/components/BookingsForm";
import Campaigns from "@/components/campaign";
import Hero from "@/components/Hero";
import Vaccines from "@/components/Vaccines";

export default function Home() {
  return (
    <>
      <Hero />
      <Vaccines />
      <Campaigns />
      <CreateBooking  />
    </>
    
  );
}
