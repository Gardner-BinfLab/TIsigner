var defUtr = "GGGGAATTGTGAGCGGATAACAATTCCCCTCTAGAAATAATTTTGTTTAACTTTAAGAAGGAGATATACAT"; //default utr
var points = [
    0,
    0.67346939,
    1.34693878,
    2.02040816,
    2.69387755,
    3.36734694,
    4.04081633,
    4.71428571,
    5.3877551,
    6.06122449,
    6.73469388,
    7.40816327,
    8.08163265,
    8.75510204,
    9.42857143,
    10.10204082,
    10.7755102,
    11.44897959,
    12.12244898,
    12.79591837,
    13.46938776,
    14.14285714,
    14.81632653,
    15.48979592,
    16.16326531,
    16.83673469,
    17.51020408,
    18.18367347,
    18.85714286,
    19.53061224,
    20.20408163,
    20.87755102,
    21.55102041,
    22.2244898,
    22.89795918,
    23.57142857,
    24.24489796,
    24.91836735,
    25.59183673,
    26.26530612,
    26.93877551,
    27.6122449,
    28.28571429,
    28.95918367,
    29.63265306,
    30.30612245,
    30.97959184,
    31.65306122,
    32.32653061,
    33
]

var success_openen = [
    1.98738964346095e-06,
    1.98738964346095e-06,
    1.98738964346095e-06,
    3.979134904699868e-05,
    0.0005614693463309397,
    0.0015994783332591886,
    0.007059343154791341,
    0.01959674401987233,
    0.03344511636457853,
    0.05846219766091034,
    0.08812439667470215,
    0.11259352563647178,
    0.1357682202648517,
    0.14211606213908856,
    0.14570074633478247,
    0.1351020183433137,
    0.1268336184495585,
    0.10785947362483832,
    0.09562433135532121,
    0.07934998819340157,
    0.05797529403020855,
    0.04464152892547112,
    0.031056912967964322,
    0.019465426689115016,
    0.013458606780850584,
    0.009290589646287092,
    0.0072191819217718774,
    0.00481998609914608,
    0.003381550290010877,
    0.0027037492134495186,
    0.0018640790321791344,
    0.0010672153576768515,
    0.00030447049761963126,
    0.0001961151937122446,
    4.936898440389916e-05,
    4.358236613730531e-05,
    0.0002030749922550749,
    0.00014137135559688042,
    0.00010345471895537332,
    4.37357584524152e-05,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06,
    1.1173963588429985e-06
]

var failed_openen = [
    5.437758361148604e-06,
    5.437758361148604e-06,
    5.437758361148604e-06,
    5.397169299206176e-05,
    0.00032248749940829824,
    0.0012660911082912243,
    0.005280751012420593,
    0.009821077717552978,
    0.015469945304867552,
    0.023015782861449723,
    0.033982478828445295,
    0.048250752743149404,
    0.06741365641897708,
    0.07535156640619728,
    0.0834311789634686,
    0.09314100388060208,
    0.10061604385988879,
    0.10365480589977134,
    0.10144817567167914,
    0.09734173335858409,
    0.09274376624962825,
    0.08880318802397255,
    0.08443827862752538,
    0.07766982571253733,
    0.06290949102413919,
    0.051156199195859016,
    0.03966004606891997,
    0.03015605437361742,
    0.023554815332062107,
    0.0191747904887778,
    0.013276183928893279,
    0.00912923396576851,
    0.005819565146953443,
    0.004128214349275207,
    0.0036718639573756536,
    0.0034950737504194852,
    0.002985476454187301,
    0.0018129676325811912,
    0.0012868050108287184,
    0.0009077691932529392,
    0.0005222456180022826,
    0.0002047648974706759,
    6.214594206722606e-05,
    0.00011287484615139223,
    0.00019046772982714063,
    0.00016835234521245699,
    7.676975792930047e-05,
    1.805206870461312e-05,
    2.1888850127133413e-06,
    2.1888850127133413e-06
]



$(document).ready(function() {
    document.forms['input-form'].reset();
    $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
    Waves.attach('.btn');
    Waves.init();
})

