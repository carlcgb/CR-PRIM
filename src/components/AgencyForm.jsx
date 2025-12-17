import { useState, useEffect } from 'react';
import { statusOptions, sectorOptions } from '../data/initialData';

export default function AgencyForm({ agency, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    sector: sectorOptions[0],
    status: 'nouveau',
    notes: '',
    notes_list: [],
    email: '',
    phone: '',
    contact_person: ''
  });

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || '',
        url: agency.url || '',
        description: agency.description || '',
        sector: agency.sector || sectorOptions[0],
        status: agency.status || 'nouveau',
        notes: agency.notes || '',
        notes_list: agency.notes_list || [],
        email: agency.email || '',
        phone: agency.phone || '',
        contact_person: agency.contact_person || ''
      });
    }
  }, [agency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="agency-form" onSubmit={handleSubmit}>
      <h2>{agency ? 'Modifier l\'agence' : 'Nouvelle agence'}</h2>

      <div className="form-group">
        <label htmlFor="name">Nom de l'agence *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL *</label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sector">Secteur</label>
        <select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={handleChange}
        >
          {sectorOptions.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Statut</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@exemple.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(514) 123-4567"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact_person">Personne contact</label>
        <input
          type="text"
          id="contact_person"
          name="contact_person"
          value={formData.contact_person}
          onChange={handleChange}
          placeholder="Nom de la personne contact"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          placeholder="Ajoutez vos notes sur cette agence..."
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {agency ? 'Enregistrer' : 'Créer'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Annuler
        </button>
      </div>
    </form>
  );
}

