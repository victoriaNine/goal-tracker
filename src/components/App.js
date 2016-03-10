// Racine applicative
// ==================

// Aaaaah ben oui comme composant bête, y'a pas plus bête : le composant
// n’existe que pour déléguer à ses composants enfants.  Nécessaire à cause de
// la façon dont on a structuré nos routes, notamment pour illutrer
// `IndexRoute`, et parce qu’une `Route` a forcément un `component=`…
export default ({ children }) => children
