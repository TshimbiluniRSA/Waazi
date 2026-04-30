import { useEffect, useMemo, useState } from 'react';
import { faqs, facilities, questions } from './mockData';

function calculateRisk(answers) {
  let riskScore = 0;
  let diabetes = 0;
  let heart = 0;
  let hypertension = 0;

  if (answers.age >= 35) {
    riskScore += 1;
    diabetes += 1;
  }
  if (answers.age >= 45) {
    riskScore += 2;
    heart += 1;
    hypertension += 1;
  }
  if (answers.age >= 60) {
    riskScore += 1;
    diabetes += 1;
    heart += 1;
    hypertension += 1;
  }

  if (answers.exercise <= 2) {
    riskScore += 2;
    diabetes += 1;
    heart += 1;
    hypertension += 1;
  } else if (answers.exercise <= 4) {
    riskScore += 1;
    heart += 1;
  }

  if (answers.smoking === 'Current smoker') {
    riskScore += 3;
    heart += 2;
    hypertension += 1;
    diabetes += 1;
  } else if (answers.smoking === 'Former smoker') {
    riskScore += 1;
    heart += 1;
  }

  if (answers.vegetables < 3) {
    riskScore += 2;
    heart += 1;
    diabetes += 1;
  } else if (answers.vegetables < 5) {
    riskScore += 1;
  }

  if (answers.familyHistory === 'Yes') {
    riskScore += 2;
    diabetes += 2;
    heart += 1;
    hypertension += 1;
  } else if (answers.familyHistory === 'Not sure') {
    riskScore += 1;
  }

  if (answers.weight === 'Overweight (BMI 25-29.9)') {
    riskScore += 1;
    diabetes += 1;
    heart += 1;
    hypertension += 1;
  }

  if (answers.weight === 'Obesity (BMI 30+)') {
    riskScore += 3;
    diabetes += 2;
    heart += 2;
    hypertension += 2;
  }

  if (answers.bloodPressure === 'Elevated / borderline') {
    riskScore += 2;
    heart += 1;
    hypertension += 2;
  } else if (answers.bloodPressure === 'Diagnosed high blood pressure') {
    riskScore += 4;
    heart += 2;
    hypertension += 4;
    diabetes += 1;
  } else if (answers.bloodPressure === 'Not sure') {
    riskScore += 1;
    hypertension += 1;
  }

  return {
    overall: Math.round((riskScore / 20) * 100),
    diabetes: diabetes >= 5 ? 'High' : diabetes >= 3 ? 'Moderate' : 'Low',
    heart: heart >= 6 ? 'High' : heart >= 3 ? 'Moderate' : 'Low',
    hypertension: hypertension >= 7 ? 'High' : hypertension >= 4 ? 'Moderate' : 'Low'
  };
}

