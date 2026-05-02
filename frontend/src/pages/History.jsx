import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast, ToastContainer } from '../components/Toast';

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    api.get('/reports')
      .then(r => setReports(r.data.reports || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const del = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r._id !== id));
      toast('Report deleted.');
    } catch { toast('Delete failed.', 'error'); }
  };

  if (loading) return (
    <div style={{ height:'80vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="spinner" style={{ width:36, height:36, borderColor:'var(--rose)', borderTopColor:'transparent' }} />
    </div>
  );

  return (
    <div className="page">
      <ToastContainer />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:44 }}>Scan History</h1>
          <p style={{ color:'var(--muted)', marginTop:4 }}>{reports.length} total scan{reports.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-rose" onClick={() => navigate('/scan')}>◎ New Scan</button>
      </div>

      {reports.length === 0 ? (
        <div className="card" style={{ padding:60, textAlign:'center' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🔬</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:8 }}>No scans yet</h3>
          <p style={{ color:'var(--muted)', marginBottom:24, fontSize:14 }}>
            Start your skin journey with your first AI analysis
          </p>
          <button className="btn btn-rose" onClick={() => navigate('/scan')}>Take First Scan →</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:18 }}>
          {reports.map(r => {
            const scoreColor = r.overallScore >= 75 ? '#166534' : r.overallScore >= 50 ? '#854d0e' : '#991b1b';
            const scoreBg    = r.overallScore >= 75 ? '#dcfce7' : r.overallScore >= 50 ? '#fef9c3' : '#fee2e2';
            return (
              <div key={r._id}
                className="card"
                style={{ overflow:'hidden', cursor:'pointer', transition:'transform .2s, box-shadow .2s' }}
                onClick={() => navigate(`/report/${r._id}`)}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(26,10,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
              >
                {/* Image */}
                <div style={{ position:'relative' }}>
                  <img src={r.imageUrl} alt="scan"
                    style={{ width:'100%', height:160, objectFit:'cover' }} />
                  <div style={{
                    position:'absolute', top:10, right:10, padding:'4px 12px',
                    background:'rgba(255,255,255,0.95)', borderRadius:99,
                    fontWeight:700, fontSize:14, color: scoreColor, background: scoreBg,
                  }}>
                    {r.overallScore}
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <p style={{ fontWeight:600, fontSize:14, textTransform:'capitalize' }}>{r.skinType} skin</p>
                      <p style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>
                        {new Date(r.createdAt).toLocaleDateString()} · {r.issuesDetected?.length ?? 0} issues found
                      </p>
                    </div>
                    <button
                      onClick={e => del(r._id, e)}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:16, padding:'4px' }}
                      title="Delete"
                    >🗑</button>
                  </div>
                  <button className="btn btn-outline"
                    style={{ width:'100%', justifyContent:'center', marginTop:12, fontSize:12, padding:'8px 14px' }}>
                    View Full Report →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
