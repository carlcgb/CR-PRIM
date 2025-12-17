import { statusOptions } from '../data/initialData';

export default function AgencyListItem({ agency, onEdit, onDelete, onView, onEmail }) {
  const status = statusOptions.find(s => s.value === agency.status) || statusOptions[0];

  const handleEmail = (e) => {
    e.stopPropagation();
    if (onEmail) {
      onEmail(agency);
    } else {
      const subject = encodeURIComponent(`Contact - ${agency.name}`);
      const body = encodeURIComponent(`Bonjour,\n\nJe souhaite entrer en contact avec vous concernant ${agency.name}.\n\nCordialement`);
      window.location.href = `mailto:${agency.email || ''}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="agency-list-item" onClick={() => onView(agency)}>
      <div className="agency-list-main">
        <div className="agency-list-info">
          <div className="agency-list-header">
            <h3 className="agency-list-name">{agency.name}</h3>
            <span 
              className="status-badge" 
              style={{ backgroundColor: status.color }}
            >
              {status.label}
            </span>
          </div>
          
          <div className="agency-list-details">
            <span className="agency-list-sector">{agency.sector}</span>
            {agency.description && (
              <span className="agency-list-description">{agency.description}</span>
            )}
            {agency.contact_person && (
              <span className="agency-list-contact">Contact: {agency.contact_person}</span>
            )}
            {agency.email && (
              <span className="agency-list-email">Email: {agency.email}</span>
            )}
            {agency.phone && (
              <span className="agency-list-phone">Tél: {agency.phone}</span>
            )}
            <a 
              href={agency.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="agency-list-url"
            >
              {agency.url}
            </a>
          </div>
        </div>

        <div className="agency-list-actions">
          {agency.email && (
            <button 
              onClick={handleEmail}
              className="btn btn-email btn-small"
              title="Envoyer un email"
            >
              📧
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(agency);
            }}
            className="btn btn-edit btn-small"
          >
            Modifier
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${agency.name}?`)) {
                onDelete(agency.id);
              }
            }}
            className="btn btn-delete btn-small"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

