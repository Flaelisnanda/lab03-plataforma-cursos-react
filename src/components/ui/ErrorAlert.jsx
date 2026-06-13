import { AlertTriangle } from 'lucide-react';

export default function ErrorAlert({ errors }) {
  if (!errors?.length) return null;
  return (
    <div className="alert alert-danger border-0 d-flex align-items-start gap-2 mb-3">
      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        {errors.map((e, i) => <div key={i}>{e}</div>)}
      </div>
    </div>
  );
}
