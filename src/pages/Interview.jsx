import { useState, useEffect, useCallback } from "react";
import questions from "../utils/questions";
import "./Interview.css";

function Interview({ user, restart }) {
  const [ques, setQues] = useState([]);
  const [index, setIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);

  // 🔹 Load questions
  useEffect(() => {
    const data = questions
      .filter((q) => q.topic === user.topic)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    setQues(data);
  }, [user.topic]);

  // 🔹 handleNext (FIXED)
  const handleNext = useCallback(() => {
    if (!ques[index]) return;

    const correctWords = ques[index].answer.toLowerCase().split(" ");
    const userAns = currentAnswer.toLowerCase();

    let match = 0;

    for (let word of correctWords) {
      if (userAns.includes(word)) match++;
    }

    const isCorrect = match >= correctWords.length / 2;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const updatedAnswers = [...allAnswers, currentAnswer || "Not Answered"];
    setAllAnswers(updatedAnswers);

    // 💾 Save final result
    if (index === ques.length - 1) {
      localStorage.setItem(
        "interviewResult",
        JSON.stringify({
          name: user.name,
          topic: user.topic,
          score: score + (isCorrect ? 1 : 0),
          answers: updatedAnswers,
          date: new Date().toLocaleString(),
        })
      );
    }

    setCurrentAnswer("");
    setIndex((prev) => prev + 1);
    setTime(30);
  }, [index, ques, currentAnswer, allAnswers, score, user]);

  // 🔹 Timer
  useEffect(() => {
    if (ques.length === 0) return;

    if (time === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, ques, handleNext]);

  // 🎤 Voice Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setCurrentAnswer(text);
    };
  };

  // 🤖 Feedback
  const getFeedback = (userAns, correctAns) => {
    if (!userAns) return "❌ Not Attempted";

    const correctWords = correctAns.toLowerCase().split(" ");
    const userText = userAns.toLowerCase();

    let match = 0;

    for (let word of correctWords) {
      if (userText.includes(word)) match++;
    }

    if (match === correctWords.length) return "🔥 Perfect Answer!";
    if (match >= correctWords.length / 2) return "✅ Good Answer";
    return "⚠️ Improve your answer";
  };

  // 🔹 history
  const history = JSON.parse(
    localStorage.getItem("interviewResult") || "null"
  );

  // 🔹 loading
  if (ques.length === 0) {
    return <h2>Loading...</h2>;
  }

  // 🔹 final screen
  if (index >= ques.length) {
    return (
      <div className="container">
        <h2>🎉 Interview Finished</h2>

        <h3>
          Score: {score} / {ques.length}
        </h3>

        {allAnswers.map((ans, i) => (
          <div key={i} className="result-card">
            <p>
              <strong>Q{i + 1}:</strong> {ques[i]?.question}
            </p>
            <p>
              <strong>Your Ans:</strong> {ans}
            </p>
            <p>
              <strong>Correct Ans:</strong> {ques[i]?.answer}
            </p>
            <p>
              <strong>Feedback:</strong>{" "}
              {getFeedback(ans, ques[i]?.answer)}
            </p>
          </div>
        ))}

        {history && (
          <div style={{ marginTop: "20px" }}>
            <h3>📜 Previous Interview</h3>
            <p>Name: {history.name}</p>
            <p>Topic: {history.topic}</p>
            <p>Score: {history.score}</p>
            <p>Date: {history.date}</p>
          </div>
        )}

        <button onClick={restart}>Restart Interview</button>
      </div>
    );
  }

  // 🔹 main UI
  return (
    <div className="container">
      <div className="top-bar">
        <h2>Welcome, {user.name}</h2>

        <div className={`timer ${time <= 5 ? "red" : ""}`}>
          ⏱️ {time}s
        </div>
      </div>

      <h3>Topic: {user.topic}</h3>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${((index + 1) / ques.length) * 100}%`,
          }}
        ></div>
      </div>

      <h4>
        Question {index + 1} / {ques.length}
      </h4>

      <h3 className="question">{ques[index]?.question}</h3>

      <input
        type="text"
        placeholder="Type or speak your answer..."
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
      />

      <div className="button-group">
        <button onClick={startListening}>🎤 Speak</button>

        <button
          onClick={handleNext}
          disabled={currentAnswer.trim() === ""}
        >
          Next Question
        </button>
      </div>
    </div>
  );
}

export default Interview;