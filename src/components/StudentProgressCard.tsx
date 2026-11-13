import React, { useState } from 'react';
import { CourseUnit, StudentProfile } from '../types';
import { TOTAL_ENCOUNTERS } from '../data/courseData';
import { CheckCircle2, Check, User, Mail, Phone, Edit3, Save, GraduationCap } from 'lucide-react';

interface StudentProgressCardProps {
  completedEncounters: number[];
  units: CourseUnit[];
  activeUnitId: string;
  onSelectUnit: (unitId: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onToggleEncounter: (encounterNumber: number) => void;
  currentStudent: StudentProfile | null;
  onUpdateStudentProfile?: (updated: StudentProfile) => void;
}

export const StudentProgressCard: React.FC<StudentProgressCardProps> = ({
  completedEncounters,
  units,
  activeUnitId,
  onSelectUnit,
  onScrollToSection,
  onToggleEncounter,
  currentStudent,
  onUpdateStudentProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFirst, setEditFirst] = useState(currentStudent?.firstName || '');
  const [editLast, setEditLast] = useState(currentStudent?.lastName || '');
  const [editEmail, setEditEmail] = useState(currentStudent?.email || '');
  const [editPhone, setEditPhone] = useState(currentStudent?.phone || '');
  const [saveNotice, setSaveNotice] = useState(false);

  const completedCount = completedEncounters.length;
  const percentage = Math.min(100, Math.max(0, Math.round((completedCount / TOTAL_ENCOUNTERS) * 100)));

  // SVG Circular Gauge parameters
  const size = 56;
  const strokeWidth = 5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let statusText = "Inizio percorso";
  let ringColor = "#C85A32";
  let statusClass = "text-[#C85A32] bg-[#C85A32]/10";

  if (percentage === 100) {
    statusText = "Corso completato!";
    ringColor = "#246A4E";
    statusClass = "text-[#246A4E] bg-[#246A4E]/15";
  } else if (percentage >= 80) {
    statusText = "Modulo finale";
    ringColor = "#246A4E";
    statusClass = "text-[#246A4E] bg-[#246A4E]/15";
  } else if (percentage >= 50) {
    statusText = "Oltre la metà";
    ringColor = "#1B4D5C";
    statusClass = "text-[#1B4D5C] bg-[#1B4D5C]/10";
  } else if (percentage >= 10) {
    statusText = "Progresso attivo";
    ringColor = "#C85A32";
    statusClass = "text-[#C85A32] bg-[#C85A32]/10";
  }

  const allEncounters = units.flatMap(u =>
    u.sections.map(sec => ({
      unitId: u.id,
      unitNumber: u.unitNumber,
      sectionId: sec.id,
      encounterNumber: sec.encounterNumber,
      title: sec.title
    }))
  );

  const nextEncounter =
    allEncounters.find(e => !completedEncounters.includes(e.encounterNumber)) ||
    allEncounters[allEncounters.length - 1];

  const isAllDone = completedCount === TOTAL_ENCOUNTERS;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !onUpdateStudentProfile) return;
    const updated: StudentProfile = {
      ...currentStudent,
      firstName: editFirst.trim() || currentStudent.firstName,
      lastName: editLast.trim() || currentStudent.lastName,
      email: editEmail.trim().toLowerCase() || currentStudent.email,
      phone: editPhone.trim()
    };
    onUpdateStudentProfile(updated);
    setIsEditing(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  return (
    <div className="editorial-card rounded-sm p-4 bg-white space-y-4">
      
      {/* Top Bar: Scheda Studente Profile Header & Edit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1A1A1A]/15 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#1B4D5C] text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-[#F6E8B1]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Scheda Studente Personale
              </span>
              {saveNotice && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-xs">
                  ✓ Salvato con successo!
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              {currentStudent ? `${currentStudent.lastName} ${currentStudent.firstName}` : 'Studente Corso'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 text-xs text-[#6E473B] font-mono">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#1B4D5C]" />
              {currentStudent?.email || 'email@esempio.it'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#C85A32]" />
              {currentStudent?.phone || 'Nessun telefono'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (currentStudent) {
                setEditFirst(currentStudent.firstName);
                setEditLast(currentStudent.lastName);
                setEditEmail(currentStudent.email);
                setEditPhone(currentStudent.phone || '');
              }
              setIsEditing(!isEditing);
            }}
            className="px-2.5 py-1 bg-[#EFECE6] hover:bg-[#1B4D5C] hover:text-white text-[#1A1A1A] text-xs font-bold uppercase rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Chiudi' : 'Modifica Scheda'}</span>
          </button>
        </div>
      </div>

      {/* Editable Student Profile Form with Salva button */}
      {isEditing && currentStudent && onUpdateStudentProfile && (
        <form onSubmit={handleSaveProfile} className="p-3.5 bg-[#F7F5F0] border border-[#1A1A1A]/20 rounded-sm space-y-3 text-xs animate-fadeIn">
          <span className="font-bold text-[#6E473B] uppercase tracking-wider text-[10px] block">
            Aggiorna i tuoi dati anagrafici e di contatto
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Nome</label>
              <input
                type="text"
                required
                value={editFirst}
                onChange={(e) => setEditFirst(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Cognome</label>
              <input
                type="text"
                required
                value={editLast}
                onChange={(e) => setEditLast(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Email</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Telefono</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+39 333 1234567"
                className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm font-mono text-[11px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 border border-[#1A1A1A]/20 rounded-sm hover:bg-[#EFECE6] font-semibold"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#246A4E] hover:bg-[#1b503b] text-white font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salva Modifiche</span>
            </button>
          </div>
        </form>
      )}

      {/* Progress & Milestone Track */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        
        {/* Left: Circular gauge + Key metric */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
              aria-label={`Completamento corso: ${percentage}%`}
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#EFECE6"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-sm font-bold text-[#1A1A1A] leading-none tabular-nums">
                {percentage}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B]">
                Avanzamento Corso
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${statusClass}`}>
                {statusText}
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A] font-semibold tabular-nums">
              <span className="font-bold text-[#C85A32]">{completedCount}</span> su {TOTAL_ENCOUNTERS} incontri completati
            </p>
          </div>
        </div>

        {/* Center: 10-step Milestone Track (I1 .. I10) */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {allEncounters.map((enc) => {
              const isDone = completedEncounters.includes(enc.encounterNumber);
              const isInActiveUnit = activeUnitId === enc.unitId;

              return (
                <button
                  key={enc.encounterNumber}
                  type="button"
                  onClick={() => {
                    onSelectUnit(enc.unitId);
                    setTimeout(() => onScrollToSection(enc.sectionId), 60);
                  }}
                  title={`Incontro ${enc.encounterNumber} (Modulo ${enc.unitNumber}): ${enc.title}`}
                  className={`p-1.5 rounded-xs text-left transition-all cursor-pointer border ${
                    isDone
                      ? 'bg-[#246A4E]/10 border-[#246A4E]/40 text-[#246A4E]'
                      : isInActiveUnit
                      ? 'bg-[#1B4D5C]/10 border-[#1B4D5C] text-[#1B4D5C]'
                      : 'bg-[#F7F5F0] border-[#1A1A1A]/15 text-[#6E473B] hover:bg-[#EFECE6]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                    <span>I{enc.encounterNumber}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#246A4E] shrink-0" />
                    ) : (
                      <span className="text-[8px] opacity-70">M{enc.unitNumber}</span>
                    )}
                  </div>
                  <div className="w-full h-1 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isDone ? 'bg-[#246A4E]' : isInActiveUnit ? 'bg-[#1B4D5C]/60' : 'bg-transparent'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick toggle for next uncompleted encounter */}
        <div className="flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => onToggleEncounter(nextEncounter.encounterNumber)}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all border flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap ${
              isAllDone
                ? 'bg-[#246A4E] text-white border-[#246A4E] hover:bg-[#1d553e]'
                : 'bg-white text-[#1B4D5C] border-[#1B4D5C] hover:bg-[#1B4D5C] hover:text-white'
            }`}
          >
            {isAllDone ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tutti Completati</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Segna Inc. {nextEncounter.encounterNumber} Fatto</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
