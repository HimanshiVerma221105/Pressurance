import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function MedicalHistory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    head: [], torso: [], arm: [], leg: []
  });

  const handleChange = (section, value) => {
    setForm(prev => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter(item => item !== value)
        : [...prev[section], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert("User not logged in. Please login.");
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/users/medical-history', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Medical history saved!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to submit medical history');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Medical History</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Head</legend>
          <label><input type="checkbox" onChange={() => handleChange('head', 'Migraine')} /> Migraine</label>
          <label><input type="checkbox" onChange={() => handleChange('head', 'Sinus')} /> Sinus</label>
        </fieldset>

        <fieldset>
          <legend>Torso</legend>
          <label><input type="checkbox" onChange={() => handleChange('torso', 'Back Pain')} /> Back Pain</label>
          <label><input type="checkbox" onChange={() => handleChange('torso', 'Chest Pain')} /> Chest Pain</label>
        </fieldset>

        <fieldset>
          <legend>Arm</legend>
          <label><input type="checkbox" onChange={() => handleChange('arm', 'Elbow Pain')} /> Elbow Pain</label>
          <label><input type="checkbox" onChange={() => handleChange('arm', 'Wrist Pain')} /> Wrist Pain</label>
        </fieldset>

        <fieldset>
          <legend>Leg</legend>
          <label><input type="checkbox" onChange={() => handleChange('leg', 'Knee Pain')} /> Knee Pain</label>
          <label><input type="checkbox" onChange={() => handleChange('leg', 'Ankle Pain')} /> Ankle Pain</label>
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
