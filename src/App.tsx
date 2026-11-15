/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile, DynamicCard, StudyMaterial, EmailConfig } from './types';
import {
  COURSE_UNITS,
  TOTAL_ENCOUNTERS,
  INITIAL_DYNAMIC_ITEMS,
  STUDY_FOLDERS,
  INITIAL_STUDY_MATERIALS
} from './data/courseData';
import { glossaryTerms } from './data/glossaryData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { UnitView } from './components/UnitView';
import { BottomSections } from './components/BottomSections';
import { LoginGateway } from './components/LoginGateway';
import { EmailConfirmationBanner } from './components/EmailConfirmationBanner';
import { OpenDetailModal } from './components/modals/OpenDetailModal';
import { AddCardModal } from './components/modals/AddCardModal';
import { AddMaterialModal } from './components/modals/AddMaterialModal';
import { RosterModal } from './components/modals/RosterModal';
import { EmailConfigModal } from './components/modals/EmailConfigModal';
import { StudentProfileModal } from './components/modals/StudentProfileModal';

const getStudentEncounters = (student: StudentProfile): number[] => {
  if (student.completedEncounters && Array.isArray(student.completedEncounters)) {
    return Array.from(
      new Set(student.completedEncounters.filter(n => n >= 1 && n <= TOTAL_ENCOUNTERS))
    ).sort((a, b) => a - b);
  }
  const count = Math.max(0, Math.min(TOTAL_ENCOUNTERS, student.completedLessons || 0));
  return Array.from({ length: count }, (_, i) => i + 1);
};

const buildEncountersForCount = (count: number): number[] => {
  const clamped = Math.max(0, Math.min(TOTAL_ENCOUNTERS, count));
  return Array.from({ length: clamped }, (_, i) => i + 1);
};

const DEFAULT_STUDENT: StudentProfile = {
  firstName: 'Giulia',
  lastName: 'Bianchi',
  email: 'giulia.bianchi@lsa.it',
  completedLessons: 1,
  completedEncounters: [1],
  confirmationSent: true,
  enrolledAt: '2026-11-12T08:00:00.000Z',
  lastAccess: new Date().toISOString()
};

const INITIAL_ROSTER: StudentProfile[] = [
  DEFAULT_STUDENT,
  {
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@lsa.it',
    completedLessons: 2,
    completedEncounters: [1, 2],
    confirmationSent: true,
    enrolledAt: '2026-11-10T10:00:00.000Z'
  },
  {
    firstName: 'Elena',
    lastName: 'Conti',
    email: 'elena.conti@email.it',
    completedLessons: 4,
    completedEncounters: [1, 2, 3, 4],
    confirmationSent: true,
    enrolledAt: '2026-11-11T14:30:00.000Z'
  },
  {
    firstName: 'Giuseppe',
    lastName: 'Moretti',
    email: 'g.moretti@studio.org',
    completedLessons: 1,
    completedEncounters: [1],
    confirmationSent: true,
    enrolledAt: '2026-11-12T08:15:00.000Z'
  }
];

