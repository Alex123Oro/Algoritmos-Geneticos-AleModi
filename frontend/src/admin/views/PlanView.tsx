import React from 'react';
import type { AyudaAsignada, PlanResponse } from '../../types';

interface Props {
  ayudas: AyudaAsignada[];
  plan: PlanResponse | null;
  busy: boolean;
  onRefresh: () => void;
  onGenerate: () => void;
  formatDate: (value: string | Date) => string;
}

const PlanView: React.FC<Props> = ({ ayudas, plan, busy, onRefresh, onGenerate, formatDate }) => (
  <section>
    <div className="content-header">
      <div className="content-header-title">
        Plan de ayuda generado
        <span className="chip">Solución propuesta por el AG</span>
      </div>
      <div className="content-header-note">Distribución de ayudas generadas automáticamente.</div>
    </div>

    <div className="flex-between mt-md">
      <div className="section-title">
        <span className="icon-dot" /> Detalle de intercambios
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline" onClick={onRefresh}>
          Refrescar
        </button>
        <button className="btn btn-primary" onClick={onGenerate} disabled={busy}>
          {busy ? 'Generando…' : 'Generar plan'}
        </button>
      </div>
    </div>

    <table className="table mt-sm">
      <thead>
        <tr>
          <th>Día</th>
          <th>Quien ayuda</th>
          <th>A quién</th>
          <th>Tarea</th>
          <th>Horas</th>
        </tr>
      </thead>
      <tbody>
        {ayudas.map((a) => (
          <tr key={a.id}>
            <td>{formatDate(a.fecha)}</td>
            <td>{a.origen?.nombre ?? `Familia ${a.origenId}`}</td>
            <td>{a.destino?.nombre ?? `Familia ${a.destinoId}`}</td>
            <td>
              <span className="badge tipo-trabajo">{a.tipo}</span>
            </td>
            <td>{a.horas} h</td>
          </tr>
        ))}
        {!ayudas.length && (
          <tr>
            <td colSpan={5} className="note-muted">
              No hay ayudas asignadas todavía.
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {plan && (
      <div className="cards-grid mt-md">
        <div className="card">
          <h3>Ayudas creadas</h3>
          <div className="card-main">{plan.totalAyudas}</div>
          <div className="card-sub">Cantidad en el último plan generado.</div>
        </div>
        <div className="card">
          <h3>Fitness</h3>
          <div className="card-main">{plan.fitness.toFixed(3)}</div>
          <div className="card-sub">Calidad de la solución del AG.</div>
        </div>
        <div className="card">
          <h3>Equilibrio</h3>
          <div className="card-main">
            {typeof plan.detalleFitness.equilibrioAyni === 'number'
              ? plan.detalleFitness.equilibrioAyni.toFixed(3)
              : typeof plan.detalleFitness.maxDesbalance === 'number'
                ? (1 / (1 + plan.detalleFitness.maxDesbalance)).toFixed(3)
                : 'N/D'}
          </div>
          <div className="card-sub">Equidad entre familias.</div>
        </div>
        <div className="card">
          <h3>Cobertura</h3>
          <div className="card-main">
            {typeof plan.detalleFitness.coberturaSolicitudes === 'number'
              ? plan.detalleFitness.coberturaSolicitudes.toFixed(3)
              : 'N/D'}
          </div>
          <div className="card-sub">Porcentaje de solicitudes cubiertas.</div>
        </div>
      </div>
    )}
  </section>
);

export default PlanView;
