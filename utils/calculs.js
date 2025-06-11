export function calculerSurfacePedagogique(surface, cno) {
  const result = surface / cno;
  return result <= 26 ? parseFloat(result.toFixed(2)) : 26.0;
}

// عدل الدالة لتقبل عدد الساعات في الأسبوع (heuresParSemaine) كوسيط إضافي
export function calculerHeuresMax(semaine, heuresParSemaine = 56) {
  return heuresParSemaine * semaine;
}

export function moyenneColonne(colonne) {
  const valides = colonne.filter(val => typeof val === 'number' && !isNaN(val));
  if (valides.length === 0) return 0;
  const total = valides.reduce((acc, curr) => acc + curr, 0);
  return parseFloat((total / valides.length).toFixed(2));
}

export function calculerBesoinHoraireParSpecialite(nbGroupes, besoinParGroupe) {
  return nbGroupes * besoinParGroupe;
}

export function sommeColonne(colonne) {
  return colonne
    .filter(val => typeof val === 'number' && !isNaN(val))
    .reduce((acc, curr) => acc + curr, 0);
}

// حساب Heures restantes: somme heures max - somme besoin par spécialité
export function calculerHeuresRestantes(sommeHeuresMax, sommeBesoinParSpecialite) {
  return parseFloat((sommeHeuresMax - sommeBesoinParSpecialite).toFixed(2));
}

// حساب Apprenants possibles: (heures restantes / moyenne besoin par groupe) * moyenne surface pédagogique
export function calculerApprenantsPossibles(heuresRestantes, moyenneBesoinParGroupe, moyenneSurfacePedagogique) {
  if (moyenneBesoinParGroupe === 0) return 0;
  return Math.round((heuresRestantes / moyenneBesoinParGroupe) * moyenneSurfacePedagogique);
}

export function determinerEtat(heuresRestantes) {
  return heuresRestantes >= 0 ? 'Excédent' : 'Dépassement';
}