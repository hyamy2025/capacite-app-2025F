export function calculerSurfacePedagogique(surface, cno) {
  const result = surface / cno;
  return result <= 26 ? parseFloat(result.toFixed(2)) : 26.0;
}

export function calculerHeuresMax(semaine) {
  return 56 * semaine;
}

export function moyenneColonne(colonne) {
  const valides = colonne.filter(val => typeof val === 'number' && !isNaN(val));
  if (valides.length === 0) return 0;
  const total = valides.reduce((acc, curr) => acc + curr, 0);
  return parseFloat((total / valides.length).toFixed(2));
}

export function sommeColonne(colonne) {
  return colonne
    .filter(val => typeof val === 'number' && !isNaN(val))
    .reduce((acc, curr) => acc + curr, 0);
}

export function calculerBesoinHoraireParSpecialite(besoinParGroupe, nbGroupes) {
  return besoinParGroupe * nbGroupes;
}

export function calculerHeuresResultat(disponible, requis) {
  return parseFloat((disponible - requis).toFixed(2));
}

export function calculerApprenantsResultat(heuresRestantes, besoinMoyen, surfaceMoyenne) {
  if (besoinMoyen === 0) return 0;
  return Math.round((heuresRestantes / besoinMoyen) * surfaceMoyenne);
}

export function determinerEtat(heuresRestantes) {
  return heuresRestantes >= 0 ? 'Excédent' : 'Dépassement';
}
