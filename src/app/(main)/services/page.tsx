import { fetchServices } from "@/actions/services";
import { ArrowBigRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const Services = async () => {
  const services = await fetchServices();
  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col md:flex-row md:px-40 md:py-20 py-10 px-8 gap-12 md:gap-0 justify-between items-center">
          <div className="md:w-[500] w-full">
            <p className="text-3xl font-bold text-center md:text-left">
              What we treat
            </p>
            <p className=" text-center md:text-left">
              Our consultant dermatologist are experts in diagnosing and
              treating skin, hair, nail, lip, and mouth conditions.
            </p>
          </div>
          <div className="hidden md:block">
            <Image src="/services.svg" alt="hero" width={500} height={500} />
          </div>
          <div className="md:hidden block">
            <Image src="/services.svg" alt="hero" width={300} height={500} />
          </div>
        </div>
      </section>
      <section className="md:py-20 py-10 px-4 md:px-8">
        <p className="text-center md:text-4xl text-3xl font-bold underline mb-2">
          Skin conditions
        </p>
        <p className="text-center text-md md:w-[600px] w-auto m-auto">
          Our Dermatologists take your skin conditions seriously and know the
          impact it can have on your quality of life. We treat more than 2000
          conditions but you can read more about the some of the more common
          skin conditions in the links below.
        </p>
        <div className="flex justify-center flex-wrap md:w-[800px] w-auto m-auto">
          {services.map((service, index) => (
            <div
              key={`${service.title}-${index}`}
              className="md:basis-1/2 basis-full mt-8"
            >
              <p className="font-bold mb-2">{service.title}</p>
              {service.sub_categories.map((single, sIndex) => (
                <p
                  key={`${single}-${sIndex}`}
                  className="flex items-center gap-x-3"
                >
                  <ArrowBigRight />
                  <span>{single}</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Services;
