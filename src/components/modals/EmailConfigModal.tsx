import React, { useState } from 'react';
import { EmailConfig } from '../../types';
import { X, Mail, CheckCircle2 } from 'lucide-react';

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: EmailConfig;
  onSaveConfig: (config: EmailConfig) => void;
}

export const EmailConfigModal: React.FC<EmailConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [serviceId, setServiceId] = useState(config.serviceId || '');
  const [templateId, setTemplateId] = useState(config.templateId || '');
  const [publicKey, setPublicKey] = useState(config.publicKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      serviceId: serviceId.trim(),
      templateId: templateId.trim(),
      publicKey: publicKey.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#1A1A1A] max-w-md w-full p-6 rounded-sm shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#1B4D5C]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E473B]">
                Impostazioni Docente
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1B4D5C]">
                Invio Email Automatico (EmailJS)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi finestra"
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#1A1A1A]/80 mb-3 leading-relaxed">
          Per inviare email silenziose in automatico agli studenti senza aprire il client di posta locale, puoi inserire le credenziali gratuite del servizio <strong>EmailJS</strong> (opzionale):
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="ejs-service" className="block font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Service ID
            </label>
            <input
              id="ejs-service"
              type="text"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              placeholder="service_xxxxxxx"
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label htmlFor="ejs-template" className="block font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Template ID
            </label>
            <input
              id="ejs-template"
              type="text"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              placeholder="template_xxxxxxx"
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label htmlFor="ejs-key" className="block font-bold uppercase tracking-wider text-[#6E473B] mb-1">
              Public Key
            </label>
            <input
              id="ejs-key"
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="user_xxxxxxxxxxxx"
              className="w-full border border-[#1A1A1A]/30 bg-[#F7F5F0] px-3 py-2 rounded-sm focus:outline-none focus:border-[#1B4D5C] text-[#1A1A1A]"
            />
          </div>

          {savedSuccess && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Configurazione salvata con successo!</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#1A1A1A]/30 font-bold uppercase tracking-wider rounded-sm hover:bg-[#EFECE6] text-[#1A1A1A] cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1B4D5C] text-white font-bold uppercase tracking-wider rounded-sm hover:bg-[#123540] transition-colors cursor-pointer"
            >
              Salva Impostazioni
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
