'use client';

interface Problem {
  id: number;
  title: string;
  description: string;
}

interface ProblemsListProps {
  problems: Problem[];
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ProblemsList({
  problems,
  onConfirm,
  isLoading,
}: ProblemsListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">🔍</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Identifikované problémy
        </h2>
        <p className="text-gray-600">
          Na základě tvých odpovědí jsem identifikoval tyto hlavní oblasti k řešení.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-indigo-600" />
        <div className="w-8 h-1 rounded bg-indigo-600" />
        <div className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
        <div className="w-8 h-1 rounded bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
        <span className="ml-2 text-sm text-gray-500">Krok 2/3</span>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {problems.map((problem, index) => (
          <div
            key={problem.id}
            className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1"
          >
            {/* Number Badge */}
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
              {index + 1}
            </div>

            <div className="mt-2">
              <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                {problem.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <p className="text-sm text-blue-800">
            Pokud souhlasíš s těmito problémy, klikni na tlačítko níže a já ti připravím konkrétní doporučení.
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
              <span>Připravuji doporučení...</span>
            </>
          ) : (
            <>
              <span>✅</span>
              <span>Potvrdit a získat doporučení</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
