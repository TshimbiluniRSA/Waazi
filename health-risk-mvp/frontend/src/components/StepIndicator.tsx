interface Props { steps: string[]; current: number; }

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
              ${i < current  ? 'bg-teal-700 text-white' : ''}
              ${i === current ? 'bg-teal-700 text-white ring-4 ring-teal-100' : ''}
              ${i > current  ? 'bg-gray-100 text-gray-400' : ''}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 text-center hidden sm:block
              ${i === current ? 'text-teal-700 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1
              ${i < current ? 'bg-teal-700' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
