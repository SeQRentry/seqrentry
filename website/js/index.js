
$(document).ready(function() {
    $(window).hashchange(function() {
        var id = location.hash.substring(1);
        var el = document.getElementById(id) || document.getElementById('main');

        $('article').each(function (idx, el) {
            if ($(el).hasClass('active')) {
                $(el).removeClass('active').addClass('inactive');
            }
        });

        $(el).removeClass('inactive').addClass('active');
    })

    $(window).hashchange();
});

function demo_log(elem, type, value) {
    var log = document.getElementById('demo-log');
    var now = String(new Date()).substring(0, 24);

    if (type != 'form') {
        $(elem).addClass('highlight');
        window.setTimeout(function() { $(elem).removeClass('highlight'); }, 1);
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
