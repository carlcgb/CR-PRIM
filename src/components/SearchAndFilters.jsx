import { statusOptions, sectorOptions } from '../data/initialData';

export default function SearchAndFilters({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange, sectorFilter, onSectorFilterChange }) {
  return (
    <div className="search-filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher une agence..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        <select
          value={sectorFilter}
          onChange={(e) => onSectorFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les secteurs</option>
          {sectorOptions.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

