const isProduction = process.env.NODE_ENV === "production";
const productionServerUrl = "https://the-human-collective-server.vercel.app";

export const API_BASE_URL = (() => {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (isProduction) {
    // Never use localhost in production; fall back to the production server.
    if (!configured || configured.includes("localhost")) {
      return productionServerUrl;
    }
    return configured;
  }
  return configured || "http://localhost:5000";
})();

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  date: string;
  creatorEmail: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchEventsError {
  type: "network" | "http";
  message: string;
  status?: number;
}

export interface FetchEventsResult {
  data: EventItem[] | null;
  error: FetchEventsError | null;
}

export interface JoinedEventItem {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDescription: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  joinedAt: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  date: string;
}

// 1. Fetch 6 Recent Upcoming Events (for Home Page)
export async function getRecentEvents(): Promise<FetchEventsResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/recent`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        data: null,
        error: {
          type: "http",
          message: `Failed to fetch recent events (HTTP ${res.status})`,
          status: res.status,
        },
      };
    }
    const data = await res.json();
    return { data: data.data || [], error: null };
  } catch (err) {
    console.error("Error fetching recent events:", err);
    return {
      data: null,
      error: {
        type: "network",
        message: "Network error fetching recent events. Please check your connection.",
      },
    };
  }
}

// 2. Fetch All Upcoming Events (with optional search and category filter)
export async function getAllEvents(
  search?: string,
  category?: string
): Promise<FetchEventsResult> {
  try {
    const params = new URLSearchParams();
    if (search && search.trim() !== "") params.append("search", search.trim());
    if (category && category !== "all") params.append("category", category);

    const url = `${API_BASE_URL}/api/events${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        data: null,
        error: {
          type: "http",
          message: `Failed to fetch upcoming events (HTTP ${res.status})`,
          status: res.status,
        },
      };
    }
    const data = await res.json();
    return { data: data.data || [], error: null };
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    return {
      data: null,
      error: {
        type: "network",
        message: "Network error fetching upcoming events. Please check your connection.",
      },
    };
  }
}

// 3. Fetch Single Event Details
export async function getEventById(id: string): Promise<EventItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error("Error fetching event details:", err);
    return null;
  }
}

// Helper to get authentication headers (combining Bearer token if present with cookies)
export function getAuthHeaders(custom?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    ...custom,
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("session_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

// Token refresh state for 401 retry logic.
// Set by AuthProvider via setTokenRefresher(fetchJwt) on mount.
let tokenRefresher: (() => Promise<void>) | null = null;
let refreshInProgress: Promise<void> | null = null;

/**
 * Registers a token refresh callback (called by AuthProvider on mount).
 * Used by fetchWithAuth to refresh the JWT on 401 responses.
 */
export function setTokenRefresher(cb: () => Promise<void>) {
  tokenRefresher = cb;
}

/**
 * Ensures a fresh JWT by calling the registered refresher once.
 * Deduplicates concurrent calls so simultaneous 401s trigger only one refresh.
 */
async function ensureFreshToken(): Promise<void> {
  if (!tokenRefresher) return;
  if (refreshInProgress) return refreshInProgress;
  refreshInProgress = tokenRefresher().finally(() => {
    refreshInProgress = null;
  });
  return refreshInProgress;
}

/**
 * Fetch wrapper that attaches Bearer token and handles one-time 401 refresh + retry.
 * - Does NOT retry 403 responses (ownership/authorization failure, not token expiry).
 * - Retries a 401 at most once (prevents infinite retry loops).
 * - Prevents duplicate simultaneous token refresh requests.
 * - Falls back to the original response when no refresher is registered.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = getAuthHeaders(init.headers as Record<string, string> | undefined);
  let res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  // One-time 401 refresh + retry. Skip 403 (not a token issue).
  if (res.status === 401 && tokenRefresher) {
    await ensureFreshToken();
    const retryHeaders = getAuthHeaders(init.headers as Record<string, string> | undefined);
    res = await fetch(input, {
      ...init,
      headers: retryHeaders,
      credentials: "include",
    });
  }

  return res;
}

// 4. Create Event (Protected)
export async function createEventApi(eventData: CreateEventInput): Promise<{ success: boolean; data?: EventItem; message?: string }> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to create event" };
    }
    return { success: true, data: data.data, message: data.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error creating event";
    return { success: false, message: msg };
  }
}

// 5. Update Event (Protected)
export async function updateEventApi(id: string, eventData: CreateEventInput): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update event" };
    }
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error updating event";
    return { success: false, message: msg };
  }
}

// 6. Delete Event (Protected)
export async function deleteEventApi(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/events/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to delete event" };
    }
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error deleting event";
    return { success: false, message: msg };
  }
}

// 7. Join Event (Protected)
export async function joinEventApi(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/events/${id}/join`, {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to join event" };
    }
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error joining event";
    return { success: false, message: msg };
  }
}

// 8. Fetch My Created Events (Protected)
export async function getMyEventsApi(): Promise<EventItem[]> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/events/user/my-events`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching my events:", err);
    return [];
  }
}

// 9. Fetch My Joined Events (Protected, sorted by date)
export async function getMyJoinedEventsApi(): Promise<JoinedEventItem[]> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/events/user/joined-events`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching my joined events:", err);
    return [];
  }
}

// 10. Fetch User Profile
export async function getUserProfileApi(): Promise<{ name: string; email: string; image?: string; createdAt?: string } | null> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/user/profile`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

// 11. Update User Profile
export async function updateUserProfileApi(payload: { name: string; image?: string }): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update profile" };
    }
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error updating profile";
    return { success: false, message: msg };
  }
}
