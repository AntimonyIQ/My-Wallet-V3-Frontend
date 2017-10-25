/* eslint-disable semi */
angular
  .module('walletApp')
  .factory('blockAlert', blockAlert)

function blockAlert ($translate) {
  const allTrue = (xs) => xs.every(x => x === true)

  const alertTypes = ['info', 'warning', 'danger']

  const isLocalizedMessage = (msg) =>
    angular.isString(msg) || (angular.isObject(msg) && msg['en'] != null)

  const isValidConfig = (config) => allTrue([
    angular.isObject(config),
    alertTypes.indexOf(config.type) > -1,
    config.dismissId == null || angular.isString(config.dismissId),
    config.header == null || isLocalizedMessage(config.header),
    config.sections && config.sections.length > 0 && config.sections.every(s =>
      isLocalizedMessage(s.title) && isLocalizedMessage(s.body)
    ),
    config.action == null || (
      isLocalizedMessage(config.action.title) &&
      angular.isString(config.action.link)
    )
  ])

  const localize = (lang, msg) =>
    angular.isString(msg) ? msg : (msg[lang] || msg['en'])

  const localizeConfig = (lang, config) => ({
    type: config.type,
    dismissId: config.dismissId,
    header: localize(lang, config.header),
    sections: config.sections.map(s => ({
      title: localize(lang, s.title),
      body: localize(lang, s.body)
    })),
    action: config.action && {
      title: localize(lang, config.action.title),
      link: config.action.link
    }
  })

  const create = (type) => (header, sections, action, { dismissId } = {}) =>
    ({ type, dismissId, header, sections, action })

  const header = (title) =>
    $translate.instant(title)

  const section = (title, body) =>
    ({ title: $translate.instant(title), body: $translate.instant(body) })

  const action = (title, link) =>
    ({ title: $translate.instant(title), link })

  return {
    isValidConfig,
    localizeConfig,
    header,
    section,
    action,
    createInfo: create('info'),
    createWarning: create('warning'),
    createDanger: create('danger')
  }
}
