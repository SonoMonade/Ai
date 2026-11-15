import React from 'react';
import { UserRole, StudentProfile } from '../types';
import {
  Users,
  Settings,
  Download,
  Plus,
  LogOut,
  Sparkles,
  Minus,
  Check,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  isEditorMode: boolean;
  onSetEditorMode: (isEditor: boolean) => void;
  currentStudent: StudentProfile | null;
  onUpdateCompletedLessons: (delta: number) => void;
  onOpenRosterModal: () => void;
  onOpenEmailConfigModal: () => void;
  onOpenAddCardModal: () => void;
  onExportJson: () => void;
  onOpenLoginGateway: () => void;
  onOpenStudentProfile: () => void;
  rosterCount: number;
  syncConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  onSwitchRole,
  isEditorMode,
  onSetEditorMode,
  currentStudent,
  onUpdateCompletedLessons,
  onOpenRosterModal,
  onOpenEmailConfigModal,
  onOpenAddCardModal,
  onExportJson,
  onOpenLoginGateway,
  onOpenStudentProfile,
  rosterCount,
  syncConnected
}) => {
  return (
    <header className="bg-white border-b-2 border-[#1A1A1A]/20 sticky top-0 z-30 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4">
        
        {/* Left Branding Block */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#1B4D5C] text-white flex items-center justify-center rounded-sm shrink-0 font-serif font-bold text-lg mt-0.5 shadow-sm">
            AI
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Corso Base • LSA Centocelle
              </span>
              <span className="text-[#1A1A1A]/30">·</span>
              <div className="inline-flex items-center gap-1.5 text-[10px]">
                <span className={`w-2 h-2 rounded-full ${syncConnected ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`} />
                <span className="font-bold text-[#1A1A1A]/80">
                  {syncConnected ? 'Sincronizzato' : 'Archivio Locale'}
                </span>
              </div>
            </div>
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#C85A32] leading-tight">
              Capire e Usare l'Intelligenza Artificiale
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#6E473B] mt-0.5 hidden sm:block">
              Guida semplice e pratica per imparare da zero, senza parole difficili
            </p>
          </div>
        </div>

        {/* Center-Right Block: Role switcher & tools */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          
          {/* Instant Role Switcher Toggle */}
          <div className="inline-flex border border-[#1A1A1A]/30 rounded-sm overflow-hidden text-xs shrink-0 self-start sm:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => onSwitchRole('student')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                userRole === 'student'
                  ? 'bg-[#1B4D5C] text-white'
                  : 'bg-[#EFECE6] text-[#6E473B] hover:text-[#1A1A1A] hover:bg-black/5'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Studente</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('admin')}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider border-l border-[#1A1A1A]/20 transition-colors flex items-center gap-1.5 cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-[#1B4D5C] text-white'
                  : 'bg-[#EFECE6] text-[#6E473B] hover:text-[#1A1A1A] hover:bg-black/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Docente</span>
            </button>
          </div>

          {/* Student Profile Info (when student mode) */}
          {userRole === 'student' && currentStudent && (() => {
            const totalEncounters = 10;
            const pct = Math.min(100, Math.max(0, Math.round((currentStudent.completedLessons / totalEncounters) * 100)));
            const radius = 10;
            const circum = 2 * Math.PI * radius;
            const offset = circum - (pct / 100) * circum;
            const ringColor = pct === 100 ? '#246A4E' : pct >= 50 ? '#1B4D5C' : '#C85A32';

            return (
              <div className="bg-[#F7F5F0] border border-[#1A1A1A]/25 rounded-sm px-2.5 py-1 flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0" title={`Completamento: ${pct}%`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" className="transform -rotate-90">
                    <circle cx="12" cy="12" r={radius} fill="none" stroke="#EFECE6" strokeWidth="2.5" />
                    <circle
                      cx="12"
                      cy="12"
                      r={radius}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="2.5"
                      strokeDasharray={circum}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#1A1A1A]">
                    {pct}%
                  </span>
                </div>

                <div className="text-left min-w-0">
                  <span className="text-xs font-bold text-[#1A1A1A] block truncate max-w-[120px]">
                    {currentStudent.firstName} {currentStudent.lastName}
                  </span>
                  <span className="text-[10px] text-[#6E473B] block">
                    {currentStudent.completedLessons}/{totalEncounters} incontri
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Teacher Mode Editor Toggles (when in admin) */}
          {userRole === 'admin' && (
            <div className="inline-flex border border-[#1A1A1A]/25 rounded-sm overflow-hidden text-[11px] shrink-0">
              <button
                type="button"
                onClick={() => onSetEditorMode(false)}
                className={`px-2.5 py-1 font-bold uppercase transition-colors cursor-pointer ${
                  !isEditorMode ? 'bg-[#1B4D5C] text-white' : 'bg-[#EFECE6] text-[#1A1A1A]'
                }`}
              >
                Anteprima
              </button>
              <button
                type="button"
                onClick={() => onSetEditorMode(true)}
                className={`px-2.5 py-1 font-bold uppercase border-l border-[#1A1A1A]/20 transition-colors cursor-pointer ${
                  isEditorMode ? 'bg-[#1B4D5C] text-white' : 'bg-[#EFECE6] text-[#1A1A1A]'
                }`}
              >
                Modifica
              </button>
            </div>
          )}

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Admin Roster */}
            {userRole === 'admin' && (
              <button
                onClick={onOpenRosterModal}
                className="px-2.5 py-1.5 bg-white hover:bg-[#EFECE6] text-[#1B4D5C] border border-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Studenti ({rosterCount})</span>
              </button>
            )}

            {/* Email Config (Admin) */}
            {userRole === 'admin' && isEditorMode && (
              <button
                onClick={onOpenEmailConfigModal}
                title="Configura invio automatico email"
                className="px-2 py-1.5 bg-white hover:bg-[#EFECE6] text-[#6E473B] border border-[#1A1A1A] text-xs font-bold uppercase rounded-sm transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Add Card (Admin) */}
            {userRole === 'admin' && isEditorMode && (
              <button
                onClick={onOpenAddCardModal}
                className="px-3 py-1.5 bg-[#C85A32] hover:bg-[#b04b25] text-white border border-[#1A1A1A] text-xs font-bold uppercase rounded-sm transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Scheda</span>
              </button>
            )}

            {/* Student Profile Button (Read-only view for student) */}
            {userRole === 'student' && currentStudent && (
              <button
                onClick={onOpenStudentProfile}
                title="Visualizza la tua scheda studente personale"
                className="px-2.5 py-1.5 bg-white hover:bg-[#F7F5F0] text-[#1B4D5C] border border-[#1B4D5C] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#C85A32]" />
                <span className="hidden sm:inline">Scheda Personale</span>
              </button>
            )}

            {/* Export JSON */}
            <button
              onClick={onExportJson}
              title="Scarica programma e appunti in JSON"
              className="px-2.5 py-1.5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] border border-[#1A1A1A] text-xs font-bold uppercase rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            {/* Login / Switch Account */}
            <button
              onClick={onOpenLoginGateway}
              title="Accedi o cambia profilo studente/docente"
              className="px-2.5 py-1.5 bg-white hover:bg-[#EFECE6] text-[#6E473B] hover:text-[#1A1A1A] border border-[#1A1A1A]/30 text-xs font-bold uppercase rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Accedi</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
