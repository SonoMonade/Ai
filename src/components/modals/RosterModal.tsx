import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { X, Search, UserPlus, Download, CheckCircle2, Minus, Plus, Mail } from 'lucide-react';

interface RosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  onUpdateStudentLessons: (email: string, delta: number) => void;
  onAddStudentManual: (student: StudentProfile) => void;
}

export const RosterModal: React.FC<RosterModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudentLessons,
  onAddStudentManual
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (!isOpen) return null;

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirst.trim() || !newLast.trim() || !newEmail.trim() || !newEmail.includes('@')) return;

    onAddStudentManual({
      firstName: newFirst.trim(),
      lastName: newLast.trim(),
      email: newEmail.trim().toLowerCase(),
      completedLessons: 0,
      confirmationSent: true,
      confirmationSentAt: new Date().toISOString(),
      enrolledAt: new Date().toISOString(),
      lastAccess: new Date().toISOString()
    });

    setNewFirst('');
    setNewLast('');
    setNewEmail('');
    setShowAddForm(false);
  };

  const handleExportCsv = () => {
    const headers = "Cognome,Nome,Email,LezioniCompletate,StatoConferma,DataIscrizione\n";
    const rows = students.map(s =>
      `"${s.lastName}","${s.firstName}","${s.email}",${s.completedLessons},"Confermata","${s.enrolledAt.slice(0, 10)}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registro-studenti-corso-ai-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] max-w-3xl w-full p-6 rounded-sm shadow-xl max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
              Monitoraggio Classe • Docente
            </span>
            <h3 className="font-serif text-xl font-bold text-[#C85A32]">
              Registro Studenti & Conferme Email ({students.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Add Student, Export CSV */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E473B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca studente per nome o email..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7F5F0] border border-[#1A1A1A]/20 rounded-sm text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1B4D5C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-[#1B4D5C] hover:bg-[#123540] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Chiudi' : 'Nuovo Studente'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors border border-[#1A1A1A]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Add Student Quick Form */}
        {showAddForm && (
          <form onSubmit={handleCreateStudent} className="p-3 bg-[#F7F5F0] border border-[#1A1A1A]/20 rounded-sm mb-3 space-y-2 text-xs">
            <span className="font-bold text-[#6E473B] block uppercase text-[10px]">
              Iscrivi manualmente uno studente
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Nome"
                value={newFirst}
                onChange={(e) => setNewFirst(e.target.value)}
                className="bg-white border border-[#1A1A1A]/20 px-2 py-1.5 rounded-sm"
              />
              <input
                type="text"
                required
                placeholder="Cognome"
                value={newLast}
                onChange={(e) => setNewLast(e.target.value)}
                className="bg-white border border-[#1A1A1A]/20 px-2 py-1.5 rounded-sm"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-white border border-[#1A1A1A]/20 px-2 py-1.5 rounded-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 border border-[#1A1A1A]/20 rounded-sm hover:bg-[#EFECE6]"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-[#246A4E] text-white font-bold rounded-sm hover:bg-[#1b503b]"
              >
                Aggiungi Studente
              </button>
            </div>
          </form>
        )}

        {/* Roster Table */}
        <div className="overflow-y-auto flex-1 border border-[#1A1A1A]/20 rounded-sm custom-scroll">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#EFECE6] text-[#6E473B] uppercase tracking-wider border-b border-[#1A1A1A]/15 sticky top-0">
              <tr>
                <th className="p-2.5">Studente</th>
                <th className="p-2.5">Email</th>
                <th className="p-2.5 text-center">Stato Ricevuta</th>
                <th className="p-2.5 text-center">Progresso Incontri</th>
                <th className="p-2.5 text-center">Aggiorna</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/10 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[#6E473B] italic">
                    Nessuno studente corrisponde ai criteri di ricerca.
                  </td>
                </tr>
              ) : (
                filtered.map((st) => (
                  <tr key={st.email} className="hover:bg-[#F7F5F0]/60 transition-colors">
                    <td className="p-2.5 font-bold text-[#1A1A1A]">
                      {st.lastName} {st.firstName}
                    </td>
                    <td className="p-2.5 text-[#6E473B] font-mono text-[11px]">
                      {st.email}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#246A4E]/15 text-[#246A4E] font-bold rounded-xs text-[10px] uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confermata</span>
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-[#1B4D5C]">
                      {st.completedLessons} / 10
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStudentLessons(st.email, -1)}
                          disabled={st.completedLessons <= 0}
                          title="Diminuisci incontro completato"
                          className="w-5 h-5 bg-[#EFECE6] hover:bg-[#1A1A1A] hover:text-white rounded-xs text-xs font-bold transition-colors disabled:opacity-30 cursor-pointer flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onUpdateStudentLessons(st.email, 1)}
                          disabled={st.completedLessons >= 10}
                          title="Aggiungi incontro completato"
                          className="w-5 h-5 bg-[#1B4D5C] hover:bg-[#123540] text-white rounded-xs text-xs font-bold transition-colors disabled:opacity-30 cursor-pointer flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1A1A1A]/10">
          <span className="text-[11px] text-[#6E473B]">
            Totale iscritti: <strong>{students.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] cursor-pointer"
          >
            Chiudi Registro
          </button>
        </div>

      </div>
    </div>
  );
};
