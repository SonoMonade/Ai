import React, { useState } from 'react';
import { TOKEN_SIMULATION_PRESETS } from '../../data/courseData';
import { X, Sparkles, Sliders, RefreshCw, ArrowRight, Lightbulb } from 'lucide-react';

interface TokenPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Candidate {
  word: string;
  probability: number;
}

export const TokenPredictorModal: React.FC<TokenPredictorModalProps> = ({ isOpen, onClose }) => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [sentence, setSentence] = useState(TOKEN_SIMULATION_PRESETS[0].phrase);
  const [temperature, setTemperature] = useState(0.3);
  const [candidates, setCandidates] = useState<Candidate[]>(TOKEN_SIMULATION_PRESETS[0].candidates);
  const [history, setHistory] = useState<string[]>([TOKEN_SIMULATION_PRESETS[0].phrase]);

  if (!isOpen) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    const preset = TOKEN_SIMULATION_PRESETS[idx];
    setSentence(preset.phrase);
    setCandidates(preset.candidates);
    setHistory([preset.phrase]);
  };

  const handlePickCandidate = (chosenWord: string) => {
    const newSentence = `${sentence} ${chosenWord}`;
    setSentence(newSentence);
    setHistory(prev => [...prev, newSentence]);

    // Generate dynamic next candidates based on the continuation
    const nextCandidates = generateNextCandidates(chosenWord);
    setCandidates(nextCandidates);
  };

  const handleReset = () => {
    handleSelectPreset(selectedPresetIdx);
  };

  // Dynamic next token simulator for interactive step-by-step continuation
  function generateNextCandidates(lastWord: string): Candidate[] {
    const lower = lastWord.toLowerCase();
    if (lower.includes('tappeto') || lower.includes('divano')) {
      return [
        { word: 'del', probability: 45 },
        { word: 'in', probability: 28 },
        { word: 'rosso', probability: 18 },
        { word: 'e', probability: 9 }
      ];
    }
    if (lower.includes('caffè') || lower.includes('cappuccino')) {
      return [
        { word: 'caldo', probability: 42 },
        { word: 'senza', probability: 31 },
        { word: 'con', probability: 19 },
        { word: 'al', probability: 8 }
      ];
    }
    if (lower.includes('colosseo')) {
      return [
        { word: 'a', probability: 52 },
        { word: 'durante', probability: 26 },
        { word: 'famoso', probability: 14 },
        { word: 'costruito', probability: 8 }
      ];
    }
    // Generic realistic distribution adjusted by temperature
    return [
      { word: 'molto', probability: Math.round(35 * (1.1 - temperature * 0.3)) },
      { word: 'sempre', probability: Math.round(25 * (1.1 - temperature * 0.3)) },
      { word: 'insieme', probability: Math.round(22 * (0.8 + temperature * 0.4)) },
      { word: 'forse', probability: Math.round(18 * (0.7 + temperature * 0.6)) }
    ];
  }

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] max-w-2xl w-full p-6 sm:p-7 rounded-sm shadow-2xl max-h-[92vh] overflow-y-auto custom-scroll">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#1B4D5C] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F6E8B1]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Simulatore Didattico • Modulo 1 · Incontro 2
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#C85A32]">
                Come Sceglie la Prossima Parola (Token)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation Note */}
        <div className="bg-[#F7F5F0] border-l-2 border-[#1B4D5C] p-3 rounded-xs text-xs text-[#1A1A1A]/90 space-y-1 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-[#1B4D5C] uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Cosa stai sperimentando:</span>
          </div>
          <p>
            Un modello AI (come ChatGPT o Gemini) non "pensa" all'intera frase in anticipo: calcola la probabilità di ogni parola successiva e sceglie tra le più probabili.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E473B] block mb-1.5">
            Scegli un esempio di partenza:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {TOKEN_SIMULATION_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`p-2 text-left rounded-sm border transition-colors cursor-pointer truncate ${
                  selectedPresetIdx === idx
                    ? 'bg-[#1B4D5C] text-white border-[#1B4D5C] font-bold'
                    : 'bg-white hover:bg-[#EFECE6] border-[#1A1A1A]/15 text-[#1A1A1A]'
                }`}
              >
                "{p.phrase}..."
              </button>
            ))}
          </div>
        </div>

        {/* Current Sentence Box */}
        <div className="p-4 bg-[#EFECE6] border border-[#1A1A1A]/20 rounded-sm mb-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#6E473B] mb-1">
            <span>Testo generato finora:</span>
            <button
              onClick={handleReset}
              className="text-[#1B4D5C] hover:text-[#C85A32] flex items-center gap-1 cursor-pointer font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Azzera</span>
            </button>
          </div>
          <p className="font-serif text-lg font-bold text-[#1A1A1A] leading-relaxed">
            "{sentence} <span className="inline-block w-2.5 h-5 bg-[#C85A32] animate-pulse ml-0.5 align-middle" />"
          </p>
        </div>

        {/* Candidates List with Probabilities */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E473B]">
              Parole candidate calcolate dall'AI:
            </span>
            <span className="text-[11px] text-[#6E473B] italic">
              Fai clic su una parola per continuare la frase
            </span>
          </div>

          <div className="space-y-2">
            {candidates.map((cand, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickCandidate(cand.word)}
                className="w-full text-left p-2.5 bg-white border border-[#1A1A1A]/20 hover:border-[#1B4D5C] rounded-sm transition-all cursor-pointer group hover:bg-[#F7F5F0]"
              >
                <div className="flex items-center justify-between mb-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#1B4D5C]">
                      "{cand.word}"
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] bg-[#246A4E] text-white px-1.5 py-0.2 rounded-xs uppercase font-bold">
                        Più probabile
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#C85A32]">
                    {cand.probability}%
                  </span>
                </div>

                {/* Probability Bar */}
                <div className="w-full h-2 bg-[#EFECE6] rounded-xs overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      idx === 0 ? 'bg-[#1B4D5C]' : 'bg-[#C85A32]'
                    }`}
                    style={{ width: `${cand.probability}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Controller */}
        <div className="p-3 bg-[#F7F5F0] border border-[#1A1A1A]/15 rounded-sm space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#6E473B] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-[#1B4D5C]" />
              <span>Parametro "Temperatura" (Creatività vs Precisione):</span>
            </span>
            <span className="font-bold text-[#1B4D5C] bg-white px-2 py-0.5 border border-[#1A1A1A]/15 rounded-sm text-[11px]">
              {temperature.toFixed(1)} {temperature < 0.4 ? '• Prudente' : temperature < 0.7 ? '• Equilibrato' : '• Creativo'}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-[#1B4D5C] cursor-pointer"
          />
          <p className="text-[11px] text-[#1A1A1A]/80 leading-relaxed">
            A temperatura bassa (0.1 - 0.3) l'AI sceglie quasi sempre la parola numero 1 (utile per riassunti e compiti precisi). A temperatura alta (0.8 - 1.0) sceglie anche parole meno scontate (utile per poesie o racconti fantastici).
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-5 pt-3 border-t border-[#1A1A1A]/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4D5C] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] transition-colors cursor-pointer"
          >
            Chiudi Simulatore
          </button>
        </div>

      </div>
    </div>
  );
};
