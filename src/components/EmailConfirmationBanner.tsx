import React from 'react';
import { StudentProfile } from '../types';
import { CheckCircle2, Send, X } from 'lucide-react';

interface EmailConfirmationBannerProps {
  student: StudentProfile | null;
  onDismiss: () => void;
}

export const EmailConfirmationBanner: React.FC<EmailConfirmationBannerProps> = ({
  student,
  onDismiss
}) => {
  if (!student) return null;

  const subject = encodeURIComponent("Conferma iscrizione — Corso: Capire e Usare l'Intelligenza Artificiale");
  const body = encodeURIComponent(
    `Ciao ${student.firstName} ${student.lastName},\n\n` +
    `la tua registrazione al corso "Capire e Usare l'Intelligenza Artificiale" (LSA Centocelle) è confermata!\n\n` +
    `• Email registrata: ${student.email}\n` +
    `• Struttura del corso: 4 Moduli / 10 Incontri pratici\n` +
    `• Incontri completati finora: ${student.completedLessons} / 10\n\n` +
    `Buono studio nell'aula digitale!`
  );
  const mailtoUrl = `mailto:glr.angelini@gmail.com?subject=${subject}&body=${body}`;

  return (
    <div className="bg-[#246A4E] text-white border-b border-[#1A1A1A]/20 px-4 py-2.5 text-xs shadow-2xs">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#F6E8B1]" />
          <span>
            <strong>Iscrizione confermata per {student.firstName} {student.lastName} ({student.email})!</strong> Ricevuta pronta.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={mailtoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-[#F6E8B1] flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apri copia nella tua app Email</span>
          </a>
          <button
            onClick={onDismiss}
            aria-label="Chiudi avviso"
            className="text-white/80 hover:text-white cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
