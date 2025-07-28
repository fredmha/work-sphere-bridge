import React, { useState } from 'react';
import { INTEREST_OPTIONS, Interest } from '../constants/interests';
import { SKILL_OPTIONS, Skill } from '../constants/skills';

const InterestsSkillsDemo: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value as Interest);
    setSelectedInterests(values);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value as Skill);
    setSelectedSkills(values);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send selectedInterests and selectedSkills to Supabase
    console.log('Selected Interests:', selectedInterests);
    console.log('Selected Skills:', selectedSkills);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Interests & Skills Demo</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Interests (multi-select):
          <select multiple value={selectedInterests} onChange={handleInterestChange} style={{ width: '100%', minHeight: 120 }}>
            {INTEREST_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Skills (multi-select):
          <select multiple value={selectedSkills} onChange={handleSkillChange} style={{ width: '100%', minHeight: 120 }}>
            {SKILL_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <br /><br />
        <button type="submit">Submit</button>
      </form>
      <div style={{ marginTop: 24 }}>
        <strong>Selected Interests:</strong> {selectedInterests.join(', ')}<br />
        <strong>Selected Skills:</strong> {selectedSkills.join(', ')}
      </div>
    </div>
  );
};

export default InterestsSkillsDemo; 