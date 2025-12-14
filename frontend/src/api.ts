const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';

type Options = RequestInit & { json?: unknown };

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...(json ? { body: JSON.stringify(json) } : {}),
    ...rest,
  });

  const text = await res.text();

  if (!res.ok) {
    const message = text || `Error HTTP ${res.status}`;
    throw new Error(message);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // Respuesta plana (ej. string)
    return text as unknown as T;
  }
}

export { API_URL };
