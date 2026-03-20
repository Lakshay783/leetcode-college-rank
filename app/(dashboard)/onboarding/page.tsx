"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Target, AlertCircle, CheckCircle2 } from "lucide-react";
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

      // Success! DO NOT redirect to leaderboard yet, just show success state.
      setIsSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-1 h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold tracking-tight">Onboarding Complete!</h2>
        <p className="text-muted-foreground">
          Your profile has been saved. The leaderboard data will sync shortly.
        </p>
      </div>
    );
  }

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="font-semibold leading-none tracking-tight text-2xl">Complete Your Profile</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            We need a few details to get you onto the college leaderboard.
          </p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <input className={inputClass} placeholder="John Doe" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">College Email</label>
                <input className={inputClass} type="email" placeholder="john@college.edu" {...register("collegeEmail")} />
                {errors.collegeEmail && <p className="text-sm text-destructive">{errors.collegeEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Department</label>
                <input className={inputClass} placeholder="Computer Science, IT, etc." {...register("department")} />
                {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Year of Study</label>
                <select className={inputClass} {...register("year")}>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                  <option value="Other">Other</option>
                </select>
                {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">LeetCode Username</label>
                <input className={inputClass} placeholder="johndoe123" {...register("leetcodeUsername")} />
                <p className="text-xs text-muted-foreground">Your exact LeetCode platform username.</p>
                {errors.leetcodeUsername && <p className="text-sm text-destructive">{errors.leetcodeUsername.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Select College</label>
                <select className={inputClass} {...register("collegeId")}>
                  <option value="" disabled>Select a college...</option>
                  {colleges.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
                {errors.collegeId && <p className="text-sm text-destructive">{errors.collegeId.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
              {isSubmitting ? "Saving Profile..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
