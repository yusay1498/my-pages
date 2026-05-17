/** GitHub の言語カラーマッピング（主要言語のみ） */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  HCL: '#844FBA',
};

type LanguageBadgeProps = {
  readonly language: string;
};

export const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  const color = LANGUAGE_COLORS[language] ?? '#6b7280';

  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block size-3 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {language}
    </span>
  );
};
