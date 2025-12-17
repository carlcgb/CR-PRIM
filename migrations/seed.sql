-- Données initiales pour la base de données
-- Note: Cette migration insère les données seulement si la table est vide

INSERT INTO agencies (name, url, description, sector, status) VALUES
('Addipros', 'http://www.addipros.com/', 'agence spécialisée en placement du personnel dans les domaines du transport routier, de l''administration et des technologies', 'Tous types d''emplois', 'nouveau'),
('Adecco Canada', 'http://www.adecco.ca/', 'grande agence de placement pour tous types d''emploi dans tous les secteurs partout au Canada', 'Tous types d''emplois', 'nouveau'),
('Adecco Québec', 'http://www.decouvrez.qc.ca/', 'grande agence de placement pour tous les secteurs d''emploi au Québec', 'Tous types d''emplois', 'nouveau'),
('ANCIA', 'http://www.ancia.qc.ca/', 'grande agence de placement pour tous les types d''emploi au Québec et même au Canada', 'Tous types d''emplois', 'nouveau'),
('APPRI', 'http://www.appri.com/', 'agence de placement située à Montréal pour tous types d''emploi', 'Tous types d''emplois', 'nouveau'),
('Manpower', 'http://www.manpower.ca/', 'grande agence placement de personnel dans tous les secteurs partout au Canada et même au monde', 'Tous types d''emplois', 'nouveau'),
('Michael Page', 'http://www.michaelpage.ca/index.html?language=fr', 'grande agence placement de personnel dans tous les secteurs partout au Canada et même au monde', 'Tous types d''emplois', 'nouveau'),
('Randstad', 'http://www.randstad.ca/', 'agence de placement de personnel dans tous les domaines (administratif, technique, ouvrier, etc) partout au Canada', 'Tous types d''emplois', 'nouveau'),
('Services Kelly', 'http://www.kellyservices.ca/eprise/main/web/ca/services/fr/index.html', 'grande agence de placement dans divers secteurs d''emploi partout au Québec et au Canada', 'Tous types d''emplois', 'nouveau'),
('Aginove', 'http://www.aginove.com/', 'agence spécialisée en placement du personnel en technologies de l''information', 'informatique', 'nouveau'),
('Candidatech', 'http://www.candidatech.qc.ca/index2new.htm', 'agence spécialisée en placement du personnel en informatique', 'informatique', 'nouveau'),
('Expertech', 'http://www.expertech.ca/', 'agence spécialisée en placement du personnel en technologies de l''information', 'informatique', 'nouveau'),
('Serti', 'http://www.serti.com/page1_f.html', 'agence spécialisée en placement du personnel en technologies de l''information', 'informatique', 'nouveau'),
('Accès Services Santé', 'http://www.acces-services-sante.ca/', 'agence spécialisée en placement dans le domaine de la santé', 'santé', 'nouveau'),
('Croix Jaune', 'http://www.croixjaune.com/', 'agence spécialisée en placement du personnel dans le domaine de la santé et des services sociaux', 'santé', 'nouveau');

