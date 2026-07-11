import { useI18n } from '../i18n/I18nContext'

const REPO_URL = 'https://github.com/Robote7701/backrooms-map'
const ISSUES_URL = `${REPO_URL}/issues`
const WIKI_URL = 'https://backrooms-wiki.wikidot.com/'

// Page de mentions légales / confidentialité. Contenu géré ici directement
// (plutôt que dans les fichiers i18n) : c'est un bloc de texte long et
// ponctuel, pas des chaînes d'UI réutilisées ailleurs. FR/EN/DE ; toute
// langue non couverte retombe sur l'anglais.
const TEXT = {
  title: { fr: 'Mentions légales & confidentialité', en: 'Legal notice & privacy', de: 'Impressum & Datenschutz' },
  publisherTitle: { fr: 'Éditeur du site', en: 'Site publisher', de: 'Betreiber der Website' },
  publisherBefore: {
    fr: 'Ce site est un projet personnel, non commercial, édité par ',
    en: 'This site is a personal, non-commercial project, published by ',
    de: 'Diese Website ist ein persönliches, nicht-kommerzielles Projekt, betrieben von ',
  },
  publisherAfter: {
    fr: '. Il s\'agit d\'un fan-site consacré à l\'univers créatif collaboratif « The Backrooms ».',
    en: '. It is a fan site dedicated to the collaborative creative universe "The Backrooms".',
    de: '. Es handelt sich um eine Fanseite zum kollaborativen Kreativuniversum „The Backrooms“.',
  },
  contactTitle: { fr: 'Contact', en: 'Contact', de: 'Kontakt' },
  contactText: {
    fr: 'Pour toute question, signalement d\'erreur ou demande, merci de passer par les issues du dépôt GitHub : ',
    en: 'For any question, bug report or request, please use the GitHub repository issues: ',
    de: 'Bei Fragen, Fehlermeldungen oder Anfragen bitte die Issues des GitHub-Repositories nutzen: ',
  },
  hostingTitle: { fr: 'Hébergement', en: 'Hosting', de: 'Hosting' },
  hostingText: {
    fr: 'Ce site est hébergé gratuitement par GitHub Pages, un service de GitHub, Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis).',
    en: 'This site is hosted for free by GitHub Pages, a service of GitHub, Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, USA).',
    de: 'Diese Website wird kostenlos von GitHub Pages gehostet, einem Dienst von GitHub, Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, USA).',
  },
  ipTitle: {
    fr: 'Propriété intellectuelle & crédits',
    en: 'Intellectual property & credits',
    de: 'Geistiges Eigentum & Credits',
  },
  ipCodeBefore: {
    fr: 'Le code source de ce site est publié sous licence MIT sur ',
    en: 'The source code of this site is published under the MIT license on ',
    de: 'Der Quellcode dieser Website ist unter der MIT-Lizenz veröffentlicht auf ',
  },
  ipDataBefore: {
    fr: 'Les données des niveaux (descriptions, entités, connexions) sont adaptées du ',
    en: 'Level data (descriptions, entities, connections) is adapted from the ',
    de: 'Die Ebenendaten (Beschreibungen, Wesen, Verbindungen) sind angepasst vom ',
  },
  ipDataAfter: {
    fr: ', dont le contenu est publié sous licence CC BY-SA. Les descriptions ont été reformulées et un lien vers la fiche source est conservé sur chaque niveau. Ce site n\'est ni affilié, ni approuvé par le Backrooms Wiki ou ses contributeurs.',
    en: ', whose content is published under a CC BY-SA license. Descriptions have been reworded and a link back to the source page is kept on every level. This site is not affiliated with nor endorsed by the Backrooms Wiki or its contributors.',
    de: ', dessen Inhalte unter einer CC-BY-SA-Lizenz veröffentlicht sind. Die Beschreibungen wurden umformuliert, ein Link zur Quellseite bleibt bei jeder Ebene erhalten. Diese Website steht in keiner Verbindung zum Backrooms Wiki oder seinen Mitwirkenden und wird von diesen nicht unterstützt.',
  },
  ipUniverse: {
    fr: 'L\'univers « The Backrooms » est une création collective libre (creepypasta) sans détenteur de droits unique connu.',
    en: 'The "Backrooms" universe is a free collaborative creation (creepypasta) with no single known rights holder.',
    de: 'Das „Backrooms“-Universum ist eine freie kollaborative Schöpfung (Creepypasta) ohne bekannten alleinigen Rechteinhaber.',
  },
  privacyTitle: {
    fr: 'Confidentialité & données personnelles',
    en: 'Privacy & personal data',
    de: 'Datenschutz & personenbezogene Daten',
  },
  privacyNoData: {
    fr: 'Ce site ne collecte aucune donnée personnelle : pas de compte utilisateur, pas de formulaire, pas de cookie, pas d\'outil d\'analyse d\'audience ni de publicité tierce.',
    en: 'This site does not collect any personal data: no user account, no form, no cookies, no audience-tracking tool, no third-party advertising.',
    de: 'Diese Website erhebt keine personenbezogenen Daten: kein Benutzerkonto, kein Formular, keine Cookies, keine Reichweitenmessung, keine Werbung Dritter.',
  },
  privacyLocalStorage: {
    fr: 'La seule information mémorisée est votre langue d\'affichage (FR/EN/DE), enregistrée via le stockage local (localStorage) de votre navigateur. Cette donnée reste uniquement sur votre appareil, n\'est jamais transmise à un serveur, et peut être effacée à tout moment en vidant les données de site de votre navigateur.',
    en: 'The only information remembered is your display language (FR/EN/DE), stored via your browser\'s local storage (localStorage). This data stays only on your device, is never sent to a server, and can be cleared at any time by clearing your browser\'s site data.',
    de: 'Die einzige gespeicherte Information ist Ihre Anzeigesprache (FR/EN/DE), gespeichert im lokalen Speicher (localStorage) Ihres Browsers. Diese Daten verbleiben ausschließlich auf Ihrem Gerät, werden nie an einen Server übertragen und können jederzeit durch Löschen der Website-Daten Ihres Browsers entfernt werden.',
  },
  privacyHostBefore: {
    fr: 'L\'hébergeur (GitHub Pages) peut collecter des journaux techniques standards (adresse IP, user-agent) nécessaires au fonctionnement et à la sécurité du service. Voir ',
    en: 'The host (GitHub Pages) may collect standard technical logs (IP address, user-agent) required to operate and secure the service. See ',
    de: 'Der Hoster (GitHub Pages) kann technische Standardprotokolle (IP-Adresse, User-Agent) erheben, die für Betrieb und Sicherheit des Dienstes erforderlich sind. Siehe ',
  },
  privacyHostLink: {
    fr: 'la politique de confidentialité de GitHub',
    en: "GitHub's privacy statement",
    de: 'die Datenschutzerklärung von GitHub',
  },
  linksTitle: { fr: 'Liens externes', en: 'External links', de: 'Externe Links' },
  linksText: {
    fr: 'Les liens vers le wiki (niveaux, entités) pointent vers un site tiers non contrôlé par l\'éditeur. Certains liens vers des pages d\'entités sont générés automatiquement et peuvent, dans de rares cas, mener à une page inexistante.',
    en: 'Links to the wiki (levels, entities) point to a third-party site not controlled by the publisher. Some entity page links are generated automatically and may, in rare cases, lead to a non-existent page.',
    de: 'Links zum Wiki (Ebenen, Wesen) verweisen auf eine Drittseite, die nicht vom Betreiber kontrolliert wird. Einige Links zu Wesen-Seiten werden automatisch generiert und können in seltenen Fällen zu einer nicht existierenden Seite führen.',
  },
  liabilityTitle: { fr: 'Responsabilité', en: 'Liability', de: 'Haftung' },
  liabilityText: {
    fr: 'Ce site est un projet de fan à but informatif et non lucratif. Le contenu peut comporter des imprécisions et n\'est pas garanti exact ni à jour.',
    en: 'This site is a non-profit, informational fan project. Content may contain inaccuracies and is not guaranteed to be accurate or up to date.',
    de: 'Diese Website ist ein gemeinnütziges, informatives Fanprojekt. Inhalte können Ungenauigkeiten enthalten und werden nicht als korrekt oder aktuell garantiert.',
  },
  updated: {
    fr: 'Dernière mise à jour : juillet 2026.',
    en: 'Last updated: July 2026.',
    de: 'Letzte Aktualisierung: Juli 2026.',
  },
}