function riskClass(level) {
  if (level === 'High') return 'high';
  if (level === 'Moderate') return 'moderate';
  return 'low';
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('waazi-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [screen, setScreen] = useState('welcome');
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const currentQuestion = questions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / questions.length) * 100);
  const risks = useMemo(() => calculateRisk(answers), [answers]);

  const recommendations = useMemo(() => {
    const recs = [];
    const age = answers.age ?? 30;
    const isOlder = age >= 60;
    const isMidlife = age >= 45 && age < 60;
    const isEarlyAdult = age < 35;

    if (risks.overall >= 60) {
      recs.push({
        title: 'Book a comprehensive review',
        text: isOlder
          ? 'Your profile suggests elevated risk at your age. Prioritize a clinician visit in the next 2-4 weeks.'
          : isMidlife
            ? 'You have several risk factors. A structured clinician review is recommended soon.'
            : 'Multiple modifiable risks are present. A preventive checkup can help you course-correct early.',
        cost: isOlder ? 'ZAR 2,000 - 5,000' : 'ZAR 1,500 - 4,000'
      });
    }
    if (risks.diabetes !== 'Low') {
      recs.push({
        title: 'Blood sugar screening (FBS or HbA1c)',
        text: isEarlyAdult
          ? 'Confirm your baseline now and repeat periodically if lifestyle risks continue.'
          : isOlder
            ? 'Screen soon and discuss whether repeat testing every 3-6 months is needed.'
            : 'Use lab testing now to guide prevention and reduce long-term complications.',
        cost: 'ZAR 600 - 1,800'
      });
    }
    if (risks.heart !== 'Low') {
      recs.push({
        title: 'Cardiovascular risk review',
        text: isOlder
          ? 'Review BP, cholesterol, kidney function, and medication plan with a clinician.'
          : 'Discuss lipids, smoking status, and activity with a clinician for a targeted plan.',
        cost: isOlder ? 'ZAR 1,500 - 4,000' : 'ZAR 1,200 - 3,500'
      });
    }
    if (risks.hypertension !== 'Low') {
      recs.push({
        title: 'Repeat blood pressure checks',
        text: isOlder
          ? 'Take home or clinic BP readings across several days and review promptly for treatment planning.'
          : 'Take 2-3 readings on separate days to confirm trends before treatment decisions.',
        cost: 'ZAR 200 - 800'
      });
    }
    if ((answers.exercise ?? 7) <= 2) {
      recs.push({
        title: 'Increase weekly activity',
        text: isOlder
          ? 'Start gradually and target 150 minutes/week with low-impact activity plus balance/strength work.'
          : 'Aim for 150 minutes of moderate activity per week (for example, 30 min x 5 days).',
        cost: 'Free'
      });
    }
    if (answers.smoking === 'Current smoker') {
      recs.push({
        title: 'Tobacco cessation support',
        text: 'Quitting smoking is one of the fastest ways to reduce heart and stroke risk.',
        cost: 'ZAR 0 - 2,000'
      });
    }
    if ((answers.vegetables ?? 0) < 5) {
      recs.push({
        title: 'Nutrition reset',
        text: 'Target at least 5 fruit/vegetable servings daily and reduce sugary drinks.',
        cost: 'Free - ZAR 1,500'
      });
    }
    return recs;
  }, [answers.age, answers.exercise, answers.smoking, answers.vegetables, risks]);

  const onAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const startAssessment = () => {
    setScreen('assessment');
    setQuestionIndex(0);
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

  useEffect(() => {
    window.localStorage.setItem('waazi-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <button className="brand" onClick={() => setScreen('welcome')}>
            <span className="brand-mark">W</span>
            <span>
              <strong>Waazi Lite</strong>
              <small>Preventive Health</small>
            </span>
          </button>

          <nav className="top-nav">
            <button className={screen === 'welcome' ? 'nav-link active' : 'nav-link'} onClick={() => setScreen('welcome')}>Home</button>
            <button className={screen === 'assessment' ? 'nav-link active' : 'nav-link'} onClick={startAssessment}>Assessment</button>
            <button className={screen === 'results' ? 'nav-link active' : 'nav-link'} onClick={() => setScreen('results')} disabled={Object.keys(answers).length === 0}>Results</button>
            <button className={screen === 'facilities' ? 'nav-link active' : 'nav-link'} onClick={() => setScreen('facilities')}>Facilities</button>
          </nav>

          <div className="header-actions">
            <button className="btn btn-secondary theme-toggle" onClick={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button className="btn btn-primary" onClick={startAssessment}>Get Started</button>
          </div>
        </div>
      </header>

      <main className="container page-content">
        {screen === 'welcome' && (
          <>
            <section className="hero card">
              <div>
                <p className="eyebrow">Community Health Tools</p>
                <h1>Know your risk early, act before it gets serious.</h1>
                <p className="subtitle">
                  A simple screening experience for non-communicable disease risk using mock local data.
                  Complete it in about 2 minutes.
                </p>
                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={startAssessment}>Start Free Assessment</button>
                  <button className="btn btn-secondary" onClick={() => setScreen('facilities')}>View Nearby Facilities</button>
                </div>
              </div>

              <div className="hero-panel">
                <p className="small">What you get</p>
                <ul>
                  <li>Personalized risk score for key conditions</li>
                  <li>Actionable next steps with expected cost ranges</li>
                  <li>Nearby care options from mock facility data</li>
                </ul>
                <div className="kpi-grid">
                  <div>
                    <strong>2 min</strong>
                    <span>Average completion</span>
                  </div>
                  <div>
                    <strong>8</strong>
                    <span>Health factors assessed</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="info-grid">
              <article className="card info-card">
                <h3>How it works</h3>
                <ol>
                  <li>Answer a few lifestyle and history questions.</li>
                  <li>Get your instant risk snapshot.</li>
                  <li>Review recommended next steps and clinics.</li>
                </ol>
              </article>

              <article className="card info-card">
                <h3>Built for local context</h3>
                <p>
                  Costs and recommendations are presented in ZAR to mirror realistic journeys and help users plan care sooner.
                </p>
              </article>

              <article className="card info-card">
                <h3>Important note</h3>
                <p>
                  This app is a frontend demo with mock data. It is not a diagnosis and does not replace a licensed clinician.
                </p>
              </article>
            </section>
          </>
        )}

        {screen === 'assessment' && (
          <section className="card form-card">
            <p className="small">Question {questionIndex + 1} of {questions.length} · {progress}% complete</p>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>
            <h2>{currentQuestion.question}</h2>

            {currentQuestion.type === 'slider' ? (
              <div>
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={answers[currentQuestion.id] ?? currentQuestion.min}
                  onChange={(e) => onAnswer(Number(e.target.value))}
                />
                <p className="value">{answers[currentQuestion.id] ?? currentQuestion.min} {currentQuestion.unit}</p>
              </div>
            ) : (
              <div className="choices">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    className={answers[currentQuestion.id] === option ? 'choice active' : 'choice'}
                    onClick={() => onAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="row">
              {questionIndex > 0 && <button className="btn btn-secondary" onClick={() => setQuestionIndex((i) => i - 1)}>Back</button>}
              <button className="btn btn-primary" disabled={answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === ''} onClick={next}>
                {questionIndex === questions.length - 1 ? 'See Results' : 'Continue'}
              </button>
            </div>
          </section>
        )}

        {screen === 'results' && (
          <>
            <section className="card results-card">
              <div className="results-head">
                <h2>Your Risk Snapshot</h2>
                <div className="score">{risks.overall}%</div>
              </div>

              <div className="grid">
                <div className={`pill ${riskClass(risks.diabetes)}`}>Diabetes: <strong>{risks.diabetes}</strong></div>
                <div className={`pill ${riskClass(risks.heart)}`}>Heart Disease: <strong>{risks.heart}</strong></div>
                <div className={`pill ${riskClass(risks.hypertension)}`}>Hypertension: <strong>{risks.hypertension}</strong></div>
              </div>

              <h3>Recommended next steps</h3>
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
                <button className="btn btn-primary" onClick={() => setScreen('facilities')}>Find Nearby Facilities</button>
                <button className="btn btn-secondary" onClick={reset}>Start New Assessment</button>
              </div>
            </section>

            <button className="chat-btn" onClick={() => setChatOpen((v) => !v)}>FAQ</button>
            {chatOpen && (
              <aside className="chat-panel">
                <h4>Frequently asked questions</h4>
                {faqs.map((faq) => (
                  <details key={faq.q}>
                    <summary>{faq.q}</summary>
                    <p>{faq.a}</p>
                  </details>
                ))}
              </aside>
            )}
          </>
        )}

        {screen === 'facilities' && (
          <section className="card">
            <h2>Nearby Health Facilities</h2>
            <p className="subtitle">Mock facilities to simulate local options for screening and follow-up care.</p>
            <div className="stack">
              {facilities.map((facility) => (
                <article key={facility.name} className="facility">
                  <h3>{facility.name}</h3>
                  <p>{facility.distance} away · {facility.services}</p>
                  <p><strong>{facility.cost}</strong></p>
                  <button className="btn btn-primary">Call {facility.phone}</button>
                </article>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={() => setScreen('results')}>Back to Results</button>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>Waazi Lite</strong>
            <p>Mock-data preventive health prototype.</p>
          </div>
          <div>
            <strong>Product</strong>
            <p>Assessment · Results · Facilities</p>
          </div>
          <div>
            <strong>Support</strong>
            <p>FAQ available inside results page</p>
          </div>
          <div>
            <strong>Disclaimer</strong>
            <p>Educational tool only, not medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