// function checkFirsttime() {
//     if (Cookies.get('first-launched') == '1') {
//         $('#launch').remove();
//         $('#submit-inputs').collapse("show");
//     }
// }
//
// function hideExpnotif() {
//     if (Cookies.get('exp-notif-dismiss') == '1') {
//         $('#experimental-notification').remove();
//     }
// }

$(document)
    .on("click", '#show-more',
        //$('#show-more').on('click',
        function() {
            $(this)
                .text(function(i, v) {
                    return v === 'Show more' ?
                        'Hide' :
                        'Show more'
                });
        })

// After clicking retry, we clear all forms and tables, hide them and show
// sequence input form.
$(document).on("click", '#try-again',
    //$('#try-again').on('click',
    function() {
        //$("#input-form").collapse("show");
        $('#input-form').css('pointer-events', 'auto');
        $('#submit-btn')[0].disabled = false;
        $('#show-results').collapse("hide");
        $('#show-more').html('Show more');
        $('#infinite-prog-bar').collapse("hide");
        $('#input-form')[0].reset();
        //    $("#input-form").collapse("show");
        $('#host-help').collapse("show");
        // $('#cst-region').collapse("hide"); $('#custom-region').attr("required",
        // false);
        $('#optimisation-type').collapse("hide");
        $('#extra-results').collapse("hide");
        $('#primer-length-selection-slider').collapse("show");
        $('#len-primer').val($('#primer-button').val() - 1);
        $('#len-primer-val').val("First " + $('#len-primer').val());
        $('#lvl-tune-val-txt').val(100);
        $('#lvl-tune').val($('#lvl-tune-val-txt').val());
        $('#lvl-tune-val').val($('#lvl-tune-val-txt').val());
        $("#lvl-selection-slider").collapse("hide");
        $('#advancedSwitchText').attr("class", "custom-control-label text-muted");
        $('#default-algorithm').attr("class", "custom-control custom-radio custom-control-inline");
        $('#algo-options-quick').attr("checked", true);
        $('#alt-algorithm').attr("class", "custom-control custom-radio custom-control-inline");
        $('#algo-options-deep').attr("checked", false);
        $('#cst-utr').collapse("hide");
        $("#algorithm-settings").collapse("hide");
        $('#tisigner-form-div').collapse('show');
        $('#nav-input-tab').tab('show');
    });

$(document).ready(function() {
    //Show custom UTR form if custom is selcted from drop down.
    $('#utr')
        .on('change', function() {
            var utrval = $(this).val();
            //console.log('utrchange');
            if (utrval == '1' && $('#host-select').val() === "Escherichia coli" && $('#custom-region').val().length === 0) {
                //console.log('lvl-select');
                $('#optimisation-type').collapse("hide");
                $('#cst-utr').collapse("hide");
                $('#custom-utr').attr("required", false);
                $("#lvl-selection-slider").collapse("show");
                $('#lvl-tune-val-txt').val(100);

            } else if (utrval == '3') {
                $('#optimisation-type').collapse("show");
                $('#cst-utr').collapse("show");
                $('#custom-utr').attr("required", true);
                $("#lvl-selection-slider").collapse("hide")
            } else if ($(this).val().length === 0) {
                $('#optimisation-type').collapse("hide");
                $("#lvl-selection-slider").collapse("hide");
            } else {
                //console.log('utrselect');
                $('#optimisation-type').collapse("show");
                $('#cst-utr').collapse("hide");
                $("#lvl-selection-slider").collapse("hide");
                $('#custom-utr').attr("required", false);
            }
        });

    $('#host-select').on('change', function() {
        var host = $(this).val();
        //console.log('hostchange', host);

        if (host === "Escherichia coli" && $('#custom-region').val().length === 0) {
            //console.log('ok');
            $('#utr').val('1');
            $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
            $('#optimisation-type').collapse("hide");
            $("#lvl-selection-slider").collapse("show");
            $('#lvl-tune-val-txt').val(100);
            $('#cst-utr').collapse("hide");
            $('#custom-utr').attr("required", false);
            // $('#cst-region').collapse("hide"); $('#custom-region').attr("required",
            // false);
        } else {
            $("#lvl-selection-slider").collapse("hide");
            $('#optimisation-type').collapse("show");
            $('#cst-utr').collapse("show");
            $('#custom-utr').attr("required", true);
            // $('#cst-region').collapse("hide"); $('#custom-region').attr("required",
            // false);
        }
    });

    $('#custom-region').on('change', function() {
        if ($('#host-select').val() === "Escherichia coli" && $(this).val().length === 0 && $('#utr').val('1')) {
            $('#optimisation-type').collapse("hide");
            $("#lvl-selection-slider").collapse("show");
            $('#lvl-tune-val-txt').val(100);
            $('#cst-utr').collapse("hide");
            $('#custom-utr').attr("required", false);
        } else {
            $("#lvl-selection-slider").collapse("hide");
            $('#optimisation-type').collapse("show");
        }
    })

});

