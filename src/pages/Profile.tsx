import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Profile: React.FC = () => {
  const { user, emailVerified } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    examType: '',
    examCity: '',
    examDate: '',
    examCenterAddress: '',
    hotelPriceRange: '',
    additionalInfo: '',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${BACKEND}/api/students/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const st = res.data?.student || {};
        if (mounted) {
          setForm({
            name: st.name || '',
            phone: st.phone || '',
            examType: st.examType || '',
            examCity: st.examCity || '',
            examDate: st.examDate || '',
            examCenterAddress: st.examCenterAddress || '',
            hotelPriceRange: st.hotelPriceRange || '',
            additionalInfo: st.additionalInfo || '',
          });
        }
      } catch (e:any) {
        toast.error(e?.response?.data?.error || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  if (!user) return null;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>{ if(v !== undefined && v !== null) fd.append(k, String(v)); });
      fd.append('uid', user.uid);
      fd.append('email', user.email||'');
      const res = await axios.post(`${BACKEND}/api/students/signup`, fd);
      if (res.data?.ok) {
        toast.success('Profile updated');
        setEditing(false);
      }
    } catch (e:any) {
      toast.error(e?.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-semibold mb-2">My Profile</h1>
          <div className="mb-6 text-sm text-slate-600 flex items-center gap-2">
            <span>Signed in as <strong>{user.email}</strong></span>
            {emailVerified ? (<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-200">Not verified</span>
            )}
          </div>

          {loading ? (
            <div className="text-slate-500">Loading…</div>
          ) : (
            <form onSubmit={onSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exam Type</label>
                  <input disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Exam Type" value={form.examType} onChange={e=>setForm({...form, examType:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date</label>
                  <input type="date" disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Exam Date" value={form.examDate} onChange={e=>setForm({...form, examDate:e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam City</label>
                <input disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Exam City" value={form.examCity} onChange={e=>setForm({...form, examCity:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Center Address</label>
                <input disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Exam Center Address" value={form.examCenterAddress} onChange={e=>setForm({...form, examCenterAddress:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Preference</label>
                <input disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Hotel Preference" value={form.hotelPriceRange} onChange={e=>setForm({...form, hotelPriceRange:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Info</label>
                <textarea disabled={!editing} className="w-full px-4 py-3 border rounded-lg disabled:bg-slate-100" placeholder="Additional Info" value={form.additionalInfo} onChange={e=>setForm({...form, additionalInfo:e.target.value})} />
              </div>

              <div className="flex items-center gap-3 pt-2">
                {!editing ? (
                  <button type="button" onClick={()=>setEditing(true)} className="px-5 py-3 rounded-lg border border-slate-300">Edit</button>
                ) : (
                  <>
                    <button type="button" onClick={()=>{ setEditing(false); /* reload to discard changes */ window.location.reload(); }} className="px-5 py-3 rounded-lg border border-slate-300">Cancel</button>
                    <button disabled={saving} className="bg-emerald-600 text-white px-6 py-3 rounded-lg">{saving?'Saving…':'Save changes'}</button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
