from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[3]
SCRIPTS_DIR = ROOT / 'public' / 'quiz' / 'scripts'
IMAGES_DIR = ROOT / 'public' / 'quiz' / 'images'

BANNED_TEXT = [
    ' deg',
    'radius',
    'side',
    'diameter',
    'perimeter',
    'Circle Segment Diagram',
    'Central and Inscribed Angles',
    'Cyclic Quadrilateral',
    'Tangent',
    'Hexagon',
    'Chords',
    'Externally Tangent Circles',
    'Find the Opposite Angle',
    'Equal Distance from the Centre',
]

STRING_RE = re.compile(r"'((?:''|[^'])*)'")
DRAWABLE_VALUE_RE = re.compile(r"\b(?:Title|\w*Label)\s*=\s*'((?:''|[^'])*)'")


def iter_drawable_strings(path):
    text = path.read_text(encoding='utf-8-sig')
    for line_no, line in enumerate(text.splitlines(), 1):
        if 'Draw-Title' in line or 'Draw-Label' in line:
            for match in STRING_RE.finditer(line):
                yield line_no, match.group(1).replace("''", "'")
            continue
        for match in DRAWABLE_VALUE_RE.finditer(line):
            yield line_no, match.group(1).replace("''", "'")


def check_script_text():
    problems = []
    for path in sorted(SCRIPTS_DIR.glob('generate_quiz*.ps1')):
        for line_no, literal in iter_drawable_strings(path):
            lowered = literal.lower()
            for banned in BANNED_TEXT:
                if banned.lower() in lowered:
                    problems.append(f'{path.relative_to(ROOT)}:{line_no}: banned image text {banned!r} in {literal!r}')
    return problems


def check_images_exist():
    problems = []
    for index in range(1, 101):
        path = IMAGES_DIR / f'q{index}.png'
        if not path.exists():
            problems.append(f'missing image: {path.relative_to(ROOT)}')
    return problems


def main():
    problems = check_script_text() + check_images_exist()
    if problems:
        print('Quiz image check failed:')
        for problem in problems:
            print(f'- {problem}')
        return 1
    print('Quiz image check passed: no banned diagram text and q1-q100 exist.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
