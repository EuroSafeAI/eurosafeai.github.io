import { BENCHMARK_SOURCES, rowLabel, type Row } from "@/lib/leaderboard";

/**
 * A benchmark's name, linked to the paper or repository defining it where one
 * is recorded in BENCHMARK_SOURCES and plain text where none is.
 *
 * The underline is dotted rather than solid: these sit inside a dense grid of
 * labels, and a solid rule on every benchmark name read as emphasis rather
 * than as a link.
 */
export const BenchmarkName: React.FC<{ row: Extract<Row, { level: "bench" }> }> = ({ row }) => {
  const source = BENCHMARK_SOURCES[row.bench];
  const name = rowLabel(row);
  if (!source) return <>{name}</>;

  return (
    <a
      href={source}
      target="_blank"
      rel="noopener noreferrer"
      // The label column is a rowheader inside a grid; without this the click
      // lands on whatever row interaction the surrounding cell defines.
      onClick={(event) => event.stopPropagation()}
      title={`${name}: open the source paper`}
      style={{
        color: "inherit",
        textDecoration: "underline dotted",
        textDecorationColor: "rgba(10,31,77,0.35)",
        textUnderlineOffset: 2,
      }}
    >
      {name}
    </a>
  );
};
