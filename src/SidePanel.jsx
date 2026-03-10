import { useEffect } from 'react';
import { NODE_COLORS } from './funnelData';

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
      {children}
    </div>
  );
}

function Prop({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-800 font-medium text-right max-w-[60%]">{String(value)}</span>
    </div>
  );
}

const PRIORITY_CLASSES = {
  P1: 'bg-red-100 text-red-700 border-red-300',
  P2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  P3: 'bg-blue-100 text-blue-700 border-blue-300',
};

export default function SidePanel({ node, onClose }) {
  // Hooks MUST be called before any early return (Rules of Hooks)
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!node) return null;
  const d = node;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-gray-900 leading-tight pr-4">{d.label}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold shrink-0">×</button>
        </div>

        <div className="flex gap-2 mb-4">
          <span className={`text-xs font-bold px-2 py-1 rounded border ${PRIORITY_CLASSES[d.priority]}`}>
            {d.priority}
          </span>
          <span className="text-xs px-2 py-1 rounded border capitalize" style={{
            backgroundColor: NODE_COLORS[d.type]?.bg,
            borderColor: NODE_COLORS[d.type]?.border,
          }}>{NODE_COLORS[d.type]?.label || d.type}</span>
        </div>

        {d.detail?.description && (
          <Section title="Description">
            <p className="text-sm text-gray-600">{d.detail.description}</p>
          </Section>
        )}

        {d.hubspot && (
          <Section title="HubSpot Properties">
            {d.hubspot.dealStage && <Prop label="Deal Stage" value={d.hubspot.dealStage} />}
            {d.hubspot.leadStatus && <Prop label="Lead Status" value={d.hubspot.leadStatus} />}
            {d.hubspot.lifecycleStage && <Prop label="Lifecycle Stage" value={d.hubspot.lifecycleStage} />}
            {d.hubspot.note && <Prop label="Note" value={d.hubspot.note} />}
            {d.hubspot.trigger && <Prop label="Trigger" value={d.hubspot.trigger} />}
          </Section>
        )}

        {d.detail?.updatedBy && (
          <Section title="Updated By">
            <p className="text-sm text-gray-600">{d.detail.updatedBy}</p>
          </Section>
        )}

        {d.detail?.trigger && (
          <Section title="Trigger Mechanism">
            <p className="text-sm text-gray-600">{d.detail.trigger}</p>
          </Section>
        )}

        {d.emailer && d.emailer.sequence !== 'None' && (
          <Section title="Emailer Integration">
            <Prop label="Sequence" value={d.emailer.sequence} />
            {d.emailer.variants && (
              <div className="flex gap-1 my-1">
                {d.emailer.variants.map((v) => (
                  <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">{v}</span>
                ))}
              </div>
            )}
            <Prop label="Email Count" value={d.emailer.emailCount} />
            {d.emailer.timing && <Prop label="Timing" value={d.emailer.timing} />}
            {d.emailer.goal && <Prop label="Goal" value={d.emailer.goal} />}
            {d.emailer.cta && <Prop label="CTA" value={d.emailer.cta} />}
            {d.emailer.subjects?.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-gray-500">Email Subjects:</span>
                <ul className="mt-1 space-y-1">
                  {d.emailer.subjects.map((s, i) => (
                    <li key={i} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {d.emailer.contentAngle && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-gray-500">Content Angle:</span>
                <div className="mt-1 space-y-1">
                  <div className="text-xs text-gray-600"><strong>WB:</strong> {d.emailer.contentAngle.WB}</div>
                  <div className="text-xs text-gray-600"><strong>BIZ:</strong> {d.emailer.contentAngle.BIZ}</div>
                </div>
              </div>
            )}
          </Section>
        )}

        {d.emailer?.note && (
          <Section title="Emailer Note">
            <p className="text-sm text-gray-600">{d.emailer.note}</p>
          </Section>
        )}

        {d.detail?.owner && (
          <Section title="Content Owner">
            <p className="text-sm text-gray-600">{d.detail.owner}</p>
          </Section>
        )}

        {d.warnings?.length > 0 && (
          <Section title="Warnings">
            {d.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2 mb-1">
                <span>⚠</span>
                <span>{w}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
