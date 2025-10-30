import BookNow from "@/components/BookNow";
import UserSignin from "@/components/UserSignin";
import { getUserFromToken } from "@/lib/clientAuth";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import React from "react";
export const metadata: Metadata = {
  title: "GulSkincare - About us",
  description:
    "Board-certified dermatology care for acne, aging, pigmentation, hair loss and more.",
};
const About = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const user = getUserFromToken(session);
  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row md:px-40 md:py-20 py-10 px-8 gap-12 md:gap-0 justify-between items-center">
          <div className="md:w-[500] w-full">
            <p className="text-3xl font-bold text-center md:text-left">
              We believe the health of your skin shouldn't have to wait
            </p>
            <div className="mt-4 flex gap-4 items-center justify-center md:justify-start">
              {user ? (
                <BookNow />
              ) : (
                <UserSignin icon={false} button_text="Book Now" />
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <Image src="/team.svg" alt="hero" width={500} height={500} />
          </div>
          <div className="md:hidden block">
            <Image src="/team.svg" alt="hero" width={300} height={500} />
          </div>
        </div>
      </section>
      <section className="md:py-20 py-10 px-4 md:px-40">
        <p className="text-3xl font-bold text-center md:text-left">
          Our Purpose
        </p>
        <p>
          skindoc’s purpose is to bring rapid, convenient, and quality skin care
          to every home in the nation.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>
            As a small business we can afford to bring you a much more
            personalised experience.
          </li>
          <li>
            We care about our environment and your health. We harness the latest
            in online hybrid technology to bring healthcare to you, in a place
            that is familiar and comfortable without the need to travel.
          </li>
          <li>
            We bring you the best, by the best – top quality UK Dermatologists
            that know the optimum ways to get you the care you want.
          </li>
        </ul>
      </section>
      <section className="md:py-20 py-10 px-4 md:px-40 bg-gray-50">
        <p className="text-3xl font-bold text-center md:text-left">
          The Environment
        </p>
        <p className="mb-4 mt-2">
          We care about the World you live in. Online services have been shown
          to reduce the healthcare industries carbon footprint by as much as 70
          times plus being a primarily digital business that means virtually
          zero paper and plastic pollution. Furthermore, removing the need to
          travel and attend hospitals also reduces transport-related greenhouse
          gas emission for both you and us. Win-win.
        </p>
        <p>
          We however wanted to go one step further. That’s why we have pledged
          our commitment to the environment by working with the climate crisis
          enterprise ecologi. We maintain a constant proportion of our revenue
          stream is donated to ecologi every month to ensure hundreds of new
          trees are planted every single year and dozens of climate projects are
          remain supported.
        </p>
      </section>
    </>
  );
};

export default About;
