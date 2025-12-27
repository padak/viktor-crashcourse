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
const cardColors = [
  'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200',
  'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
  'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200',
  'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
  'bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200',
];

const titleColors = [
  'text-indigo-800',
  'text-emerald-800',
  'text-amber-800',
  'text-rose-800',
  'text-cyan-800',
  'text-violet-800',
];

export default function Recommendations({
  recommendations,
  problems,
  onReset,
}: RecommendationsProps) {
  // Create a map for quick problem lookup
  const problemMap = new Map(problems.map((p) => [p.id, p]));

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Vase doporuceni
        </h2>
        <p className="text-gray-600">
          Na zaklade vasich odpovedi jsme pripravili nasledujici rady
        </p>
      </div>

      <div className="space-y-6 mb-10">
        {recommendations.map((rec, index) => {
          const problem = problemMap.get(rec.problem_id);
          const colorIndex = index % cardColors.length;

          return (
            <div
              key={rec.problem_id}
              className={`rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${cardColors[colorIndex]}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-semibold mb-3 ${titleColors[colorIndex]}`}
                  >
                    {problem?.title || `Problem ${rec.problem_id}`}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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
          <p>Zadna doporuceni k zobrazeni</p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
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
          Zacit znovu
        </button>
      </div>
    </div>
  );
}
