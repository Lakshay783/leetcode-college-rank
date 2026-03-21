"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Target, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { onboardSchema, type OnboardInput } from "@/validators/user.validator";

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null);
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardInput>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      name: "",
      collegeEmail: "",
      department: "Computer Science",
      year: "First Year",
      leetcodeUsername: "",
      collegeId: "",
    },
  });

  useEffect(() => {
    // Fetch colleges for dropdown
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges");
        if (res.ok) {
          const data = await res.json();
          setColleges(data);
        }
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchColleges();
  }, []);

  const onSubmit = async (data: OnboardInput) => {
    setError(null);
    try {
      const res = await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Failed to onboard. Please try again.");
        return;
      }

      // Show success state smoothly, then route
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/leaderboard";
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Polished Success State View
  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white/60 p-10 text-center shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Profile Completed!</h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Your data is saved. Syncing your stats and routing to the leaderboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Extracted premium Tailwind utilities
  const inputClass = "flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/20";
  const labelClass = "text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-300";

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6">
      {/* Premium Glassmorphic Form Card */}
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/50">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-4 border-b border-zinc-200/50 p-6 sm:p-8 dark:border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Setup Your Profile</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                We need your academic details and distinct LeetCode handle.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Polished Error Banner */}
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200/50 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} placeholder="e.g. John Doe" {...register("name")} />
                {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className={labelClass}>College Email</label>
                <input className={inputClass} type="email" placeholder="e.g. john@college.edu" {...register("collegeEmail")} />
                {errors.collegeEmail && <p className="text-xs font-medium text-red-500">{errors.collegeEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Department</label>
                <input className={inputClass} placeholder="e.g. Computer Science" {...register("department")} />
                {errors.department && <p className="text-xs font-medium text-red-500">{errors.department.message}</p>}
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Year of Study</label>
                <select className={inputClass} {...register("year")}>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                  <option value="Other">Other</option>
                </select>
                {errors.year && <p className="text-xs font-medium text-red-500">{errors.year.message}</p>}
              </div>

              <div className="space-y-2 border-t border-zinc-200/50 pt-4 md:col-span-2 md:border-t-0 md:pt-0 dark:border-zinc-800/50">
                <label className={labelClass}>LeetCode Username</label>
                <input className={inputClass} placeholder="e.g. johndoe123" {...register("leetcodeUsername")} />
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Must be your exact platform handle (e.g., neeti1).</p>
                {errors.leetcodeUsername && <p className="text-xs font-medium text-red-500">{errors.leetcodeUsername.message}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className={labelClass}>Select College</label>
                <select className={inputClass} {...register("collegeId")}>
                  <option value="" disabled>Choose your institution...</option>
                  {colleges.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
                {errors.collegeId && <p className="text-xs font-medium text-red-500">{errors.collegeId.message}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving Profile...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
