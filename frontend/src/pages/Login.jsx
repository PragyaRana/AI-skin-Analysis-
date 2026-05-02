import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from '../components/Toast';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast('Please fill all fields.', 'error'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast('Welcome back! ✨');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.error || 'Login failed.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#FDF8F5', display:'flex',
      alignItems:'center', justifyContent:'center', padding:24, position:'relative',
    }}>
      <ToastContainer />
      {/* Background orbs */}
      <div style={{ position:'fixed', top:0, right:0, width:400, height:400, borderRadius:'50%', background:'rgba(242,192,192,0.25)', filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:0, left:0, width:300, height:300, borderRadius:'50%', background:'rgba(200,151,110,0.15)', filter:'blur(60px)', pointerEvents:'none' }} />

      <div className="card" style={{ width:'100%', maxWidth:420, padding:40, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#C9607B' }} />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700 }}>DermAI</span>
        </div>

        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, marginBottom:6 }}>Welcome back</h2>
        <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>Sign in to your skin analysis account</p>

        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position:'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:16 }}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'14px', marginTop:8 }}>
            {loading ? <><span className="spinner" style={{ borderColor:'#fff' }} /> Signing in…</> : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color:'var(--rose)', fontWeight:600, textDecoration:'none' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
