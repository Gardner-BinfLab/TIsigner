// http://stackoverflow.com/questions/487073/check-if-element-is-visible-after
// -scrolling

$(document)
    .ready(function () {
        Waves.attach('.btn');
        Waves.init();
        // Check if element is scrolled into view
        function isScrolledIntoView(elem) {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = $(elem)
                .offset()
                .top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
        // If element is scrolled into view, fade it in
        $(window)
            .scroll(function () {
                $('.scroll-animations .animated')
                    .each(function () {
                        if (isScrolledIntoView(this) === true) {
                            $(this).addClass('fadeInUp');
                            console.log('faded')
                        }
                    });
            });

        //on clicking the arrow scroll to the bottom div
        $('#down-arrow').click(function () {
            $('html, body').animate({
                scrollTop: $('#down-arrow')
                    .offset()
                    .top + 45
            }, 1000);
        });

    });
