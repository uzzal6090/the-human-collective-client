"use client";

import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/auth-context";
import {
  getUserProfileApi,
  updateUserProfileApi,
  getMyEventsApi,
  getMyJoinedEventsApi,
} from "@/src/lib/api";

export default function ProfilePage() {
  const { user, refreshSession } = useAuth();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [createdCount, setCreatedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getUserProfileApi(),
      getMyEventsApi(),
      getMyJoinedEventsApi(),
    ])
      .then(([profile, myEvents, joinedEvents]) => {
        if (isMounted) {
          if (profile) {
            setName(profile.name || "");
            setImage(profile.image || "");
            setEmail(profile.email || "");
          } else if (user) {
            setName(user.name || "");
            setImage(user.image || "");
            setEmail(user.email || "");
          }

          if (profile?.createdAt) {
            const date = new Date(profile.createdAt);
            setCreatedAt(
              !Number.isNaN(date.getTime())
                ? date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : ""
            );
          }

          setCreatedCount(myEvents.length);
          setJoinedCount(joinedEvents.length);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading profile data:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await updateUserProfileApi({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        await refreshSession();
      } else {
        toast.error(res.message || "Failed to update profile.");
      }
    } catch {
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Page Header */}
      <section className="border-b border-border bg-surface-secondary px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Account Management
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            View your community contributions and update your personal profile details.
          </p>
        </div>
      </section>

      {/* Main Profile Form & Stats */}
      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            /* Loading Skeleton */
            <div className="space-y-6">
              <div className="h-44 animate-pulse rounded-3xl border border-border bg-surface" />
              <div className="h-80 animate-pulse rounded-3xl border border-border bg-surface" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Card & Activity Summary */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    {/* Live Avatar Preview */}
                    <div className="relative">
                      {image ? (
                        <img
                          src={image}
                          alt={name || "User avatar"}
                          className="h-20 w-20 rounded-2xl object-cover ring-4 ring-primary/10"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-button-primary text-2xl font-bold text-white shadow-md">
                          {name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-white ring-2 ring-surface">
                        ✓
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                        {name || user?.name}
                      </h2>
                      <p className="text-sm text-muted">
                        {email || user?.email}
                      </p>
                      {createdAt && (
                        <p className="mt-1 text-xs text-muted">
                          Member since {createdAt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="flex gap-4 border-t border-border pt-4 sm:border-0 sm:pt-0">
                    <div className="rounded-2xl border border-border bg-surface-secondary px-5 py-3 text-center">
                      <p className="text-2xl font-extrabold text-primary">
                        {createdCount}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Events Hosted
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface-secondary px-5 py-3 text-center">
                      <p className="text-2xl font-extrabold text-accent">
                        {joinedCount}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Events Joined
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form (PDF Optional Task #2) */}
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground sm:text-xl">
                    Edit Personal Information
                  </h3>
                  <p className="text-sm text-muted">
                    Update your display name and public profile avatar photo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="profileName"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      id="profileName"
                      type="text"
                      required
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Email (Readonly) */}
                  <div>
                    <label
                      htmlFor="profileEmail"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Email Address
                    </label>
                    <input
                      id="profileEmail"
                      type="email"
                      disabled
                      value={email || user?.email || ""}
                      className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-secondary px-4 py-3.5 text-sm text-muted opacity-80"
                    />
                    <p className="mt-1.5 text-xs text-muted">
                      Your primary email is linked to your authentication credentials.
                    </p>
                  </div>

                  {/* Profile Photo URL */}
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Profile Photo URL
                    </label>
                    <input
                      id="profileImage"
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    <p className="mt-1.5 text-xs text-muted">
                      Paste a direct image URL (e.g. from Unsplash, Imgur, or GitHub).
                    </p>
                  </div>

                  {/* Form Submit */}
                  <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-button-primary px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-button-primary-hover hover:text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save Profile Changes"}
                      <span aria-hidden="true">✓</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
