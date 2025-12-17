// Script pour parser le HTML et extraire les données des agences

export function parseAgenciesFromHTML(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const agencies = [];
  let currentSector = 'Tous types d\'emplois';
  
  // Parcourir tous les paragraphes
  const paragraphs = doc.querySelectorAll('p');
  
  paragraphs.forEach(p => {
    const text = p.textContent.trim();
    
    // Détecter les changements de secteur
    if (text.includes('Secteur ') || text.includes('Agences pour')) {
      if (text.includes('Secteur ')) {
        currentSector = text.replace('Secteur ', '').replace(' :', '').trim();
      } else if (text.includes('Agences pour tous types')) {
        currentSector = 'Tous types d\'emplois';
      } else if (text.includes('Agences pour des secteurs')) {
        // On garde le secteur précédent
      }
      return;
    }
    
    // Chercher les liens dans le paragraphe
    const link = p.querySelector('a');
    if (link && link.href && link.href.startsWith('http')) {
      const name = link.textContent.trim();
      const url = link.href;
      
      // Extraire la description (texte après le nom)
      let description = text;
      const nameIndex = description.indexOf(name);
      if (nameIndex !== -1) {
        description = description.substring(nameIndex + name.length);
        // Nettoyer la description
        description = description.replace(/^[:\s-]+/, '').trim();
      }
      
      // Ignorer les agences d'artistes pour l'instant (on peut les ajouter plus tard)
      if (name && url && !text.includes('agence rpute') && !text.includes('pour artistes')) {
        agencies.push({
          id: Date.now() + Math.random(), // ID temporaire
          name: name,
          url: url,
          description: description || '',
          sector: currentSector,
          status: 'nouveau', // nouveau, contacté, en négociation, gagné, perdu
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
  });
  
  return agencies;
}

// Fonction pour charger et parser le fichier HTML
export async function loadAgenciesFromFile() {
  try {
    const response = await fetch('/liste des agences de placement.htm');
    const htmlContent = await response.text();
    return parseAgenciesFromHTML(htmlContent);
  } catch (error) {
    console.error('Erreur lors du chargement du fichier HTML:', error);
    return [];
  }
}

