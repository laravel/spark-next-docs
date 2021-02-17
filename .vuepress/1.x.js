module.exports = [
    {
        title: "Getting Started",
        collapsable: false,
        children: [
            'introduction',
            'installation',
        ],
    }, {
        title: "Spark Paddle",
        collapsable: false,
        children: prefix('spark-paddle', [
            'configuration',
            'plans',
            'middleware',
            'events',
            'testing',
            'customization',
        ]),
    }, {
        title: "Spark Stripe",
        collapsable: false,
        children: prefix('spark-stripe', [
            'configuration',
            'plans',
            'middleware',
            'taxes',
            'events',
            'testing',
            'cookbook',
            'customization',
        ]),
    }
]

function prefix(prefix, children) {
    return children.map(child => `${prefix}/${child}`)
}
