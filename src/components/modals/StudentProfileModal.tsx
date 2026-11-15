import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { X, GraduationCap, Mail, Phone, Calendar, CheckCircle2, Save, Edit3 } from 'lucide-react';
import { COURSE_UNITS, TOTAL_ENCOUNTERS } from '../../data/courseData';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  isReadOnly: boolean;
  onSaveStudent?: (updated: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  isReadOnly,
  onSaveStudent
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(student?.firstName || '');
  const [lastName, setLastName] = useState(student?.lastName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');

  if (!isOpen || !student) return null;

  const completedEncounters = student.completedEncounters || Array.from({ length: student.completedLessons }, (_, i) => i + 1);
  const pct = Math.min(100, Math.max(0, Math.round((completedEncounters.length / TOTAL_ENCOUNTERS) * 100)));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveStudent) return;
    const updated: StudentProfile = {
      ...student,
      firstName: firstName.trim() || student.firstName,
      lastName: lastName.trim() || student.lastName,
      email: email.trim().toLowerCase() || student.email,
      phone: phone.trim()
    };
    onSaveStudent(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] max-w-xl w-full p-6 rounded-sm shadow-xl max-h-[90vh] overflow-y-auto custom-scroll">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#1B4D5C] text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#F6E8B1]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                {isReadOnly ? 'Scheda Personale Studente' : 'Scheda Studente • Vista Admin'}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#C85A32]">
                {student.lastName} {student.firstName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Toggle for Admin */}
        {!isReadOnly && !isEditing && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => {
                setFirstName(student.firstName);
                setLastName(student.lastName);
                setEmail(student.email);
                setPhone(student.phone || '');
                setIsEditing(true);
              }}
              className="px-3 py-1 bg-[#EFECE6] hover:bg-[#1B4D5C] hover:text-white text-[#1A1A1A] text-xs font-bold uppercase rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modifica Scheda</span>
            </button>
          </div>
        )}

        {/* Editing Form for Admin */}
        {!isReadOnly && isEditing ? (
          <form onSubmit={handleSave} className="p-4 bg-[#F7F5F0] border border-[#1A1A1A]/20 rounded-sm mb-4 space-y-3 text-xs">
            <span className="font-bold text-[#6E473B] uppercase tracking-wider text-[10px] block">
              Modifica informazioni anagrafiche dello studente
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Cognome *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Telefono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm font-mono text-[11px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#1A1A1A]/10">
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
                <span>Salva</span>
              </button>
            </div>
          </form>
        ) : (
          /* Student Info Card */
          <div className="space-y-4 text-xs text-[#1A1A1A]">
            
            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F7F5F0] border border-[#1A1A1A]/15 rounded-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B] block">
                  Indirizzo Email
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[#1B4D5C]">
                  <Mail className="w-3.5 h-3.5 text-[#6E473B]" />
                  <span>{student.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B] block">
                  Numero di Telefono
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[#C85A32]">
                  <Phone className="w-3.5 h-3.5 text-[#6E473B]" />
                  <span>{student.phone || 'Non specificato'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B] block">
                  Data Iscrizione
                </span>
                <div className="flex items-center gap-1.5 text-[#1A1A1A]">
                  <Calendar className="w-3.5 h-3.5 text-[#6E473B]" />
                  <span>{student.enrolledAt ? student.enrolledAt.slice(0, 10) : '2026-11-12'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B] block">
                  Stato Registrazione
                </span>
                <div className="flex items-center gap-1.5 font-bold text-[#246A4E]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Iscrizione Confermata</span>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="p-4 bg-white border border-[#1A1A1A]/15 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#1B4D5C]">
                  Avanzamento del Corso (10 Incontri)
                </span>
                <span className="font-bold text-xs bg-[#1B4D5C]/10 text-[#1B4D5C] px-2.5 py-0.5 rounded-sm">
                  {completedEncounters.length} / {TOTAL_ENCOUNTERS} completati ({pct}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#EFECE6] rounded-xs overflow-hidden border border-[#1A1A1A]/15">
                <div
                  className="h-full bg-[#246A4E] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Modules breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#1A1A1A]/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B] block">
                  Dettaglio Moduli
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COURSE_UNITS.map(u => {
                    const modDone = u.sections.filter(s => completedEncounters.includes(s.encounterNumber)).length;
                    const isModComplete = modDone === u.sections.length;

                    return (
                      <div key={u.id} className="p-2 bg-[#F7F5F0] border border-[#1A1A1A]/10 rounded-sm flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#C85A32] block">
                            M{u.unitNumber} • {u.title}
                          </span>
                          <span className="text-[10px] text-[#6E473B]">
                            {modDone} di {u.sections.length} incontri
                          </span>
                        </div>
                        {isModComplete ? (
                          <span className="text-[10px] bg-[#246A4E]/15 text-[#246A4E] font-bold px-1.5 py-0.5 rounded-xs">
                            Completato
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#1B4D5C]/10 text-[#1B4D5C] font-bold px-1.5 py-0.5 rounded-xs">
                            In corso
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-5 pt-3 border-t border-[#1A1A1A]/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] cursor-pointer"
          >
            Chiudi Scheda
          </button>
        </div>

      </div>
    </div>
  );
};
