import { Instagram, Mail, PhoneCall } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "GulSkincare - Contact us",
  description:
    "Board-certified dermatology care for acne, aging, pigmentation, hair loss and more.",
};
const Contact = () => {
  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row md:px-40 md:py-20 py-10 px-8 gap-12 md:gap-0 justify-between items-center">
          <div className="md:w-[500] w-full">
            <p className="text-3xl font-bold text-center md:text-left">
              Contact us
            </p>
            <p className=" text-center md:text-left">
              Do you have a question or need help? Do you have a disability that
              you would like us to accommodate? Do you have a complaint or
              suggestion? Whatever it is we are here to help. Try our FAQ
              section first but if that does not answer your question please
              contact us.
            </p>
          </div>
          <div className="hidden md:block">
            <Image src="/contact.svg" alt="hero" width={500} height={500} />
          </div>
          <div className="md:hidden block">
            <Image src="/contact.svg" alt="hero" width={300} height={500} />
          </div>
        </div>
      </section>
      <section className="lg:py-20 py-10 px-4 lg:px-8">
        <div className="flex flex-wrap md:flex-row flex-col justify-center items-center lg:gap-y-0 md:gap-y-6 gap-y-4">
          <div className="flex md:basis-[300px] w-[300px] gap-2 md:justify-center justify-start lg:justify-start">
            <Mail size={50} color="indigo" className="hidden  md:block" />
            <Mail size={30} color="indigo" className="md:hidden" />
            <div className="">
              <p className="font-bold text-lg">Email Here</p>
            </div>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2  md:justify-center justify-start lg:justify-start">
            <PhoneCall size={50} color="teal" className="hidden  md:block" />
            <PhoneCall size={30} color="teal" className="md:hidden" />
            <span className="font-bold text-lg">Number here</span>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2  md:justify-center justify-start lg:justify-start">
            <Instagram size={50} color="orange" className="hidden  md:block" />
            <Instagram size={30} color="orange" className="  md:hidden" />
            <div className="">
              <p className="font-bold text-lg">Insta Handle here</p>
            </div>
          </div>
        </div>
        <div className=" m-auto max-w-[600] mt-8">
          <p>Opening Hours:</p>
          <ul className="list-disc list-inside">
            <li>Monday - Friday: 09:00 - 17:00</li>
            <li>Saturday: 09:00 - 13:00</li>
            <li>Sunday: Closed</li>
          </ul>
          <p className="font-bold">
            We are also closed on bank holidays and bank holiday weekends.
          </p>
          <p>Want to write to us? Get us at: Business Name. @ Address Here</p>
        </div>
      </section>
      <section className="md:py-20 py-10 px-4 md:px-40 bg-gray-50">
        <p className="text-3xl font-bold text-center md:text-left">
          Emergencies
        </p>
        <p className="mb-4 mt-2">
          skindoc. is not an online emergency service but we can offer medical
          advice if related to services you have obtained from us. This includes
          suspected drug allergies, worsening of your condition or feeling
          unwell since starting treatment, unexpected side effects etc.
        </p>
        <p className="mb-4 mt-2">
          Please contact us and we will arrange for a doctor to contact you as
          soon as possible.
        </p>
        <p className="mb-4 mt-2">
          If our contact centre is closed, and you urgently need medical advice
          but it's not a life-threatening situation, contact the NHS advice
          line, by calling 111.
        </p>
        <p className="mb-4 mt-2 font-bold">
          Call 999 in an emergency or life-threatening situation.
        </p>
        <p>
          You can also find a list of NHS urgent care services by visiting the
          NHS website.
        </p>
      </section>
    </>
  );
};

export default Contact;
