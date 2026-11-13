import React from 'react';
import { X, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface OpenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenDetailModal: React.FC<OpenDetailModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] max-w-2xl w-full p-6 sm:p-7 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto custom-scroll">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
              Modulo 1 · Incontro 2 — Approfondimento
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#246A4E]">
              Ricerca su Internet vs Generazione di Risposte
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm text-[#1A1A1A]/90 leading-relaxed">
          <p>
            <strong>Differenza chiave:</strong> un motore di ricerca tradizionale (come Google Search) cerca e restituisce link a pagine reali già pubblicate sul web. L'<strong>AI generativa</strong> invece non "cerca" una risposta pronta: genera parola dopo parola una frase nuova calcolando ciò che è statisticamente più probabile.
          </p>
          <p>
            <strong>La "Scatola Nera" e le Allucinazioni:</strong> poiché questi modelli elaborano miliardi di connessioni matematiche opache ("scatola nera"), quando non conoscono un dettaglio possono inventarlo con tono estremamente sicuro. Ecco perché la <strong>regola d'oro</strong> resta invariata: <em>l'umano resta sempre al centro delle decisioni</em>.
          </p>

          {/* Comparative Table */}
          <div className="overflow-x-auto border border-[#1A1A1A]/20 rounded-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#1B4D5C] text-white uppercase tracking-wider">
                <tr>
                  <th className="p-3">Aspetto</th>
                  <th className="p-3">Ricerca su Internet</th>
                  <th className="p-3">AI Generativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/15 bg-[#F7F5F0]">
                <tr>
                  <td className="p-3 font-bold text-[#6E473B]">Come lavora</td>
                  <td className="p-3">Trova e ordina pagine web esistenti</td>
                  <td className="p-3">Genera un testo nuovo sul momento</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6E473B]">Fonti</td>
                  <td className="p-3">Vedi subito il sito da cui proviene il dato</td>
                  <td className="p-3">Sintesi statistica ("Scatola Nera")</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6E473B]">Tipo di errore</td>
                  <td className="p-3">Trovi siti vecchi o poco pertinenti</td>
                  <td className="p-3">Allucinazioni (dati inventati con sicurezza)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#6E473B]">Uso ideale</td>
                  <td className="p-3">Verificare fatti, orari, prezzi e fonti ufficiali</td>
                  <td className="p-3">Riassumere, scrivere bozze, organizzare idee</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Human-in-the-loop Box */}
          <div className="bg-[#F7F5F0] border-l-2 border-[#246A4E] p-4 rounded-xs text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#246A4E] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>La Regola del Pilota Umano (in 3 passaggi obbligatori):</span>
            </div>
            <div className="space-y-1.5 text-[#1A1A1A]/90 pl-1">
              <p>
                <strong>1. PRIMA:</strong> Tu imposti l'obiettivo, dai istruzioni chiare e rimuovi tutti i dati privati o sensibili prima dell'invio.
              </p>
              <p>
                <strong>2. DURANTE:</strong> L'AI fa la prima bozza veloce, offrendoti spunti, sintesi e alternative in pochi secondi.
              </p>
              <p>
                <strong>3. DOPO:</strong> Tu rileggi con occhio critico, verifichi che i fatti siano veri e firmi il risultato con la tua responsabilità.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-3 border-t border-[#1A1A1A]/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] transition-colors cursor-pointer"
          >
            Ho Capito • Chiudi Scheda
          </button>
        </div>

      </div>
    </div>
  );
};
