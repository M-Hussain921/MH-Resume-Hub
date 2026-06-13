import { useState } from 'react';
import * as api from '../../services/api.service';
import '../../styles/Sections/SkillsSection.css';
import { toast } from 'react-toastify';

export default function SkillsSection({ skills, onAddSkill, onRemoveSkill, resumeId }) {
  const [newSkill, setNewSkill] = useState('');
 const [apiLoading, setApiLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const cleanId = typeof resumeId === 'object' ? resumeId?._id : resumeId;

  const addSkill = async () => {
if(!resumeId||resumeId==='null')
 toast.error("Fist save your Personal Info!");
    if (!newSkill.trim()) return;

    if (skills.includes(newSkill.trim())) {
      toast.warning("This Skill is already added!");
      return;
    }

    if (!resumeId || resumeId === "[object Object]") {
      toast.error("first save personal info!");
      return;
    }

    const skillToAdd = newSkill.trim();
    onAddSkill(skillToAdd);
    setNewSkill('');

    setAdding(true);
    try {
      await api.addSkill(cleanId, skillToAdd);
      toast.success("Skill added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sync failed");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveSkill = async (index) => {
    const skillToRemove = skills[index];

    onRemoveSkill(index);

    if (!cleanId || cleanId === "[object Object]") return;

    try {
      await api.removeSkill(cleanId, skillToRemove);
    } catch (error) {
      console.error('Remove sync failed:', error);
    }
  };

 return (
    <div className="skills-section">
      <h2 className="section-title">Technical Skills</h2>

      <div className="skills-input-group">
        <input
          type="text"
          className="form-input"
          placeholder="e.g., React.js, Python, Node.js..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          disabled={apiLoading}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" className="btn-add" onClick={addSkill} disabled={apiLoading}>
          {apiLoading ? '⏳ Adding...' : '+ Add Skill'}
        </button>
      </div>

      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-tag">
            <span>{skill}</span>
            <button className="btn-remove-small" onClick={() => handleRemoveSkill(index)} disabled={apiLoading}>
              ×
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="empty-hint">No skills added. Click + Add Skill to add your skills.</p>
      )}
    </div>
  );
}