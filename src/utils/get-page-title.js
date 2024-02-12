import defaultSettings from '@/settings'

const title ='PriorTest' || defaultSettings.title

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