//$(document).ready(function(){ });

function updateTuning(elem) {
    var level = "High";
    // //console.log($(elem).val()); //console.log(100 >= $(elem).val() &&
    // $(elem).val() >= 75);
    if (100 >= $(elem).val() && $(elem).val() >= 75) {
        level = "High ";
    } else if (75 > $(elem).val() && $(elem).val() >= 30) {
        level = "Mid ";
    } else if (30 > $(elem).val() && $(elem).val() >= 0) {
        ////console.log($(elem).val());
        level = "Low ";
    }

    $('#lvl-tune-val').val(level + "(" + $(elem).val() + "%)");
    $('#lvl-tune-val-txt').val($(elem).val());
}

function hostSelect() {
    $('select[name=host-select]')
        .on('change', function() {
            if ($(this).val() !== "Escherichia coli") {
                $("#lvl-selection-slider").collapse("hide");
                $("#utr").val('3');
                $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
            } else if ($(this).val() === "Escherichia coli" && $('#utr').val() === '1' && $('#custom-region').val().length === 0) {
                $("#lvl-selection-slider").collapse("show");
            }
        });
}

function ntSlider() {
    $('input[name="designMode"]')
        .on('change', function() {
            if ($('#primer-button').prop('checked')) {
                $('#primer-length-selection-slider').collapse("show");
            } else {
                $('#primer-length-selection-slider').collapse("hide");
            }
        });
}

//script to get the value from slider
function updateRange(elem) {
    $('#len-primer-val').val("First " + $(elem).val()); //+" codons");
    $('#primer-button').val(+$(elem).val() + 1);
    //+1 so that length is counted from start codon
}

//check if advanced swith is checked and show respective form accordingly

function showAdvancedForm() {
    if ($('#advancedSwitch')[0].checked == true) {

        $('#advancedSwitchText').attr("class", "custom-control-label text-danger");
        $('#algorithm-settings').collapse("show");
        ////console.log("adv switch checked");
    } else {
        $('#advancedSwitchText').attr("class", "custom-control-label text-muted");
        $('#algorithm-settings').collapse("hide");
        ////console.log("adv switch unchecked");
    }
}

function termcheckset() {
    if ($("#termcheck")[0].checked == true) {
        $('#termcheck-bool').val("True");
        //console.log('val set');
    } else {
        $('#termcheck-bool').val("False");
    }
}

$(document)
    .on("click", '#demo', function() {
        $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
        //console.log('demo clicked');
        $('#input-sequence').val("ATGAAGAAATCTCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTAC" +
            "CATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG");
        $('#utr').val('1');
        $('#input-form').css('pointer-events', 'auto');
        $('#host-select').val('Escherichia coli');
        $('#custom-region').val('');
        $('#optimisation-type').collapse("hide");
        $("#lvl-selection-slider").collapse("show");
        $('#lvl-tune-val-txt').val("100");
        $('#lvl-tune').val("100");
        $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
        $('#optimisation-type').collapse("hide");
        $('#cst-utr').collapse("hide");
        $('#custom-utr').val('');
        $('#custom-utr').attr("required", false);
        $('#nav-input-tab').tab('show');
        $("#seq-err").collapse("hide");
    });

