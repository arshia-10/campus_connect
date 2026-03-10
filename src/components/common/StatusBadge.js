import React from 'react';

export default function StatusBadge({ status, dark }) {
  const map = {
    open:         { label: 'Registration Open', cls: dark ? 'badge-open-dark'         : 'badge-open'         },
    closed:       { label: 'Closed',            cls: dark ? 'badge-closed-dark'       : 'badge-closed'       },
    interviewing: { label: 'Interviewing',       cls: dark ? 'badge-interviewing-dark' : 'badge-interviewing' },
    Applied:      { label: 'Applied',            cls: dark ? 'badge-open-dark'         : 'badge-open'         },
    Shortlisted:  { label: 'Shortlisted',        cls: dark ? 'badge-interviewing-dark' : 'badge-interviewing' },
    Rejected:     { label: 'Rejected',           cls: dark ? 'badge-closed-dark'       : 'badge-closed'       },
    Placed:       { label: 'Placed 🎉',          cls: dark ? 'badge-open-dark'         : 'badge-open'         },
  };
  const { label, cls } = map[status] || map.open;
  return (
    <span className={`badge ${cls}`}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
      {label}
    </span>
  );
}
