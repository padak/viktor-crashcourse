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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto px-4">
      {/* Question 1: How are you feeling today? */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <label htmlFor="feeling" className="block text-lg font-medium text-gray-800 mb-3">
          Jak se dnes citis?
        </label>
        <textarea
          id="feeling"
          name="feeling"
          value={formData.feeling}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Popis, jak se dnes citis..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-colors"
        />
      </div>

      {/* Question 2: What troubles you lately? */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <label htmlFor="troubles" className="block text-lg font-medium text-gray-800 mb-3">
          Co te v posledni dobe trapi?
        </label>
        <textarea
          id="troubles"
          name="troubles"
          value={formData.troubles}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Popis, co te trapi..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-colors"
        />
      </div>

      {/* Question 3: What would you like to change? */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <label htmlFor="changes" className="block text-lg font-medium text-gray-800 mb-3">
          Co bys chtel zmenit?
        </label>
        <textarea
          id="changes"
          name="changes"
          value={formData.changes}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Popis, co bys chtel zmenit..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-colors"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
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
              <span>Zpracovavam...</span>
            </>
          ) : (
            <span>Ziskat radu od kouce</span>
          )}
        </button>
      </div>
    </form>
  );
}
