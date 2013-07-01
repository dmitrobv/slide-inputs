$(document).ready(function() {
    var currentDt = 1,                                                          //currently displayed dd
        firstQ = $('dl.questions dt').first(),                                  //getting first dt to adjusst it margin-top in the future
        percentageText = $('.progress-wrapper p');                              //paragraph to display percents
        progress = $('.progress').css('background-size','0 100%'),              //progress bar block
        nextBtn = $('.nextBtn'),                                                //next button
        prevBtn = $('.prevQuest'),                                              //previous button - visible only since second step
        questBlock = $('.questions'),                                           //block within the current question is displayed
        progressWrap = $('.progress-wrapper'),                                  //block, containing progress bar and percents section

        percentageText.text('0%');


        /* Setting masks for ZIP and PHONE inputs using inputmask jquery library */
        $(".zipcode").inputmask( "99999", { 'clearIncomplete': true, 'autoUnmask' : true });
        $(".phonenum").inputmask( "999-999-9999", {'autoUnmask':true, 'clearIncomplete': true});
        /**************************************************************************/

        $('button').on('click', function() {

            var typeOfLoan = $("#typeOfLoan").val();

            /* Select appropriate filter according to selected type of loan */
            switch( typeOfLoan ) {
                case 'mortgagerefinance': refinance(); break;
                case 'homeequity': equity(); break;
                case 'purchasehome': purchasehome(); break;
                    default: emptyField(); return;
            };
            /*****************************************************************/

            var totalItems = $('dl.questions dt:visible').length,               //getting amount of visible dt's
                percentage = 100 / totalItems;

            currentDt = ($(this).data('dir') === 'next') ? nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText, totalItems) : prevQuestFn(currentDt, firstQ, percentage, progress, percentageText); } );
});


/* Next button pressed */
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
/***********************/

/* Previous button pressed */
function prevQuestFn(currentDt, firstQ, percentage, progress, percentageText, totalItems) {
    if(currentDt === 2) $('.prevQuest').css('visibility','hidden');
    firstQ.animate({'margin-top': (currentDt === 1) ? 0 : '+=117px' }, 500);
    progressRefresh(percentage, currentDt, progress, 'prev', percentageText);
    return (currentDt === 1) ? 1 : --currentDt;
}
/***************************/

/* Refreshing progress bar filling and percents */
function progressRefresh(percentage, currentDt, progress, dir, percentageText) {
    progress.css('background-size', (dir === 'prev') ? (currentDt-=2)*percentage+'% 100%' : currentDt*percentage+'% 100%');
    percentageText.text(Math.round( currentDt*percentage) + '%');
}
/*************************************************/

/* Filter dt's and dd's for refinance type only */
function refinance() {
    showDtDd();
    $("dt:not(.refinance)").css('display','none');
    $("dd:not(.refinance)").css('display','none');
    initDds();
}
/************************************************/

/* Filter dt's and dd's for equity type only */
function equity() {
    showDtDd();
    $("dt:not(.equity)").css('display','none');
    $("dd:not(.equity)").css('display','none');
    initDds();
}
/*********************************************/

/* Filter dt's and dd's for purchase home type only */
function purchasehome() {
    showDtDd();
    $("dt:not(.purchase-home)").css('display','none');
    $("dd:not(.purchase-home)").css('display','none');
    initDds();
}
/****************************************************/

/* Displaying all dt's and dd's*/
function showDtDd() {
    $("dt").css('display','block');
    $("dd").css('display','block');
}
/*******************************/

/* Bounce effect if the field or selection is empty */
function emptyField() {
    $("dd select").effect( "bounce", { times: 5 }, "slow" );
    $("dd input").effect( "bounce", { times: 5 }, "slow" );
}
/*****************************************************/

/* Adding class to all currently visible dd's to know which is current in the future use */
function initDds() {
    var class_id = 0;

    $('dd:visible').addClass(function(class_id){
        return 'fid'+ (++class_id);
    })
}
/*****************************************************************************************/

