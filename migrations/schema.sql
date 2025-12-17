-- Schéma de la base de données pour Cloudflare D1
-- Créer la table agencies

CREATE TABLE IF NOT EXISTS agencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  sector TEXT,
  status TEXT DEFAULT 'nouveau',
  notes TEXT,
  notes_list TEXT,
  email TEXT,
  phone TEXT,
  contact_person TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_status ON agencies(status);
CREATE INDEX IF NOT EXISTS idx_sector ON agencies(sector);
CREATE INDEX IF NOT EXISTS idx_updatedAt ON agencies(updatedAt);

