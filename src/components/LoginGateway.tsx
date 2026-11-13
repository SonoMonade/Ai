import React, { useState } from 'react';
import { UserRole, StudentProfile } from '../types';
import { GraduationCap, ShieldCheck, Mail, User, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginGatewayProps {
  onLoginStudent: (student: StudentProfile) => void;
  onLoginAdmin: () => void;
  syncConnected: boolean;
  registeredStudents: StudentProfile[];
  onClose?: () => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLoginStudent,
  onLoginAdmin,
  syncConnected,
  registeredStudents,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFirst || !cleanLast || !cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Inserisci un nome, un cognome e un indirizzo email valido.');
      return;
    }

    const existing = registeredStudents.find(
      s => s.email.toLowerCase() === cleanEmail
    );

    const completedCount = existing ? Math.min(10, Math.max(0, existing.completedLessons)) : 1;
    const defaultEncounters = Array.from({ length: completedCount }, (_, i) => i + 1);

    const studentData: StudentProfile = {
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      completedLessons: completedCount,
      completedEncounters: existing?.completedEncounters && existing.completedEncounters.length > 0
        ? existing.completedEncounters
        : defaultEncounters,
      confirmationSent: true,
      confirmationSentAt: new Date().toISOString(),
      enrolledAt: existing ? existing.enrolledAt : new Date().toISOString(),
      lastAccess: new Date().toISOString()
    };

    onLoginStudent(studentData);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const user = adminUser.trim().toLowerCase();
    if ((user === 'admin' || user === 'docente2' || user === 'glr.angelini@gmail.com') && adminPass.length >= 6) {
      onLoginAdmin();
    } else {
      setErrorMsg('Credenziali docente non valide. Accesso riservato esclusivamente ai docenti autorizzati.');
    }
  };

  const quickFillStudent = (name: string, surname: string, mail: string) => {
    setFirstName(name);
    setLastName(surname);
    setEmail(mail);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F5F0]">
      <div className="max-w-xl w-full editorial-card rounded-sm overflow-hidden my-6 shadow-xl">
        {/* Header Gatekeeper */}
        <div className="bg-[#1B4D5C] text-white p-6 sm:p-7 border-b border-[#1A1A1A]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[#1B4D5C] flex items-center justify-center rounded-sm font-serif font-bold text-lg shadow-sm">
                AI
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F6E8B1] block">
                  Corso Base • LSA Centocelle
                </span>
                <span className="text-[11px] text-white/80">Edizione Autunno 2026</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] bg-[#123540]/80 px-2.5 py-1 rounded-sm border border-white/10">
                <span className={`w-2 h-2 rounded-full ${syncConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span className="font-semibold text-white/90">
                  {syncConnected ? 'Cloud Attivo' : 'Archivio Locale'}
                </span>
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-sm bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  aria-label="Chiudi finestra"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Capire e Usare l'Intelligenza Artificiale
          </h1>
          <p className="text-xs sm:text-sm text-white/85 mt-1.5">
            Aula digitale interattiva per studenti e docenti • Guida semplice passo dopo passo
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-2 border-b border-[#1A1A1A]/20 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setErrorMsg(''); }}
            className={`py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'student'
                ? 'bg-white text-[#1B4D5C] border-b-2 border-[#C85A32]'
                : 'bg-[#EFECE6] text-[#6E473B] hover:text-[#1A1A1A]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Studente</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`py-3.5 flex items-center justify-center gap-2 border-l border-[#1A1A1A]/15 transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-[#1B4D5C] border-b-2 border-[#C85A32]'
                : 'bg-[#EFECE6] text-[#6E473B] hover:text-[#1A1A1A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Docente / Admin</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-7 bg-white">
          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4 text-sm">
              <div className="bg-[#F7F5F0] border-l-2 border-[#1B4D5C] p-3.5 text-xs text-[#1A1A1A]/90 leading-relaxed">
                <strong>Accesso Studente:</strong> Inserisci Nome, Cognome ed Email per entrare subito nell'aula digitale e accedere alle lezioni del corso.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="student-fname" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E473B]/70" />
                    <input
                      id="student-fname"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Es. Giulia"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#1A1A1A]/25 bg-[#F7F5F0] rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="student-lname" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
                    Cognome
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E473B]/70" />
                    <input
                      id="student-lname"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Es. Bianchi"
                      className="w-full pl-9 pr-3 py-2.5 border border-[#1A1A1A]/25 bg-[#F7F5F0] rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="student-email" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
                  Indirizzo Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E473B]/70" />
                  <input
                    id="student-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="giulia.bianchi@esempio.it"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#1A1A1A]/25 bg-[#F7F5F0] rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-[#C85A32] font-semibold rounded-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#C85A32] hover:bg-[#b04b25] text-white border border-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Entra nell'Aula Studente</span>
              </button>

              {/* Quick test student button */}
              <div className="pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs text-[#6E473B]">
                <span>Vuoi provare subito come studente?</span>
                <button
                  type="button"
                  onClick={() => quickFillStudent('Marco', 'Rossi', 'marco.rossi@lsa.it')}
                  className="font-bold underline text-[#1B4D5C] hover:text-[#C85A32] cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Compila Demo</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-sm">
              <div className="bg-[#F7F5F0] border-l-2 border-[#C85A32] p-3.5 text-xs text-[#1A1A1A]/90 leading-relaxed">
                <strong>Area Riservata Docenti:</strong> accesso protetto riservato ai docenti autorizzati per la gestione del corso e del registro.
              </div>

              <div>
                <label htmlFor="admin-user" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
                  Identificativo Docente / Email
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E473B]/70" />
                  <input
                    id="admin-user"
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Inserisci identificativo docente"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#1A1A1A]/25 bg-[#F7F5F0] rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pass" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
                  Password Sicura
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E473B]/70" />
                  <input
                    id="admin-pass"
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#1A1A1A]/25 bg-[#F7F5F0] rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-[#C85A32] font-semibold rounded-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1B4D5C] hover:bg-[#123540] text-white border border-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Accedi come Docente Autorizzato</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
