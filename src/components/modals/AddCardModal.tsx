import React, { useState, useEffect } from 'react';
import { CourseUnit } from '../../types';
import { X, Plus, Layers } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: CourseUnit[];
  activeUnitId: string;
  defaultColumn: '1' | '2' | '3';
  onAddCard: (card: {
    unitId: string;
    column: '1' | '2' | '3';
    title: string;
    description: string;
  }) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  units,
  activeUnitId,
  defaultColumn,
  onAddCard
}) => {
  const [unitId, setUnitId] = useState(activeUnitId);
  const [column, setColumn] = useState<'1' | '2' | '3'>(defaultColumn);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUnitId(activeUnitId);
      setColumn(defaultColumn);
    }
  }, [isOpen, activeUnitId, defaultColumn]);

  if (!isOpen) return null;

  const currentUnit = units.find(u => u.id === unitId) || units[0];
  const validColumn = Number(column) > currentUnit.sections.length ? '1' : column;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddCard({
      unitId,
      column: validColumn,
      title: title.trim(),
      description: description.trim()
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] max-w-md w-full p-6 rounded-sm shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C85A32]" />
            <h3 className="font-serif text-lg font-bold text-[#C85A32]">
              Aggiungi Scheda nell'Incontro
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label htmlFor="card-unit" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Scegli Modulo
            </label>
            <select
              id="card-unit"
              value={unitId}
              onChange={(e) => {
                setUnitId(e.target.value);
                setColumn('1');
              }}
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  Modulo {u.unitNumber}: {u.title} ({u.dateShort})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="card-col" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Scegli Incontro
            </label>
            <select
              id="card-col"
              value={validColumn}
              onChange={(e) => setColumn(e.target.value as '1' | '2' | '3')}
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            >
              {currentUnit.sections.map((sec, idx) => (
                <option key={sec.id} value={String(idx + 1)}>
                  {sec.number}: {sec.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="card-title" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Titolo della scheda
            </label>
            <input
              id="card-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Esercizio pratico in aula con prompt"
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label htmlFor="card-desc" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Testo didattico semplice
            </label>
            <textarea
              id="card-desc"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi l'esempio, la regola o l'attività da svolgere insieme..."
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#1A1A1A]/30 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#EFECE6] text-[#1A1A1A] cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Salva Scheda</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
