const questions = [
  {
    question: "What can CreatorKit do?",
    answer:
      "CreatorKit can extract audio from supported videos, enhance voice recordings, transcribe English speech, and help you play, share, and organize your saved files.",
  },
  {
    question: "Which formats can I export?",
    answer:
      "The Audio Extractor offers MP3 and M4A (AAC) output. It can select video files in MP4, MKV, and AVI formats.",
  },
  {
    question: "Does the app send my recordings to the cloud?",
    answer:
      "CreatorKit processes selected media on your device. The app is designed for local use, with no cloud uploads for its audio tools.",
  },
  {
    question: "Which languages can it transcribe?",
    answer:
      "English transcription is available in the current app listing. Check the Play Store listing for the latest supported features.",
  },
  {
    question: "Is CreatorKit available for iPhone?",
    answer:
      "CreatorKit is currently an Android app. It is available to install through Google Play.",
  },
];

export default function FAQ() {
  return (
    <section className="faq-section section-space" aria-labelledby="faq-title">
      <div className="faq-layout page-width">
        <div className="faq-heading" data-reveal>
          <p className="eyebrow">Good to know</p>
          <h2 id="faq-title">A few quick answers.</h2>
          <p>Still have a question? <a href="mailto:mastersimpleapps@gmail.com">Talk to us.</a></p>
        </div>
        <div className="faq-list" data-reveal>
          {questions.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}<span aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
