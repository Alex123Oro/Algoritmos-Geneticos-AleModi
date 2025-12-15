import React, { useEffect, useState } from 'react';
import { api } from './api';
import type { Comunidad, LoginResponse } from './types';
import { saveSession } from './auth';

interface Props {
  onSuccess: (session: LoginResponse) => void;
}

const Login: React.FC<Props> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreFamilia, setNombreFamilia] = useState('');
  const [miembros, setMiembros] = useState('');
  const [comunidadId, setComunidadId] = useState('');
  const [comunidadNueva, setComunidadNueva] = useState(false);
  const [comunidadNombre, setComunidadNombre] = useState('');
  const [comunidadRegion, setComunidadRegion] = useState('');
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'register' && !comunidadNueva) {
      void api<Comunidad[]>('/comunidades')
        .then((data) => {
          setComunidades(data);
          if (!comunidadId && data[0]?.id) setComunidadId(String(data[0].id));
        })
        .catch((err) => setError((err as Error).message));
    }
  }, [mode, comunidadId, comunidadNueva]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Ingresa email y contraseña.');
      return;
    }
    if (mode === 'register') {
      const miembrosNum = Number(miembros);
      if (!nombreFamilia || !miembros || Number.isNaN(miembrosNum) || miembrosNum < 1) {
        setError('Completa nombre de familia y número de miembros.');
        return;
      }
      if (comunidadNueva) {
        if (!comunidadNombre || !comunidadRegion) {
          setError('Completa nombre y región de la nueva comunidad.');
          return;
        }
      } else {
        if (!comunidadId || Number.isNaN(Number(comunidadId))) {
          setError('Selecciona una comunidad.');
          return;
        }
      }
    }
    try {
      setBusy(true);
      const res =
        mode === 'login'
          ? await api<LoginResponse>('/auth/login', { method: 'POST', json: { email, password } })
          : await api<LoginResponse>('/auth/register/family', {
              method: 'POST',
              json: {
                email,
                password,
                nombreFamilia,
                miembros: Number(miembros),
                comunidadId: comunidadNueva ? undefined : Number(comunidadId),
                comunidadNombre: comunidadNueva ? comunidadNombre : undefined,
                comunidadRegion: comunidadNueva ? comunidadRegion : undefined,
              },
            });
      saveSession({ token: res.token, role: res.role, familiaId: res.familiaId ?? null });
      onSuccess(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-tabs">
          {[
            ['login', 'Ingresar'],
            ['register', 'Crear cuenta familia'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`login-tab ${mode === id ? 'active' : ''}`}
              onClick={() => setMode(id as 'login' | 'register')}
            >
              {label}
            </button>
          ))}
        </div>
        <h1>{mode === 'login' ? 'Ingresar a AYNI-PLUS-AG' : 'Registro de familia'}</h1>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Usa tus credenciales (ADMIN o FAMILIA).'
            : 'Crea la cuenta de tu familia con sus datos básicos.'}
        </p>
        <form onSubmit={submit} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ayni.com"
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {mode === 'register' && (
            <>
              <label className="login-toggle">
                <input
                  type="checkbox"
                  checked={comunidadNueva}
                  onChange={(e) => setComunidadNueva(e.target.checked)}
                />
                Crear nueva comunidad
              </label>
              {comunidadNueva ? (
                <>
                  <label>
                    Nombre de la comunidad
                    <input
                      type="text"
                      value={comunidadNombre}
                      onChange={(e) => setComunidadNombre(e.target.value)}
                      placeholder="Comunidad Andina"
                    />
                  </label>
                  <label>
                    Región
                    <select value={comunidadRegion} onChange={(e) => setComunidadRegion(e.target.value)}>
                      <option value="">Selecciona</option>
                      {['Altiplano', 'Valles', 'Chaco', 'Yungas', 'Amazonía', 'Otra'].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <label>
                  Comunidad
                  <select value={comunidadId} onChange={(e) => setComunidadId(e.target.value)}>
                    <option value="">Selecciona</option>
                    {comunidades.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.region})
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Nombre de la familia
                <input
                  type="text"
                  value={nombreFamilia}
                  onChange={(e) => setNombreFamilia(e.target.value)}
                  placeholder="Familia Quispe"
                />
              </label>
              <label>
                Número de miembros
                <input
                  type="number"
                  value={miembros}
                  onChange={(e) => setMiembros(e.target.value)}
                  placeholder="Ej: 4"
                  min={1}
                />
              </label>
            </>
          )}
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={busy} className="login-btn">
            {busy ? (mode === 'login' ? 'Accediendo…' : 'Creando cuenta…') : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
