import { Facebook, Instagram, Mail, PhoneCall } from "lucide-react";
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
        <div className="flex flex-wrap md:flex-row flex-col justify-center items-center gap-x-4 lg:gap-y-0 md:gap-y-6 gap-y-4">
          <div className="flex md:basis-[300px] w-[300px] gap-2 md:justify-center justify-start lg:justify-start items-center">
            <a href="https://www.tiktok.com/@03349240257_03464280801?_r=1&_t=ZS-97CM1SmKq4j" target="_blank" className="hidden md:block">
              <Image src="/tikton.png" alt="instagram" width={40} height={30} />
            </a>
            <a href="https://www.tiktok.com/@03349240257_03464280801?_r=1&_t=ZS-97CM1SmKq4j" target="_blank" className="block md:hidden">
              <Image src="/tikton.png" alt="instagram" width={40} height={30} />
            </a>
            <a className="" href="https://www.tiktok.com/@03349240257_03464280801?_r=1&_t=ZS-97CM1SmKq4j" target="_blank">
              <p className="font-bold text-lg">Dr. Mian Shahid Gul</p>
            </a>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2  md:justify-center justify-start lg:justify-start items-center">
            <PhoneCall size={40} color="teal" className="hidden  md:block" />
            <PhoneCall size={30} color="teal" className="md:hidden" />
            <span className="font-bold text-lg">+92 334 9240257</span>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2  md:justify-center justify-start lg:justify-start items-center">
            <Facebook size={40} color="teal" className="hidden  md:block" />
            <Facebook size={30} color="teal" className="md:hidden" />
            <a href="https://www.facebook.com/share/18yD92AbEP/?mibextid=wwXIfr" target="_blank" className="font-bold text-lg">Dr. Mian Shahid Gul</a>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2  md:justify-center justify-start lg:justify-start items-center">
            <Mail size={50} color="indigo" className="hidden  md:block" />
            <Mail size={30} color="indigo" className="md:hidden" />
            <div className="">
              <p className="font-bold text-lg">mianshahidgul@gmail.com</p>
            </div>
          </div>
        </div>
        <div className=" m-auto max-w-[600] mt-8">
          <p>Opening Hours:</p>
          <ul className="list-disc list-inside">
            <li>Monday - Friday: 09:00 - 17:00</li>
            <li>Saturday & Sunday: 09:00 - 13:00</li>
          </ul>
          <p className="font-bold">
            We are also closed on bank holidays and bank holiday weekends.
          </p>
          <p>Want to write to us? Get us at: GulSkincare. @ Gul Plaza Dagari Malakand Kpk Pakistan</p>
        </div>
      </section>
      <section className="md:py-20 py-10 px-4 md:px-40 bg-gray-50">
        <p className="text-3xl font-bold text-center md:text-left">
          Emergencies
        </p>
        <p className="mb-4 mt-2">
        gulskincare. is not an online emergency medical service, but we can offer medical guidance if it is directly related to the treatments or services you have obtained from us. This includes suspected drug allergies, a worsening of your skin condition, feeling unwell since starting your treatment, or experiencing unexpected side effects.
        </p>
        <p className="mb-4 mt-2">
        Please contact us immediately, and we will arrange for a doctor to get in touch with you as soon as possible.
        </p>
        <p className="mb-4 mt-2">
        Non-Life-Threatening Urgencies: If our contact center is closed and you urgently need medical advice for a non-life-threatening situation, please visit your nearest hospital's outpatient department (OPD), contact your local family physician, or call a reputable local health helpline.
        </p>
        <p className="mb-4 mt-2 font-bold">
          Call 1122 in an emergency or life-threatening situation.
        </p>
        <p>
        Life-Threatening Emergencies: In case of a severe medical emergency or a life-threatening situation, please immediately call 1122 (Rescue 1122) or 15, or proceed directly to the emergency room (ER) of your nearest major hospital.
        </p>
      </section>
    </>
  );
};

export default Contact;
