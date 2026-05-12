import { useState, useEffect, useRef } from "react";
import MapComponent from './MapComponent'

const COLORS = {
  crimson: "#C41E3A",
  crimsonDark: "#8B0000",
  crimsonLight: "#FF6B8A",
  rose: "#FF1A4B",
  bg: "#0A0A0F",
  bgCard: "#12121A",
  bgCardHover: "#1A1A26",
  border: "#2A2A3A",
  borderLight: "#3A3A4E",
  text: "#F0EEF8",
  textMuted: "#9898B0",
  textDim: "#5A5A72",
  success: "#00D68F",
  warning: "#FFAA00",
  info: "#4D9EFF",
  purple: "#8B5CF6",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'DM Sans', sans-serif;
    background: ${COLORS.bg};
    color: ${COLORS.text};
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  
  .font-syne { font-family: 'Syne', sans-serif; }
  
  .sos-pulse {
    animation: sosPulse 2s infinite;
  }
  @keyframes sosPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,30,58,0.7); }
    50% { box-shadow: 0 0 0 24px rgba(196,30,58,0); }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .card {
    background: ${COLORS.bgCard};
    border: 0.5px solid ${COLORS.border};
    border-radius: 16px;
    transition: border-color 0.2s, background 0.2s;
  }
  .card:hover { border-color: ${COLORS.borderLight}; background: ${COLORS.bgCardHover}; }
  
  .btn-primary {
    background: ${COLORS.crimson};
    color: white;
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { background: ${COLORS.rose}; }
  .btn-primary:active { transform: scale(0.97); }
  
  .btn-ghost {
    background: transparent;
    color: ${COLORS.textMuted};
    border: 0.5px solid ${COLORS.border};
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-ghost:hover { border-color: ${COLORS.borderLight}; color: ${COLORS.text}; background: ${COLORS.bgCard}; }
  
  input, textarea, select {
    background: ${COLORS.bg};
    border: 0.5px solid ${COLORS.border};
    border-radius: 10px;
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 12px 16px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-color: ${COLORS.crimson}; }
  input::placeholder, textarea::placeholder { color: ${COLORS.textDim}; }
  select option { background: ${COLORS.bgCard}; }
  
  .nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px 16px; cursor: pointer; border-radius: 12px;
    transition: all 0.2s; color: ${COLORS.textMuted}; font-size: 11px;
    border: none; background: transparent; font-family: 'DM Sans', sans-serif;
  }
  .nav-item.active { color: ${COLORS.crimsonLight}; background: rgba(196,30,58,0.12); }
  .nav-item:hover:not(.active) { color: ${COLORS.text}; background: ${COLORS.bgCard}; }
  
  .alert-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;
  }
  .badge-danger { background: rgba(196,30,58,0.15); color: ${COLORS.crimsonLight}; }
  .badge-success { background: rgba(0,214,143,0.12); color: ${COLORS.success}; }
  .badge-warning { background: rgba(255,170,0,0.12); color: ${COLORS.warning}; }
  .badge-info { background: rgba(77,158,255,0.12); color: ${COLORS.info}; }
  
  .map-container {
    background: linear-gradient(135deg, #0D1520 0%, #0A1A2E 50%, #0D1520 100%);
    border-radius: 16px; position: relative; overflow: hidden;
    border: 0.5px solid ${COLORS.border};
  }
  .map-grid {
    position: absolute; inset: 0; opacity: 0.15;
    background-image: 
      linear-gradient(${COLORS.info}33 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.info}33 1px, transparent 1px);
    background-size: 40px 40px;
  }
  
  .location-dot {
    width: 16px; height: 16px; border-radius: 50%;
    background: ${COLORS.crimson};
    box-shadow: 0 0 0 4px rgba(196,30,58,0.3), 0 0 20px rgba(196,30,58,0.5);
    animation: locPulse 2s infinite;
  }
  @keyframes locPulse {
    0%, 100% { box-shadow: 0 0 0 4px rgba(196,30,58,0.3), 0 0 20px rgba(196,30,58,0.5); }
    50% { box-shadow: 0 0 0 10px rgba(196,30,58,0.1), 0 0 30px rgba(196,30,58,0.3); }
  }
  
  .section-label {
    font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: ${COLORS.textDim}; margin-bottom: 12px;
  }
  
  .divider { height: 0.5px; background: ${COLORS.border}; margin: 20px 0; }
  
  .toast {
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: ${COLORS.bgCard}; border: 0.5px solid ${COLORS.border};
    border-radius: 12px; padding: 12px 20px; font-size: 14px;
    display: flex; align-items: center; gap: 10px;
    animation: toastIn 0.3s ease; z-index: 1000;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5); white-space: nowrap;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  .shimmer {
    background: linear-gradient(90deg, ${COLORS.bgCard} 25%, ${COLORS.bgCardHover} 50%, ${COLORS.bgCard} 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .hero-glow {
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(196,30,58,0.08) 0%, transparent 70%);
    top: -100px; left: 50%; transform: translateX(-50%);
    pointer-events: none;
  }
  
  .stat-card {
    background: ${COLORS.bgCard}; border: 0.5px solid ${COLORS.border};
    border-radius: 12px; padding: 16px 20px; text-align: center;
    flex: 1;
  }
  
  @media (max-width: 480px) {
    .hide-mobile { display: none !important; }
    .stack-mobile { flex-direction: column !important; }
  }
`;

const ICON = {
  shield: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  alert: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  map: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  user: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  home: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  phone: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 12 19.79 19.79 0 01.79 3.38 2 2 0 012.77 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l.98-.98a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  plus: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  lock: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  share: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  bell: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  check: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 11 4 13"/></svg>,
  tip: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  location: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  logout: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  edit: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  send: (s=24) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

const MOCK_USER = { name: "Priya Sharma", email: "priya@gmail.com", phone: "+91 98765 43210", avatar: "PS" };
const MOCK_CONTACTS = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 11111", relation: "Brother" },
  { id: 2, name: "Meena Sharma", phone: "+91 98765 22222", relation: "Mother" },
  { id: 3, name: "Ananya Gupta", phone: "+91 98765 33333", relation: "Friend" },
];
const MOCK_ALERTS = [
  { id: 1, time: "Today, 8:42 PM", location: "MG Road, Bengaluru", status: "resolved", contacts: 3 },
  { id: 2, time: "Yesterday, 11:15 PM", location: "Koramangala, Bengaluru", status: "resolved", contacts: 2 },
  { id: 3, time: "Dec 12, 7:30 PM", location: "Indiranagar, Bengaluru", status: "resolved", contacts: 3 },
];
const SAFETY_TIPS = [
  { icon: "🌙", title: "Stay in well-lit areas", tip: "Avoid dark alleys and isolated spots, especially at night. Stick to busy, well-lit roads and public spaces." },
  { icon: "📱", title: "Keep your phone charged", tip: "Always ensure your phone is charged before going out. Carry a power bank for longer trips." },
  { icon: "👥", title: "Share your plans", tip: "Always inform a trusted person about your whereabouts, travel plans, and expected return time." },
  { icon: "🚕", title: "Verify transport", tip: "Cross-check cab driver and vehicle details with the app. Sit in the back seat and share ride details." },
  { icon: "🔊", title: "Trust your instincts", tip: "If something feels wrong, act on it. Move to a public place, call someone, or seek help." },
  { icon: "🛡️", title: "Self-defense basics", tip: "Consider learning basic self-defense techniques. Simple moves like palm strike or wrist release can help." },
];
const HELPLINES = [
  { name: "Women Helpline", number: "1091", type: "National" },
  { name: "Police", number: "100", type: "Emergency" },
  { name: "Ambulance", number: "108", type: "Medical" },
  { name: "Nirbhaya Helpline", number: "181", type: "Women Safety" },
  { name: "Childline", number: "1098", type: "Children" },
  { name: "Senior Citizen", number: "14567", type: "Senior" },
];

export default function SafeHer() {
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [toast, setToast] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const [addingContact, setAddingContact] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const countdownRef = useRef(null);

  const showToast = (msg, icon = "✅") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerSOS = () => {
    if (sosCountdown !== null) return;
    setSosCountdown(3);
    countdownRef.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setSosCountdown(null);
          setSosTriggered(true);
          setSosActive(true);
          const newAlert = {
            id: Date.now(), time: "Just now", location: "MG Road, Bengaluru", status: "active", contacts: contacts.length
          };
          setAlerts(prev => [newAlert, ...prev]);
          showToast(`SOS sent to ${contacts.length} contacts`, "🚨");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    clearInterval(countdownRef.current);
    setSosCountdown(null);
    setSosActive(false);
    setSosTriggered(false);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts(prev => [...prev, { ...newContact, id: Date.now() }]);
    setNewContact({ name: "", phone: "", relation: "" });
    setAddingContact(false);
    showToast("Contact added successfully");
  };

  const removeContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast("Contact removed");
  };

  const nav = loggedIn
    ? ["home", "dashboard", "location", "tips"]
    : ["home", "tips"];

  const navLabels = { home: "Home", dashboard: "Dashboard", location: "Location", tips: "Safety" };
  const navIcons = { home: ICON.home, dashboard: ICON.user, location: ICON.map, tips: ICON.shield };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", paddingBottom: loggedIn ? "80px" : 0 }}>
        {page === "home" && <HomePage setPage={setPage} loggedIn={loggedIn} triggerSOS={triggerSOS} sosCountdown={sosCountdown} cancelSOS={cancelSOS} sosActive={sosActive} sosTriggered={sosTriggered} setSosTriggered={setSosTriggered} setSosActive={setSosActive} showToast={showToast} />}
        {page === "auth" && <AuthPage authMode={authMode} setAuthMode={setAuthMode} setLoggedIn={setLoggedIn} setPage={setPage} showPw={showPw} setShowPw={setShowPw} showToast={showToast} />}
        {page === "dashboard" && loggedIn && <DashboardPage contacts={contacts} alerts={alerts} addingContact={addingContact} setAddingContact={setAddingContact} newContact={newContact} setNewContact={setNewContact} addContact={addContact} removeContact={removeContact} setLoggedIn={setLoggedIn} setPage={setPage} showToast={showToast} />}
        {page === "location" && loggedIn && <LocationPage contacts={contacts} locationSharing={locationSharing} setLocationSharing={setLocationSharing} showToast={showToast} triggerSOS={triggerSOS} sosCountdown={sosCountdown} cancelSOS={cancelSOS} sosActive={sosActive} />}
        {page === "tips" && <TipsPage />}

        {loggedIn && (
          <nav style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
            background: COLORS.bgCard, borderTop: `0.5px solid ${COLORS.border}`,
            display: "flex", justifyContent: "space-around", padding: "8px 0 12px",
          }}>
            {nav.map(n => (
              <button key={n} className={`nav-item ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>
                {navIcons[n](22)}
                <span>{navLabels[n]}</span>
              </button>
            ))}
          </nav>
        )}

        {!loggedIn && page !== "auth" && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.bgCard, borderTop: `0.5px solid ${COLORS.border}`, display: "flex", justifyContent: "space-around", padding: "8px 0 12px", zIndex: 100 }}>
            <button className={`nav-item ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>{ICON.home(22)}<span>Home</span></button>
            <button className={`nav-item ${page === "tips" ? "active" : ""}`} onClick={() => setPage("tips")}>{ICON.shield(22)}<span>Safety</span></button>
            <button className={`nav-item`} onClick={() => setPage("auth")}>{ICON.user(22)}<span>Sign In</span></button>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast">
          <span style={{ fontSize: 18 }}>{toast.icon}</span>
          <span style={{ color: COLORS.text, fontSize: 14 }}>{toast.msg}</span>
        </div>
      )}
    </>
  );
}

function HomePage({ setPage, loggedIn, triggerSOS, sosCountdown, cancelSOS, sosActive, sosTriggered, setSosTriggered, setSosActive, showToast }) {
  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 100px" }}>
      <div style={{ position: "relative", padding: "60px 0 40px", textAlign: "center" }}>
        <div className="hero-glow" />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(196,30,58,0.1)", border: `0.5px solid rgba(196,30,58,0.3)`, borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
          {ICON.shield(14)}
          <span style={{ fontSize: 12, color: COLORS.crimsonLight, letterSpacing: "0.06em" }}>YOUR SAFETY, OUR PRIORITY</span>
        </div>
        <h1 className="font-syne" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.02em" }}>
          Safe<span style={{ color: COLORS.crimson }}>Her</span>
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 16, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 36px" }}>
          Real-time protection for every woman. Share your location, send emergency alerts in one tap.
        </p>

        <div style={{ position: "relative", display: "inline-block", marginBottom: 40 }}>
          {sosCountdown !== null && (
            <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `2px solid ${COLORS.crimson}`, animation: "sosPulse 1s infinite" }} />
          )}
          <button
            onClick={sosCountdown !== null ? cancelSOS : triggerSOS}
            className={sosCountdown !== null ? "" : "sos-pulse"}
            style={{
              width: 140, height: 140, borderRadius: "50%",
              background: sosCountdown !== null ? COLORS.crimsonDark : sosActive ? COLORS.crimson : `radial-gradient(circle at 40% 35%, #E8304A, ${COLORS.crimsonDark})`,
              border: `3px solid ${COLORS.crimson}`,
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.3s", position: "relative", overflow: "hidden",
              boxShadow: `0 0 40px rgba(196,30,58,0.35)`,
            }}
          >
            <div style={{ color: "white", opacity: 0.9 }}>{ICON.alert(28)}</div>
            <span className="font-syne" style={{ color: "white", fontWeight: 800, fontSize: sosCountdown !== null ? 32 : 20, letterSpacing: "0.04em" }}>
              {sosCountdown !== null ? sosCountdown : "SOS"}
            </span>
            {sosCountdown !== null && <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>tap to cancel</span>}
          </button>
        </div>

        {sosTriggered && (
          <div style={{ background: "rgba(196,30,58,0.1)", border: `0.5px solid rgba(196,30,58,0.4)`, borderRadius: 12, padding: "14px 20px", marginBottom: 20, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: COLORS.crimsonLight }}>{ICON.bell(16)}</span>
              <span style={{ color: COLORS.crimsonLight, fontWeight: 500, fontSize: 14 }}>Emergency alert sent!</span>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.5 }}>Your location and SOS have been shared with your emergency contacts. Help is on the way.</p>
            <button onClick={() => { setSosTriggered(false); setSosActive(false); }} className="btn-ghost" style={{ marginTop: 12, fontSize: 13, padding: "8px 16px" }}>Dismiss Alert</button>
          </div>
        )}

        <p style={{ color: COLORS.textDim, fontSize: 12 }}>Hold for 3 seconds to send emergency alert</p>
      </div>

      <div className="divider" />
      <div className="section-label">Features</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { icon: ICON.location, title: "Live Tracking", desc: "Real-time GPS location sharing", color: COLORS.info },
          { icon: ICON.send, title: "Instant Alerts", desc: "One-tap SOS to all contacts", color: COLORS.crimson },
          { icon: ICON.phone, title: "Emergency Contacts", desc: "Manage trusted contacts", color: COLORS.success },
          { icon: ICON.shield, title: "Safety Tips", desc: "Expert women safety advice", color: COLORS.purple },
        ].map((f, i) => (
          <div key={i} className="card" style={{ padding: "18px 16px" }}>
            <div style={{ color: f.color, marginBottom: 10 }}>{f.icon(22)}</div>
            <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{f.title}</p>
            <p style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {!loggedIn && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ color: COLORS.textMuted, marginBottom: 16, fontSize: 14 }}>Create an account to unlock all features</p>
          <button className="btn-primary" onClick={() => setPage("auth")} style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "14px" }}>
            {ICON.shield(18)} Get Protected Now
          </button>
        </div>
      )}

      <div className="divider" />
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Women Protected", value: "50K+" },
          { label: "Alerts Sent", value: "12K+" },
          { label: "Cities Covered", value: "200+" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="font-syne" style={{ fontSize: 22, fontWeight: 700, color: COLORS.crimsonLight }}>{s.value}</p>
            <p style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthPage({ authMode, setAuthMode, setLoggedIn, setPage, showPw, setShowPw, showToast }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [forgotPw, setForgotPw] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = () => {
    if (forgotPw) {
      showToast("Reset link sent to your email");
      setForgotPw(false);
      return;
    }
    if (!form.email || !form.password) { showToast("Please fill all fields", "⚠️"); return; }
    setLoggedIn(true);
    setPage("dashboard");
    showToast(authMode === "login" ? "Welcome back, Priya! 👋" : "Account created! Stay safe 💪");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 400, margin: "0 auto", padding: "40px 20px 100px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, background: "rgba(196,30,58,0.12)", borderRadius: 16, marginBottom: 16 }}>
          {ICON.shield(28)}
        </div>
        <h2 className="font-syne" style={{ fontSize: 26, fontWeight: 700 }}>
          {forgotPw ? "Reset Password" : authMode === "login" ? "Welcome Back" : "Join SafeHer"}
        </h2>
        <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 8 }}>
          {forgotPw ? "Enter your email to receive a reset link" : authMode === "login" ? "Sign in to your account" : "Create your account and stay safe"}
        </p>
      </div>

      <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {forgotPw ? (
          <>
            <div>
              <label style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Email</label>
              <input type="email" placeholder="you@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>{ICON.send(16)} Send Reset Link</button>
            <button className="btn-ghost" onClick={() => setForgotPw(false)} style={{ width: "100%", justifyContent: "center" }}>Back to Sign In</button>
          </>
        ) : (
          <>
            {authMode === "signup" && (
              <>
                <div>
                  <label style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Full Name</label>
                  <input placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Phone Number</label>
                  <input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </>
            )}
            <div>
              <label style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Email</label>
              <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6, display: "block" }}>Password</label>
              <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", marginTop: 3, background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, display: "flex", alignItems: "center" }}>
                {showPw ? ICON.eyeOff(18) : ICON.eye(18)}
              </button>
            </div>
            {authMode === "login" && (
              <button onClick={() => setForgotPw(true)} style={{ background: "none", border: "none", color: COLORS.crimsonLight, fontSize: 13, cursor: "pointer", textAlign: "right", padding: 0 }}>
                Forgot password?
              </button>
            )}
            <button className="btn-primary" onClick={handleSubmit} style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: "14px" }}>
              {ICON.lock(16)} {authMode === "login" ? "Sign In" : "Create Account"}
            </button>
            <div style={{ textAlign: "center" }}>
              <span style={{ color: COLORS.textMuted, fontSize: 13 }}>
                {authMode === "login" ? "No account? " : "Already have one? "}
              </span>
              <button onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")} style={{ background: "none", border: "none", color: COLORS.crimsonLight, fontSize: 13, cursor: "pointer" }}>
                {authMode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DashboardPage({ contacts, alerts, addingContact, setAddingContact, newContact, setNewContact, addContact, removeContact, setLoggedIn, setPage, showToast }) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Good evening,</p>
          <h2 className="font-syne" style={{ fontSize: 22, fontWeight: 700 }}>{MOCK_USER.name}</h2>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.crimson}, ${COLORS.crimsonDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 15, color: "white" }}>
            {MOCK_USER.avatar}
          </div>
          <button onClick={() => { setLoggedIn(false); setPage("home"); }} className="btn-ghost" style={{ padding: "8px 10px" }}>{ICON.logout(18)}</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: COLORS.bgCard, borderRadius: 12, padding: 4, border: `0.5px solid ${COLORS.border}` }}>
        {["overview", "contacts", "alerts"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
            background: tab === t ? COLORS.crimson : "transparent",
            color: tab === t ? "white" : COLORS.textMuted,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            transition: "all 0.2s", textTransform: "capitalize"
          }}>{t}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div className="stat-card">
              <p className="font-syne" style={{ fontSize: 26, fontWeight: 700, color: COLORS.crimsonLight }}>{contacts.length}</p>
              <p style={{ color: COLORS.textMuted, fontSize: 11 }}>Contacts</p>
            </div>
            <div className="stat-card">
              <p className="font-syne" style={{ fontSize: 26, fontWeight: 700, color: COLORS.warning }}>{alerts.length}</p>
              <p style={{ color: COLORS.textMuted, fontSize: 11 }}>Alerts Sent</p>
            </div>
            <div className="stat-card">
              <p className="font-syne" style={{ fontSize: 26, fontWeight: 700, color: COLORS.success }}>✓</p>
              <p style={{ color: COLORS.textMuted, fontSize: 11 }}>Protected</p>
            </div>
          </div>

          <div className="card" style={{ padding: "18px 20px" }}>
            <div className="section-label">Profile</div>
            {[
              [ICON.user, MOCK_USER.name],
              [ICON.send, MOCK_USER.email],
              [ICON.phone, MOCK_USER.phone],
            ].map(([icon, val], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `0.5px solid ${COLORS.border}` : "none" }}>
                <span style={{ color: COLORS.textMuted }}>{icon(18)}</span>
                <span style={{ fontSize: 14 }}>{val}</span>
              </div>
            ))}
            <button className="btn-ghost" onClick={() => showToast("Profile edit coming soon")} style={{ marginTop: 12, fontSize: 13 }}>
              {ICON.edit(15)} Edit Profile
            </button>
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontWeight: 500 }}>Emergency Contacts ({contacts.length})</span>
            <button className="btn-primary" onClick={() => setAddingContact(!addingContact)} style={{ padding: "8px 14px", fontSize: 13 }}>
              {ICON.plus(15)} Add
            </button>
          </div>

          {addingContact && (
            <div className="card" style={{ padding: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 12, border: `0.5px solid ${COLORS.crimson}` }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.crimsonLight }}>New Contact</p>
              <input placeholder="Contact name" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
              <input placeholder="Phone number" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
              <input placeholder="Relation (e.g. Sister, Friend)" value={newContact.relation} onChange={e => setNewContact({...newContact, relation: e.target.value})} />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" onClick={addContact} style={{ flex: 1, justifyContent: "center" }}>{ICON.check(15)} Save</button>
                <button className="btn-ghost" onClick={() => setAddingContact(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {contacts.map(c => (
              <div key={c.id} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(196,30,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: COLORS.crimsonLight, fontWeight: 600, fontSize: 14 }}>
                  {c.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</p>
                  <p style={{ color: COLORS.textMuted, fontSize: 12 }}>{c.phone} • {c.relation}</p>
                </div>
                <button onClick={() => removeContact(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textDim, padding: 4 }}>
                  {ICON.trash(18)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map(a => (
            <div key={a.id} className="card" style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{a.time}</span>
                <span className={`alert-badge ${a.status === "active" ? "badge-danger" : "badge-success"}`}>
                  {a.status === "active" ? "● Active" : "✓ Resolved"}
                </span>
              </div>
              <p style={{ fontSize: 14, marginBottom: 4 }}>{a.location}</p>
              <p style={{ color: COLORS.textDim, fontSize: 12 }}>Notified {a.contacts} contacts</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LocationPage({ contacts, locationSharing, setLocationSharing, showToast, triggerSOS, sosCountdown, cancelSOS, sosActive }) {
  const [coords] = useState({ lat: 12.9716, lng: 77.5946 });

  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 100px" }}>
      <h2 className="font-syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Live Location</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 20 }}>Track and share your real-time location</p>

      <div>
        <MapComponent />
      </div>

      <div className="card" style={{ padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <p style={{ fontWeight: 500, fontSize: 15, marginBottom: 3 }}>Share Location</p>
            <p style={{ color: COLORS.textMuted, fontSize: 13 }}>
              {locationSharing ? `Sharing with ${contacts.length} contacts` : "Location sharing is off"}
            </p>
          </div>
          <button
            onClick={() => { setLocationSharing(!locationSharing); showToast(locationSharing ? "Location sharing stopped" : `Sharing with ${contacts.length} contacts`); }}
            style={{
              width: 52, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
              background: locationSharing ? COLORS.success : COLORS.borderLight,
              transition: "all 0.3s", position: "relative"
            }}
          >
            <div style={{
              position: "absolute", top: 3, left: locationSharing ? 27 : 3,
              width: 22, height: 22, borderRadius: "50%", background: "white",
              transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
            }} />
          </button>
        </div>

        {locationSharing && (
          <div style={{ borderTop: `0.5px solid ${COLORS.border}`, paddingTop: 14 }}>
            <p className="section-label">Shared with</p>
            {contacts.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <span style={{ color: COLORS.success }}>{ICON.check(14)}</span>
                <span style={{ fontSize: 13 }}>{c.name}</span>
                <span style={{ color: COLORS.textDim, fontSize: 12, marginLeft: "auto" }}>{c.relation}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={sosCountdown !== null ? cancelSOS : triggerSOS}
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: 16, fontSize: 16, background: sosCountdown !== null ? COLORS.crimsonDark : COLORS.crimson, borderRadius: 14 }}
      >
        {ICON.alert(20)}
        {sosCountdown !== null ? `Sending in ${sosCountdown}... (tap to cancel)` : "Send Emergency SOS"}
      </button>
    </div>
  );
}

function TipsPage() {
  return (
    <div className="fade-in" style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 100px" }}>
      <h2 className="font-syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Safety Tips</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24 }}>Expert advice to keep you safer every day</p>

      <div className="section-label">Women Safety Tips</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {SAFETY_TIPS.map((t, i) => (
          <div key={i} className="card" style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{t.icon}</div>
            <div>
              <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 5 }}>{t.title}</p>
              <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.6 }}>{t.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-label">Emergency Helplines</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {HELPLINES.map((h, i) => (
          <div key={i} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span className="alert-badge badge-info" style={{ fontSize: 11, padding: "3px 8px" }}>{h.type}</span>
            </div>
            <p className="font-syne" style={{ fontSize: 22, fontWeight: 700, color: COLORS.crimsonLight, marginBottom: 4 }}>{h.number}</p>
            <p style={{ color: COLORS.textMuted, fontSize: 12 }}>{h.name}</p>
            <a href={`tel:${h.number}`} className="btn-ghost" style={{ marginTop: 10, fontSize: 12, padding: "6px 12px", display: "inline-flex" }}>
              {ICON.phone(14)} Call
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
