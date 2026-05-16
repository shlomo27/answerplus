interface Props {
  content: string;
  conclusion: string;
}

export default function SummaryCard({ content, conclusion }: Props) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✦</span>
        <h2 className="text-lg font-bold text-indigo-800">סיכום ומסקנה</h2>
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full mr-auto">
          AI Summary
        </span>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">{content}</p>

      <div className="bg-white border border-indigo-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-indigo-500 mb-1 uppercase tracking-wide">
          המסקנה הטובה ביותר
        </p>
        <p className="text-gray-900 font-medium leading-snug">{conclusion}</p>
      </div>
    </div>
  );
}
