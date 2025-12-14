import React, { useEffect, useMemo, useState } from 'react';
import type { TipoAyuda, Urgencia } from '../../types';
import { tipoAyudaOptions, urgenciaOptions } from '../constants';

export interface HelpRequestValues {
  tipo: TipoAyuda | '';
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  horasEstimadas: string;
  urgencia: Urgencia | '';
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: HelpRequestValues) => void;
  busy?: boolean;
  familiaNombre?: string;
}

const RequestHelpSheet: React.FC<Props> = ({ open, onClose, onSubmit, busy, familiaNombre }) => {
  const defaultForm = useMemo(() => {
    const toInput = (date: Date) => {
      const offset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };
    const start = new Date();
    const end = new Date();
    end.setHours(end.getHours() + 3);

    return {
      tipo: '' as const,
      descripcion: '',
      fechaInicio: toInput(start),
      fechaFin: toInput(end),
      horasEstimadas: '2',
      urgencia: 'MEDIA' as const,
    };
  }, []);

  const [form, setForm] = useState<HelpRequestValues>(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(defaultForm);
    }
  }, [open, defaultForm]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="client-overlay" role="dialog" aria-modal="true">
      <div className="client-sheet">
        <header>
          <div>
            <p className="client-muted" style={{ margin: 0 }}>
              Para: {familiaNombre ?? 'Mi familia'}
            </p>
            <h3>Pedir ayuda</h3>
          </div>
          <button className="close" onClick={onClose} type="button">
            Cerrar
          </button>
        </header>

        <form className="client-form" onSubmit={handleSubmit}>
          <label>
            <span>Tipo de ayuda</span>
            <select
              value={form.tipo}
              onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as TipoAyuda }))}
            >
              <option value="">-- Selecciona --</option>
              {tipoAyudaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Urgencia</span>
            <select
              value={form.urgencia}
              onChange={(e) => setForm((prev) => ({ ...prev, urgencia: e.target.value as Urgencia }))}
            >
              <option value="">-- Selecciona --</option>
              {urgenciaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Fecha inicio</span>
            <input
              type="datetime-local"
              value={form.fechaInicio}
              onChange={(e) => setForm((prev) => ({ ...prev, fechaInicio: e.target.value }))}
            />
          </label>

          <label>
            <span>Fecha fin</span>
            <input
              type="datetime-local"
              value={form.fechaFin}
              onChange={(e) => setForm((prev) => ({ ...prev, fechaFin: e.target.value }))}
            />
          </label>

          <label>
            <span>Horas estimadas</span>
            <input
              type="number"
              min="1"
              value={form.horasEstimadas}
              onChange={(e) => setForm((prev) => ({ ...prev, horasEstimadas: e.target.value }))}
              placeholder="Ej. 4"
            />
          </label>

          <label className="full">
            <span>Descripción</span>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Cuenta brevemente qué necesitas"
            />
          </label>

          <div className="client-actions full">
            <button type="button" className="client-btn-secondary" onClick={onClose} disabled={busy}>
              Cancelar
            </button>
            <button type="submit" className="client-btn-cta" disabled={busy}>
              {busy ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestHelpSheet;
