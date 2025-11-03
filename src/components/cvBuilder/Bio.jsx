// src/components/cvBuilder/bio.jsx
import React, { useState } from "react";
import { submitBio } from "../../services/cvBuilderService";

const Bio = () => {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await submitBio({ bio });
      setResponseMsg("Bio saved successfully!");
      console.log("Backend response:", res);
    } catch (error) {
      setResponseMsg("Failed to save bio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bio-section">
      <h3>Bio</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write a short bio..."
          rows={5}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Bio"}
        </button>
      </form>

      {responseMsg && <p>{responseMsg}</p>}
    </div>
  );
};

export default Bio;
