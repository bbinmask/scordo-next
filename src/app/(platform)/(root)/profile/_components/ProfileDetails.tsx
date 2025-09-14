import User from "@/types/user.props";
import { CalendarIcon, LanguagesIcon, LocationEditIcon, MailIcon, UserIcon } from "lucide-react";
import { CgGenderMale } from "react-icons/cg";

const InfoCard = ({ label, value, icon }) => (
  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-5">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
    <div className="rounded-lg bg-gray-200 p-2">{icon}</div>
  </div>
);

const ProfileDetails = ({ profile }: { profile: User }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="flex flex-col gap-12 md:flex-row">
        <section className="w-full md:w-3/4">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-2 text-3xl font-bold">Personal information</h2>
            <p className="mb-10 text-gray-500">
              Manage your personal information, including phone numers and email adress where you
              can be contacted
            </p>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <InfoCard label="Name" value={profile.name} icon={<UserIcon />} />
              <InfoCard label="Date of Birth" value="07 July 1993" icon={<CalendarIcon />} />
              <InfoCard
                value={profile.address?.city + " " + profile.address?.country}
                label="Location"
                icon={<LocationEditIcon />}
              />
              <InfoCard label="Gender" value={profile.gender} icon={<CgGenderMale />} />
              <InfoCard label="Contactable at" value="ikakodesign@gmail.com" icon={<MailIcon />} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileDetails;
