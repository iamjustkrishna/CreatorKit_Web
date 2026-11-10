import { articles } from "../content";

export default function Journal() {
  return (
    <section className="journal-section section-space" id="journal" aria-labelledby="journal-title">
      <div className="page-width">
        <div className="journal-heading" data-reveal>
          <div>
            <p className="eyebrow">From the CreatorKit journal</p>
            <h2 id="journal-title">Notes for making, without the noise.</h2>
          </div>
          <a className="quiet-link" href="/journal/">
            Browse every story <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="journal-grid">
          {articles.map((article, index) => (
            <article className={`journal-card journal-card--${index + 1}`} key={article.slug} data-reveal>
              <a href={`/journal/${article.slug}/`}>
                <span className="journal-card-meta">
                  <span>{article.category}</span>
                  <span>{article.readTime}</span>
                </span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span className="journal-card-link">Read the story <span aria-hidden="true">↗</span></span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
