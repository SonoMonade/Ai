import React, { useState } from 'react';
import { StudyFolder } from '../../types';
import { X, FolderPlus } from 'lucide-react';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: StudyFolder[];
  defaultFolderId?: string;
  onAddMaterial: (material: {
    folder: string;
    type: string;
    title: string;
    description?: string;
  }) => void;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  folders,
  defaultFolderId = 'M1',
  onAddMaterial
}) => {
  const [folder, setFolder] = useState(defaultFolderId);
  const [type, setType] = useState('Tavole / Slide');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (isOpen && defaultFolderId) {
      setFolder(defaultFolderId);
    }
  }, [isOpen, defaultFolderId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim() || !title.trim()) return;

    onAddMaterial({
      folder,
      type: type.trim(),
      title: title.trim(),
      description: description.trim() || undefined
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
            <FolderPlus className="w-5 h-5 text-[#C85A32]" />
            <h3 className="font-serif text-lg font-bold text-[#C85A32]">
              Aggiungi File in Cartella
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
            <label htmlFor="mat-folder" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Scegli Cartella di Destinazione
            </label>
            <select
              id="mat-folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mat-type" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Tipo di Documento / Risorsa
            </label>
            <input
              id="mat-type"
              type="text"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Es. Slide PDF, Guida Pratica, Eserciziario"
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label htmlFor="mat-title" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Titolo del File o della Dispensa
            </label>
            <input
              id="mat-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Riassunto Lezione 1 (16/11/26)"
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label htmlFor="mat-desc" className="block text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Descrizione o istruzioni d'uso (opzionale)
            </label>
            <textarea
              id="mat-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve indicazione per gli studenti sul contenuto..."
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
              className="px-5 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] transition-colors cursor-pointer"
            >
              Salva nella Cartella
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
