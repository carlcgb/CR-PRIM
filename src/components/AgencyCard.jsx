import { statusOptions } from '../data/initialData';

export default function AgencyCard({ agency, onEdit, onDelete, onView, onEmail }) {
  const status = statusOptions.find(s => s.value === agency.status) || statusOptions[0];

  const handleEmail = (e) => {
    e.stopPropagation();
    if (onEmail) {
      onEmail(agency);
    } else {
      // Fallback si onEmail n'est pas fourni
      const subject = encodeURIComponent(`Contact - ${agency.name}`);
      const body = encodeURIComponent(`Bonjour,\n\nJe souhaite entrer en contact avec vous concernant ${agency.name}.\n\nCordialement`);
      window.location.href = `mailto:${agency.email || ''}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="agency-card" onClick={() => onView(agency)}>
      <div className="agency-card-header">
        <h3>{agency.name}</h3>
        <span 
          className="status-badge" 
          style={{ backgroundColor: status.color }}
        >
          {status.label}
        </span>
      </div>
      
      <div className="agency-card-body">
        <p className="sector">{agency.sector}</p>
        <p className="description">{agency.description || 'Aucune description'}</p>
        {agency.contact_person && (
          <p className="contact-person">Contact: {agency.contact_person}</p>
        )}
        {agency.email && (
          <p className="email">Email: {agency.email}</p>
        )}
        {agency.phone && (
          <p className="phone">Téléphone: {agency.phone}</p>
        )}
        <a 
          href={agency.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="url-link"
        >
          {agency.url}
        </a>
      </div>

      <div className="agency-card-footer">
        {agency.email && (
          <button 
            onClick={handleEmail}
            className="btn btn-email"
            title="Envoyer un email"
          >
            📧 Email
          </button>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(agency);
          }}
          className="btn btn-edit"
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
          className="btn btn-delete"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

