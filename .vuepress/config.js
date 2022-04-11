module.exports = {
    title: "Laravel Spark",
    description: "A perfect starting point for your next great idea.",
    base: '/docs/',

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

        sidebar: {
            '/1.x/': require('./1.x'),
            '/2.x/': require('./2.x')
        },
    },
}
