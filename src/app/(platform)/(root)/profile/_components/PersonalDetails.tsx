import { User } from "@/generated/prisma";
import { capitalize } from "lodash";
import { CalendarIcon, MailIcon, UserIcon } from "lucide-react";
import { CgGenderFemale, CgGenderMale } from "react-icons/cg";
import { MdLocationPin, MdOutlineEventAvailable } from "react-icons/md";

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoCard = ({ label, value, icon }: InfoCardProps) => (
  <div className="border-input container-bg flex items-center justify-between rounded-xl border p-5 font-[poppins]">
    <div>
      <p className="text-[13px] text-gray-600 dark:text-gray-300">{label}</p>
      <p className="text-foreground text-sm font-semibold">{value}</p>
    </div>
    <div className="bg-input rounded-lg p-2">{icon}</div>
  </div>
);

const PersonalDetails = ({ profile }: { profile: User }) => {
  return (
    <div className="flex flex-col gap-12 md:flex-row">
      <section className="w-full">
        <div className="">
          <h2 className="mb-2 font-[cal_sans] text-3xl">Personal information</h2>
          <p className="mb-10 font-[urbanist] text-sm text-gray-500">
            Manage your personal information, including phone numers and email adress where you can
            be contacted
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InfoCard label="Name" value={profile.name} icon={<UserIcon />} />
            <InfoCard
              label="Date of Birth"
              value={new Date(profile.dob).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              icon={<CalendarIcon />}
            />
            <InfoCard
              value={profile.address?.city + " " + profile.address?.country}
              label="Location"
              icon={<MdLocationPin />}
            />
            <InfoCard
              label="Gender"
              value={capitalize(profile.gender as string)}
              icon={
                profile.gender && profile.gender.toLowerCase() === "male" ? (
                  <CgGenderMale />
                ) : (
                  <CgGenderFemale />
                )
              }
            />
            <InfoCard label="Email" value={profile.email} icon={<MailIcon />} />
            <InfoCard
              label="Availability"
              value={profile.availability ? "Available" : "Not Available"}
              icon={<MdOutlineEventAvailable />}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalDetails;