function maketable(elem, data) {
    var tbody = $("<tbody />"),
        tr;
    $.each(data, function(_, obj) {
        tr = $("<tr />");
        $.each(obj, function(_, text) {
            tr.append("<td>" + text + "</td>")
        });
        tr.appendTo(tbody);
    });
    tbody.appendTo(elem);
}

function validateCustomRange(elem) {
    var region = elem.val();
    var reg = region.split(':');
    //    var attr = elem.attr("required");    if (attr === "required") {
    if (reg.length === 2) {
        var dist;
        if ((reg[0] < 0 && reg[1] < 0) || (reg[0] > 0 && reg[1] > 0) || reg[0] > reg[1]) {
            dist = Math.abs(reg[0] - reg[1])
        } else if (reg[1] > reg[0]) {
            dist = Math.abs(reg[1] - reg[0])
        }

        if (isNaN(dist)) {
            return "The custom region input has non numeric values."
        } else if (dist <= 4) {
            return "The custom region is too small. "
        } else if (dist >= 151) {
            return "The custom region is greater then 150 nts."
        } else {
            return true;
        }
    } else if (region.length === 0) {
        return true;
    } else {
        return "Incorrect values in custom region."
    }
    //    } else {        return true;    }
}

//$(document).ready(function() {
function validateinputs(event) {

    var inpSeq = $('#input-sequence')
        .val()
        .replace(/U/gi, 'T')
        .replace(/\s+/g, '')
        .toUpperCase();

    var inpUtr = $('#custom-utr')
        .val()
        .replace(/U/gi, 'T')
        .toUpperCase();
    var utrNucl; //var to check if UTR is valid

    $('#utr').val() == '3' ?
        (utrNucl = inpUtr) :
        (utrNucl = defUtr);
    //console.log(utrNucl);
    var reg = /^[ATGCU]*$/;
    var stCdns = ["TAG", "TGA", "TAA"]
    var cdns = inpSeq.match(/.{1,3}/g);
    var startCdn = cdns[0];
    //console.log("Input codons are:") console.log(cdns)
    cdns.shift(); //remove start codon
    cdns.pop(); //remove stop codon

    var rms = $('#rms-sites')
        .val()
        .replace(/U/gi, 'T')
        .toUpperCase();
    var rmsreg = /^[ACGTU]+(\,{0,1}[AGCTU])+$/;
    if (!rms) {
        rms = 'TTTTT,CACCTGC,GCAGGTG,GGTCTC,GAGACC,CGTCTC,GAGACG'
    }

    var common = cdns.filter(value => stCdns.includes(value))
        //console.log(regionrange);
    var customrangevalidatemsg = validateCustomRange($('#custom-region'));

    if (common.length !== 0 || !reg.test(inpSeq) || !reg.test(utrNucl) || startCdn !== "ATG" || cdns.length < 25 || !rmsreg.test(rms) || inpSeq.length >= 300000 || inpUtr.length >= 3000 || inpSeq.length % 3 != 0 || utrNucl.length < 71 || customrangevalidatemsg !== true) {
        // (!regionreg.test(cstregion) && $('#custom-region').attr('required') !==
        // undefined)) {

        $('#seq-err-msg').empty();
        $('#seq-err-msg').append("<strong>Sequence error: </strong>");
        if (cdns.length < 25) {
            $('#seq-err-msg').append("The input sequence should be longer than 75 nucleotides.");
            // console.log("Sequence is too short. Sequences shorter than 75 nucleotides are
            // not allowed.)");
        } else if (startCdn !== "ATG") {
            $('#seq-err-msg').append("The input sequence doesn't have a start codon.");
            //console.log("Sequence doesn't have any start codon.");
        } else if (!reg.test(inpSeq)) {
            $('#seq-err-msg').append("Only A, T, G, C, U are allowed in the input sequence.");
            //console.log("Unknown nucleotides in input sequence.");
        } else if (inpSeq.length >= 300000) {
            $('#seq-err-msg').append("The input sequence is too long (>300,000 nt). Please use command line version for " +
                "longer sequence optimisation.");
            //console.log("Long input sequence.");
        } else if (inpUtr.length >= 3000) {
            $('#seq-err-msg').append("The input 5&#8242; UTR sequence is too long (>3000 nt). Please use command line version for " +
                "longer sequence optimisation.");
            //console.log("Long input sequence.");
        } else if (inpSeq.length % 3 != 0) {
            $('#seq-err-msg').append("The input sequence is not divisible by 3.");
            //console.log("Input sequence not divisible by 3.");
        } else if ($('#utr').val() == '3' && utrNucl.length < 71) {
            $('#seq-err-msg').append("The input 5&#8242; UTR sequence should be longer than 71 nucleotides.");
            //console.log("Short custom promoter sequence. Min length 71 nucltoides.");
        } else if (!reg.test(utrNucl)) {
            $('#seq-err-msg').append("Only A, T, G, C, U are allowed in the input 5&#8242; UTR sequence.");
            //console.log("Unknown nucleotides in custom promoter sequence.");
        } else if (common.length !== 0) {
            $('#seq-err-msg').append("The input sequence has an early stop codon.");
            //console.log("Premature stop codons.");
        } else if (!rmsreg.test(rms)) {
            $('#seq-err-msg').append("The input restriction sites are not in a proper format. Please use comma to sepa" +
                "rate multiple sites. Only A, T, G, C, U are allowed.");
            //console.log("Wrong RMS format");
        } else if (utrNucl.length != 0 && !reg.test(utrNucl)) {
            $('#seq-err-msg').append("Only A, T, G, C, U are allowed in the input 5&#8242; UTR sequence.");
            //console.log("Nucleotides other then A, T, G, C, U in UTR");
        } else if (customrangevalidatemsg !== true) {
            $('#seq-err-msg').append(customrangevalidatemsg);
        }
        $('#seq-err').collapse("show");
        event.preventDefault();

    } else {

        event.preventDefault();
        //$("#input-form").collapse("hide");
        $('#input-form').css('pointer-events', 'none');

        $("#submit-btn")[0].disabled = true;
        $("#seq-err").collapse("hide");
        $("#infinite-prog-bar").collapse("show");
        $("#snackbar-msg").collapse("show");
        $("#new-table0 tbody").remove();
        $("#new-table1 tbody").remove();
        $("#new-table2 tbody").remove();
        if ($('select[name=utr]').val() === '1' && $('select[name=host-select]').val() === 'Escherichia coli' && $('#custom-region').val().length === 0) {
            $('td:nth-child(3),th:nth-child(3)').show();
        } else {
            $('td:nth-child(3),th:nth-child(3)').hide();
        }

        if ($("#termcheck")[0].checked == true) {

            $('td:nth-child(4),th:nth-child(4)').show();
            $('td:nth-child(5),th:nth-child(5)').show();
        } else {
            $('td:nth-child(4),th:nth-child(4)').hide();
            $('td:nth-child(5),th:nth-child(5)').hide();
        }
        return true;

    }
}
//});

