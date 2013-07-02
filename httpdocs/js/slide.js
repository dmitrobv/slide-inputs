$(document).ready(function() {
    var currentDt = 1,                                                          //currently displayed dd
        firstQ = $('dl.questions dt').first(),                                  //getting first dt to adjusst it margin-top in the future
        percentageText = $('.progress-wrapper p');                              //paragraph to display percents
        progress = $('.progress').css('background-size','0 100%'),              //progress bar block
        nextBtn = $('.nextBtn'),                                                //next button
        prevBtn = $('.prevQuest'),                                              //previous button - visible only since second step
        questBlock = $('.questions'),                                           //block within the current question is displayed
        progressWrap = $('.progress-wrapper'),                                  //block, containing progress bar and percents section
        step = 3;

        percentageText.text('0%');


        /* Setting masks for ZIP and PHONE inputs using inputmask jquery library */
        $(".zipcode").inputmask( "99999", { 'clearIncomplete': true, 'autoUnmask' : true });
        $(".phonenum").inputmask( "999-999-9999", {'autoUnmask':true, 'clearIncomplete': true});
        /**************************************************************************/

        $('button').on('click', function() {
            if(currentDt<=1){
                var typeOfLoan = $("#typeOfLoan").val();

                /* Select appropriate filter according to selected type of loan */
                switch( typeOfLoan ) {
                    case 'mortgagerefinance': refinance(); break;
                    case 'homeequity': equity(); break;
                    case 'purchasehome': purchasehome(); break;
                        default: emptyField(); return;
                };
                /*****************************************************************/
            }
                var totalItems = $('dl.questions dt:visible').length,               //getting amount of visible dt's
                    percentage = (100 / totalItems);

            currentDt = ($(this).data('dir') === 'next') ? nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText, totalItems) : prevQuestFn(currentDt, firstQ, percentage, progress, percentageText); } );
});

$(document).ready(function(){
    $("#property_zip").on('focusout', function(){ zipInfo({'zip': '#property_zip', 'state':'#property_state'}) })
    $("#zip").on('focusout', function(){ zipInfo({'zip': '#zip', 'state':'#state', 'city':'#city'}) })
    $("#second_mortgage_yes").on('click', function(){ $('.second_mortgage_fields').css('display','block'); initDds(); })
    $("#second_mortgage_no").on('click', function(){ $('.second_mortgage_fields').css('display','none').removeClass('fid11 fid12'); initDds(); })
})

/* Next button pressed */
function nextQuestFn(currentDt, firstQ, totalItems, percentage, progress, percentageText) {


    if (($(".fid"+currentDt).children('select').val()=='') || ($(".fid"+currentDt).children('input').val()=='')) {
        emptyField();
        return currentDt;
    }

    if (($(".fid"+(currentDt+1)).children('select').val()=='') || ($(".fid"+(currentDt+1)).children('input').val()=='')) {
        emptyField();
        return currentDt;
    }

    if (($(".fid"+(currentDt+2)).children('select').val()=='') || ($(".fid"+(currentDt+2)).children('input').val()=='')) {
        emptyField();
        return currentDt;
    }

    $('.prevQuest').css('visibility','visible');
    firstQ.animate({'margin-top': (currentDt === totalItems) ? '-='+0 : '-=351px' }, 500);
    progressRefresh(percentage, currentDt+(step-1), progress, 'next', percentageText);

    //Final question is answered
    if((totalItems - currentDt)<=(step-1)) {
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
    return ((totalItems-currentDt)>=step) ? (currentDt+step) : totalItems;
}
/***********************/

/* Previous button pressed */
function prevQuestFn(currentDt, firstQ, percentage, progress, percentageText, totalItems) {
    if(currentDt <= (step+1)) $('.prevQuest').css('visibility','hidden');
    if (currentDt === totalItems) currentDt = ( totalItems - currentDt);
    if(currentDt === 0) currentDt = totalItems;
    firstQ.animate({'margin-top': (currentDt === 1) ? 0 : '+=351px' }, 500);
    progressRefresh(percentage, (currentDt-(step-1)), progress, 'prev', percentageText);
    return (currentDt < step) ? 1 : (currentDt-step);
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
    var second_mortgage_fields = $(".second_mortgage_fields");

    $("dt").css('display','block');
    $("dd").css('display','block');


    if($("second_mortgage_no").prop('checked', true))
        second_mortgage_fields.css('display', 'none');
    else second_mortgage_fields.css('display', 'bock');
}
/*******************************/

/* Bounce effect if the field or selection is empty */
function emptyField() {
    $("dd select").effect( "bounce", { times: 5 }, "slow" );
    $("dd input[type='text']").effect( "bounce", { times: 5 }, "slow" );
}
/*****************************************************/

/* Adding class to all currently visible dd's to know which is current in the future use */
function initDds() {
    var class_id = 0,
        item_classes,
        fid_pos,
        visible_dts = $('dd:visible');

        //removing fid classes to avoid repeated instances
        visible_dts.each(function() {
          item_classes  = $(this).attr('class');

          $(this).removeClass(item_classes);
          fid_pos = strpos(item_classes, 'fid');
          if(fid_pos !== false) { item_classes = item_classes.substr(0, fid_pos)}
          $(this).addClass(item_classes);
        })


    visible_dts.addClass(function(class_id){
        return 'fid'+ (++class_id);
    })
}
/*****************************************************************************************/

/* getting state and city according to US zip */
function zipInfo(params)
{
        var zipElement = jQuery(params.zip);
        if(params.city!=null)
             var cityElement = jQuery(params.city);
        else
        {
            var cityElement =null;
        }
        var stateElement = jQuery(params.state);
        if(typeof params.container!='undefined' && params.container!=null)
        {
            zipElement = jQuery(params.zip,params.container);
            if(cityElement!=null)
                cityElement = jQuery(params.city,params.container);
            stateElement = jQuery(params.state,params.container);
        }
        if (typeof(jQuery) == 'undefined')
        {

        }
        else
        {
            if (jQuery(zipElement).val().length>0)
            {
                if(jQuery(zipElement).val().replace('_','').length == 5)
                {
                    if(cityElement==null || (cityElement!=null && (jQuery(cityElement).val()=='Loading...' || jQuery(cityElement).val().length==0))){
                        if(cityElement!=null)
                            jQuery(cityElement).val('Loading...');

                        var ___url = 'https://altohost.com/system/geo/zipinfo.php?zip='+encodeURIComponent(jQuery(zipElement).val())+'&c=?';
                        jQuery.ajax(
                        {
                            url: ___url,
                            cache: false,
                            dataType:'jsonp',
                            success: function(obj){
                                var  cityTP = '';
                                var  stateTP = '';

                                try {

                                    if(obj.city && obj.state){
                                        cityTP = obj.city;
                                        stateTP = obj.state;

                                    }
                                }
                                catch(err) {
                                    cityTP = '';
                                    stateTP = '';
                                }
                                if(cityTP.length>0){
                                    if(cityElement!=null)
                                        jQuery(cityElement).val(cityTP);
                                }else{
                                    if(cityElement!=null)
                                        jQuery(cityElement).val('');
                                }
                                if(stateTP.length>0)
                                    jQuery(stateElement).val(stateTP);
                                if(cityElement!=null)
                                    jQuery(cityElement).change();
                                jQuery(stateElement).change();
                            }
                            }
                        );
                    }
                }
            }

        }
    }
/**********************************************/


function strpos (haystack, needle, offset) {
  var i = (haystack+'').indexOf(needle, (offset || 0));
  return i === -1 ? false : i;
}