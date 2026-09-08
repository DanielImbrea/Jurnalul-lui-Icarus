export async function fetchAdminJson<T>(
  url: string,
  init?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      credentials: "same-origin",
      ...init,
      headers: {
        ...(init?.headers ?? {})
      }
    });

    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      return {
        data: null,
        error: res.ok
          ? "Răspuns invalid de la server."
          : `Eroare server (${res.status}).`
      };
    }

    if (!res.ok) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof (payload as { error?: unknown }).error === "string"
          ? (payload as { error: string }).error
          : `Eroare server (${res.status}).`;
      return { data: null, error: message };
    }

    return { data: payload as T, error: null };
  } catch {
    return {
      data: null,
      error: "Nu am putut contacta serverul. Verifică conexiunea și reîncearcă."
    };
  }
}
