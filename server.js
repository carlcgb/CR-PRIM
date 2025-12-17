import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
const dbPath = join(__dirname, 'agences.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err);
  } else {
    console.log('Base de données SQLite connectée');
    initDatabase();
  }
});

// Créer la table si elle n'existe pas
function initDatabase() {
  db.run(`
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
    )
  `, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err);
    } else {
      console.log('Table agencies créée ou déjà existante');
      // Ajouter la colonne notes_list si elle n'existe pas (migration)
      db.run(`
        ALTER TABLE agencies ADD COLUMN notes_list TEXT
      `, (alterErr) => {
        // Ignorer l'erreur si la colonne existe déjà
        if (alterErr && !alterErr.message.includes('duplicate column')) {
          console.log('Colonne notes_list déjà présente ou erreur:', alterErr.message);
        }
      });
      // Insérer les données initiales si la table est vide
      db.get('SELECT COUNT(*) as count FROM agencies', (err, row) => {
        if (!err && row.count === 0) {
          insertInitialData();
        }
      });
    }
  });
}

// Insérer les données initiales
function insertInitialData() {
  const initialAgencies = [
    ['Addipros', 'http://www.addipros.com/', 'agence spécialisée en placement du personnel dans les domaines du transport routier, de l\'administration et des technologies', 'Tous types d\'emplois', 'nouveau'],
    ['Adecco Canada', 'http://www.adecco.ca/', 'grande agence de placement pour tous types d\'emploi dans tous les secteurs partout au Canada', 'Tous types d\'emplois', 'nouveau'],
    ['Adecco Québec', 'http://www.decouvrez.qc.ca/', 'grande agence de placement pour tous les secteurs d\'emploi au Québec', 'Tous types d\'emplois', 'nouveau'],
    ['ANCIA', 'http://www.ancia.qc.ca/', 'grande agence de placement pour tous les types d\'emploi au Québec et même au Canada', 'Tous types d\'emplois', 'nouveau'],
    ['APPRI', 'http://www.appri.com/', 'agence de placement située à Montréal pour tous types d\'emploi', 'Tous types d\'emplois', 'nouveau'],
    ['Manpower', 'http://www.manpower.ca/', 'grande agence placement de personnel dans tous les secteurs partout au Canada et même au monde', 'Tous types d\'emplois', 'nouveau'],
    ['Michael Page', 'http://www.michaelpage.ca/index.html?language=fr', 'grande agence placement de personnel dans tous les secteurs partout au Canada et même au monde', 'Tous types d\'emplois', 'nouveau'],
    ['Randstad', 'http://www.randstad.ca/', 'agence de placement de personnel dans tous les domaines (administratif, technique, ouvrier, etc) partout au Canada', 'Tous types d\'emplois', 'nouveau'],
    ['Services Kelly', 'http://www.kellyservices.ca/eprise/main/web/ca/services/fr/index.html', 'grande agence de placement dans divers secteurs d\'emploi partout au Québec et au Canada', 'Tous types d\'emplois', 'nouveau'],
    ['Aginove', 'http://www.aginove.com/', 'agence spécialisée en placement du personnel en technologies de l\'information', 'informatique', 'nouveau'],
    ['Candidatech', 'http://www.candidatech.qc.ca/index2new.htm', 'agence spécialisée en placement du personnel en informatique', 'informatique', 'nouveau'],
    ['Expertech', 'http://www.expertech.ca/', 'agence spécialisée en placement du personnel en technologies de l\'information', 'informatique', 'nouveau'],
    ['Serti', 'http://www.serti.com/page1_f.html', 'agence spécialisée en placement du personnel en technologies de l\'information', 'informatique', 'nouveau'],
    ['Accès Services Santé', 'http://www.acces-services-sante.ca/', 'agence spécialisée en placement dans le domaine de la santé', 'santé', 'nouveau'],
    ['Croix Jaune', 'http://www.croixjaune.com/', 'agence spécialisée en placement du personnel dans le domaine de la santé et des services sociaux', 'santé', 'nouveau']
  ];

  const stmt = db.prepare('INSERT INTO agencies (name, url, description, sector, status) VALUES (?, ?, ?, ?, ?)');
  
  initialAgencies.forEach(agency => {
    stmt.run(agency);
  });
  
  stmt.finalize((err) => {
    if (err) {
      console.error('Erreur lors de l\'insertion des données initiales:', err);
    } else {
      console.log('Données initiales insérées');
    }
  });
}

// Routes API

// GET toutes les agences
app.get('/api/agencies', (req, res) => {
  db.all('SELECT * FROM agencies ORDER BY updatedAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Parser les notes_list pour chaque agence
      const parsedRows = rows.map(row => {
        if (row.notes_list) {
          try {
            row.notes_list = JSON.parse(row.notes_list);
          } catch (e) {
            row.notes_list = [];
          }
        } else {
          row.notes_list = [];
        }
        return row;
      });
      res.json(parsedRows);
    }
  });
});

// GET une agence par ID
app.get('/api/agencies/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM agencies WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Agence non trouvée' });
    } else {
      // Parser les notes_list
      if (row.notes_list) {
        try {
          row.notes_list = JSON.parse(row.notes_list);
        } catch (e) {
          row.notes_list = [];
        }
      } else {
        row.notes_list = [];
      }
      res.json(row);
    }
  });
});

