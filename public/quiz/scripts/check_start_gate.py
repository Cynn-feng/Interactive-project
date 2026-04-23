from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[3]
QUIZ_DIR = ROOT / "public" / "quiz"


REQUIRED_HTML = [
    'id="quiz-start-panel"',
    'id="quiz-start"',
    'id="quiz-play-area"',
    "quiz-play-area--hidden",
]

REQUIRED_JS = [
    "started: false",
    "els.start",
    "startQuiz",
    "showStartView",
    "quiz-play-area--hidden",
]


def missing_tokens(path, tokens):
    text = path.read_text(encoding="utf-8")
    return [token for token in tokens if token not in text]


def main():
    problems = []
    for token in missing_tokens(QUIZ_DIR / "index.html", REQUIRED_HTML):
        problems.append(f"index.html missing {token}")
    for token in missing_tokens(QUIZ_DIR / "quiz.js", REQUIRED_JS):
        problems.append(f"quiz.js missing {token}")

    if problems:
        print("Quiz start-gate check failed:")
        for problem in problems:
            print(f"- {problem}")
        return 1

    print("Quiz start-gate check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
