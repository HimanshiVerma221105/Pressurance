import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

export default function AccuDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({ name: '', status: 'Under Treatment' });
  const [activePainArea, setActivePainArea] = useState('Back');
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser((prev) => ({ ...prev, name: decoded.name || 'User' }));
    } else navigate('/login');
  }, [token, navigate]);

  const painAreas = ['Back', 'Neck', 'Shoulder', 'Knee'];

  const ToggleSection = ({ id, title, icon, children }) => (
    <div className="card">
      <div className="card-header" onClick={() => setSelectedSection(selectedSection === id ? null : id)}>
        <h3 className="section-title">{icon}{title}</h3>
        <span className={`arrow ${selectedSection === id ? 'up' : 'down'}`} />
      </div>
      {selectedSection === id && <div className="card-content">{children}</div>}
    </div>
  );

  return (
    <div className="dashboard">
      <header className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="Pressurance Logo" className="logo-img" />
        <span className="logo-text">PRESSURANCE</span>
      </div>
        <nav>
          <a href="#profile">Profile</a>
          <a href="#condition">Condition</a>
          <a href="#pain">Pain Areas</a>
          <a href="#progress">Progress</a>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="logout">Logout</button>
        </nav>
      </header>

      <main className="container">
        <section className="welcome-card">
          <div className="welcome">
            <span className="avatar-icon">👤</span>
            <div>
              <h2>Welcome, {user.name}</h2>
              <p>Your care plan is ready. Start by selecting a pain area.</p>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="left-column">
            <ToggleSection id="profile" title="Profile Overview" icon="📝">
              <p>Status: <span className="badge">{user.status}</span></p>
              <p>Start: March 15, 2025</p>
              <p>Doctor: Dr. Sarah Johnson</p>
              <button onClick={() => navigate('/medical-history')} className="button-cta">Edit Profile</button>
            </ToggleSection>

            <ToggleSection id="condition" title="Current Condition" icon="📋">
              <p>Pain Area: {activePainArea}</p>
              <p>Intensity: <span className="warning">Mild</span></p>
              <p>Duration: 2 weeks</p>
              <button className="button-cta">Reassess Symptoms</button>
            </ToggleSection>

            <ToggleSection id="pain" title="Select Pain Area" icon="🎯">
              <div className="pain-grid">
                {painAreas.map(area => (
                  <button key={area} className={`pain-btn ${activePainArea === area ? 'active' : ''}`} onClick={() => setActivePainArea(area)}>
                    {area}
                  </button>
                ))}
              </div>
              <button
  className="button-cta"
  onClick={() => window.open("http://localhost:5000/3d", "_blank")}
>
  View 3D Body Model
</button>

            </ToggleSection>
          </div>

          <div className="right-column">
            <ToggleSection id="progress" title="Daily Progress & Feedback" icon="📈">
              <p>Overall: <span className="highlight">Improving 👍</span></p>
              <div className="chart-placeholder">[Progress Chart Here]</div>
              <button className="button-cta">View Details</button>
            </ToggleSection>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="quick-links">
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
        </div>
        <p>&copy; 2025 PRESSURANCE</p>
      </footer>
    </div>
  );
}