"use client";

import { useState } from "react";
import { QuestionForm } from "@/components/QuestionForm";
import ProblemsList from "@/components/ProblemsList";
import Recommendations from "@/components/Recommendations";

type Step = "form" | "problems" | "recommendations";

interface Problem {
  id: number;
  title: string;
  description: string;
}

interface Recommendation {
  problem_id: number;
  advice: string;
}

interface FormData {
  feeling: string;
  troubles: string;
  changes: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to analyze problems");
      }

      const result = await response.json();
      setProblems(result.problems);
      setStep("problems");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmProblems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problems }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to get recommendations");
      }

      const result = await response.json();
      setRecommendations(result.recommendations);
      setStep("recommendations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setProblems([]);
    setRecommendations([]);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Zavrit
          </button>
        </div>
      )}

      {/* Step: Form */}
      {step === "form" && (
        <QuestionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}

      {/* Step: Problems List */}
      {step === "problems" && (
        <ProblemsList
          problems={problems}
          onConfirm={handleConfirmProblems}
          isLoading={isLoading}
        />
      )}

      {/* Step: Recommendations */}
      {step === "recommendations" && (
        <Recommendations
          recommendations={recommendations}
          problems={problems}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