export default function App() {
  // Session & Auth state - start with LoginGateway if not logged in
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ai_course_v2_logged_in') === 'true';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ai_course_v2_role');
    return (saved as UserRole) || 'student';
  });

  const [isEditorMode, setIsEditorMode] = useState<boolean>(() => {
    return localStorage.getItem('ai_course_v2_editor_mode') === 'true';
  });

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ai_course_v2_student');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
  });

  // Students roster
  const [registeredStudents, setRegisteredStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('ai_course_v2_roster');
    return saved ? JSON.parse(saved) : INITIAL_ROSTER;
  });

  // Pending student registration requests
  const [pendingStudents, setPendingStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('ai_course_v2_pending_students');
    return saved ? JSON.parse(saved) : [
      {
        firstName: 'Federico',
        lastName: 'Neri',
        email: 'federico.neri@esempio.it',
        phone: '+39 349 9876543',
        completedLessons: 0,
        confirmationSent: false,
        enrolledAt: new Date().toISOString()
      }
    ];
  });

  // Dynamic cards added by teacher
  const [dynamicCards, setDynamicCards] = useState<DynamicCard[]>(() => {
    const saved = localStorage.getItem('ai_course_v2_cards');
    return saved ? JSON.parse(saved) : INITIAL_DYNAMIC_ITEMS;
  });

  // Study materials in folders
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('ai_course_v2_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  // Student notebook
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return localStorage.getItem('ai_course_v2_notes') || '';
  });

  // EmailJS config
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(() => {
    const saved = localStorage.getItem('ai_course_v2_email_cfg');
    return saved ? JSON.parse(saved) : { serviceId: '', templateId: '', publicKey: '' };
  });

  // Navigation
  const [activeUnitId, setActiveUnitId] = useState<string>('unit-1');
  const [showEmailBanner, setShowEmailBanner] = useState<boolean>(false);

  // Modals
  const [isLoginGatewayOpen, setIsLoginGatewayOpen] = useState<boolean>(!isLoggedIn);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState<boolean>(false);
  const [addCardDefaultCol, setAddCardDefaultCol] = useState<'1' | '2' | '3'>('1');
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState<boolean>(false);
  const [addMaterialFolderId, setAddMaterialFolderId] = useState<string>('M1');
  const [isRosterModalOpen, setIsRosterModalOpen] = useState<boolean>(false);
  const [isEmailConfigModalOpen, setIsEmailConfigModalOpen] = useState<boolean>(false);
  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState<boolean>(false);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('ai_course_v2_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_editor_mode', String(isEditorMode));
  }, [isEditorMode]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_student', JSON.stringify(currentStudent));
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_roster', JSON.stringify(registeredStudents));
  }, [registeredStudents]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_pending_students', JSON.stringify(pendingStudents));
  }, [pendingStudents]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_cards', JSON.stringify(dynamicCards));
  }, [dynamicCards]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_notes', studentNotes);
  }, [studentNotes]);

  useEffect(() => {
    localStorage.setItem('ai_course_v2_email_cfg', JSON.stringify(emailConfig));
  }, [emailConfig]);

  // Handle student login & registration
  const handleLoginStudent = (student: StudentProfile) => {
    setCurrentStudent(student);
    setUserRole('student');
    setIsEditorMode(false);
    setShowEmailBanner(true);
    setIsLoggedIn(true);
    localStorage.setItem('ai_course_v2_logged_in', 'true');
    setIsLoginGatewayOpen(false);

    // Save to roster if new
    setRegisteredStudents(prev => {
      const exists = prev.some(s => s.email.toLowerCase() === student.email.toLowerCase());
      if (exists) {
        return prev.map(s => s.email.toLowerCase() === student.email.toLowerCase() ? { ...s, lastAccess: new Date().toISOString() } : s);
      }
      return [student, ...prev];
    });
  };

  // Handle admin login
  const handleLoginAdmin = () => {
    setUserRole('admin');
    setIsEditorMode(true);
    setIsLoggedIn(true);
    localStorage.setItem('ai_course_v2_logged_in', 'true');
    setIsLoginGatewayOpen(false);
  };

  // Switch role directly from header
  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setIsEditorMode(true);
    } else {
      setIsEditorMode(false);
    }
  };

  // Student progress update (+ / -)
  const handleUpdateCompletedLessons = (delta: number) => {
    const currentEncounters = getStudentEncounters(currentStudent);
    const nextCount = Math.max(0, Math.min(TOTAL_ENCOUNTERS, currentEncounters.length + delta));
    let nextEncounters = [...currentEncounters];

    if (delta > 0) {
      for (let i = 1; i <= TOTAL_ENCOUNTERS && nextEncounters.length < nextCount; i++) {
        if (!nextEncounters.includes(i)) nextEncounters.push(i);
      }
      nextEncounters.sort((a, b) => a - b);
    } else if (delta < 0 && nextEncounters.length > nextCount) {
      nextEncounters = nextEncounters.slice(0, nextCount);
    }

    const updated: StudentProfile = {
      ...currentStudent,
      completedLessons: nextEncounters.length,
      completedEncounters: nextEncounters
    };
    setCurrentStudent(updated);

    // Update in roster
    setRegisteredStudents(prev =>
      prev.map(s => s.email.toLowerCase() === updated.email.toLowerCase() ? updated : s)
    );
  };

  // Toggle individual encounter (1..10)
  const handleToggleEncounter = (encounterNumber: number) => {
    const currentEncounters = getStudentEncounters(currentStudent);
    const exists = currentEncounters.includes(encounterNumber);
    const nextEncounters = exists
      ? currentEncounters.filter(n => n !== encounterNumber)
      : [...currentEncounters, encounterNumber].sort((a, b) => a - b);

    const updated: StudentProfile = {
      ...currentStudent,
      completedLessons: nextEncounters.length,
      completedEncounters: nextEncounters
    };
    setCurrentStudent(updated);

    setRegisteredStudents(prev =>
      prev.map(s => s.email.toLowerCase() === updated.email.toLowerCase() ? updated : s)
    );
  };

  // Teacher updating a student's encounters in RosterModal
  const handleUpdateStudentLessonsInRoster = (email: string, delta: number) => {
    setRegisteredStudents(prev =>
      prev.map(s => {
        if (s.email.toLowerCase() === email.toLowerCase()) {
          const nextVal = Math.max(0, Math.min(TOTAL_ENCOUNTERS, s.completedLessons + delta));
          return {
            ...s,
            completedLessons: nextVal,
            completedEncounters: buildEncountersForCount(nextVal)
          };
        }
        return s;
      })
    );
    if (currentStudent.email.toLowerCase() === email.toLowerCase()) {
      setCurrentStudent(prev => {
        const nextVal = Math.max(0, Math.min(TOTAL_ENCOUNTERS, prev.completedLessons + delta));
        return {
          ...prev,
          completedLessons: nextVal,
          completedEncounters: buildEncountersForCount(nextVal)
        };
      });
    }
  };

  const handleAddStudentManual = (student: StudentProfile) => {
    setRegisteredStudents(prev => [student, ...prev]);
  };

  const handleEditStudent = (originalEmail: string, updatedStudent: StudentProfile) => {
    setRegisteredStudents(prev =>
      prev.map(s => s.email.toLowerCase() === originalEmail.toLowerCase() ? updatedStudent : s)
    );
    if (currentStudent && currentStudent.email.toLowerCase() === originalEmail.toLowerCase()) {
      setCurrentStudent(updatedStudent);
    }
  };

  const handleUpdateStudentProfile = (updated: StudentProfile) => {
    setCurrentStudent(updated);
    setRegisteredStudents(prev =>
      prev.map(s => s.email.toLowerCase() === updated.email.toLowerCase() ? updated : s)
    );
  };

  const handleDeleteStudent = (email: string) => {
    setRegisteredStudents(prev => prev.filter(s => s.email.toLowerCase() !== email.toLowerCase()));
  };

  const handleAddPendingStudent = (student: StudentProfile) => {
    setPendingStudents(prev => {
      const exists = prev.some(s => s.email.toLowerCase() === student.email.toLowerCase());
      const alreadyRegistered = registeredStudents.some(s => s.email.toLowerCase() === student.email.toLowerCase());
      if (exists || alreadyRegistered) return prev;
      return [student, ...prev];
    });
  };

  const handleAcceptPendingStudent = (email: string) => {
    const studentToAccept = pendingStudents.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (studentToAccept) {
      const accepted: StudentProfile = {
        ...studentToAccept,
        confirmationSent: true,
        confirmationSentAt: new Date().toISOString()
      };
      setRegisteredStudents(prev => [accepted, ...prev]);
      setPendingStudents(prev => prev.filter(s => s.email.toLowerCase() !== email.toLowerCase()));
    }
  };

  const handleRejectPendingStudent = (email: string) => {
    setPendingStudents(prev => prev.filter(s => s.email.toLowerCase() !== email.toLowerCase()));
  };

  // Dynamic cards
  const handleAddDynamicCard = (cardData: {
    unitId: string;
    column: '1' | '2' | '3';
    title: string;
    description: string;
  }) => {
    const newCard: DynamicCard = {
      id: `card-${Date.now()}`,
      unitId: cardData.unitId,
      column: cardData.column,
      title: cardData.title,
      description: cardData.description,
      createdAt: Date.now(),
      author: 'Docente'
    };
    setDynamicCards(prev => [...prev, newCard]);
  };

  const handleRemoveDynamicCard = (id: string) => {
    setDynamicCards(prev => prev.filter(c => c.id !== id));
  };

  // Study materials
  const handleAddStudyMaterial = (matData: {
    folder: string;
    type: string;
    title: string;
    description?: string;
  }) => {
    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      folder: matData.folder,
      type: matData.type,
      title: matData.title,
      description: matData.description,
      addedAt: new Date().toISOString()
    };
    setStudyMaterials(prev => [...prev, newMat]);
  };

  const handleRemoveStudyMaterial = (id: string) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Save notes
  const handleSaveStudentNotes = (notes: string) => {
    setStudentNotes(notes);
  };

  // Export JSON
  const handleExportJson = () => {
    const payload = {
      corso: "Capire e Usare l'Intelligenza Artificiale",
      sede: "LSA Centocelle",
      anno: 2026,
      esportatoIl: new Date().toISOString(),
      ruoloUtente: userRole,
      studenteAttuale: currentStudent,
      moduliProgramma: COURSE_UNITS.map(u => ({
        modulo: u.unitNumber,
        titolo: u.title,
        intervallo: u.encountersRange,
        incontri: u.sections.map(s => ({
          numero: s.number,
          titolo: s.title,
          puntiChiave: s.keyPoints
        }))
      })),
      schedeAggiunteDalDocente: dynamicCards,
      cartelleMateriale: STUDY_FOLDERS.map(f => ({
        cartella: f.label,
        documenti: studyMaterials.filter(m => m.folder === f.id)
      })),
      glossarioCompletoVoci: glossaryTerms.length,
      registroStudenti: userRole === 'admin' ? registeredStudents : undefined,
      appuntiPersonali: studentNotes
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `programma-corso-ai-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Smooth scroll
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Active unit object & synced encounters
  const activeUnit = COURSE_UNITS.find(u => u.id === activeUnitId) || COURSE_UNITS[0];
  const studentEncounters = getStudentEncounters(currentStudent);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0]">
      
      {/* 1. Sticky Header */}
      <Header
        userRole={userRole}
        onSwitchRole={handleSwitchRole}
        isEditorMode={isEditorMode}
        onSetEditorMode={setIsEditorMode}
        currentStudent={currentStudent}
        onUpdateCompletedLessons={handleUpdateCompletedLessons}
        onOpenRosterModal={() => setIsRosterModalOpen(true)}
        onOpenEmailConfigModal={() => setIsEmailConfigModalOpen(true)}
        onOpenAddCardModal={() => {
          setAddCardDefaultCol('1');
          setIsAddCardModalOpen(true);
        }}
        onExportJson={handleExportJson}
        onOpenLoginGateway={() => {
          setIsLoggedIn(false);
          localStorage.removeItem('ai_course_v2_logged_in');
          setIsLoginGatewayOpen(true);
        }}
        rosterCount={registeredStudents.length}
        syncConnected={true}
        onOpenStudentProfile={() => setIsStudentProfileModalOpen(true)}
      />

      {/* 2. Email Confirmation Banner */}
      {showEmailBanner && currentStudent && (
        <EmailConfirmationBanner
          student={currentStudent}
          onDismiss={() => setShowEmailBanner(false)}
        />
      )}

      {/* 3. Main Two-Column Layout */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <Sidebar
          units={COURSE_UNITS}
          activeUnitId={activeUnitId}
          onSelectUnit={(id) => {
            setActiveUnitId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onScrollToSection={scrollToSection}
          completedEncounters={studentEncounters}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Active Unit View */}
          <UnitView
            unit={activeUnit}
            units={COURSE_UNITS}
            activeUnitId={activeUnitId}
            onSelectUnit={(id) => {
              setActiveUnitId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onScrollToSection={scrollToSection}
            dynamicCards={dynamicCards}
            userRole={userRole}
            isEditorMode={isEditorMode}
            completedEncounters={studentEncounters}
            onToggleEncounter={handleToggleEncounter}
            onOpenDetailModal={() => setIsOpenDetailModal(true)}
            onOpenAddCardModal={(col) => {
              setAddCardDefaultCol(col);
              setIsAddCardModalOpen(true);
            }}
            onRemoveDynamicCard={handleRemoveDynamicCard}
            onOpenAddMaterialModal={() => {
              setAddMaterialFolderId('M1');
              setIsAddMaterialModalOpen(true);
            }}
            currentStudent={currentStudent}
            onUpdateStudentProfile={handleUpdateStudentProfile}
          />

          {/* Bottom 4 Panels: Glossary, Books, Study Folders, Notebook & Quiz */}
          <BottomSections
            glossaryTerms={glossaryTerms}
            studyFolders={STUDY_FOLDERS}
            studyMaterials={studyMaterials}
            userRole={userRole}
            isEditorMode={isEditorMode}
            onOpenAddMaterialModal={(folderId) => {
              if (folderId) setAddMaterialFolderId(folderId);
              setIsAddMaterialModalOpen(true);
            }}
            onRemoveStudyMaterial={handleRemoveStudyMaterial}
            studentNotes={studentNotes}
            onSaveStudentNotes={handleSaveStudentNotes}
          />

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A1A1A]/15 bg-white py-4 px-6 text-center text-xs text-[#6E473B]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Corso Base: <strong>Capire e Usare l'Intelligenza Artificiale</strong> • LSA Centocelle</span>
          <span>Materiale didattico ad uso esclusivo dei partecipanti • 2026</span>
        </div>
      </footer>

      {/* Login Gateway Modal */}
      {isLoginGatewayOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
          <LoginGateway
            onLoginStudent={handleLoginStudent}
            onLoginAdmin={handleLoginAdmin}
            syncConnected={true}
            registeredStudents={registeredStudents}
            pendingStudents={pendingStudents}
            onAddPendingStudent={handleAddPendingStudent}
            onClose={() => setIsLoginGatewayOpen(false)}
          />
        </div>
      )}

      {/* Detail Comparative Table Modal */}
      <OpenDetailModal
        isOpen={isOpenDetailModal}
        onClose={() => setIsOpenDetailModal(false)}
      />

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        units={COURSE_UNITS}
        activeUnitId={activeUnitId}
        defaultColumn={addCardDefaultCol}
        onAddCard={handleAddDynamicCard}
      />

      {/* Add Material Modal */}
      <AddMaterialModal
        isOpen={isAddMaterialModalOpen}
        onClose={() => setIsAddMaterialModalOpen(false)}
        folders={STUDY_FOLDERS}
        defaultFolderId={addMaterialFolderId}
        onAddMaterial={handleAddStudyMaterial}
      />

      {/* Roster Modal */}
      <RosterModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        students={registeredStudents}
        pendingStudents={pendingStudents}
        onUpdateStudentLessons={handleUpdateStudentLessonsInRoster}
        onAddStudentManual={handleAddStudentManual}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        onAcceptPendingStudent={handleAcceptPendingStudent}
        onRejectPendingStudent={handleRejectPendingStudent}
      />

      {/* Email Config Modal */}
      <EmailConfigModal
        isOpen={isEmailConfigModalOpen}
        onClose={() => setIsEmailConfigModalOpen(false)}
        config={emailConfig}
        onSaveConfig={setEmailConfig}
      />

      {/* Student Profile Modal (Read-only for student) */}
      {isStudentProfileModalOpen && currentStudent && (
        <StudentProfileModal
          isOpen={true}
          onClose={() => setIsStudentProfileModalOpen(false)}
          student={currentStudent}
          isReadOnly={true}
        />
      )}

    </div>
  );
}
