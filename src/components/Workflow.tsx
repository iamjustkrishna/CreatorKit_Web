import { workflow } from "../content";
import { Icon } from "./Icons";

export default function Workflow() {
  return (
    <section className="wf" id="workflow" data-chapter="workflow">
      <div className="wf-inner">
        <header className="wf-head">
          <p className="module-label" data-label>
            01 / SIGNAL PATH
          </p>
          <h2 className="module-title" data-title>
            Everything your audio needs, in one flow.
          </h2>
        </header>

        <div className="wf-body">
          <ol className="wf-steps" aria-label="How CreatorKit works">
            {workflow.map((step, index) => (
              <li className="wf-step" key={step.title} data-wf-step={index}>
                <div className="wf-step-bar" aria-hidden="true">
                  <i />
                </div>
                <div className="wf-step-icon" aria-hidden="true">
                  <Icon name={step.icon} size={22} />
                </div>
                <div className="wf-step-copy">
                  <span className="wf-step-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* The particle signal docks here. Purely visual. */}
          <div className="wf-signal" data-anchor="wf-signal" aria-hidden="true">
            <span className="wf-corner wf-corner--tl" />
            <span className="wf-corner wf-corner--tr" />
            <span className="wf-corner wf-corner--bl" />
            <span className="wf-corner wf-corner--br" />
            <div className="wf-readout">
              <span className="wf-readout-tag" data-wf-tag>
                {workflow[0].tag}
              </span>
              <span className="wf-readout-text" data-wf-readout>
                {workflow[0].readout}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
