export const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // Same-origin relative path in browser; proxied by next.config.ts rewrites
    : process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      "https://the-human-collective-server.vercel.app";

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
export async function getRecentEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events/recent`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching recent events:", err);
    return [];
  }
}

// 2. Fetch All Upcoming Events (with optional search and category filter)
export async function getAllEvents(search?: string, category?: string): Promise<EventItem[]> {
  try {
    const params = new URLSearchParams();
    if (search && search.trim() !== "") params.append("search", search.trim());
    if (category && category !== "all") params.append("category", category);

    const url = `${API_BASE_URL}/api/events${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    return [];
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

// 4. Create Event (Protected)
export async function createEventApi(eventData: CreateEventInput): Promise<{ success: boolean; data?: EventItem; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: "DELETE",
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/events/${id}/join`, {
      method: "POST",
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/events/user/my-events`, {
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/events/user/joined-events`, {
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      credentials: "include",
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
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
