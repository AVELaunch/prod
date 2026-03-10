import { useState, useCallback } from 'react';
import { hubspotTable } from './funnelData';

const HEADERS = ['#', 'Deal Stage', 'Lead Status', 'Lifecycle', 'Emailer Sequence', 'Updated By', 'Trigger', 'Priority'];

const PRIORITY_CLASSES = {
  P1: 'bg-red-100 text-red-700 border-red-300',
  P2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  P3: 'bg-blue-100 text-blue-700 border-blue-300',
};

function csvQuote(val) {
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export default function HubSpotTable() {
  const [open, setOpen] = useState(false);

  const exportCSV = useCallback(() => {
    const rows = hubspotTable.map((r) =>
      [r.num, r.dealStage, r.leadStatus, r.lifecycle, r.emailerSequence, r.updatedBy, r.trigger, r.priority].map(csvQuote).join(',')
    );
    const csv = [HEADERS.join(','), ...rows].join('\n');
    navigator.clipboard.writeText(csv).then(() => {
      alert('CSV copied to clipboard!');
    });
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white border-t border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
      >
        <span>HubSpot Tagging Summary ({hubspotTable.length} stages)</span>
        <span>{open ? '▼' : '▲'}</span>
      </button>
      {open && (
        <div className="bg-white border-t border-gray-100 max-h-64 overflow-y-auto">
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={exportCSV}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border border-gray-300 font-medium"
            >
              Export CSV to Clipboard
            </button>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-gray-500 font-semibold border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hubspotTable.map((row) => (
                <tr key={row.num} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-3 py-1.5 text-gray-400">{row.num}</td>
                  <td className="px-3 py-1.5 font-medium text-gray-800">{row.dealStage}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.leadStatus}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.lifecycle}</td>
                  <td className="px-3 py-1.5 font-mono text-purple-700">{row.emailerSequence}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.updatedBy}</td>
                  <td className="px-3 py-1.5 text-gray-600">{row.trigger}</td>
                  <td className="px-3 py-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${PRIORITY_CLASSES[row.priority]}`}>
                      {row.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
