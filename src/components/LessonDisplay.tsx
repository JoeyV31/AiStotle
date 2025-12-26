import { LessonContent } from '../services/geminiService';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, SPACING } from '../constants';

interface LessonDisplayProps {
  lesson: LessonContent;
}

export function LessonDisplay({ lesson }: LessonDisplayProps) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        boxShadow: SHADOWS.lg,
        maxWidth: '900px',
        margin: '0 auto',
        animation: 'fadeIn 0.5s ease-in',
      }}
      className="lesson-display"
    >
      {/* Title */}
      <h1
        style={{
          fontFamily: TYPOGRAPHY.heading,
          fontSize: '2.5rem',
          color: COLORS.pennBlue,
          margin: `0 0 ${SPACING.lg} 0`,
          fontWeight: 700,
          borderBottom: `3px solid ${COLORS.pennRed}`,
          paddingBottom: SPACING.md,
        }}
        className="print-title"
      >
        {lesson.title}
      </h1>

      {/* Objectives */}
      {lesson.objectives.length > 0 && (
        <section style={{ marginBottom: SPACING.lg }}>
          <h2
            style={{
              fontFamily: TYPOGRAPHY.heading,
              fontSize: '1.5rem',
              color: COLORS.pennBlue,
              margin: `0 0 ${SPACING.md} 0`,
              fontWeight: 600,
            }}
            className="print-heading"
          >
            Objectives
          </h2>
          <ul
            style={{
              fontFamily: TYPOGRAPHY.body,
              fontSize: '1rem',
              color: COLORS.darkGray,
              lineHeight: '1.8',
              paddingLeft: SPACING.lg,
              margin: 0,
            }}
            className="print-list"
          >
            {lesson.objectives.map((objective, index) => (
              <li key={index} style={{ marginBottom: SPACING.xs }}>
                {objective}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Key Concepts */}
      <section style={{ marginBottom: SPACING.lg }}>
        <h2
          style={{
            fontFamily: TYPOGRAPHY.heading,
            fontSize: '1.5rem',
            color: COLORS.pennBlue,
            margin: `0 0 ${SPACING.md} 0`,
            fontWeight: 600,
          }}
          className="print-heading"
        >
          Key Concepts
        </h2>
        <div
          style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '1rem',
            color: COLORS.darkGray,
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
          }}
          className="print-content"
        >
          {lesson.keyConcepts}
        </div>
      </section>

      {/* Insight */}
      <section
        style={{
          marginBottom: SPACING.lg,
          padding: SPACING.md,
          backgroundColor: 'rgba(1, 31, 91, 0.05)',
          borderRadius: BORDER_RADIUS.md,
          borderLeft: `4px solid ${COLORS.pennRed}`,
        }}
        className="print-insight"
      >
        <h2
          style={{
            fontFamily: TYPOGRAPHY.heading,
            fontSize: '1.5rem',
            color: COLORS.pennRed,
            margin: `0 0 ${SPACING.md} 0`,
            fontWeight: 600,
          }}
          className="print-heading"
        >
          Insight
        </h2>
        <div
          style={{
            fontFamily: TYPOGRAPHY.body,
            fontSize: '1rem',
            color: COLORS.darkGray,
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
          }}
          className="print-content"
        >
          {lesson.insight}
        </div>
      </section>

      {/* Quiz */}
      {lesson.quiz.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: TYPOGRAPHY.heading,
              fontSize: '1.5rem',
              color: COLORS.pennBlue,
              margin: `0 0 ${SPACING.md} 0`,
              fontWeight: 600,
            }}
            className="print-heading"
          >
            Quiz
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
            {lesson.quiz.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: SPACING.md,
                  backgroundColor: COLORS.lightGray,
                  borderRadius: BORDER_RADIUS.md,
                }}
                className="print-quiz-item"
              >
                <p
                  style={{
                    fontFamily: TYPOGRAPHY.body,
                    fontSize: '1.1rem',
                    color: COLORS.pennBlue,
                    fontWeight: 500,
                    margin: `0 0 ${SPACING.sm} 0`,
                  }}
                  className="print-question"
                >
                  {index + 1}. {item.question}
                </p>
                <ul
                  style={{
                    fontFamily: TYPOGRAPHY.body,
                    fontSize: '1rem',
                    color: COLORS.darkGray,
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                  className="print-options"
                >
                  {item.options.map((option, optIndex) => (
                    <li
                      key={optIndex}
                      style={{
                        marginBottom: SPACING.xs,
                        paddingLeft: SPACING.md,
                      }}
                    >
                      {String.fromCharCode(97 + optIndex)}) {option}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          .lesson-display {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .print-title {
            page-break-after: avoid;
          }
          .print-heading {
            page-break-after: avoid;
          }
          .print-content {
            page-break-inside: avoid;
          }
          .print-quiz-item {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

