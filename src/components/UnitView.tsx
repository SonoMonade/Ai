import React from 'react';
import { CourseUnit, DynamicCard, UserRole, StudentProfile } from '../types';
import { StudentProgressCard } from './StudentProgressCard';
import {
  Check,
  CheckCircle2,
  Layers,
  PenSquare,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface UnitViewProps {
  unit: CourseUnit;
  units: CourseUnit[];
  activeUnitId: string;
  onSelectUnit: (unitId: string) => void;
  onScrollToSection: (sectionId: string) => void;
  dynamicCards: DynamicCard[];
  userRole: UserRole;
  isEditorMode: boolean;
  completedEncounters: number[];
  onToggleEncounter: (encounterNumber: number) => void;
  onOpenDetailModal: () => void;
  onOpenAddCardModal: (column: '1' | '2' | '3') => void;
  onRemoveDynamicCard: (id: string) => void;
  onOpenAddMaterialModal: () => void;
  currentStudent: StudentProfile | null;
  onUpdateStudentProfile: (updated: StudentProfile) => void;
}

export const UnitView: React.FC<UnitViewProps> = ({
  unit,
  units,
  activeUnitId,
  onSelectUnit,
  onScrollToSection,
  dynamicCards,
  userRole,
  isEditorMode,
  completedEncounters,
  onToggleEncounter,
  onOpenDetailModal,
  onOpenAddCardModal,
  onRemoveDynamicCard,
  onOpenAddMaterialModal,
  currentStudent,
  onUpdateStudentProfile
}) => {
  const unitCards = dynamicCards.filter(c => c.unitId === unit.id);
  const gridColsClass = unit.sections.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  return (
    <div className="space-y-6">
      
      {/* Teacher Editor Banner */}
      {userRole === 'admin' && isEditorMode && (
        <div className="bg-[#C85A32]/10 border border-[#C85A32]/30 px-4 py-3 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#1A1A1A]">
            <PenSquare className="w-4 h-4 text-[#C85A32] shrink-0" />
            <span>
              <strong>Modalità Docente / Editor attiva:</strong> aggiungi schede pratiche negli incontri o carica materiali nelle cartelle dei moduli.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddMaterialModal}
              className="font-bold underline text-[#1B4D5C] hover:text-[#1A1A1A] cursor-pointer"
            >
              + File in cartella
            </button>
            <button
              onClick={() => onOpenAddCardModal('1')}
              className="font-bold underline text-[#C85A32] hover:text-[#1A1A1A] cursor-pointer"
            >
              + Scheda incontro
            </button>
          </div>
        </div>
      )}

      {/* Visual Course Progress Card for Students */}
      {userRole === 'student' && (
        <StudentProgressCard
          completedEncounters={completedEncounters}
          units={units}
          activeUnitId={activeUnitId}
          onSelectUnit={onSelectUnit}
          onScrollToSection={onScrollToSection}
          onToggleEncounter={onToggleEncounter}
          currentStudent={currentStudent}
          onUpdateStudentProfile={onUpdateStudentProfile}
        />
      )}

      {/* Module Selector Tab Strip */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-[#1A1A1A]/15 custom-scroll">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {units.map((u) => {
            const isCurrent = u.id === activeUnitId;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => onSelectUnit(u.id)}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#1B4D5C] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#EFECE6] text-[#6E473B] border border-[#1A1A1A]/15'
                }`}
              >
                <span>Modulo {u.unitNumber}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-xs ${
                  isCurrent ? 'bg-[#F6E8B1] text-[#1B4D5C]' : 'bg-[#EFECE6] text-[#6E473B]'
                }`}>
                  {u.dateShort}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-[#6E473B] font-semibold hidden sm:inline whitespace-nowrap">
          Modulo {unit.unitNumber} di {units.length}
        </span>
      </div>

      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#1A1A1A]/20 pb-2.5 gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#6E473B] uppercase tracking-wider mb-0.5">
            <Layers className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>{unit.encountersRange}</span>
            <span>·</span>
            <span>Modulo {unit.unitNumber} di 4</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#C85A32] leading-tight">
            {unit.fullTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/80 font-medium mt-0.5">
            {unit.shortDesc}
          </p>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#6E473B] bg-[#EFECE6] px-2.5 py-1 rounded-sm border border-[#1A1A1A]/10 self-start sm:self-auto shrink-0">
          {unit.sections.length} Incontri
        </span>
      </div>

      {/* Dynamic Columns Grid (3 cols for Mod 1-2, 2 cols for Mod 3-4) */}
      <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
        {unit.sections.map((section, idx) => {
          const colIndex = String(idx + 1) as '1' | '2' | '3';
          const dynamicColCards = unitCards.filter(c => c.column === colIndex);
          const isEncounterDone = completedEncounters.includes(section.encounterNumber);

          // Title coloring: alternate green/terracotta cleanly
          const titleColorClass = idx === 0 ? 'text-[#246A4E]' : 'text-[#C85A32]';

          return (
            <div key={section.id} id={section.id} className="flex flex-col">
              {/* Heading ABOVE the editorial card */}
              <div className="mb-2 px-0.5 flex items-start justify-between gap-2">
                <div className="leading-snug">
                  <span className="font-serif text-base font-bold text-[#6E473B] mr-1.5">
                    {section.number}:
                  </span>
                  <span className={`font-serif text-lg font-bold ${titleColorClass}`}>
                    {section.title}
                  </span>
                </div>

                {userRole === 'admin' && isEditorMode ? (
                  <button
                    onClick={() => onOpenAddCardModal(colIndex)}
                    title={`Aggiungi scheda a ${section.number}`}
                    className="text-[11px] font-bold text-[#1B4D5C] hover:text-[#C85A32] flex items-center gap-0.5 cursor-pointer shrink-0 mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Aggiungi</span>
                  </button>
                ) : userRole === 'student' ? (
                  <button
                    type="button"
                    onClick={() => onToggleEncounter(section.encounterNumber)}
                    title={isEncounterDone ? 'Segna come da fare' : 'Segna incontro completato'}
                    className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1 ${
                      isEncounterDone
                        ? 'bg-[#246A4E] text-white border-[#246A4E]'
                        : 'bg-white text-[#6E473B] border-[#1A1A1A]/20 hover:border-[#246A4E] hover:text-[#246A4E]'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{isEncounterDone ? 'Fatto' : 'Segna'}</span>
                  </button>
                ) : null}
              </div>

              {/* The Editorial Card */}
              <div className="editorial-card p-5 rounded-sm flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6E473B] mb-2.5">
                    {section.subtitle}
                  </p>

                  {/* Bullet points with green ticks */}
                  <ul className="space-y-2.5 text-sm text-[#1A1A1A]/90 mb-5">
                    {section.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-[#246A4E] shrink-0 mt-1" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Callout Box */}
                  {section.calloutText && (
                    <div className={`p-3.5 text-xs text-[#1A1A1A]/90 space-y-1.5 mb-5 rounded-xs ${
                      idx === 2
                        ? 'bg-[#F7F5F0] border-l-2 border-[#C85A32]'
                        : 'bg-[#F7F5F0] border-l-2 border-[#1B4D5C]'
                    }`}>
                      {section.calloutTitle && (
                        <p className="font-bold text-[#6E473B] uppercase tracking-wider">
                          {section.calloutTitle}
                        </p>
                      )}
                      <p className="leading-relaxed">
                        {section.calloutText}
                      </p>
                    </div>
                  )}

                  {/* Teacher Dynamic Cards in this column */}
                  {dynamicColCards.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {dynamicColCards.map((card) => (
                        <div
                          key={card.id}
                          className="bg-[#F7F5F0] border border-[#1A1A1A]/20 p-3.5 rounded-sm relative"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E473B] flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-[#1B4D5C]" />
                              <span>{card.title}</span>
                            </span>
                            {userRole === 'admin' && isEditorMode && (
                              <button
                                onClick={() => onRemoveDynamicCard(card.id)}
                                title="Elimina scheda"
                                className="text-[#1A1A1A]/40 hover:text-[#C85A32] text-xs cursor-pointer p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-[#1A1A1A]/90 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: OPEN button or Key summary attribute */}
                <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs">
                  {section.hasOpenDetail ? (
                    <>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E473B]">
                        {section.footerLabel}
                      </span>
                      <button
                        onClick={onOpenDetailModal}
                        className="px-5 py-1.5 bg-[#1B4D5C] hover:bg-[#123540] text-white border border-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <span>OPEN</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="uppercase tracking-wider text-[#6E473B] font-bold">
                        {section.footerLabel}:
                      </span>
                      <span className="font-bold text-[#1A1A1A]">
                        {section.footerValue}
                      </span>
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Percorso Completo banner */}
      <div className="bg-white/85 border border-[#1A1A1A]/20 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
            Percorso Completo (4 Moduli · 10 Incontri)
          </span>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#C85A32]">
            M1. Esplorazione & Sicurezza · M2. Prompt & Testi · M3. Organizzazione & Dati · M4. Senso Critico & Metodo
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {unit.unitNumber < units.length && (
            <button
              onClick={() => onSelectUnit(`unit-${unit.unitNumber + 1}`)}
              className="px-4 py-2 bg-[#EFECE6] hover:bg-[#1B4D5C] hover:text-white text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 border border-[#1A1A1A]/15 cursor-pointer"
            >
              <span>Vai al Modulo {unit.unitNumber + 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