function plotaccs(ctx, data) {
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(231,233,237)'
    };
    var accSel = []; //selected sequence accessibility
    var accInp = []; //selected sequence accessibility
    $.each(data.Selected, function(index, element) {
        accSel.push(element.Accessibility);
    });

    $.each(data.Input, function(index, element) {
        accInp.push(element.Accessibility);
    });

    // console.log("accsSel"); console.log(accSel); console.log("accsInp");
    // console.log(accInp); Check if we have a previous plot and destroy it
    if (window.chart && window.chart !== null) {
        //console.log("Previous chart found. Clearing it..")
        window
            .chart
            .destroy();
    }

    var showGraph = ($('#utr').val() === '1' && $('#host-select').val() === "Escherichia coli" && $('#custom-region').val().length === 0) ?
        1 :
        0;
    if (showGraph == 1) {
        window.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: points,
                datasets: [

                    {
                        label: 'Success',
                        backgroundColor: window.chartColors.blue,
                        borderColor: window.chartColors.blue,
                        fill: false,
                        data: success_openen,
                        yAxisID: 'probDensity',
                        pointRadius: 1,
                        pointHoverRadius: 1,
                        linetension: 1.5
                    }, {
                        label: 'Failed',
                        /*backgroundColor: gradientFill,
                        borderColor: gradientFill,*/
                        backgroundColor: window.chartColors.orange,
                        borderColor: window.chartColors.orange,
                        fill: false,
                        data: failed_openen,
                        yAxisID: 'probDensity',
                        pointRadius: 1,
                        pointHoverRadius: 1,
                        linetension: 1.5
                    }
                ]
            },

            options: {
                title: {
                    display: true,
                    position: 'bottom',
                    text: "Distributions for PSI:Biology targets (8,780 ‘success’ and 2,650 ‘failure’ exper" +
                        "iments)."
                },

                tooltips: {
                    enabled: true,
                    mode: 'index',
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return " Fraction of data with this opening energy: : " + tooltipItems.yLabel;
                        }
                    }
                },

                animation: {
                    easing: "easeInOutBack"
                },

                scales: {
                    yAxes: [{
                        id: "probDensity",
                        type: 'linear',
                        ticks: {
                            //beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ''
                        }
                    }],

                    xAxes: [{
                        beginAtZero: true,
                        type: 'category',
                        position: 'bottom',
                        display: false
                    }, {
                        id: 'x-axis-2',
                        type: 'linear',
                        position: 'bottom',
                        display: true,

                        scaleLabel: {
                            display: true,
                            labelString: 'Opening Energy'
                        },

                        ticks: {
                            min: 0,
                            max: 33,
                            stepSize: 0.25
                        }
                    }]

                },

                annotation: {
                    annotations: [{
                            type: 'line',
                            drawTime: 'afterDatasetsDraw',
                            mode: 'vertical',
                            scaleID: 'x-axis-2',
                            value: accSel,
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 2,
                            label: {
                                enabled: true,
                                content: 'Optimised',
                                position: "top"
                            }
                        }, {
                            type: 'line',
                            drawTime: 'afterDatasetsDraw',
                            mode: 'vertical',
                            scaleID: 'x-axis-2',
                            value: accInp,
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 2,
                            label: {
                                enabled: true,
                                content: 'Input',
                                position: 'center'
                            }
                        }

                    ]
                }
            }
        });
    }
}


