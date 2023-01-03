module.exports = {
    title: "Laravel Spark",
    description: "A perfect starting point for your next great idea.",
    base: '/docs/',

    plugins: [require("./plugins/metaVersion.js")],

    head: require('./head'),

    themeConfig: {
        logo: '/assets/img/logo.svg',
        displayAllHeaders: true,
        activeHeaderLinks: false,
        searchPlaceholder: 'Press / to search',
        lastUpdated: false, // string | boolean
        sidebarDepth: 0,

        // repo: 'laravel/spark',

        // docsRepo: 'laravel/spark-next-docs',
        // editLinks: true,
        // editLinkText: 'Help us improve this page!',

        nav: [
            { text: 'Home', link: 'https://spark.laravel.com', target: '_self' },
        ],

        nav: [
            { text: 'Home', link: 'https://spark.laravel.com', target: '_self' },
            {
                text: "Version",
                link: "/",
                items: [
                    { text: "1.x", link: "/1.x/" },
                    { text: "2.x", link: "/2.x/" },
                    { text: "3.x", link: "/3.x/" },
                ]
            }
        ],

        sidebar: {
            '/1.x/': require('./1.x'),
            '/2.x/': require('./2.x'),
            '/3.x/': require('./3.x')
        },
    },
}
