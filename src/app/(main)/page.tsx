import BookNow from "@/components/BookNow";
import UserSignin from "@/components/UserSignin";
import { getUserFromToken } from "@/lib/clientAuth";
import { MessageCircleMore, StickyNote, UserCircle } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const treatments = [
  {
    name: "Acne & spots",
    description:
      "Expert management of acne, rosacea, infected hair follicles, cysts, and painful sores or boils",
    image: "/services/acne.webp",
  },
  {
    name: "Skin rashes",
    description:
      "Targeted treatment for eczema, psoriasis, skin allergies, hives, blisters, and acute infections.",
    image: "/services/rashes.webp",
  },
  {
    name: "Skin changes",
    description: "Diagnostic assessment for shifts in pigmentation (color loss or darkening), localized swelling, and skin thickening",
    image: "/services/changes.webp",
  },
  {
    name: "Nail problems",
    description: "Medical assessment of nail infections, discoloration, and unexplained changes in texture or growth.",
    image: "/services/nails.webp",
  },
  {
    name: "Moles & Growths",
    description: "Evaluation and safe management of moles, unexplained lumps, bumps, and various skin lesions",
    image: "/services/moles.webp",
  },
  {
    name: "Hair disorders",
    description: "Comprehensive care for hair loss, thinning, excessive growth, and structural changes to your hair",
    image: "/services/hair.webp",
  },
  {
    name: "Mouth & Lips",
    description: "Evaluation of lesions, new lumps, or structural changes affecting your lips, inside cheeks, or gums.",
    image: "/services/lips.webp",
  },
  {
    name: "Atypical Symptoms (No Rash)",
    description: "Advanced care for persistent itching, altered skin sensations, and excessive sweating.",
    image: "/services/body.webp",
  },
  {
    name: "Undiagnosed Concerns",
    description:
      "Specialized diagnostic consultations for unique or unexplained skin problems when you feel something is wrong but aren't sure what it is.",
    image: "/services/idk.webp",
  },
];

export const metadata: Metadata = {
  title: "GulSkincare - Home",
  description:
    "Board-certified dermatology care for acne, aging, pigmentation, hair loss and more.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const user = getUserFromToken(session);

  return (
    <>
      <section id="hero-section" className="">
        <div className=" py-4 bg-emerald-100">
          <p className="text-center font-sora md:text-lg text-xs">
            If you need help, you can call us on +92 346 4280801.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:px-40 md:py-20 py-10 px-8 gap-12 md:gap-0 justify-between items-center">
          <div className="md:w-[500] w-full">
            <p className="text-3xl font-bold text-center md:text-left">
              Healthy skin, confident you
            </p>
            <p className=" text-center md:text-left">
              Board-certified dermatology care for acne, aging, pigmentation,
              hair loss and more.
            </p>
            <div className="mt-4 flex gap-4 items-center justify-center md:justify-start">
              {user ? (
                <BookNow />
              ) : (
                <UserSignin icon={false} button_text="Book Now" />
              )}
              <Link href="/services" className="hover:underline font-bold">
                <span>Explore Services</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block rounded-full overflow-hidden">
            <Image src="/owner.png" alt="hero" width={500} height={500} />
          </div>
          <div className="md:hidden block">
            <Image src="/owner.png" alt="hero" width={300} height={500} />
          </div>
        </div>
      </section>
      <section className="md:py-20 py-10 px-4 md:px-8 bg-gray-50">
        <p className="text-center md:text-4xl text-3xl font-bold underline mb-2">
          What we treat
        </p>
        <p className="text-center text-md">
          Our consultant dermatologist are experts in diagnosing and treating
          skin, hair, nail, lip, and mouth conditions.
        </p>
        <div className="flex md:flex-row flex-col flex-wrap gap-y-12 mt-8 lg:px-40 w-full justify-center">
          {treatments.map((treatment, index) => (
            <div
              className="flex gap-3 lg:basis-1/3 md:basis-1/2 basis-full items-center"
              key={`${treatment.name}-${index}`}
            >
              <Image src={treatment.image} alt="acne" width={80} height={400} />
              <div className="">
                <p className="font-bold">{treatment.name}</p>
                <p>{treatment.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex flex-col md:flex-row md:px-40 md:py-20 py-10 px-8 gap-12 md:gap-0 justify-between items-center">
          <div className="md:w-[500] w-full">
            <p className="text-3xl font-bold text-center md:text-left">
              Meet our team
            </p>
            <p className=" text-center md:text-left">
              Our team of Pakistani Dermatology Consultants is dedicated to providing
              high-quality, patient-centred care. With years of clinical
              experience, our professionals are equipped to assess a broad range
              of skin concerns and help you feel more confident in your skin.
            </p>
            <div className="mt-4 flex gap-4 items-center justify-center md:justify-start">
              <Link
                href=""
                className="hover:underline font-bold underline text-green-800"
              >
                <span>Read More about the team</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <Image src="/doctors.svg" alt="hero" width={500} height={500} />
          </div>
          <div className="md:hidden block">
            <Image src="/doctors.svg" alt="hero" width={300} height={500} />
          </div>
        </div>
      </section>
      <section className="lg:py-20 py-10 px-4 lg:px-8 bg-gray-50">
        <div className="flex flex-wrap md:flex-row flex-col justify-center items-center lg:gap-y-0 md:gap-y-6 gap-y-4">
          <div className="flex md:basis-[300px] w-[300px] gap-2 justify-center lg:justify-start">
            <MessageCircleMore size={50} color="indigo" />
            <div className="">
              <p className="font-bold text-lg">
                Online Dermatology consultation
              </p>
            </div>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2 justify-center lg:justify-start">
            <UserCircle size={50} color="teal" />
            <span className="font-bold text-lg">
              Get diagnosed by a specialist
            </span>
          </div>
          <div className="flex md:basis-[300px]  w-[300px] gap-2 justify-center lg:justify-start">
            <StickyNote size={50} color="orange" />
            <div className="">
              <p className="font-bold text-lg">
                Treatment delivered anywhere in Pakistan
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
