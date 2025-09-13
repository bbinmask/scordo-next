import User from "@/types/user.props";

const ProfileDetails = ({ profile }: { profile: User }) => {
  return (
    <div className="space-y-6">
      <h3 className="heading-text mb-6 text-center text-3xl font-extrabold">
        {profile.username || "username"}
      </h3>
      <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
        <h6 className="text-lg font-medium md:col-span-1">Full Name</h6>
        <div className="heading-text text-lg md:col-span-3">{profile.name || "Full Name"}</div>
      </div>
      <hr className="border-gray-200" />
      <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
        <h6 className="text-lg font-medium md:col-span-1">Email</h6>
        <div className="heading-text text-lg md:col-span-3">
          {profile.email || "abcd@your-email.com"}
        </div>
      </div>
      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
        <h6 className="text-lg font-medium md:col-span-1">Phone</h6>
        <div
          className={`${profile?.contact ? "heading-text" : "subheading-text"} text-lg md:col-span-3`}
        >
          {profile.contact || "No phone number"}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
