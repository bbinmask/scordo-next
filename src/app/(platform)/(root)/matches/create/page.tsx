"use client";

import { teams } from "@/constants";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import FormSelect from "../../_components/FormSelect";

const CreateMatchForm = () => {
  const [theme, setTheme] = useState("dark");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVenueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, venue: { ...prev.venue, [name]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.teamAId === formData.teamBId && formData.teamAId !== "") {
      alert("Team A and Team B cannot be the same.");
      return;
    }
    console.log("Match Data Submitted:", { ...formData, status: "not_started" });
    alert("Match creation data logged to console. See the console (F12) for details.");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const selectedTeamA = teams.find((t) => t.id === formData.teamAId);
  const selectedTeamB = teams.find((t) => t.id === formData.teamBId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team and Tournament Selection */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormSelect
          label="Team A"
          id="teamAId"
          name="teamAId"
          value={formData.teamAId}
          onChange={handleInputChange}
          required
        >
          <option value="">FormSelect Team A</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </FormSelect>
        <FormSelect
          label="Team B"
          id="teamBId"
          name="teamBId"
          value={formData.teamBId}
          onChange={handleInputChange}
          required
        >
          <option value="">FormSelect Team B</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </FormSelect>
      </div>
      <FormSelect
        label="Tournament (Optional)"
        id="tournamentId"
        name="tournamentId"
        value={formData.tournamentId}
        onChange={handleInputChange}
      >
        <option value="">Friendly Match (No Tournament)</option>
        {mockTournaments.map((tour) => (
          <option key={tour.id} value={tour.id}>
            {tour.title}
          </option>
        ))}
      </FormSelect>

      {/* Venue Details */}

      <Input
        label="Ground / Stadium Name"
        id="location"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="e.g., M. Chinnaswamy Stadium"
        required
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="City"
          id="city"
          name="city"
          value={formData.venue.city}
          onChange={handleVenueChange}
          placeholder="e.g., Bengaluru"
          required
        />
        <Input
          label="State"
          id="state"
          name="state"
          value={formData.venue.state}
          onChange={handleVenueChange}
          placeholder="e.g., Karnataka"
          required
        />
        <Input
          label="Country"
          id="country"
          name="country"
          value={formData.venue.country}
          onChange={handleVenueChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormSelect
          label="Toss Winner"
          id="tossWinner"
          name="tossWinner"
          value={formData.tossWinner}
          onChange={handleInputChange}
          disabled={!selectedTeamA || !selectedTeamB}
        >
          <option value="">FormSelect Toss Winner</option>
          {selectedTeamA && <option value={selectedTeamA.name}>{selectedTeamA.name}</option>}
          {selectedTeamB && <option value={selectedTeamB.name}>{selectedTeamB.name}</option>}
        </FormSelect>
        <FormSelect
          label="Toss Decision"
          id="tossDecision"
          name="tossDecision"
          value={formData.tossDecision}
          onChange={handleInputChange}
        >
          <option value="">FormSelect Decision</option>
          <option value="Bat">Bat</option>
          <option value="Bowl">Bowl</option>
        </FormSelect>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormSelect
          label="Match Category"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="T10">T10</option>
          <option value="T20">T20</option>
          <option value="ODI">ODI</option>
          <option value="Test">Test</option>
          <option value="others">Others</option>
        </FormSelect>
        <Input
          label="Date and Time"
          id="date"
          name="date"
          type="datetime-local"
          value={formData.date}
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
  );
};
export default CreateMatchForm;
