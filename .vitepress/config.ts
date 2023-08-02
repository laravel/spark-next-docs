import { defineConfigWithTheme } from "vitepress";
import type { ThemeConfig } from '@hempworks/pilgrim'
import config from '@hempworks/pilgrim/config'

export default defineConfigWithTheme<ThemeConfig>({
    extends: config,
    title: 'Laravel Spark',
    description: 'A perfect starting point for your next great idea.',
    base: '/docs/',
    cleanUrls: false,
    srcDir: 'src',

    head: [
        ['link', {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/docs/apple-touch-icon.png',
        }],
        ['link', {
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
            href: '/docs/favicon-16x16.png',
        }],
        ['link', {
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
            href: '/docs/favicon-32x32.png',
        }],
        ['link', {
            rel: 'mask-icon',
            href: '/docs/safari-pinned-tab.svg',
        }],
        ['meta', {
            name: 'msapplication-TileColor',
            content: '#18b69b',
        }],
        ['meta', {
            name: 'msapplication-TileImage',
            content: '/docs/mstile-144x144.png',
        }],
        ['meta', {
            property: 'og:image',
            content: '/docs/social-share.png',
        }],
        ['meta', {
            property: 'twitter:card',
            content: 'summary_large_image',
        }],
        ['meta', {
            property: 'twitter:image',
            content: '/docs/social-share.png',
        }],
    ],

    themeConfig: {
        logo: {
            light: '/logo.svg',
            dark: '/logo-dark.svg',
        },
        nav: [
            {
                text: 'Laravel Spark',
                link: 'https://spark.laravel.com',
            },
        ],
        versions: [
            {
                text: 'v4.x',
                link: 'https://spark.laravel.com/docs',
                current: true,
            },
            { text: 'v3.x', link: 'https://github.com/laravel/spark-next-docs/tree/3.x' },
            { text: 'v2.x', link: 'https://github.com/laravel/spark-next-docs/tree/2.x' },
            { text: 'v1.x', link: 'https://github.com/laravel/spark-next-docs/tree/1.x' },
        ],
        sidebar: [
            {
                text: 'Getting Started',
                items: [
                    { text: 'Introduction', link: '/introduction' },
                    { text: 'Installation', link: '/installation' },
                    { text: 'Customization', link: '/customization' },
                ],
            }, {
                text: 'Spark Paddle',
                items: [
                    { text: 'Configuration', link: '/spark-paddle/configuration' },
                    { text: 'Plans', link: '/spark-paddle/plans' },
                    { text: 'Middleware', link: '/spark-paddle/middleware' },
                    { text: 'Events', link: '/spark-paddle/events' },
                    { text: 'Testing', link: '/spark-paddle/testing' },
                    { text: 'Cookbook', link: '/spark-paddle/cookbook' },
                    { text: 'Customization', link: '/spark-paddle/customization' },
                    { text: 'Upgrade', link: '/spark-paddle/upgrade' },
                ],
            }, {
                text: 'Spark Stripe',
                items: [
                    { text: 'Configuration', link: '/spark-stripe/configuration' },
                    { text: 'Plans', link: '/spark-stripe/plans' },
                    { text: 'Middleware', link: '/spark-stripe/middleware' },
                    { text: 'Taxes', link: '/spark-stripe/taxes' },
                    { text: 'Events', link: '/spark-stripe/events' },
                    { text: 'Testing', link: '/spark-stripe/testing' },
                    { text: 'Cookbook', link: '/spark-stripe/cookbook' },
                    { text: 'Customization', link: '/spark-stripe/customization' },
                    { text: 'Upgrade', link: '/spark-stripe/upgrade' },
                ],
            }
        ],
        search: {
            provider: 'local',
            options: {
                placeholder: 'Search Spark Docs...',
                miniSearch: {
                }
            },
        }
    },
    vite: {
        server: {
            host: true,
            fs: {
                // for when developing with locally linked theme
                allow: ['../..']
            }
        },
    }
})
