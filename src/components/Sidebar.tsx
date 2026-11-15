import React, { useState } from 'react';
import { CourseUnit } from '../types';
import { TOTAL_ENCOUNTERS } from '../data/courseData';
import {
  ListOrdered,
  Layers,
  ChevronDown,
  ChevronRight,
  BookOpen,
  FolderOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  units: CourseUnit[];
  activeUnitId: string;
  onSelectUnit: (unitId: string) => void;
  onScrollToSection: (sectionId: string) => void;
  completedEncounters: number[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  units,
  activeUnitId,
  onSelectUnit,
  onScrollToSection,
  completedEncounters
}) => {
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const completedCount = completedEncounters.length;
  const pct = Math.min(100, Math.round((completedCount / TOTAL_ENCOUNTERS) * 100));

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-[#F6E8B1] border-b lg:border-b-0 lg:border-r border-[#D9C27E] p-4">
      <div className="lg:sticky lg:top-24 space-y-4">
        
        {/* Section 1: Collapsible Course Index (4 Moduli, 10 Incontri) */}
        <div className="bg-white/90 border border-[#D9C27E] rounded-sm p-3 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsTreeOpen(!isTreeOpen)}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
            aria-expanded={isTreeOpen}
          >
            <span className="font-bold text-xs uppercase tracking-widest text-[#1A1A1A] group-hover:text-[#C85A32] transition-colors flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#6E473B]" />
              <span>Indice Corso (4 Moduli)</span>
            </span>
            {isTreeOpen ? (
              <ChevronDown className="w-4 h-4 text-[#6E473B] transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#6E473B] transition-transform" />
            )}
          </button>

          {isTreeOpen && (
            <div className="pt-3 mt-2.5 border-t border-[#D9C27E] space-y-3.5 max-h-[54vh] overflow-y-auto pr-1 custom-scroll">
              {units.map((unit, idx) => {
                const isActive = activeUnitId === unit.id;
                const allModuleEncountersDone = unit.sections.every(s =>
                  completedEncounters.includes(s.encounterNumber)
                );

                return (
                  <div key={unit.id} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectUnit(unit.id)}
                      className={`w-full text-left flex items-start justify-between gap-2 group cursor-pointer py-1 px-1.5 rounded-xs transition-colors ${
                        isActive
                          ? 'bg-[#1B4D5C]/10 text-[#C85A32]'
                          : 'hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="font-serif text-base font-bold text-[#C85A32] leading-none shrink-0">
                          M{unit.unitNumber}
                        </span>
                        <span className={`text-[11px] font-bold uppercase tracking-wide leading-snug transition-colors ${
                          isActive ? 'text-[#C85A32]' : 'text-[#1A1A1A] group-hover:text-[#C85A32]'
                        }`}>
                          {unit.title}
                        </span>
                      </div>
                      {allModuleEncountersDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#246A4E] shrink-0 mt-0.5" />
                      )}
                    </button>

                    <ul className="pl-3 space-y-1.5 text-[11px] font-semibold text-[#6E473B] border-l-2 border-[#D9C27E] ml-2">
                      {unit.sections.map((sec) => {
                        const isEncDone = completedEncounters.includes(sec.encounterNumber);
                        return (
                          <li key={sec.id}>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectUnit(unit.id);
                                setTimeout(() => onScrollToSection(sec.id), 60);
                              }}
                              className="hover:text-[#C85A32] text-left py-0.5 leading-snug w-full cursor-pointer transition-colors flex items-start justify-between gap-1.5"
                            >
                              <span>
                                <strong className="text-[#1A1A1A]">{sec.number}:</strong> {sec.title}
                              </span>
                              {isEncDone && (
                                <CheckCircle2 className="w-3 h-3 text-[#246A4E] shrink-0 mt-0.5" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {idx < units.length - 1 && (
                      <hr className="border-[#D9C27E]/70 my-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Mappa dei 4 Moduli */}
        <div className="bg-white/90 border border-[#D9C27E] rounded-sm p-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#D9C27E] pb-1.5 mb-2.5">
            <span className="font-bold text-[11px] uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Struttura Moduli</span>
            </span>
            <span className="text-[10px] font-bold text-[#6E473B]">10 Incontri</span>
          </div>

          <ul className="space-y-1.5 text-[11px]">
            {units.map((unit) => {
              const isActive = activeUnitId === unit.id;
              const doneInMod = unit.sections.filter(s =>
                completedEncounters.includes(s.encounterNumber)
              ).length;
              const isModDone = doneInMod === unit.sections.length;

              return (
                <li key={unit.id}>
                  <button
                    type="button"
                    onClick={() => onSelectUnit(unit.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-sm transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-white border border-[#1B4D5C]/60 shadow-2xs'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-bold shrink-0 text-[10px] px-1.5 py-0.2 rounded-xs ${
                        isActive ? 'bg-[#1B4D5C] text-white' : 'bg-[#EFECE6] text-[#6E473B]'
                      }`}>
                        {unit.dateShort}
                      </span>
                      <span className="text-[#1A1A1A] font-semibold truncate">
                        M{unit.unitNumber}. {unit.title}
                      </span>
                    </div>
                    {isModDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#246A4E] shrink-0 ml-1" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#6E473B] shrink-0 ml-1">
                        {doneInMod}/{unit.sections.length}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Section 2.5: Course Visual Progress Bar */}
        <div className="bg-white/90 border border-[#D9C27E] rounded-sm p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="uppercase tracking-wider text-[#6E473B]">Avanzamento Corso</span>
            <span className="text-[#C85A32] font-serif text-xs">
              {pct}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#EFECE6] rounded-xs overflow-hidden border border-[#D9C27E]/40">
            <div
              className={`h-full transition-all duration-500 ease-out ${
                completedCount >= TOTAL_ENCOUNTERS ? 'bg-[#246A4E]' : 'bg-[#1B4D5C]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#6E473B]">
            <span>{completedCount} di {TOTAL_ENCOUNTERS} incontri</span>
            <span className="font-semibold">
              {TOTAL_ENCOUNTERS - completedCount > 0 ? `${TOTAL_ENCOUNTERS - completedCount} rimasti` : 'Completato!'}
            </span>
          </div>
        </div>

        {/* Section 3: Quick Jump Shortcuts */}
        <div className="bg-white/85 border border-[#D9C27E] rounded-sm p-2.5 space-y-1.5 text-xs font-bold text-[#6E473B]">
          <span className="text-[10px] uppercase tracking-wider block text-[#1A1A1A]/70 mb-1">
            Accesso Rapido Strumenti
          </span>
          <button
            type="button"
            onClick={() => onScrollToSection('section-glossary')}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-white hover:text-[#1B4D5C] transition-colors text-left cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1B4D5C]" />
            <span>Glossario (115 Voci)</span>
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('section-materials')}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-white hover:text-[#1B4D5C] transition-colors text-left cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#6E473B]" />
            <span>Cartelle dei Moduli</span>
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('section-quiz')}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-white hover:text-[#246A4E] transition-colors text-left cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#246A4E]" />
            <span>Taccuino & Quiz</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
