$(document).ready(function() {
    var currentDt = 1,
        firstQ = $('dl.questions dt').first(),
        totalItems = $('dl.questions dt').length,
        percentage = 100 / totalItems;
        percentageText = $('.progress-wrapper p');
        progress = $('.progress').css('background-size','0 100%'),
        nextBtn = $('.nextBtn'),
        prevBtn = $('.prevQuest'),
        questBlock = $('.questions'),
        progressWrap = $('.progress-wrapper');

        percentageText.text('0%');

        $('button').on('click', function() { currentDt = ($(this).data('dir') === 'next') ? nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText, totalItems) : prevQuestFn(currentDt, firstQ, percentage, progress, percentageText); } );
});


function nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText) {
    $('.prevQuest').css('visibility','visible');
    firstQ.animate({'margin-top': (currentDt === totalItems) ? '-='+0 : '-=117px' }, 500);
    progressRefresh(percentage, currentDt, progress, 'next', percentageText);

    //Final question is answered
    if(currentDt === totalItems) {
        progressWrap.hide();
        questBlock.hide();
        prevBtn.hide();
        nextBtn.hide();
        $('.form').css({ 'height': '660px', 'background-size':'100% 100%'});
        $('.form_inside').css('padding','25px');
        var field_id = 1;
        $('dl.questions dd').children().each(
                function(){
                   $('#f'+field_id).val($(this).val());
                   ++field_id;
                }
        )
        $('.complForm').show('slow');
    }
    return (currentDt<totalItems) ? ++currentDt : currentDt;
}

function prevQuestFn(currentDt, firstQ, percentage, progress, percentageText, totalItems) {
    if(currentDt === 2) $('.prevQuest').css('visibility','hidden');
    firstQ.animate({'margin-top': (currentDt === 1) ? 0 : '+=117px' }, 500);
    progressRefresh(percentage, currentDt, progress, 'prev', percentageText);
    return (currentDt === 1) ? 1 : --currentDt;
}

function progressRefresh(percentage, currentDt, progress, dir, percentageText) {
    progress.css('background-size', (dir === 'prev') ? (currentDt-=2)*percentage+'% 100%' : currentDt*percentage+'% 100%');
    percentageText.text(Math.round( currentDt*percentage) + '%');
}