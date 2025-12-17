// Données initiales extraites du HTML
// Ces données seront chargées depuis le fichier HTML ou utilisées comme fallback

export const initialAgencies = [
  {
    id: 1,
    name: "Addipros",
    url: "http://www.addipros.com/",
    description: "agence spécialisée en placement du personnel dans les domaines du transport routier, de l'administration et des technologies",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Adecco Canada",
    url: "http://www.adecco.ca/",
    description: "grande agence de placement pour tous types d'emploi dans tous les secteurs partout au Canada",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Adecco Québec",
    url: "http://www.decouvrez.qc.ca/",
    description: "grande agence de placement pour tous les secteurs d'emploi au Québec",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "ANCIA",
    url: "http://www.ancia.qc.ca/",
    description: "grande agence de placement pour tous les types d'emploi au Québec et même au Canada",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "APPRI",
    url: "http://www.appri.com/",
    description: "agence de placement située à Montréal pour tous types d'emploi",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Manpower",
    url: "http://www.manpower.ca/",
    description: "grande agence placement de personnel dans tous les secteurs partout au Canada et même au monde",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "Michael Page",
    url: "http://www.michaelpage.ca/index.html?language=fr",
    description: "grande agence placement de personnel dans tous les secteurs partout au Canada et même au monde",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Randstad",
    url: "http://www.randstad.ca/",
    description: "agence de placement de personnel dans tous les domaines (administratif, technique, ouvrier, etc) partout au Canada",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9,
    name: "Services Kelly",
    url: "http://www.kellyservices.ca/eprise/main/web/ca/services/fr/index.html",
    description: "grande agence de placement dans divers secteurs d'emploi partout au Québec et au Canada",
    sector: "Tous types d'emplois",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "Aginove",
    url: "http://www.aginove.com/",
    description: "agence spécialisée en placement du personnel en technologies de l'information",
    sector: "informatique",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 11,
    name: "Candidatech",
    url: "http://www.candidatech.qc.ca/index2new.htm",
    description: "agence spécialisée en placement du personnel en informatique",
    sector: "informatique",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 12,
    name: "Expertech",
    url: "http://www.expertech.ca/",
    description: "agence spécialisée en placement du personnel en technologies de l'information",
    sector: "informatique",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 13,
    name: "Serti",
    url: "http://www.serti.com/page1_f.html",
    description: "agence spécialisée en placement du personnel en technologies de l'information (intelligence d'affaires, développement d'applications, architecture techno, administration de systèmes, assurance qualité, etc)",
    sector: "informatique",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 14,
    name: "Accès Services Santé",
    url: "http://www.acces-services-sante.ca/",
    description: "agence spécialisée en placement dans le domaine de la santé",
    sector: "santé",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 15,
    name: "Croix Jaune",
    url: "http://www.croixjaune.com/",
    description: "agence spécialisée en placement du personnel dans le domaine de la santé et des services sociaux",
    sector: "santé",
    status: "nouveau",
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const statusOptions = [
  { value: 'nouveau', label: 'Nouveau', color: '#3b82f6' },
  { value: 'contacté', label: 'Contacté', color: '#f59e0b' },
  { value: 'en négociation', label: 'En négociation', color: '#8b5cf6' },
  { value: 'accord verbal', label: 'Accord verbal', color: '#06b6d4' },
  { value: 'gagné', label: 'Gagné', color: '#10b981' },
  { value: 'perdu', label: 'Perdu', color: '#ef4444' }
];

export const sectorOptions = [
  "Tous types d'emplois",
  "administration",
  "informatique",
  "santé",
  "hôtellerie, restauration et tourisme",
  "sciences sociales et droit",
  "transport",
  "génie, sciences et techniques",
  "arts et communications graphiques"
];

