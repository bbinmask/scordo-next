"use client";

import { teams } from "@/constants";

import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { EnumFormSelect, FormSelect } from "../../_components/FormSelect";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormInputProps {
  teamAId: string;
  teamBId: string;
  tournamentId: string;
  venue: {
    city: string;
    state: string;
    country: string;
  };
  location: string;
  tossWinner: string;
  tossDecision: string;
  category: string;
  date: string;
}

const CreateMatchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormInputProps>({});

  const [formData, setFormData] = useState({
    teamAId: "",
    teamBId: "",
    tournamentId: "",
    venue: { city: "", state: "", country: "India" },
    location: "",
    tossWinner: "",
    tossDecision: "",
    category: "T20",
    date: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVenueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, venue: { ...prev.venue, [name]: value } }));
  };

  const [tossWinner, teamAId, teamBId] = watch(["tossWinner", "teamAId", "teamBId"]);

  const onSubmit: SubmitHandler<FormInputProps> = (data) => {
    console.log(data);

    if (formData.teamAId === formData.teamBId && formData.teamAId !== "") {
      alert("Team A and Team B cannot be the same.");
      return;
    }
    console.log("Match Data Submitted:", { ...formData, status: "not_started" });
    alert("Match creation data logged to console. See the console (F12) for details.");
  };

  const selectedTeamA = teams.find((t) => t.id === formData.teamAId);
  const selectedTeamB = teams.find((t) => t.id === formData.teamBId);

  return (
    <div className="container-bg w-full rounded-xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Team and Tournament Selection */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect<FormInputProps>
            rules={{ required: "Team B is required" }}
            data={teams.filter((t) => t.id !== formData.teamAId)}
            register={register}
            label="Team A"
            name="teamAId"
          />

          <FormSelect<FormInputProps>
            rules={{ required: "Team B is required" }}
            data={teams.filter((t) => t.id !== formData.teamAId)}
            register={register}
            label="Team B"
            name="teamBId"
          ></FormSelect>
        </div>
        <FormSelect<FormInputProps>
          data={[]}
          rules={{ required: false }}
          register={register}
          label="Tournament (Optional)"
          name="tournamentId"
        />

        {/* Venue Details */}

        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="e.g., M. Chinnaswamy Stadium"
          required
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            id="city"
            name="city"
            value={formData.venue.city}
            onChange={handleVenueChange}
            placeholder="e.g., Bengaluru"
            required
          />
          <Input
            id="state"
            name="state"
            value={formData.venue.state}
            onChange={handleVenueChange}
            placeholder="e.g., Karnataka"
            required
          />
          <Input
            id="country"
            name="country"
            value={formData.venue.country}
            onChange={handleVenueChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect<FormInputProps>
            rules={{ required: false }}
            data={[
              {
                name: selectedTeamA?.name || "Select Team A",
                value: selectedTeamA?.id || "",
                id: teamAId,
              },
              {
                name: selectedTeamB?.name || "Select Team B",
                value: selectedTeamB?.id || "",
                id: teamBId,
              },
            ]}
            register={register}
            label="Toss Winner"
            name="tossWinner"
          />
          {tossWinner && (
            <EnumFormSelect<FormInputProps>
              data={[{ label: "Toss Decision", value: "tossDecision" }]}
              rules={{ required: true }}
              register={register}
              label="Toss Decision"
              name="tossDecision"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <EnumFormSelect<FormInputProps>
            data={[
              { label: "T10", value: "T10" },
              { label: "T20", value: "T20" },
              { label: "ODI", value: "ODI" },
              { label: "Test", value: "Test" },
              { label: "Others", value: "others" },
            ]}
            rules={{ required: "Category is required" }}
            register={register}
            label="Match Category"
            name="category"
          />

          <Input
            id="date"
            name="date"
            type="datetime-local"
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="transform rounded-lg bg-green-600 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700"
          >
            Create Match
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateMatchForm;
