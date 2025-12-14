import React from 'react';
import type { SolicitudAyuda } from '../../types';

interface Stats {
  totalFamilias: number;
  totalSolicitudes: number;
  pendientes: number;
  totalAyudas: number;
  horasDadas: number;
  horasRecibidas: number;
}

interface Props {
  stats: Stats;
  solicitudesPendientes: SolicitudAyuda[];
}

const ComunidadView: React.FC<Props> = ({ stats, solicitudesPendientes }) => (
  <section>
    <div className="content-header">
      <div className="content-header-title">
        Vista comunitaria
        <span className="chip">Equilibrio global del ayni</span>
      </div>
      <div className="content-header-note">Nivel de reciprocidad y tareas pendientes.</div>
    </div>

    <div className="cards-grid">
      <div className="card">
        <h3>Familias activas</h3>
        <div className="card-main">{stats.totalFamilias}</div>
        <div className="card-sub">Familias registradas.</div>
      </div>
      <div className="card">
        <h3>Horas dadas</h3>
        <div className="card-main">{stats.horasDadas} h</div>
        <div className="card-sub">Trabajo total ofrecido.</div>
      </div>
      <div className="card">
        <h3>Horas recibidas</h3>
        <div className="card-main">{stats.horasRecibidas} h</div>
        <div className="card-sub">Trabajo total recibido.</div>
      </div>
      <div className="card">
        <h3>Solicitudes pendientes</h3>
        <div className="card-main">{stats.pendientes}</div>
        <div className="card-sub">De {stats.totalSolicitudes} solicitudes totales.</div>
      </div>
    </div>

    <div className="section-title mt-md">
      <span className="icon-dot" /> Tareas comunitarias pendientes
    </div>

    <table className="table mt-sm">
      <thead>
        <tr>
          <th>Tarea</th>
          <th>Familia beneficiaria</th>
          <th>Estado</th>
          <th>Prioridad</th>
        </tr>
      </thead>
      <tbody>
        {solicitudesPendientes.map((s) => (
          <tr key={s.id}>
            <td>{s.descripcion}</td>
            <td>{s.familia?.nombre ?? `Familia ${s.familiaId}`}</td>
            <td>
              <span className="badge pendiente">{s.estado}</span>
            </td>
            <td className="text-muted">{s.urgencia}</td>
          </tr>
        ))}
        {!solicitudesPendientes.length && (
          <tr>
            <td colSpan={4} className="note-muted">
              No hay solicitudes pendientes.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </section>
);

export type { Stats as ComunidadStats };
export default ComunidadView;
