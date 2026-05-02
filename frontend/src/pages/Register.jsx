import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from '../components/Toast';

export default function Register() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast('All fields are required.', 'error'); return; }
    if (password.length < 6) { toast('Password must be at least 6 characters.', 'error'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast('Account created! ✨');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.error || 'Registration failed.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', background:'#FDF8F5', display:'flex',
      alignItems:'center', justifyContent:'center', padding:24, position:'relative',
    }}>
      <ToastContainer />
      <div style={{ position:'fixed', top:0, left:0, width:450, height:450, borderRadius:'50%', background:'rgba(242,192,192,0.22)', filter:'blur(80px)', pointerEvents:'none' }} />

      <div className="card" style={{ width:'100%', maxWidth:420, padding:40, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#C9607B' }} />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700 }}>DermAI</span>
        </div>

        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, marginBottom:6 }}>Create account</h2>
        <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>Start your personalised skin journey today</p>

        <form onSubmit={submit}>
          <div className="field">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 6 characters" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width:'100%', justifyContent:'center', padding:'14px', marginTop:8 }}>
            {loading ? <><span className="spinner" style={{ borderColor:'#fff' }} /> Creating…</> : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--rose)', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