// POST créer une nouvelle agence
app.post('/api/agencies', (req, res) => {
  const { name, url, description, sector, status, notes, notes_list, email, phone, contact_person } = req.body;
  
  if (!name || !url) {
    return res.status(400).json({ error: 'Le nom et l\'URL sont requis' });
  }

  const notesListJson = notes_list ? JSON.stringify(notes_list) : '[]';

  db.run(
    'INSERT INTO agencies (name, url, description, sector, status, notes, notes_list, email, phone, contact_person) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, url, description || '', sector || 'Tous types d\'emplois', status || 'nouveau', notes || '', notesListJson, email || '', phone || '', contact_person || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        db.get('SELECT * FROM agencies WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            // Parser les notes_list
            if (row.notes_list) {
              try {
                row.notes_list = JSON.parse(row.notes_list);
              } catch (e) {
                row.notes_list = [];
              }
            } else {
              row.notes_list = [];
            }
            res.status(201).json(row);
          }
        });
      }
    }
  );
});

// PUT mettre à jour une agence
app.put('/api/agencies/:id', (req, res) => {
  const { id } = req.params;
  const { name, url, description, sector, status, notes, notes_list, email, phone, contact_person } = req.body;
  
  const notesListJson = notes_list ? JSON.stringify(notes_list) : null;
  
  db.run(
    'UPDATE agencies SET name = ?, url = ?, description = ?, sector = ?, status = ?, notes = ?, notes_list = COALESCE(?, notes_list), email = ?, phone = ?, contact_person = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [name, url, description || '', sector || 'Tous types d\'emplois', status || 'nouveau', notes || '', notesListJson, email || '', phone || '', contact_person || '', id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Agence non trouvée' });
      } else {
        db.get('SELECT * FROM agencies WHERE id = ?', [id], (err, row) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            // Parser les notes_list
            if (row.notes_list) {
              try {
                row.notes_list = JSON.parse(row.notes_list);
              } catch (e) {
                row.notes_list = [];
              }
            } else {
              row.notes_list = [];
            }
            res.json(row);
          }
        });
      }
    }
  );
});

// DELETE supprimer une agence
app.delete('/api/agencies/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM agencies WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Agence non trouvée' });
    } else {
      res.json({ message: 'Agence supprimée avec succès', id: parseInt(id) });
    }
  });
});

// POST ajouter une note à une agence
app.post('/api/agencies/:id/notes', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Le contenu de la note est requis' });
  }

  db.get('SELECT notes_list FROM agencies WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Agence non trouvée' });
    } else {
      let notesList = [];
      if (row.notes_list) {
        try {
          notesList = JSON.parse(row.notes_list);
        } catch (e) {
          notesList = [];
        }
      }
      
      // Ajouter la nouvelle note en haut de la liste
      const newNote = {
        id: Date.now(),
        content: content.trim(),
        createdAt: new Date().toISOString()
      };
      notesList.unshift(newNote);
      
      db.run(
        'UPDATE agencies SET notes_list = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(notesList), id],
        function(updateErr) {
          if (updateErr) {
            res.status(500).json({ error: updateErr.message });
          } else {
            db.get('SELECT * FROM agencies WHERE id = ?', [id], (selectErr, updatedRow) => {
              if (selectErr) {
                res.status(500).json({ error: selectErr.message });
              } else {
                updatedRow.notes_list = notesList;
                res.json(updatedRow);
              }
            });
          }
        }
      );
    }
  });
});

// DELETE supprimer une note
app.delete('/api/agencies/:id/notes/:noteId', (req, res) => {
  const { id, noteId } = req.params;
  
  db.get('SELECT notes_list FROM agencies WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Agence non trouvée' });
    } else {
      let notesList = [];
      if (row.notes_list) {
        try {
          notesList = JSON.parse(row.notes_list);
        } catch (e) {
          notesList = [];
        }
      }
      
      notesList = notesList.filter(note => note.id != noteId);
      
      db.run(
        'UPDATE agencies SET notes_list = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(notesList), id],
        function(updateErr) {
          if (updateErr) {
            res.status(500).json({ error: updateErr.message });
          } else {
            db.get('SELECT * FROM agencies WHERE id = ?', [id], (selectErr, updatedRow) => {
              if (selectErr) {
                res.status(500).json({ error: selectErr.message });
              } else {
                updatedRow.notes_list = notesList;
                res.json(updatedRow);
              }
            });
          }
        }
      );
    }
  });
});

// GET statistiques
app.get('/api/stats', (req, res) => {
  db.all(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'nouveau' THEN 1 ELSE 0 END) as nouveau,
      SUM(CASE WHEN status = 'contacté' THEN 1 ELSE 0 END) as contacté,
      SUM(CASE WHEN status = 'en négociation' THEN 1 ELSE 0 END) as 'en négociation',
      SUM(CASE WHEN status = 'accord verbal' THEN 1 ELSE 0 END) as 'accord verbal',
      SUM(CASE WHEN status = 'gagné' THEN 1 ELSE 0 END) as gagné,
      SUM(CASE WHEN status = 'perdu' THEN 1 ELSE 0 END) as perdu,
      SUM(CASE WHEN status IN ('contacté', 'en négociation', 'accord verbal') THEN 1 ELSE 0 END) as actives
    FROM agencies
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows[0]);
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});

// Fermer la base de données à l'arrêt
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connexion à la base de données fermée');
    process.exit(0);
  });
});

