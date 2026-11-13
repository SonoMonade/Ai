import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { X, Search, UserPlus, Download, CheckCircle2, Minus, Plus, Edit3, Trash2, Save, Phone, Mail } from 'lucide-react';

interface RosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  onUpdateStudentLessons: (email: string, delta: number) => void;
  onAddStudentManual: (student: StudentProfile) => void;
  onEditStudent: (originalEmail: string, student: StudentProfile) => void;
  onDeleteStudent: (email: string) => void;
}

export const RosterModal: React.FC<RosterModalProps> = ({
  isOpen,
  onClose,
  students,
  onUpdateStudentLessons,
  onAddStudentManual,
  onEditStudent,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);

  // Form state for adding/editing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.phone || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartAdd = () => {
    setEditingEmail(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setShowAddForm(true);
  };

  const handleStartEdit = (st: StudentProfile) => {
    setEditingEmail(st.email);
    setFirstName(st.firstName);
    setLastName(st.lastName);
    setEmail(st.email);
    setPhone(st.phone || '');
    setShowAddForm(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanFirst || !cleanLast || !cleanEmail || !cleanEmail.includes('@')) return;

    if (editingEmail) {
      // Edit existing
      const existing = students.find(s => s.email.toLowerCase() === editingEmail.toLowerCase());
      const updated: StudentProfile = {
        ...(existing || {
          completedLessons: 0,
          confirmationSent: true,
          enrolledAt: new Date().toISOString()
        }),
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
        lastAccess: new Date().toISOString()
      };
      onEditStudent(editingEmail, updated);
    } else {
      // Add new
      onAddStudentManual({
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        phone: cleanPhone,
        completedLessons: 0,
        confirmationSent: true,
        confirmationSentAt: new Date().toISOString(),
        enrolledAt: new Date().toISOString(),
        lastAccess: new Date().toISOString()
      });
    }

    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setShowAddForm(false);
    setEditingEmail(null);
  };

  const handleExportCsv = () => {
    const headers = "Cognome,Nome,Email,Telefono,LezioniCompletate,StatoConferma,DataIscrizione\n";
    const rows = students.map(s =>
      `"${s.lastName}","${s.firstName}","${s.email}","${s.phone || ''}",${s.completedLessons},"Confermata","${s.enrolledAt.slice(0, 10)}"`
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
      <div className="bg-white border border-[#1A1A1A] max-w-4xl w-full p-6 rounded-sm shadow-xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
              Monitoraggio Classe • Docente
            </span>
            <h3 className="font-serif text-xl font-bold text-[#C85A32]">
              Registro Studenti & Schede Anagrafiche ({students.length})
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
              placeholder="Cerca per nome, email o telefono..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7F5F0] border border-[#1A1A1A]/20 rounded-sm text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1B4D5C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (showAddForm) {
                  setShowAddForm(false);
                } else {
                  handleStartAdd();
                }
              }}
              className="px-3 py-1.5 bg-[#1B4D5C] hover:bg-[#123540] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Chiudi Modulo' : 'Nuovo Studente'}</span>
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

        {/* Add / Edit Student Form with Salva button */}
        {showAddForm && (
          <form onSubmit={handleSaveStudent} className="p-4 bg-[#F7F5F0] border border-[#1A1A1A]/20 rounded-sm mb-3 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#6E473B] uppercase tracking-wider text-[11px]">
                {editingEmail ? `Modifica Scheda Studente: ${editingEmail}` : 'Inserisci Nuovo Studente'}
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-[#6E473B] hover:text-[#1A1A1A]"
              >
                ✕ Annulla
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Es. Giulia"
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
                  placeholder="Es. Bianchi"
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
                  placeholder="giulia@esempio.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#6E473B] mb-1">Telefono</label>
                <input
                  type="tel"
                  placeholder="+39 333 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded-sm font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-[#1A1A1A]/10">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 border border-[#1A1A1A]/20 rounded-sm hover:bg-[#EFECE6] font-semibold"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#246A4E] hover:bg-[#1b503b] text-white font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salva Scheda</span>
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
                <th className="p-2.5">Contatti (Email & Tel)</th>
                <th className="p-2.5 text-center">Progresso Incontri</th>
                <th className="p-2.5 text-center">Aggiorna Incontri</th>
                <th className="p-2.5 text-center">Azioni Scheda</th>
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
                      <div className="text-sm font-serif text-[#1B4D5C]">
                        {st.lastName} {st.firstName}
                      </div>
                      <span className="text-[10px] text-[#6E473B] font-normal">
                        Iscritto il {st.enrolledAt.slice(0, 10)}
                      </span>
                    </td>
                    <td className="p-2.5 space-y-0.5">
                      <div className="flex items-center gap-1 text-[#1A1A1A] font-mono text-[11px]">
                        <Mail className="w-3 h-3 text-[#6E473B]" />
                        <span>{st.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6E473B] font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-[#C85A32]" />
                        <span>{st.phone || 'Nessun telefono'}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-center font-bold text-[#1B4D5C]">
                      <span className="bg-[#1B4D5C]/10 px-2 py-0.5 rounded-sm">
                        {st.completedLessons} / 10
                      </span>
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
                    <td className="p-2.5 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(st)}
                          title="Modifica scheda studente"
                          className="p-1 bg-[#EFECE6] hover:bg-[#1B4D5C] hover:text-white text-[#1B4D5C] rounded-xs transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Sei sicuro di voler eliminare lo studente ${st.lastName} ${st.firstName}?`)) {
                              onDeleteStudent(st.email);
                            }
                          }}
                          title="Elimina studente"
                          className="p-1 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xs transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
            Totale iscritti nel registro: <strong>{students.length}</strong>
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
