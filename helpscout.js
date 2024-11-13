! function(e, t, n) {
    function a() {
        var e = t.getElementsByTagName("script")[0],
            n = t.createElement("script");
        n.type = "text/javascript", n.async = !0, n.src = "https://beacon-v2.helpscout.net", e.parentNode.insertBefore(n, e)
    }
    if (e.Beacon = n = function(t, n, a) {
        e.Beacon.readyQueue.push({
            method: t,
            options: n,
            data: a
        })
    }, n.readyQueue = [], "complete" === t.readyState) return a();
    e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1)

    window.Beacon('init', 'b4c28295-5588-4668-a3af-7a56a9091998')

    document.querySelector("#navbar ul a[href='mailto:spark@laravel.com']").onclick = function (e) {
        if (typeof window.Beacon !== 'undefined') {
            e.preventDefault();
            Beacon('open')
        }
    }
}(window, document, window.Beacon || function() {});
