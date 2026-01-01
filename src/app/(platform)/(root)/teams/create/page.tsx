import React from "react";
import TeamForm from "../_components/TeamForm";

const CreateTeamPage = () => {
  return (
    <div className="center flex w-full">
      <div className="container-bg w-full rounded-2xl border p-6 lg:p-10">
        <h2 className="primary-heading mb-6 text-center font-[cal_sans] text-3xl font-black tracking-wide">
          Create Your Team
        </h2>
        <TeamForm />
      </div>
    </div>
  );
};

export default CreateTeamPage;
