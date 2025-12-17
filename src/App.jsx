import { useState, useEffect, useMemo } from 'react';
import { api } from './services/api';
import AgencyListItem from './components/AgencyListItem';
import AgencyForm from './components/AgencyForm';
import AgencyDetail from './components/AgencyDetail';
import SearchAndFilters from './components/SearchAndFilters';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [agencies, setAgencies] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);
  const [viewingAgency, setViewingAgency] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // list, dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [agenciesData, statsData] = await Promise.all([
        api.getAgencies(),
        api.getStats()
      ]);
      setAgencies(agenciesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données. Assurez-vous que le serveur est démarré (npm run dev:server).');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les agences
  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agency.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agency.sector?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || agency.status === statusFilter;
      const matchesSector = !sectorFilter || agency.sector === sectorFilter;
      
      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [agencies, searchTerm, statusFilter, sectorFilter]);

  const handleAdd = () => {
    setEditingAgency(null);
    setShowForm(true);
  };

  const handleEdit = (agency) => {
    setEditingAgency(agency);
    setShowForm(true);
    setViewingAgency(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingAgency) {
        // Modifier une agence existante
        const updated = await api.updateAgency(editingAgency.id, formData);
        setAgencies(prev => prev.map(agency => 
          agency.id === editingAgency.id ? updated : agency
        ));
      } else {
        // Créer une nouvelle agence
        const newAgency = await api.createAgency(formData);
        setAgencies(prev => [...prev, newAgency]);
      }
      // Recharger les stats
      const statsData = await api.getStats();
      setStats(statsData);
      setShowForm(false);
      setEditingAgency(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAgency(id);
      setAgencies(prev => prev.filter(agency => agency.id !== id));
      // Recharger les stats
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    }
  };

  const handleView = (agency) => {
    setViewingAgency(agency);
  };

  const handleEmail = (agency) => {
    if (!agency.email) {
      alert('Aucun email enregistré pour cette agence.');
      return;
    }
    const subject = encodeURIComponent(`Contact - ${agency.name}`);
    const body = encodeURIComponent(`Bonjour${agency.contact_person ? ` ${agency.contact_person}` : ''},\n\nJe souhaite entrer en contact avec vous concernant ${agency.name}.\n\nCordialement`);
    window.location.href = `mailto:${agency.email}?subject=${subject}&body=${body}`;
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAgency(null);
  };

  const handleCloseDetail = () => {
    setViewingAgency(null);
  };

  const handleAgencyUpdate = (updatedAgency) => {
    setAgencies(prev => prev.map(agency => 
      agency.id === updatedAgency.id ? updatedAgency : agency
    ));
    if (viewingAgency && viewingAgency.id === updatedAgency.id) {
      setViewingAgency(updatedAgency);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <p>{error}</p>
        <button onClick={loadData} className="btn btn-primary">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CRM - Agences de Placement</h1>
        <p className="subtitle">Gérez vos leads d'agences de placement</p>
      </header>

      <div className="stats-bar">
        {stats && (
          <>
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Nouveau:</span>
              <span className="stat-value">{stats.nouveau}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Contacté:</span>
              <span className="stat-value">{stats.contacté}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En négociation:</span>
              <span className="stat-value">{stats['en négociation']}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accord verbal:</span>
              <span className="stat-value stat-info">{stats['accord verbal'] || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Gagné:</span>
              <span className="stat-value stat-success">{stats.gagné}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Perdu:</span>
              <span className="stat-value stat-danger">{stats.perdu}</span>
            </div>
          </>
        )}
      </div>

      <div className="main-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Liste
          </button>
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          <Dashboard
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ) : (
          <>
            <div className="toolbar">
              <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sectorFilter={sectorFilter}
                onSectorFilterChange={setSectorFilter}
              />
              <button onClick={handleAdd} className="btn btn-primary btn-add">
                + Nouvelle agence
              </button>
            </div>

            <div className="agencies-list">
              {filteredAgencies.length === 0 ? (
                <div className="empty-state">
                  <p>Aucune agence trouvée.</p>
                  <button onClick={handleAdd} className="btn btn-primary">
                    Ajouter une agence
                  </button>
                </div>
              ) : (
                filteredAgencies.map(agency => (
                  <AgencyListItem
                    key={agency.id}
                    agency={agency}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onEmail={handleEmail}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AgencyForm
              agency={editingAgency}
              onSave={handleSave}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {viewingAgency && (
        <AgencyDetail
          agency={viewingAgency}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
          onUpdate={handleAgencyUpdate}
        />
      )}
    </div>
  );
}

export default App;
