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
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Identifikovane problemy
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {problems.map((problem, index) => (
          <div
            key={problem.id}
            className="relative bg-white border border-gray-200 rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-2">
              {problem.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {problem.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
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
              Zpracovavam...
            </span>
          ) : (
            "Potvrdit problemy"
          )}
        </button>
      </div>
    </div>
  );
}