function successfunc(response) {
    console.log("SUCCESS");
    //show json in table
    maketable("#new-table0", response.Selected);
    maketable("#new-table1", response.Input);
    maketable("#new-table2", response.Optimised);

    //plottings
    var ctx = document
        .getElementById("myChart")
        .getContext('2d');
    plotaccs(ctx, response);
    $("#infinite-prog-bar").collapse("hide");
    $("#snackbar-msg").collapse("hide");
    $("#show-results").collapse("show");
    $('#tisigner-form-div').collapse('hide');
    //store file in local storage to maybe retrieve it later
    localStorage.setItem('newresults', JSON.stringify(response));

    //console.log('Data received from server.'); console.log(response);

}

function errorfunc(jqXHR, textStatus, errorThrown) {
    //    var errors = jqXHR.responseText;
    $("#infinite-prog-bar").collapse("hide");
    $("#snackbar-msg").collapse("hide");
    // $('#try-again').trigger("click");    setTimeout(function () {
    // location.reload(true);    }, 5000);
    $('#snackbar-msg-error').empty();
    $('#snackbar-msg-error')
        .append('Error ' + `${jqXHR.status}` + ': ' + `${jqXHR.responseText}`)
        .collapse("toggle");
    setTimeout(function() {
        $('#snackbar-msg-error').collapse("toggle");
        $('#try-again').trigger("click");
    }, 5000);
    // $('#input-form-card').append(`<div class='card-body'><h5
    // class='card-title'>Error ${jqXHR.status}:</h5><p class='card-text'>We
    // encountered the following error:</p><h6 class='card-subtitle mb-2
    // text-muted'>${errors}</h6><p>The page will now refresh.</p><div
    // class='container''><canvas id='errorCanvas'
    // style=';width:100%;height:100%'></canvas></div></div>`); console.log('An
    // error occurred.'); console.log(errors);
}


function filesave(blob) {
    var f = JSON.parse(localStorage.getItem(blob));
    saveAs(f, "results.txt");
}

// $(document).ready(function(){
//
// })
