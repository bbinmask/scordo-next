import { user } from "@/constants";
import { Verified } from "lucide-react";
import React from "react";
import PersonalDetails from "./_components/PersonalDetails";
const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const profile = user;

  return (
    <div className="container-bg border-input relative mb-6 grid w-full gap-6 rounded-xl border px-3 md:grid-cols-3">
      {/* Profile Picture */}
      <div className="h-full p-6 transition-all duration-300 md:col-span-1">
        <div className="mb-6">
          <h3 className="font-[cal_sans] text-2xl">Profile Information</h3>
        </div>
        <div className="relative flex flex-col items-center text-center">
          {/* {isEditProfile && (
            <div className="absolute top-20 z-50 flex w-full items-center justify-center">
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e?.target?.files && e.target.files[0]) {
                    setAvatar(e.target.files[0]);
                  }
                }}
                className="absolute h-32 w-[6.2rem] cursor-pointer opacity-0"
                type="file"
                name="image"
                accept="image/*"
              />
              <BiSolidCamera className="h-6 w-6" />

              <div className="absolute right-0 flex gap-2">
                <Button
                  variant="default"
                  className="font-urbanist w-14 cursor-pointer border-none bg-blue-500 text-xs hover:bg-blue-500/90 active:bg-blue-500/80"
                  onClick={() => {
                    setIsEditProfile(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="font-urbanist w-14 cursor-pointer text-xs"
                  onClick={() => {
                    setIsEditProfile(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )} */}
          <img
            src={"https://bootdey.com/img/Content/avatar/avatar7.png"}
            // onClick={() => {
            //   // if (!isOwner) return;
            //   setIsEditProfile(true);
            // }}
            alt="profile"
            className={`border-input borderh-36 w-36 rounded-full object-cover`}
          />
          <div className="relative mt-4 text-center">
            {profile.isVerified && (
              <span className="absolute top-0 -right-5 rounded-full bg-green-700 text-white">
                <Verified className="h-4 w-4" />
              </span>
            )}
            <p className="font-[poppins] text-base font-medium">{`@${profile.username}`}</p>
            <div className="my-3 flex justify-center gap-6 text-base">
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800 shadow-sm">
                Friends: {profile?.friends?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 h-full p-6 transition-all duration-300 md:col-span-2">
        <div>
          <PersonalDetails profile={profile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
