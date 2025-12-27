'use client';

interface Problem {
  id: number;
  title: string;
  description: string;
}

interface Recommendation {
  problem_id: number;
  advice: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
  problems: Problem[];
  onReset: () => void;
}

// Color palette for recommendation cards
const cardStyles = [
  {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200',
    title: 'text-indigo-800',
    icon: '💜',
  },
  {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
    title: 'text-emerald-800',
    icon: '💚',
  },
  {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    title: 'text-amber-800',
    icon: '💛',
  },
];

export default function Recommendations({
  recommendations,
  problems,
  onReset,
}: RecommendationsProps) {
  // Create a map for quick problem lookup
  const problemMap = new Map(problems.map((p) => [p.id, p]));

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
          <span className="text-3xl">🎯</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Tvá doporučení
        </h2>
        <p className="text-gray-600">
          Na základě identifikovaných problémů jsem připravil konkrétní kroky, které ti pomohou.
        </p>
      </div>

      {/* Step Indicator - Completed */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="w-8 h-1 rounded bg-green-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="w-8 h-1 rounded bg-green-500" />
        <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100" />
        <span className="ml-2 text-sm text-green-600 font-medium">Hotovo!</span>
      </div>

      {/* Recommendations */}
      <div className="space-y-5 mb-8">
        {recommendations.map((rec, index) => {
          const problem = problemMap.get(rec.problem_id);
          const style = cardStyles[index % cardStyles.length];

          return (
            <div
              key={rec.problem_id}
              className={`rounded-2xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${style.bg}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <span className="text-2xl">{style.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                      Problém {index + 1}
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${style.title}`}>
                    {problem?.title || `Problém ${rec.problem_id}`}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {rec.advice}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Žádná doporučení k zobrazení</p>
        </div>
      )}

      {/* Success Message */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">🌟</span>
          <div>
            <p className="text-sm text-green-800 font-medium">
              Skvělá práce!
            </p>
            <p className="text-sm text-green-700 mt-1">
              První krok ke změně je uvědomění si problémů. Teď je čas začít pracovat na jejich řešení.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          <span>Začít znovu</span>
        </button>
      </div>
    </div>
  );
}
