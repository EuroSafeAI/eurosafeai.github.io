"""Prune src/data/models.json after a verbatim refresh from the pipeline.

Line-based on purpose: reserialising the file reformats parts of the tree the
pipeline wrote, so removals delete whole lines and repair the trailing comma
left behind instead.

Usage:  python3 scripts/prune-models.py src/data/models.json
"""
import json
import sys

RETIRED_SCORERS = (
    '"openrouter/google/gemini-3-flash-preview"',
    '"openrouter/openai/gpt-5-mini"',
)
UNPUBLISHED_MODEL_IDS = ("muse-spark-1.2",)


def drop_unpublished_models(lines):
    kept, depth, entry_start, entry_id = [], 0, None, None
    for line in lines:
        if depth == 1 and line.strip() == "{":
            entry_start, entry_id = len(kept), None
        if entry_start is not None and line.strip().startswith('"id":'):
            entry_id = json.loads(line.strip().rstrip(",").split(":", 1)[1].strip())
        depth += line.count("{") + line.count("[") - line.count("}") - line.count("]")
        kept.append(line)
        if entry_start is not None and depth == 1 and line.strip().rstrip(",") == "}":
            if entry_id in UNPUBLISHED_MODEL_IDS:
                del kept[entry_start:]
            entry_start, entry_id = None, None
    return kept


def repair_trailing_commas(lines):
    for i, line in enumerate(lines[:-1]):
        if line.rstrip().endswith(",") and lines[i + 1].lstrip()[:1] in "}]":
            lines[i] = line.rstrip()[:-1]
    return lines


def main(path):
    lines = open(path).read().split("\n")
    lines = [l for l in lines if not l.lstrip().startswith(RETIRED_SCORERS)]
    lines = repair_trailing_commas(drop_unpublished_models(lines))
    text = "\n".join(lines)
    models = json.loads(text)
    print(f"{len(models)} models")
    open(path, "w").write(text)


main(sys.argv[1])
