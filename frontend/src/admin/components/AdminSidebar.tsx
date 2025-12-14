import React from 'react';
import type { Familia } from '../../types';

type View = 'resumen' | 'plan' | 'comunidad';

interface Props {
  familias: Familia[];
  selectedId: number | null;
  comunidadName: Record<number, string>;
  view: View;
  onChangeView: (v: View) => void;
  onSelectFamilia: (id: number | null) => void;
}

const AdminSidebar: React.FC<Props> = ({
  familias,
  selectedId,
  comunidadName,
  view,
  onChangeView,
  onSelectFamilia,
}) => (
  <aside className="sidebar">
    <div>
      <h2>Familia actual</h2>
      <select
        className="family-select"
        value={selectedId ?? ''}
        onChange={(e) => onSelectFamilia(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Selecciona una familia…</option>
        {familias.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nombre} ({f.comunidad?.nombre ?? comunidadName[f.comunidadId] ?? '—'})
          </option>
        ))}
      </select>
    </div>

    <div>
      <h2>Menú</h2>
      <div className="menu">
        {(
          [
            ['resumen', 'Resumen de ayni'],
            ['plan', 'Plan de ayuda'],
            ['comunidad', 'Comunidad'],
          ] as [View, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            className={`menu-btn ${view === id ? 'active' : ''}`}
            onClick={() => onChangeView(id)}
            type="button"
          >
            <span className="icon-dot" />
            {label}
          </button>
        ))}
      </div>
    </div>


  </aside>
);

export type { View };
export default AdminSidebar;
