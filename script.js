Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('template');
    var nextUrl;
    var items;

    Array.prototype.slice.call(templates).forEach(function(tmpl) {
        Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
    });

    $('.loadmore').hide();

    function makeRequest() {
        var $input = $('input').val();
        var $type = $('select').val();
        $.ajax({
            url: 'https://elegant-croissant.glitch.me/spotify',
            method: 'GET',
            data: {
                limit: 18,
                q: $input,
                type: $type
            },
            success: function(data) {
                data = data.artists || data.albums;
                //CREATE NICE INTRO ANIMATION
                if (items && items.length) {
                    items = items.concat(data.items);
                } else {
                    items = data.items;
                }
                $('.word-searched').html('<h2>Results for: "' + $input + '"</h2>');
                next = data.next && data.next.replace('https://api.spotify.com/v1/search', 'https://elegant-croissant.glitch.me/spotify');

                $('#showresults').html(Handlebars.templates.results({
                    items: items
                }))
                //Need to toggle loadmore button on more searches
                if (next) {
                    $('.loadmore').show();
                }
            }
        });
    }

    $('button').on('click', function(e) {
        makeRequest();
    });

    // setTimeout(function(){
    //     console.log("2sec delay before showing:");
    //     console.log(($(window).height() + $(window).scrollTop())); console.log($(document).height());
    // }, 2000);

    $(document).on('click', '.loadmore', function(e){
        $(e.target).remove();
        $.ajax({
          url: next,
          success: function(data) {
            data = data.artists || data.albums;
            $('#showresults').append(Handlebars.templates.results(data));
            next = data.next && data.next.replace('https://api.spotify.com/v1/search', 'https://elegant-croissant.glitch.me/spotify')
          }
        });
    });
