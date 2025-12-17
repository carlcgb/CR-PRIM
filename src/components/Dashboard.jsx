import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AgencyListItem from './AgencyListItem';

export default function Dashboard({ onEdit, onDelete, onView }) {
  const [agencies, setAgencies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all'); // all, active, pending, verbal

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agenciesData, statsData] = await Promise.all([
        api.getAgencies(),
        api.getStats()
      ]);
      setAgencies(agenciesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données. Assurez-vous que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = () => {
    switch (activeView) {
      case 'active':
        return agencies.filter(a => ['contacté', 'en négociation', 'accord verbal'].includes(a.status));
      case 'pending':
        return agencies.filter(a => a.status === 'en négociation');
      case 'verbal':
        return agencies.filter(a => a.status === 'accord verbal');
      default:
        return agencies;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-stats">
          {stats && (
            <>
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card active">
                <div className="stat-value">{stats.actives}</div>
                <div className="stat-label">Actives</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-value">{stats['en négociation'] || 0}</div>
                <div className="stat-label">En attente</div>
              </div>
              <div className="stat-card verbal">
                <div className="stat-value">{stats['accord verbal'] || 0}</div>
                <div className="stat-label">Accord verbal</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-views">
        <button
          className={`view-btn ${activeView === 'all' ? 'active' : ''}`}
          onClick={() => setActiveView('all')}
        >
          Toutes ({agencies.length})
        </button>
        <button
          className={`view-btn ${activeView === 'active' ? 'active' : ''}`}
          onClick={() => setActiveView('active')}
        >
          Actives ({stats?.actives || 0})
        </button>
        <button
          className={`view-btn ${activeView === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveView('pending')}
        >
          En attente ({stats?.['en négociation'] || 0})
        </button>
        <button
          className={`view-btn ${activeView === 'verbal' ? 'active' : ''}`}
          onClick={() => setActiveView('verbal')}
        >
          Accord verbal ({stats?.['accord verbal'] || 0})
        </button>
      </div>

      <div className="agencies-list">
        {filteredAgencies().length === 0 ? (
          <div className="empty-state">
            <p>Aucune agence dans cette catégorie.</p>
          </div>
        ) : (
          filteredAgencies().map(agency => (
            <AgencyListItem
              key={agency.id}
              agency={agency}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
}

