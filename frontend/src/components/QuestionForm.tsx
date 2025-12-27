'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface QuestionFormProps {
  onSubmit: (data: {
    feeling: string;
    troubles: string;
    changes: string;
  }) => void;
  isLoading: boolean;
}

interface FormData {
  feeling: string;
  troubles: string;
  changes: string;
}

const questions = [
  {
    id: 'feeling',
    label: 'Jak se dnes cítíš?',
    placeholder: 'Popiš, jak se právě teď cítíš...',
    icon: '💭',
  },
  {
    id: 'troubles',
    label: 'Co tě v poslední době trápí?',
    placeholder: 'Co tě nejvíc tíží nebo znepokojuje...',
    icon: '🤔',
  },
  {
    id: 'changes',
    label: 'Co bys chtěl/a změnit?',
    placeholder: 'Jaké změny by ti pomohly...',
    icon: '✨',
  },
];

export function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    feeling: '',
    troubles: '',
    changes: '',
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.feeling.trim() && formData.troubles.trim() && formData.changes.trim();
  const filledCount = [formData.feeling, formData.troubles, formData.changes].filter(v => v.trim()).length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">🧭</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pojďme na to společně
        </h2>
        <p className="text-gray-600">
          Odpověz na 3 jednoduché otázky a já ti pomohu identifikovat hlavní oblasti pro zlepšení.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={`w-3 h-3 rounded-full transition-colors ${filledCount >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        <div className={`w-8 h-1 rounded transition-colors ${filledCount >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        <div className={`w-3 h-3 rounded-full transition-colors ${filledCount >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        <div className={`w-8 h-1 rounded transition-colors ${filledCount >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        <div className={`w-3 h-3 rounded-full transition-colors ${filledCount >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`} />
        <span className="ml-2 text-sm text-gray-500">{filledCount}/3</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
          >
            <label htmlFor={q.id} className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-3">
              <span className="text-2xl">{q.icon}</span>
              <span>{q.label}</span>
              <span className="ml-auto text-sm font-normal text-gray-400">
                {index + 1}/3
              </span>
            </label>
            <textarea
              id={q.id}
              name={q.id}
              value={formData[q.id as keyof FormData]}
              onChange={handleChange}
              disabled={isLoading}
              placeholder={q.placeholder}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all text-gray-700 placeholder-gray-400"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Analyzuji tvou situaci...</span>
              </>
            ) : (
              <>
                <span>🎯</span>
                <span>Získat radu od kouče</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
