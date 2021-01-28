module.exports = {
    title: "Laravel Spark",
    description: "A perfect starting point for your next great idea.",
    base: '/',

    head: require('./head'),

    themeConfig: {
        logo: '/assets/img/logo.svg',
        displayAllHeaders: true,
        activeHeaderLinks: false,
        searchPlaceholder: 'Press / to search',
        lastUpdated: false, // string | boolean
        sidebarDepth: 0,

        // repo: 'laravel/spark',

        docsRepo: 'laravel/spark-docs',
        editLinks: true,
        editLinkText: 'Help us improve this page!',

        nav: [
            { text: 'Home', link: '/', target: '_self' },
        ],

        sidebar: {
            '/1.x/': require('./1.x')
        },
    },
}
