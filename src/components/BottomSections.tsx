import React, { useState } from 'react';
import { GlossaryItem, StudyFolder, StudyMaterial, UserRole, QuizQuestion } from '../types';
import { RECOMMENDED_READINGS, SELF_CHECK_QUIZ } from '../data/courseData';
import {
  Search,
  BookOpen,
  Folder,
  FolderOpen,
  ChevronDown,
  Plus,
  Trash2,
  FileText,
  Bookmark,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Save,
  Download
} from 'lucide-react';

interface BottomSectionsProps {
  glossaryTerms: GlossaryItem[];
  studyFolders: StudyFolder[];
  studyMaterials: StudyMaterial[];
  userRole: UserRole;
  isEditorMode: boolean;
  onOpenAddMaterialModal: (folderId?: string) => void;
  onRemoveStudyMaterial: (id: string) => void;
  studentNotes: string;
  onSaveStudentNotes: (notes: string) => void;
  onOpenTokenSimulator: () => void;
}

export const BottomSections: React.FC<BottomSectionsProps> = ({
  glossaryTerms,
  studyFolders,
  studyMaterials,
  userRole,
  isEditorMode,
  onOpenAddMaterialModal,
  onRemoveStudyMaterial,
  studentNotes,
  onSaveStudentNotes,
  onOpenTokenSimulator
}) => {
  // Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('tutti');
  const [highlightedTerms, setHighlightedTerms] = useState<Set<string>>(new Set());
  const [favoriteTerms, setFavoriteTerms] = useState<Set<string>>(new Set());

  // Folder open/close state
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['M1']));
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // Panel 4 tab: 'notebook' | 'quiz'
  const [activeToolTab, setActiveToolTab] = useState<'notebook' | 'quiz'>('notebook');
  const [localNotes, setLocalNotes] = useState(studentNotes);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Glossary filter logic
  const filteredGlossary = glossaryTerms.filter(item => {
    const matchesSearch =
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(glossarySearch.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'tutti') return true;
    if (selectedCategory === 'preferiti') return favoriteTerms.has(item.id);
    return item.category === selectedCategory;
  });

  const toggleHighlight = (id: string) => {
    setHighlightedTerms(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteTerms(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleSaveNotes = () => {
    onSaveStudentNotes(localNotes);
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2000);
  };

  const handleExportNotes = () => {
    const blob = new Blob([localNotes || "Nessun appunto registrato."], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taccuino-corso-ai-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectQuizAnswer = (qId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    SELF_CHECK_QUIZ.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <section className="bg-[#EFECE6] border border-[#1A1A1A]/20 rounded-sm overflow-hidden shadow-xs mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1A1A1A]/20">

        {/* Panel 1: Glossario (113 voci) + Search */}
        <div id="section-glossary" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Parole Chiave
              </span>
              <span className="text-[10px] font-bold text-[#1B4D5C] bg-white px-2 py-0.5 border border-[#1A1A1A]/15 rounded-sm">
                {filteredGlossary.length} / {glossaryTerms.length} voci
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#C85A32] mb-2.5">
              Glossario
            </h3>

            {/* Search Input */}
            <div className="relative mb-2.5">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6E473B]" />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Cerca un termine..."
                aria-label="Cerca nel glossario"
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#1A1A1A]/25 rounded-sm text-xs text-[#1A1A1A] placeholder:text-[#6E473B]/60 focus:outline-none focus:border-[#1B4D5C]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 mb-2.5 text-[10px] font-bold">
              {[
                { id: 'tutti', label: 'Tutti' },
                { id: 'fondamentali', label: 'Basi' },
                { id: 'sicurezza', label: 'Sicurezza' },
                { id: 'etica_societa', label: 'Etica' },
                { id: 'preferiti', label: `Salvati (${favoriteTerms.size})` }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#1B4D5C] text-white'
                      : 'bg-white/80 text-[#6E473B] hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Terms List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
              {filteredGlossary.length === 0 ? (
                <p className="text-xs text-[#6E473B] italic py-3 text-center">
                  Nessun termine trovato per "{glossarySearch}".
                </p>
              ) : (
                filteredGlossary.map((item) => {
                  const isHighlighted = highlightedTerms.has(item.id);
                  const isFav = favoriteTerms.has(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleHighlight(item.id)}
                      className={`p-2.5 rounded-sm border transition-colors cursor-pointer text-left ${
                        isHighlighted
                          ? 'bg-[#DCE8EC] border-[#1B4D5C]'
                          : 'bg-white border-[#1A1A1A]/15 hover:border-[#1B4D5C]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-[11px] uppercase tracking-wider text-[#C85A32]">
                          {item.term}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(e, item.id)}
                          title={isFav ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
                          className={`p-0.5 rounded-xs cursor-pointer ${
                            isFav ? 'text-[#C85A32]' : 'text-[#1A1A1A]/30 hover:text-[#C85A32]'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#1A1A1A]/90 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <p className="text-[10px] text-[#6E473B] mt-2 pt-2 border-t border-[#1A1A1A]/10">
            Fai clic su un termine per evidenziarlo durante lo studio.
          </p>
        </div>

        {/* Panel 2: Libri e Blog */}
        <div className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B] block mb-1">
              Letture Consigliate
            </span>
            <h3 className="font-serif text-xl font-bold text-[#C85A32] mb-3">
              Libri e Blog
            </h3>
            <ul className="space-y-2.5 text-xs text-[#1A1A1A]/90 max-h-80 overflow-y-auto pr-1 custom-scroll">
              {RECOMMENDED_READINGS.map((book, idx) => (
                <li key={idx} className="bg-white p-3 border border-[#1A1A1A]/15 rounded-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#6E473B] block uppercase text-[10px] tracking-wider">
                      {book.type}
                    </span>
                    <span className="text-[9px] bg-[#EFECE6] px-1.5 py-0.2 rounded-xs text-[#1B4D5C] font-semibold">
                      {book.tag}
                    </span>
                  </div>
                  <p className="font-bold text-[12px] text-[#1A1A1A]">
                    {book.title} <span className="font-normal text-[#6E473B]">— {book.author}</span>
                  </p>
                  <p className="text-[11px] text-[#1A1A1A]/80 leading-relaxed">
                    {book.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[11px] text-[#6E473B]">
            <BookOpen className="w-3.5 h-3.5 text-[#1B4D5C]" />
            <span>Biblioteca aggiornata per studenti LSA</span>
          </div>
        </div>

        {/* Panel 3: Materiale di Studio (Cartelle per Modulo) */}
        <div id="section-materials" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Cartelle Lezioni
              </span>
              {userRole === 'admin' && isEditorMode && (
                <button
                  onClick={() => onOpenAddMaterialModal()}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D5C] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Aggiungi</span>
                </button>
              )}
            </div>
            <h3 className="font-serif text-xl font-bold text-[#C85A32] mb-3">
              Materiale di studio
            </h3>

            {/* Folder Tree */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
              {studyFolders.map((folder) => {
                const files = studyMaterials.filter(m => m.folder === folder.id);
                const isOpen = openFolders.has(folder.id);

                return (
                  <div key={folder.id} className="bg-white border border-[#1A1A1A]/20 rounded-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleFolder(folder.id)}
                      className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-[#F7F5F0] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isOpen ? (
                          <FolderOpen className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-[#6E473B] shrink-0" />
                        )}
                        <span className="font-bold text-[11px] text-[#1A1A1A] truncate">
                          {folder.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#EFECE6] text-[#6E473B] rounded-xs">
                          {files.length}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-[#6E473B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#1A1A1A]/10 bg-[#F7F5F0]/60 p-2 space-y-1.5">
                        {files.length === 0 ? (
                          <p className="text-[11px] italic text-[#6E473B]/70 px-1">
                            Cartella vuota
                          </p>
                        ) : (
                          files.map((mat) => (
                            <div
                              key={mat.id}
                              onClick={() => setPreviewMaterial(mat)}
                              className="bg-white p-2 border border-[#1A1A1A]/15 rounded-sm flex items-start justify-between gap-2 text-xs hover:border-[#1B4D5C] cursor-pointer"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-[#6E473B] block uppercase text-[9px] tracking-wider">
                                  {mat.type}
                                </span>
                                <span className="font-bold text-[#1A1A1A] text-[11px] leading-snug block truncate">
                                  {mat.title}
                                </span>
                              </div>
                              {userRole === 'admin' && isEditorMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveStudyMaterial(mat.id);
                                  }}
                                  title="Rimuovi file"
                                  className="text-[#1A1A1A]/40 hover:text-[#C85A32] text-xs mt-0.5 shrink-0 cursor-pointer p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))
                        )}

                        {userRole === 'admin' && isEditorMode && (
                          <button
                            type="button"
                            onClick={() => onOpenAddMaterialModal(folder.id)}
                            className="w-full flex justify-center items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1B4D5C] hover:text-[#C85A32] py-1 border border-dashed border-[#1B4D5C]/40 rounded-sm mt-1 cursor-pointer bg-white"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Aggiungi in {folder.id}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] text-[#6E473B] mt-2 pt-2 border-t border-[#1A1A1A]/10">
            Fai clic su un documento per aprirne i dettagli e gli schemi.
          </p>
        </div>

        {/* Panel 4: Spazio Riservato & Strumenti Pratici (Taccuino Personale & Mini-Quiz) */}
        <div id="section-quiz" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Laboratorio Studente
              </span>
              <button
                onClick={onOpenTokenSimulator}
                className="text-[10px] font-bold text-[#C85A32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Simulatore</span>
              </button>
            </div>

            {/* Tab switch between Notebook and Quiz */}
            <div className="grid grid-cols-2 gap-1 bg-[#1A1A1A]/5 p-0.5 rounded-sm mb-3 text-xs font-bold uppercase">
              <button
                type="button"
                onClick={() => setActiveToolTab('notebook')}
                className={`py-1 rounded-xs transition-colors cursor-pointer ${
                  activeToolTab === 'notebook'
                    ? 'bg-white text-[#1B4D5C] shadow-2xs'
                    : 'text-[#6E473B] hover:text-[#1A1A1A]'
                }`}
              >
                Taccuino Note
              </button>
              <button
                type="button"
                onClick={() => setActiveToolTab('quiz')}
                className={`py-1 rounded-xs transition-colors cursor-pointer ${
                  activeToolTab === 'quiz'
                    ? 'bg-white text-[#1B4D5C] shadow-2xs'
                    : 'text-[#6E473B] hover:text-[#1A1A1A]'
                }`}
              >
                Quiz ({SELF_CHECK_QUIZ.length})
              </button>
            </div>

            {activeToolTab === 'notebook' ? (
              <div className="space-y-2">
                <textarea
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  placeholder="Scrivi qui i tuoi appunti personali, le domande da fare al docente o i prompt che vuoi memorizzare..."
                  rows={8}
                  className="w-full p-2.5 bg-white border border-[#1A1A1A]/20 rounded-sm text-xs text-[#1A1A1A] placeholder:text-[#6E473B]/50 focus:outline-none focus:border-[#1B4D5C] leading-relaxed custom-scroll"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#6E473B]">
                    {notesSavedNotice ? (
                      <span className="text-[#246A4E] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Appunti salvati!
                      </span>
                    ) : (
                      `${localNotes.split(/\s+/).filter(Boolean).length} parole`
                    )}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleExportNotes}
                      title="Scarica i tuoi appunti in file di testo"
                      className="p-1.5 bg-white hover:bg-[#EFECE6] border border-[#1A1A1A]/20 rounded-sm text-[#1A1A1A] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1.5 bg-[#1B4D5C] hover:bg-[#123540] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3 h-3" />
                      <span>Salva</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scroll text-xs">
                {SELF_CHECK_QUIZ.map((q, idx) => {
                  const selected = quizAnswers[q.id];
                  const isAnswered = selected !== undefined;
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div key={q.id} className="bg-white p-2.5 border border-[#1A1A1A]/15 rounded-sm space-y-1.5">
                      <p className="font-bold text-[11px] text-[#1A1A1A] leading-snug">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-1">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selected === optIdx;
                          let optStyle = 'bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#1A1A1A]';

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'bg-emerald-100 border border-emerald-500 text-emerald-900 font-bold';
                            } else if (isOptionSelected && !isCorrect) {
                              optStyle = 'bg-red-100 border border-red-500 text-red-900 line-through';
                            }
                          } else if (isOptionSelected) {
                            optStyle = 'bg-[#1B4D5C] text-white font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectQuizAnswer(q.id, optIdx)}
                              className={`w-full text-left p-1.5 rounded-xs text-[10px] leading-snug transition-colors cursor-pointer ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && isAnswered && (
                        <p className={`text-[10px] p-1.5 rounded-xs leading-relaxed ${
                          isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                        }`}>
                          <strong>{isCorrect ? 'Corretto!' : 'Spiegazione:'}</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 flex items-center justify-between">
                  {quizSubmitted ? (
                    <>
                      <span className="font-bold text-[11px] text-[#246A4E]">
                        Punteggio: {calculateScore()} / {SELF_CHECK_QUIZ.length}
                      </span>
                      <button
                        onClick={resetQuiz}
                        className="px-2.5 py-1 bg-[#EFECE6] hover:bg-black/10 text-[#1A1A1A] text-[10px] font-bold uppercase rounded-sm flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Riprova</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="w-full py-1.5 bg-[#246A4E] hover:bg-[#1b503b] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Verifica Risposte ({Object.keys(quizAnswers).length}/{SELF_CHECK_QUIZ.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[11px] text-[#6E473B]">
            <FileText className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Spazio didattico integrato</span>
          </div>
        </div>

      </div>

      {/* Document Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#1A1A1A] max-w-lg w-full p-6 rounded-sm shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                  Materiale Didattico • Cartella {previewMaterial.folder}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#1B4D5C]">
                  {previewMaterial.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#1A1A1A]/90 leading-relaxed">
              <div className="p-3 bg-[#F7F5F0] border border-[#1A1A1A]/15 rounded-sm">
                <span className="font-bold text-[#6E473B] block uppercase text-[10px] mb-1">
                  Tipologia Documento: {previewMaterial.type}
                </span>
                <p>{previewMaterial.description || "Dispensa di approfondimento e schede illustrative per gli studenti del corso."}</p>
              </div>
              <div className="p-3 bg-[#EFECE6] border-l-2 border-[#1B4D5C] rounded-sm text-[11px]">
                <strong>Disponibile per la consultazione:</strong> Gli studenti registrati possono consultare questa risorsa sia durante la lezione frontale che a casa per ripasso.
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
