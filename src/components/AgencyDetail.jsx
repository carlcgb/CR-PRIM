import { statusOptions } from '../data/initialData';
import NotesSection from './NotesSection';

export default function AgencyDetail({ agency, onClose, onEdit, onUpdate }) {
  if (!agency) return null;

  const status = statusOptions.find(s => s.value === agency.status) || statusOptions[0];

  return (
    <div className="agency-detail-overlay" onClick={onClose}>
      <div className="agency-detail" onClick={(e) => e.stopPropagation()}>
        <div className="agency-detail-header">
          <h2>{agency.name}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="agency-detail-body">
          <div className="detail-section">
            <label>Statut:</label>
            <span 
              className="status-badge" 
              style={{ backgroundColor: status.color }}
            >
              {status.label}
            </span>
          </div>

          <div className="detail-section">
            <label>Secteur:</label>
            <span>{agency.sector}</span>
          </div>

          <div className="detail-section">
            <label>URL:</label>
            <a 
              href={agency.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="url-link"
            >
              {agency.url}
            </a>
          </div>

          <div className="detail-section">
            <label>Description:</label>
            <p>{agency.description || 'Aucune description'}</p>
          </div>

          {agency.email && (
            <div className="detail-section">
              <label>Email:</label>
              <a 
                href={`mailto:${agency.email}?subject=${encodeURIComponent(`Contact - ${agency.name}`)}`}
                className="email-link"
              >
                {agency.email}
              </a>
            </div>
          )}

          {agency.phone && (
            <div className="detail-section">
              <label>Téléphone:</label>
              <a href={`tel:${agency.phone}`} className="phone-link">
                {agency.phone}
              </a>
            </div>
          )}

          {agency.contact_person && (
            <div className="detail-section">
              <label>Personne contact:</label>
              <span>{agency.contact_person}</span>
            </div>
          )}

          {agency.notes && (
            <div className="detail-section">
              <label>Note générale:</label>
              <p className="notes">{agency.notes}</p>
            </div>
          )}

          <div className="detail-section notes-section-wrapper">
            <NotesSection agency={agency} onUpdate={onUpdate} />
          </div>

          <div className="detail-section">
            <label>Créé le:</label>
            <span>{new Date(agency.createdAt).toLocaleDateString('fr-CA')}</span>
          </div>

          {agency.updatedAt !== agency.createdAt && (
            <div className="detail-section">
              <label>Modifié le:</label>
              <span>{new Date(agency.updatedAt).toLocaleDateString('fr-CA')}</span>
            </div>
          )}
        </div>

        <div className="agency-detail-footer">
          {agency.email && (
            <button 
              onClick={() => {
                const subject = encodeURIComponent(`Contact - ${agency.name}`);
                const body = encodeURIComponent(`Bonjour${agency.contact_person ? ` ${agency.contact_person}` : ''},\n\nJe souhaite entrer en contact avec vous concernant ${agency.name}.\n\nCordialement`);
                window.location.href = `mailto:${agency.email}?subject=${subject}&body=${body}`;
              }} 
              className="btn btn-email"
            >
              📧 Envoyer un email
            </button>
          )}
          <button onClick={() => onEdit(agency)} className="btn btn-primary">
            Modifier
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

