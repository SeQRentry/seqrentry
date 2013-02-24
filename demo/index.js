
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
