import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ScoreRing from '../components/ScoreRing';

const sev = (s) => ({ mild:'chip-mild', moderate:'chip-moderate', severe:'chip-severe' }[s] || 'chip-mild');

function Section({ emoji, title, children }) {
  return (
    <div className="card" style={{ padding:24, marginBottom:16 }}>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:22 }}>{emoji}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function ListItem({ text, num }) {
  return (
    <div style={{ display:'flex', gap:12, marginBottom:10, alignItems:'flex-start' }}>
      <div style={{
        minWidth:24, height:24, borderRadius:'50%', background:'rgba(201,96,123,0.1)',
        color:'var(--rose)', fontSize:12, fontWeight:700, display:'flex',
        alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1,
      }}>{num}</div>
      <p style={{ fontSize:14, color:'var(--deep)', lineHeight:1.6 }}>{text}</p>
    </div>
  );
}

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then(r => setReport(r.data.report))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ height:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spinner" style={{ width:36, height:36, borderColor:'var(--rose)', borderTopColor:'transparent' }} />
    </div>
  );
  if (!report) return <div className="page"><p>Report not found.</p></div>;

  const scores = [
    { label:'Overall Health', val: report.overallScore },
    { label:'Acne Score',     val: report.acneScore },
    { label:'Glow Score',     val: report.glowScore },
    { label:'Hydration',      val: report.hydrationScore },
    { label:'Youth Score',    val: report.youthScore },
    { label:'Symmetry',       val: report.symmetryScore },
  ];

  return (
    <div className="page" style={{ maxWidth:860 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <button onClick={() => navigate('/history')} className="btn btn-outline" style={{ padding:'8px 16px', fontSize:13 }}>
          ← Back
        </button>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:38 }}>Skin Analysis Report</h1>
          <p style={{ color:'var(--muted)', fontSize:13, marginTop:2 }}>
            {new Date(report.createdAt).toLocaleDateString('en-US', { dateStyle:'long' })}
            {' · '}<span style={{ textTransform:'capitalize' }}>{report.skinType} skin</span>
            {' · '}Est. skin age: <strong>{report.skinAge}</strong>
          </p>
        </div>
      </div>

      {/* Photo + Scores */}
      <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:20, marginBottom:20 }}>
        <div className="card" style={{ padding:12, overflow:'hidden' }}>
          <img src={report.imageUrl} alt="Scan" style={{ width:'100%', borderRadius:10, objectFit:'cover', aspectRatio:'1' }} />
        </div>
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:20 }}>Skin Scores</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {scores.map(s => <ScoreRing key={s.label} score={s.val} label={s.label} size={90} />)}
          </div>
        </div>
      </div>

      {/* Score progress bars */}
      <div className="card" style={{ padding:24, marginBottom:16 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:18 }}>Score Breakdown</h3>
        {scores.map(s => {
          const c = s.val >= 75 ? '#22c55e' : s.val >= 50 ? '#C8976E' : '#C9607B';
          return (
            <div key={s.label} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{s.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:c }}>{s.val}/100</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${s.val}%`, background:c }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detected issues */}
      {report.issuesDetected?.length > 0 && (
        <Section emoji="🔍" title="Detected Issues">
          {report.issuesDetected.map((issue, i) => (
            <div key={i} style={{
              display:'flex', gap:12, alignItems:'flex-start', padding:'12px 14px',
              background:'rgba(253,248,245,0.8)', borderRadius:12, marginBottom:10,
            }}>
              <span className={`chip ${sev(issue.severity)}`} style={{ marginTop:2, flexShrink:0 }}>
                {issue.severity}
              </span>
              <div>
                <p style={{ fontWeight:600, fontSize:14, marginBottom:3 }}>{issue.name}</p>
                <p style={{ fontSize:13, color:'var(--muted)' }}>{issue.description}</p>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Remedies */}
      {report.remedies?.length > 0 && (
        <Section emoji="🌿" title="Remedies & Tips">
          {report.remedies.map((r, i) => <ListItem key={i} num={i+1} text={r} />)}
        </Section>
      )}

      {/* Daily Routine */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <Section emoji="☀️" title="Morning Routine">
          {report.dailyRoutine?.morning?.map((s, i) => <ListItem key={i} num={i+1} text={s} />)}
        </Section>
        <Section emoji="🌙" title="Evening Routine">
          {report.dailyRoutine?.evening?.map((s, i) => <ListItem key={i} num={i+1} text={s} />)}
        </Section>
      </div>

      {/* Diet + Lifestyle */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <Section emoji="🥗" title="Diet Suggestions">
          {report.dietSuggestions?.map((d, i) => <ListItem key={i} num={i+1} text={d} />)}
        </Section>
        <Section emoji="🏃" title="Lifestyle Changes">
          {report.lifestyleChanges?.map((l, i) => <ListItem key={i} num={i+1} text={l} />)}
        </Section>
      </div>

      {/* Products */}
      {report.productRecommendations?.length > 0 && (
        <Section emoji="🛍️" title="Recommended Products">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
            {report.productRecommendations.map((p, i) => (
              <div key={i} style={{
                padding:'14px 16px', background:'rgba(253,248,245,0.9)',
                borderRadius:12, border:'1px solid rgba(200,151,110,0.2)',
              }}>
                <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--gold)' }}>
                  {p.type}
                </span>
                <p style={{ fontWeight:600, fontSize:14, margin:'4px 0 6px' }}>{p.name}</p>
                <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.55 }}>{p.reason}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Doctor consultation */}
      {report.doctorConsultation?.required && (
        <div style={{
          padding:'18px 20px', background:'#fee2e2', borderRadius:14,
          border:'1px solid #fca5a5', marginBottom:16,
        }}>
          <p style={{ fontWeight:700, color:'#991b1b', marginBottom:4 }}>🏥 Doctor Consultation Recommended</p>
          <p style={{ fontSize:13, color:'#7f1d1d' }}>{report.doctorConsultation.reason}</p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:'flex', gap:12, marginTop:8 }}>
        <button className="btn btn-primary" onClick={() => navigate('/scan')} style={{ padding:'12px 28px' }}>
          ◎ New Scan
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/history')} style={{ padding:'12px 28px' }}>
          View History
        </button>
      </div>
    </div>
  );
}
