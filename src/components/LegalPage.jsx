import { useI18n } from '../i18n/I18nContext'

const REPO_URL = 'https://github.com/Robote7701/backrooms-map'
const ISSUES_URL = `${REPO_URL}/issues`
const WIKI_URL = 'https://backrooms-wiki.wikidot.com/'

// Page de mentions légales / confidentialité. Contenu bilingue géré ici
// directement (plutôt que dans les fichiers i18n) : c'est un bloc de texte
// long et ponctuel, pas une chaîne d'UI réutilisée ailleurs.
export default function LegalPage({ onClose }) {
  const { lang, t } = useI18n()
  const fr = lang === 'fr'

  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <button className="legal-page__close" onClick={onClose}>
          ← {t('legal.back')}
        </button>

        <h1>{fr ? 'Mentions légales & confidentialité' : 'Legal notice & privacy'}</h1>

        <section>
          <h2>{fr ? 'Éditeur du site' : 'Site publisher'}</h2>
          <p>
            {fr
              ? 'Ce site est un projet personnel, non commercial, édité par '
              : 'This site is a personal, non-commercial project, published by '}
            <strong>Robote7701</strong>
            {fr
              ? '. Il s\'agit d\'un fan-site consacré à l\'univers créatif collaboratif « The Backrooms ».'
              : '. It is a fan site dedicated to the collaborative creative universe "The Backrooms".'}
          </p>
        </section>

        <section>
          <h2>{fr ? 'Contact' : 'Contact'}</h2>
          <p>
            {fr
              ? 'Pour toute question, signalement d\'erreur ou demande, merci de passer par les issues du dépôt GitHub : '
              : 'For any question, bug report or request, please use the GitHub repository issues: '}
            <a href={ISSUES_URL} target="_blank" rel="noreferrer noopener">
              {ISSUES_URL}
            </a>
          </p>
        </section>

        <section>
          <h2>{fr ? 'Hébergement' : 'Hosting'}</h2>
          <p>
            {fr
              ? 'Ce site est hébergé gratuitement par GitHub Pages, un service de GitHub, Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis).'
              : 'This site is hosted for free by GitHub Pages, a service of GitHub, Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, USA).'}
          </p>
        </section>

        <section>
          <h2>{fr ? 'Propriété intellectuelle & crédits' : 'Intellectual property & credits'}</h2>
          <p>
            {fr
              ? 'Le code source de ce site est publié sous licence MIT sur '
              : 'The source code of this site is published under the MIT license on '}
            <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            .
          </p>
          <p>
            {fr
              ? 'Les données des niveaux (descriptions, entités, connexions) sont adaptées du '
              : 'Level data (descriptions, entities, connections) is adapted from the '}
            <a href={WIKI_URL} target="_blank" rel="noreferrer noopener">
              Backrooms Wiki
            </a>
            {fr
              ? ', dont le contenu est publié sous licence CC BY-SA. Les descriptions ont été reformulées et un lien vers la fiche source est conservé sur chaque niveau. Ce site n\'est ni affilié, ni approuvé par le Backrooms Wiki ou ses contributeurs.'
              : ', whose content is published under a CC BY-SA license. Descriptions have been reworded and a link back to the source page is kept on every level. This site is not affiliated with nor endorsed by the Backrooms Wiki or its contributors.'}
          </p>
          <p>
            {fr
              ? 'L\'univers « The Backrooms » est une création collective libre (creepypasta) sans détenteur de droits unique connu.'
              : 'The "Backrooms" universe is a free collaborative creation (creepypasta) with no single known rights holder.'}
          </p>
        </section>

        <section>
          <h2>{fr ? 'Confidentialité & données personnelles' : 'Privacy & personal data'}</h2>
          <p>
            {fr
              ? 'Ce site ne collecte aucune donnée personnelle : pas de compte utilisateur, pas de formulaire, pas de cookie, pas d\'outil d\'analyse d\'audience ni de publicité tierce.'
              : 'This site does not collect any personal data: no user account, no form, no cookies, no audience-tracking tool, no third-party advertising.'}
          </p>
          <p>
            {fr
              ? 'La seule information mémorisée est votre langue d\'affichage (FR/EN), enregistrée via le stockage local (localStorage) de votre navigateur. Cette donnée reste uniquement sur votre appareil, n\'est jamais transmise à un serveur, et peut être effacée à tout moment en vidant les données de site de votre navigateur.'
              : 'The only information remembered is your display language (FR/EN), stored via your browser\'s local storage (localStorage). This data stays only on your device, is never sent to a server, and can be cleared at any time by clearing your browser\'s site data.'}
          </p>
          <p>
            {fr
              ? 'L\'hébergeur (GitHub Pages) peut collecter des journaux techniques standards (adresse IP, user-agent) nécessaires au fonctionnement et à la sécurité du service. Voir '
              : 'The host (GitHub Pages) may collect standard technical logs (IP address, user-agent) required to operate and secure the service. See '}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noreferrer noopener"
            >
              {fr ? 'la politique de confidentialité de GitHub' : "GitHub's privacy statement"}
            </a>
            .
          </p>
        </section>

        <section>
          <h2>{fr ? 'Liens externes' : 'External links'}</h2>
          <p>
            {fr
              ? 'Les liens vers le wiki (niveaux, entités) pointent vers un site tiers non contrôlé par l\'éditeur. Certains liens vers des pages d\'entités sont générés automatiquement et peuvent, dans de rares cas, mener à une page inexistante.'
              : 'Links to the wiki (levels, entities) point to a third-party site not controlled by the publisher. Some entity page links are generated automatically and may, in rare cases, lead to a non-existent page.'}
          </p>
        </section>

        <section>
          <h2>{fr ? 'Responsabilité' : 'Liability'}</h2>
          <p>
            {fr
              ? 'Ce site est un projet de fan à but informatif et non lucratif. Le contenu peut comporter des imprécisions et n\'est pas garanti exact ni à jour.'
              : 'This site is a non-profit, informational fan project. Content may contain inaccuracies and is not guaranteed to be accurate or up to date.'}
          </p>
        </section>

        <p className="legal-page__updated">
          {fr ? 'Dernière mise à jour : juillet 2026.' : 'Last updated: July 2026.'}
        </p>
      </div>
    </div>
  )
}
