$(document).ready(function() {
    var currentDt = 1,
        firstQ = $('dl.questions dt').first(),
        percentageText = $('.progress-wrapper p');
        progress = $('.progress').css('background-size','0 100%'),
        nextBtn = $('.nextBtn'),
        prevBtn = $('.prevQuest'),
        questBlock = $('.questions'),
        progressWrap = $('.progress-wrapper'),

        percentageText.text('0%');


        $(".zipcode").inputmask( "99999", { 'clearIncomplete': true, 'autoUnmask' : true });
        $(".phonenum").inputmask( "999-999-9999", {'autoUnmask':true, 'clearIncomplete': true});


        $('button').on('click', function() {

            var typeOfLoan = $("#typeOfLoan").val();

            switch( typeOfLoan ) {
                case 'Refinance': refinance(); break;
                case 'Home Equity': equity(); break;
                case 'Purchase Home': purchasehome(); break;
                    default: emptyField(); return;
            };

            var totalItems = $('dl.questions dt:visible').length,
                percentage = 100 / totalItems;

            currentDt = ($(this).data('dir') === 'next') ? nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText, totalItems) : prevQuestFn(currentDt, firstQ, percentage, progress, percentageText); } );
});


function nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText) {
    if (($(".fid"+currentDt).children('select').val()=='') || ($(".fid"+currentDt).children('input').val()=='')) {
        emptyField();
        return currentDt;
    }

    $('.prevQuest').css('visibility','visible');
    firstQ.animate({'margin-top': (currentDt === totalItems) ? '-='+0 : '-=117px' }, 500);
    progressRefresh(percentage, currentDt, progress, 'next', percentageText);

    //Final question is answered
    if(currentDt === totalItems) {
        progressWrap.css('display','none');
        questBlock.css('display','none');
        prevBtn.css('display','none');
        nextBtn.css('display','none');
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

function refinance() {
    showDtDd();
    $("dt:not(.refinance)").css('display','none');
    $("dd:not(.refinance)").css('display','none');
    initDds();
}

function equity() {
    showDtDd();
    $("dt:not(.equity)").css('display','none');
    $("dd:not(.equity)").css('display','none');
    initDds();
}

function purchasehome() {
    showDtDd();
    $("dt:not(.purchase-home)").css('display','none');
    $("dd:not(.purchase-home)").css('display','none');
    initDds();
}

function showDtDd() {
    $("dt").css('display','block');
    $("dd").css('display','block');
}

function emptyField() {
    $("dd select").effect( "bounce", { times: 5 }, "slow" );
    $("dd input").effect( "bounce", { times: 5 }, "slow" );
}

function initDds() {
    var class_id = 0;

    $('dd:visible').addClass(function(class_id){
        return 'fid'+ (++class_id);
    })
}

