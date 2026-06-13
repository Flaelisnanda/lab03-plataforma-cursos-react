import { Inbox } from 'lucide-react';

export default function EmptyState({ Icon = Inbox, message = 'Nenhum registro encontrado.' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={24} color="#94a3b8" />
      </div>
      <p>{message}</p>
    </div>
  );
}
