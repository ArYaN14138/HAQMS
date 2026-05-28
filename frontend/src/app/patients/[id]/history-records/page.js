'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/common/Navbar';
import { 
  ArrowLeft, FileText, Calendar, Clock, Activity, User, 
  Mail, Phone, ShieldAlert, Heart, CalendarDays, ClipboardList 
} from 'lucide-react';
import Link from 'next/link';

export default function PatientHistoryRecords() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, API_BASE_URL } = useAuth();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Authentication Navigation Guard
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve patient medical records profile.');
      }
      const data = await res.json();
      setPatient(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token && id) {
      fetchPatientDetails();
    }
  }, [id, user, token]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        
        {/* Back Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-300 group hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <span className="text-xxs font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase bg-slate-200/50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
            Diagnostic Records System
          </span>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="pulse-loader">
              <div></div>
              <div></div>
            </div>
            <p className="mt-6 text-sm font-semibold text-slate-400 animate-pulse">Retrieving diagnostic profile...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 space-y-4 max-w-xl mx-auto text-center shadow-lg">
            <ShieldAlert className="h-12 w-12 mx-auto animate-bounce" />
            <h3 className="font-extrabold text-lg">Failed to Retrieve Profile</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{error}</p>
            <button 
              onClick={fetchPatientDetails}
              className="px-5 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors shadow-md"
            >
              Retry Sync
            </button>
          </div>
        ) : !patient ? (
          <p className="text-center py-12 text-slate-400 text-sm">Patient profile not found.</p>
        ) : (
          <>
            {/* Patient Header Summary Profile Card */}
            <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
              <div className="absolute inset-0 bg-radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 80%) opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                {/* Big Initials Avatar */}
                <div className="h-16 w-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-md flex items-center justify-center text-2xl font-black shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-transparent"></div>
                  {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {patient.name}
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xxs font-extrabold uppercase tracking-wide border border-teal-500/20 shadow-sm">
                      Active patient
                    </span>
                  </h1>
                  
                  {/* Demographics row */}
                  <div className="flex flex-wrap gap-2 text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <User className="h-3 w-3 text-teal-600" />
                      {patient.age} years
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 capitalize">
                      <Heart className="h-3 w-3 text-teal-600" />
                      {patient.gender}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <CalendarDays className="h-3 w-3 text-teal-600" />
                      Registered: {new Date(patient.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Quick Contact Cards */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex-1 md:flex-none">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest">Phone Number</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{patient.phoneNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex-1 md:flex-none">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest">Email Address</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{patient.email || 'None Provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout: History detail and logs */}
            <div className="grid gap-8 lg:grid-cols-3">
              
              {/* Left Column: Clinical history card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden flex flex-col h-full hover:shadow-teal-500/5 transition-all duration-300">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-teal-600 shrink-0" />
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                      Clinical Background
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex-1">
                    <span className="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">
                      Medical Anamnesis / History
                    </span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-6 whitespace-pre-line">
                      {patient.medicalHistory || 'No medical history or pre-existing clinical conditions recorded in the active directory system.'}
                    </p>
                  </div>

                  {/* Summary Metric Widgets */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                      <span className="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest">Appointments</span>
                      <span className="block text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                        {patient.appointments?.length || 0}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                      <span className="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest">Queue Check-ins</span>
                      <span className="block text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
                        {patient.queueTokens?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic timeline logs */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Scheduled consultations timeline */}
                <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <Calendar className="h-5 w-5 text-teal-600 shrink-0" />
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                      Clinical Consultation Timeline
                    </h3>
                  </div>

                  {(!patient.appointments || patient.appointments.length === 0) ? (
                    <div className="p-8 text-center bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <ClipboardList className="h-8 w-8 text-slate-400 mx-auto animate-bounce" />
                      <p className="mt-2 text-slate-400 text-xs font-semibold">No appointments scheduled in the logs history.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {patient.appointments.map((app) => (
                        <div 
                          key={app.id} 
                          className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 hover:border-teal-500/30 hover:bg-slate-500/10 transition-all duration-300"
                        >
                          <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                            App
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                {app.doctor ? app.doctor.name : 'Unassigned Practitioner'}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-xxs font-extrabold uppercase tracking-wider border ${
                                app.status === 'COMPLETED' 
                                  ? 'bg-teal-500/10 text-teal-600 border-teal-500/25' 
                                  : app.status === 'CANCELLED' 
                                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/25' 
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                              <span className="font-bold text-teal-600 dark:text-teal-400">{app.doctor?.specialization}</span>
                              • Reason: {app.reason || 'Routine diagnostic review'}
                            </p>
                            
                            <p className="text-xxs text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(app.appointmentDate).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Queue monitoring log */}
                <div className="glass p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <Activity className="h-5 w-5 text-teal-600 shrink-0" />
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
                      Check-in Queue Monitor Logs
                    </h3>
                  </div>

                  {(!patient.queueTokens || patient.queueTokens.length === 0) ? (
                    <div className="p-8 text-center bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Clock className="h-8 w-8 text-slate-400 mx-auto animate-bounce" />
                      <p className="mt-2 text-slate-400 text-xs font-semibold">No direct queue check-in sessions recorded today.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {patient.queueTokens.map((token) => (
                        <div 
                          key={token.id} 
                          className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 hover:border-teal-500/30 hover:bg-slate-500/10 transition-all duration-300"
                        >
                          <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 shrink-0 flex flex-col items-center justify-center">
                            <span className="text-xxs font-extrabold tracking-wide uppercase text-slate-400">Token</span>
                            <span className="text-sm font-black -mt-0.5">#{token.tokenNumber}</span>
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                Assigned: {token.doctor ? token.doctor.name : 'Unknown Practitioner'}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-xxs font-extrabold uppercase tracking-wider border ${
                                token.status === 'CALLING' 
                                  ? 'bg-teal-500 text-white border-teal-600 animate-pulse' 
                                  : token.status === 'COMPLETED' 
                                    ? 'bg-teal-500/10 text-teal-600 border-teal-500/25' 
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                              }`}>
                                {token.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                              Practitioner Spec: <span className="font-bold text-teal-600 dark:text-teal-400">{token.doctor?.specialization}</span>
                            </p>

                            <p className="text-xxs text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Checked-in: {new Date(token.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}
