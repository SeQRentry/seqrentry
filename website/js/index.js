
$(document).load(function() {
    // Enable fading pages if Javascript is available
    $('article').each(function (idx, el) {
            $(el).addClass('stacked');
    });
});

$(document).ready(function() {
    $(window).hashchange(function() {
        var id = location.hash.substring(1);
        var el = document.getElementById(id) || document.getElementById('main');

        // Re-insert article in flow (but hidden)
        $(el).removeClass('removed').addClass('inactive');

        window.setTimeout(function() {
            // Make one article active and all others inactive
            $('article').each(function (idx, el) {
                $(el).removeClass('active').removeClass('inactive');
            });

            $(el).addClass('active');
        }, 10);

        window.setTimeout(function() {
            // Remove article from flow once it has faded away
            $('article').each(function (idx, el) {
                if (!$(el).hasClass('active')) {
                    $(el).removeClass('inactive').addClass('removed');
                }
            });
        }, 500);
        
        // Enable fading pages if Javascript is available
        $('article').each(function (idx, el) {
            $(el).addClass('stacked');
        });

        // Track page views
        ga('send', 'pageview', {
            'page':  location.pathname + location.search + location.hash,
            'title': $(el).find('header h2').text()
        });

        $('#link-github').on('click', function() {
            ga('send', 'event', 'link', 'click', 'gitgub');
        });

        $('#link-group').on('click', function() {
            ga('send', 'event', 'link', 'click', 'group-developers');
        });
    })

    $(window).hashchange();
});

function demo_log(elem, type, value) {
    var log = document.getElementById('demo-log');
    var now = String(new Date()).substring(0, 24);

    if (type != 'form') {
        $(elem).addClass('highlight');
        window.setTimeout(function() { $(elem).removeClass('highlight'); }, 500);
    }

    switch (type) {
        case 'form':
            log.innerHTML += now + ' Form "' + elem.getElementsByTagName('legend').item(0).innerHTML + '": ' + value + '<br/>';
            break;

        case 'username':
            log.innerHTML += now + ' Username: ' + value + '<br/>';
            break;

        case 'password':
            log.innerHTML += now + ' Password: ' + value + '<br/>';
            break;

        case 'new-password':
            log.innerHTML += now + ' New password: ' + value + '<br/>';
            break;

        default:
            log.innerHTML += now + ' Unknown type "' + type + '": ' + value + '<br/>';
            break;
    }
}
