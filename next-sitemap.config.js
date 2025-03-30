/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://johnenglish.online',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://johnenglish.online/sitemap.xml',
    ],
  },
  exclude: ['/404'],
  changefreq: 'weekly',
  priority: 0.7,
}