export function calculerBesoinHoraireParSpecialiteAjout(nbGroupesExistant, nbGroupesAjout, besoinParGroupe) {
  const nEx = Number(nbGroupesExistant) || 0;
  const nAj = Number(nbGroupesAjout) || 0;
  const b = Number(besoinParGroupe) || 0;
  if (isNaN(nEx) || isNaN(nAj) || isNaN(b)) return 0;
  return (nEx + nAj) * b;
}