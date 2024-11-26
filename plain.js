(function(d, script) {
    script = d.createElement('script');
    script.async = false;
    script.onload = function (){
        Plain.init({
            appId: 'liveChatApp_01JDM3PR254XBX2KT88YW09BBE',
            links: [
                {
                    icon: 'book',
                    text: 'View our docs',
                    url: 'https://docs.vapor.build',
                }, {
                    icon: 'discord',
                    text: 'Join our Discord',
                    url: 'https://discord.com/invite/laravel',
                }
            ],
            style: {
                chatButtonColor: '#7C46F6',
                chatButtonIconColor: '#ffffff',
            },
            threadDetails: {
                labelTypeIds: ['liveChatApp_01JDM3PR254XBX2KT88YW09BBE'],
            },
        });
    };
    script.src = 'https://chat.cdn-plain.com/index.js';
    d.getElementsByTagName('head')[0].appendChild(script);

    document.querySelector("#navbar ul a[href='mailto:spark@laravel.com']").onclick = function (e) {
        if (typeof window.Plain !== 'undefined') {
            e.preventDefault();
            Plain.open()
        }
    }
}(document));