function tr(key, lang) {
  return TEXT[key][lang] ?? TEXT[key].en
}

export default function LegalPage({ onClose }) {
  const { lang, t } = useI18n()
  const L = (key) => tr(key, lang)

  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <button className="legal-page__close" onClick={onClose}>
          ← {t('legal.back')}
        </button>

        <h1>{L('title')}</h1>

        <section>
          <h2>{L('publisherTitle')}</h2>
          <p>
            {L('publisherBefore')}
            <strong>Robote7701</strong>
            {L('publisherAfter')}
          </p>
        </section>

        <section>
          <h2>{L('contactTitle')}</h2>
          <p>
            {L('contactText')}
            <a href={ISSUES_URL} target="_blank" rel="noreferrer noopener">
              {ISSUES_URL}
            </a>
          </p>
        </section>

        <section>
          <h2>{L('hostingTitle')}</h2>
          <p>{L('hostingText')}</p>
        </section>

        <section>
          <h2>{L('ipTitle')}</h2>
          <p>
            {L('ipCodeBefore')}
            <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
            .
          </p>
          <p>
            {L('ipDataBefore')}
            <a href={WIKI_URL} target="_blank" rel="noreferrer noopener">
              Backrooms Wiki
            </a>
            {L('ipDataAfter')}
          </p>
          <p>{L('ipUniverse')}</p>
        </section>

        <section>
          <h2>{L('privacyTitle')}</h2>
          <p>{L('privacyNoData')}</p>
          <p>{L('privacyLocalStorage')}</p>
          <p>
            {L('privacyHostBefore')}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noreferrer noopener"
            >
              {L('privacyHostLink')}
            </a>
            .
          </p>
        </section>

        <section>
          <h2>{L('linksTitle')}</h2>
          <p>{L('linksText')}</p>
        </section>

        <section>
          <h2>{L('liabilityTitle')}</h2>
          <p>{L('liabilityText')}</p>
        </section>

        <p className="legal-page__updated">{L('updated')}</p>
      </div>
    </div>
  )
}
