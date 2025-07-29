'use client';

import { useEffect, useState } from 'react';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  // ✅ Load questions from public/questions.json
  useEffect(() => {
    fetch('/questions.json')
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  // Timer logic
  useEffect(() => {
    if (!questions.length || isFinished || showReview) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleNext();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current, isFinished, questions]);

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setTimeLeft(15);
    } else {
      setIsFinished(true);
    }
  };

  const handleReview = () => {
    setShowReview(true);
  };

  if (!questions.length) {
    return <p className="text-center mt-10 text-gray-600">Loading quiz...</p>;
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center bg-white text-gray-800">
      {!isFinished && !showReview && (
        <div className="max-w-lg w-full space-y-6 text-center">
          <div className="text-sm text-gray-500">Time Left: {timeLeft}s</div>
          <h2 className="text-2xl font-semibold">{questions[current].question}</h2>
          <div className="space-y-3">
            {questions[current].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`w-full py-2 rounded-lg font-medium transition
                  ${
                    selected
                      ? opt === questions[current].answer
                        ? 'bg-green-500 text-white'
                        : opt === selected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
                disabled={!!selected}
              >
                {opt}
              </button>
            ))}
          </div>

          {selected && (
            <button
              onClick={handleNext}
              className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
            >
              {current + 1 === questions.length ? 'Finish Quiz' : 'Next'}
            </button>
          )}
        </div>
      )}

      {isFinished && !showReview && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Quiz Finished!</h2>
          <p className="text-xl">Your score: {score} / {questions.length}</p>
          <button
            onClick={handleReview}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Review Answers
          </button>
        </div>
      )}

      {showReview && (
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Review</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow">
              <p className="font-semibold mb-2">{q.question}</p>
              <p className="text-green-700">
                ✅ Correct Answer: <strong>{q.answer}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
