import React from "react";
import CreateTeamForm from "../_components/CreateTeamForm";

const CreateTeamPage = () => {
  return (
    <div className="center flex w-full">
      <div className="container-bg w-full max-w-3xl rounded-2xl border p-6 lg:p-10">
        <h2 className="primary-heading mb-6 text-center font-[cal_sans] text-3xl font-black tracking-wide">
          Create Your Team
        </h2>
        <CreateTeamForm />
      </div>
    </div>
  );
};

export default CreateTeamPage;
