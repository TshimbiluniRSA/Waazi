import { useMemo, useState } from 'react';
import { faqs, facilities, questions } from './mockData';

function calculateRisk(answers) {
  let riskScore = 0;
  let diabetes = 0;
  let heart = 0;
  let hypertension = 0;

  if (answers.age > 45) riskScore += 2;
  if (answers.age > 60) riskScore += 1;

  if (answers.exercise < 3) {
    riskScore += 2;
    diabetes += 1;
    heart += 1;
  }

  if (answers.smoking === 'Yes') {
    riskScore += 3;
    heart += 2;
    hypertension += 1;
  }

  if (answers.vegetables < 3) {
    riskScore += 1;
    diabetes += 1;
  }

  if (answers.familyHistory === 'Yes') {
    riskScore += 2;
    diabetes += 2;
    heart += 1;
    hypertension += 2;
  }

  if (answers.weight === 'Overweight' || answers.weight === 'Obese') {
    riskScore += 2;
    diabetes += 2;
    hypertension += 1;
  }

  if (answers.stress > 7) {
    riskScore += 1;
    hypertension += 1;
  }

  return {
    overall: Math.round((riskScore / 14) * 100),
    diabetes: diabetes > 3 ? 'High' : diabetes > 1 ? 'Moderate' : 'Low',
    heart: heart > 2 ? 'High' : heart > 1 ? 'Moderate' : 'Low',
    hypertension: hypertension > 2 ? 'High' : hypertension > 1 ? 'Moderate' : 'Low'
  };
}

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const currentQuestion = questions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / questions.length) * 100);
  const risks = useMemo(() => calculateRisk(answers), [answers]);

  const recommendations = useMemo(() => {
    const recs = [];
    if (risks.overall > 50) {
      recs.push({ title: 'Schedule a Health Screening', text: 'Your risk score suggests a checkup soon.', cost: 'KES 1,500 - 3,000' });
    }
    if (risks.diabetes !== 'Low') {
      recs.push({ title: 'Diabetes Screening', text: 'Get your blood sugar tested for early detection.', cost: 'KES 500 - 1,000' });
    }
    if (risks.hypertension !== 'Low') {
      recs.push({ title: 'Blood Pressure Check', text: 'Monitor your blood pressure regularly.', cost: 'KES 200 - 500' });
    }
    if ((answers.exercise ?? 7) < 3) {
      recs.push({ title: 'Increase Physical Activity', text: 'Aim for 30 mins at least 5 days/week.', cost: 'Free' });
    }
    return recs;
  }, [answers.exercise, risks]);

  const onAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const next = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setScreen('results');
    }
  };

  const reset = () => {
    setScreen('welcome');
    setQuestionIndex(0);
    setAnswers({});
    setChatOpen(false);
  };

  if (screen === 'welcome') {
    return (
      <main className="page">
        <section className="card center">
          <h1>Waazi Lite</h1>
          <p className="subtitle">Frontend prototype with mock data</p>
          <ul className="feature-list">
            <li>✅ 2-minute self-assessment</li>
            <li>✅ Risk score summary</li>
            <li>✅ Mock nearby facility list</li>
          </ul>
          <button onClick={() => setScreen('assessment')}>Start Assessment →</button>
        </section>
      </main>
    );
  }

  if (screen === 'assessment') {
    const value = answers[currentQuestion.id];
    const complete = value !== undefined && value !== '';

    return (
      <main className="page">
        <section className="card">
          <p className="small">Question {questionIndex + 1} of {questions.length} · {progress}%</p>
          <div className="progress"><span style={{ width: `${progress}%` }} /></div>
          <h2>{currentQuestion.question}</h2>

          {currentQuestion.type === 'slider' ? (
            <div>
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={value ?? currentQuestion.min}
                onChange={(e) => onAnswer(Number(e.target.value))}
              />
              <p className="value">{value ?? currentQuestion.min} {currentQuestion.unit}</p>
            </div>
          ) : (
            <div className="choices">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  className={value === option ? 'choice active' : 'choice'}
                  onClick={() => onAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <div className="row">
            {questionIndex > 0 && <button className="secondary" onClick={() => setQuestionIndex((i) => i - 1)}>← Back</button>}
            <button disabled={!complete} onClick={next}>{questionIndex === questions.length - 1 ? 'See Results' : 'Next →'}</button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'results') {
    return (
      <main className="page">
        <section className="card">
          <h2>Your Health Risk Assessment</h2>
          <div className="score">{risks.overall}% overall risk</div>

          <div className="grid">
            <div className="pill">Diabetes: <strong>{risks.diabetes}</strong></div>
            <div className="pill">Heart: <strong>{risks.heart}</strong></div>
            <div className="pill">Hypertension: <strong>{risks.hypertension}</strong></div>
          </div>

          <h3>Recommended Next Steps</h3>
          <div className="stack">
            {recommendations.map((item) => (
              <article key={item.title} className="recommendation">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
                <small>{item.cost}</small>
              </article>
            ))}
          </div>

          <div className="row">
            <button onClick={() => setScreen('facilities')}>Find Nearby Health Facilities</button>
            <button className="secondary" onClick={reset}>Start New Assessment</button>
          </div>
        </section>

        <button className="chat-btn" onClick={() => setChatOpen((v) => !v)}>💬</button>
        {chatOpen && (
          <aside className="chat-panel">
            <h4>FAQ</h4>
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </aside>
        )}
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <h2>Nearby Health Facilities</h2>
        <div className="stack">
          {facilities.map((facility) => (
            <article key={facility.name} className="facility">
              <h3>{facility.name}</h3>
              <p>{facility.distance} away · {facility.services}</p>
              <p><strong>{facility.cost}</strong></p>
              <button>Call {facility.phone}</button>
            </article>
          ))}
        </div>
        <button className="secondary" onClick={() => setScreen('results')}>← Back to Results</button>
      </section>
    </main>
  );
}
