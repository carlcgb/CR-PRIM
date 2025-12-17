import { useState } from 'react';
import { api } from '../services/api';

export default function NotesSection({ agency, onUpdate }) {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const notes = agency.notes_list || [];

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setLoading(true);
      const updated = await api.addNote(agency.id, newNote);
      setNewNote('');
      setIsAdding(false);
      if (onUpdate) {
        onUpdate(updated);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note:', error);
      const errorMessage = error.message || 'Erreur lors de l\'ajout de la note. Veuillez réessayer.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      return;
    }

    try {
      setLoading(true);
      const updated = await api.deleteNote(agency.id, noteId);
      if (onUpdate) {
        onUpdate(updated);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la note:', error);
      alert('Erreur lors de la suppression de la note. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notes-section">
      <div className="notes-section-header">
        <h3>Notes ({notes.length})</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary btn-small"
          >
            + Ajouter une note
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddNote} className="note-form">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Écrivez votre note ici..."
            rows="4"
            className="note-input"
            disabled={loading}
            autoFocus
          />
          <div className="note-form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-small"
              disabled={loading || !newNote.trim()}
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}
              className="btn btn-secondary btn-small"
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="no-notes">Aucune note pour le moment.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-item">
              <div className="note-header">
                <span className="note-date">{formatDate(note.createdAt)}</span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="btn-delete-note"
                  title="Supprimer cette note"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
              <div className="note-content">{note.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

