//on ready functions
$(document)
    .ready(function () {
        document
            .forms['input-form-pfam']
            .reset();
        document
            .forms['input-form']
            .reset();
        $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
        Waves.attach('.btn');
        Waves.init();

        //on manual input coord;
        $('#end-box').on('input', function () {
            if ($("#domain-slider").is('.collapse:not(.show)')) {
                $("#domain-slider").collapse('show');
            }
            checkEmpty();
            $('#range-input')[0]
                .noUiSlider
                .set([
                    null, $(this).val()
                ]);
            currRanges = $('#range-input')[0]
                .noUiSlider
                .get();
            showSuggestions(currRanges[0] + '-' + currRanges[1]);
            coveredDomains();

        })

        $('#start-box').on('input', function () {
            if ($("#domain-slider").is('.collapse:not(.show)')) {
                $("#domain-slider").collapse('show');
            }
            checkEmpty();
            $('#range-input')[0]
                .noUiSlider
                .set([
                    $(this).val(),
                    null
                ]);
            currRanges = $('#range-input')[0]
                .noUiSlider
                .get();
            showSuggestions(currRanges[0] + '-' + currRanges[1]);
            coveredDomains();

        })

        $('#protein').on('click', function () {
            var inputHelp = '<strong>Help </strong>' +
            //      '<ul class="list-unstyled">'+
            'Input a single sequence, with or without a fasta header. Single letter amino aci' +
                    'd codes only and no ambiguity codes. No stop (*) allowed except at the end. <but' +
                    'ton type="button" class="btn btn-link" onclick="exampleInput()">Example</button>'

            $('#input-help-text').empty();
            $('#input-help-text').append(inputHelp);
            setTimeout(function () {
                $('#input-help').collapse('show');
            }, 200);
        })

        $('#nucleotide').on('click', function () {
            var inputHelp = '<strong>Help </strong>' +
            //      '<ul class="list-unstyled">'+
            'Input a single sequence, with or without a fasta header. No ambiguity codes. No ' +
                    'stop codons allowed except at the end. <button type="button" class="btn btn-link' +
                    '" onclick="exampleInput()">Example</button>'

            $('#input-help-text').empty();
            $('#input-help-text').append(inputHelp);
            setTimeout(function () {
                $('#input-help').collapse('show');
            }, 200);
        })

        //show currently saved value of setting for suggestion box
        settingForSuggestion();

        //    fill tisigner form after clicking optimise
        $('#optimise-to-tisigner').on('click', function () {
            if ($("[name='type-of-seq']:checked").val() != "nucleotide" && !$('#nt-seq').val()) {
                $('#no-optimisation').text('Optimisation is available only on nucleotide input.');
                setTimeout(function () {
                    $('#no-optimisation').text("");
                }, 2000);

            } else {
                seqToOptimise = "ATG" + $('#result-seq-nt').val() + "TGA"
                $('#results-page').collapse('hide');
                $('#optimisation-tisigner').collapse('show');
                $('#tisigner-form-div').collapse('show');
                $("#show-results").collapse("hide");
                //        $('#input-sequence').attr('readonly', true);
            }
        })

        //    show domain form and hide optimisation form on clicking BACK
        $('#cancel-optimisation').on('click', function () {
            $('#results-page').collapse('show');
            $('#optimisation-tisigner').collapse('hide');
            $('#try-again').trigger('click');
        })

        // optimisation using tisigner idk why ajax is repeating but this var should
        // handle that
        var request = false;

        $('#submit-btn').on('click', function (event) {
            // event.preventDefault();
            var frm = $("#input-form");
            var res_tbl = $("#show-results");
            var csrf_token = "{{ csrf_token() }}";
            console.log("start");

            frm.submit(function (event) {
                if (validateinputs(event) == true && !request) {
                    event.preventDefault();
                    request = true; //flag to prevent duplicate firing
                    $('#cancel-optimisation').attr('disabled', true);
                    console.log("mid")
                    $.ajaxSetup({
                        beforeSend: function (c, b) {
                            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(b.type) && !this.crossDomain) {
                                c.setRequestHeader("X-CSRFToken", csrf_token)
                            }
                        }
                    });
                    $.ajax({
                        type: frm.attr("method"),
                        url: frm.attr("action"),
                        data: frm.serialize(),
                        dataType: "json",
                        success: function (b) {
                            successfunc(b)
                            request = false;
                            $('#cancel-optimisation').attr('disabled', false);
                        },
                        error: function (b, d, c) {
                            errorfunc(b, d, c)
                            request = false;
                            $('#cancel-optimisation').attr('disabled', false);
                        }
                    })
                }
                console.log("END")
                event.preventDefault();
            });
        })

        //$('#submit-btn')
        $('#view-tag').on('click', function () {
            checkCustomTag();
        })

        $('#custom-tag').on('input', function () {
            checkCustomTag();
        })

        $('#nucleotide-tag').on('click', function () {
            checkCustomTag();
        })

        $('#protein-tag').on('click', function () {
            checkCustomTag();
        })

    });

function checkCustomTag() {

    current_seq = $('#result-seq').val();
    input_tag = $('#custom-tag').val();
    var cust_tag;
    if (input_tag) {
        if ($('#protein-tag').prop("checked")) {
            try {
                checkValidProtein(input_tag);
                cust_tag = input_tag.toUpperCase()
                if (cust_tag.substr(-1) === '*') {
                    cust_tag = cust_tag.substr(0, cust_tag.length - 1) //remove * from custom tag
                }
            } catch (err) {
                $('#custom-tag').addClass('is-invalid');
                $('#custom-tag-invalid').text(err);
            }
        }
        if ($('#nucleotide-tag').prop("checked")) {
            try {
                checkValidNucleotideSequence(input_tag + 'TAG');
                cust_tag = translateSequence(input_tag + 'TAG');
            } catch (err) {
                $('#custom-tag').addClass('is-invalid');
                $('#custom-tag-invalid').text(err);
            }
        }
        if (!($('#protein-tag').prop("checked")) & !$('#nucleotide-tag').prop("checked")) {
            $('#custom-tag').addClass('is-invalid');
            $('#custom-tag-invalid').text("Please select a sequence type!");
        }
    } else {
        // $('#custom-tag').addClass('is-invalid');
        // $('#custom-tag-invalid').text("Please input a sequence!");
    }

    if (cust_tag) {
        $('#custom-tag').removeClass('is-invalid');
    }
    plotWithTags(current_seq, cust_tag);
}

//hide popover on clicking on html body
$(document)
    .on('click', function (e) {
        $('[data-toggle="popover"]')
            .each(function () {
                // the 'is' for buttons that trigger popups the 'has' for icons within a button
                // that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
    });

function exampleInput() {
    var exampleProt = 'MAGAASPCANGCGPSAPSDAEVVHLCRSLEVGTVMTLFYSKKSRPERKTFQVKLETRQITWSRGADKIEGAIDIREIKEI' +
            'RPGKTSRDFDRYQEDPAFRPDQSHCFVILYGMEFRLKTLSLQATSEDEVNMWIRGLTWLMEDTLQAATPLQIERWLRKQF' +
            'YSVDRNREDRISAKDLKNMLSQVNYRVPNMRFLRERLTDLEQRTSDITYGQFAQLYRSLMYSAQKTMDLPFLEASALRAG' +
            'ERPELCRVSLPEFQQFLLEYQGELWAVDRLQVQEFMLSFLRDPLREIEEPYFFLDEFVTFLFSKENSIWNSQLDEVCPDT' +
            'MNNPLSHYWISSSHNTYLTGDQFSSESSLEAYARCLRMGCRCIELDCWDGPDGMPVIYHGHTLTTKIKFSDVLHTIKEHA' +
            'FVASEYPVILSIEDHCSIAQQRNMAQYFKKVLGDTLLTKPVDIAADGLPSPNQLKRKILIKHKKLAEGSAYEEVPTSVMY' +
            'SENDISNSIKNGILYLEDPVNHEWYPHYFVLTSSKIYYSEETSSDQGNEDEEEPKEASGSTELHSNEKWFHGKLGAGRDG' +
            'RHIAERLLTEYCIETGAPDGSFLVRESETFVGDYTLSFWRNGKVQHCRIHSRQDAGTPKFFLTDNLVFDSLYDLITHYQQ' +
            'VPLRCNEFEMRLSEPVPQTNAHESKEWYHASLTRAQAEHMLMRVPRDGAFLVRKRNEPNSYAISFRAEGKIKHCRVQQEG' +
            'QTVMLGNSEFDSLVDLISYYEKHPLYRKMKLRYPINEEALEKIGTAEPDYGALYEGRNPGFYVEANPMPTFKCAVKALFD' +
            'YKAQREDELTFTKSAIIQNVEKQEGGWWRGDYGGKKQLWFPSNYVEEMVSPAALEPEREHLDENSPLGDLLRGVLDVPAC' +
            'QIAVRPEGKNNRLFVFSISMASVAHWSLDVAADSQEELQDWVKKIREVAQTADARLTEGKMMERRKKIALELSELVVYCR' +
            'PVPFDEEKIGTERACYRDMSSFPETKAEKYVNKAKGKKFLQYNRLQLSRIYPKGQRLDSSNYDPLPMWICGSQLVALNFQ' +
            'TPDKPMQMNQALFLAGGHCGYVLQPSVMRDEAFDPFDKSSLRGLEPCAICIEVLGARHLPKNGRGIVCPFVEIEVAGAEY' +
            'DSIKQKTEFVVDNGLNPVWPAKPFHFQISNPEFAFLRFVVYEEDMFSDQNFLAQATFPVKGLKTGYRAVPLKNNYSEGLE' +
            'LASLLVKIDVFPAKQENGDLSPFGGASLRERSCDASGPLFHGRAREGSFEARYQQPFEDFRISQEHLADHFDGRDRRTPR' +
            'RTRVNGDNRL'
    var exampleNuc = 'ATGCGAGTGTTGAAGTTCGGCGGTACATCAGTGGCAAATGCAGAACGTTTTCTGCGTGTTGCCGATATTCTGGAAAGCAA' +
            'TGCCAGGCAGGGGCAGGTGGCCACCGTCCTCTCTGCCCCCGCCAAAATCACCAACCACCTGGTGGCGATGATTGAAAAAA' +
            'CCATTAGCGGCCAGGATGCTTTACCCAATATCAGCGATGCCGAACGTATTTTTGCCGAACTTTTGACGGGACTCGCCGCC' +
            'GCCCAGCCGGGGTTCCCGCTGGCGCAATTGAAAACTTTCGTCGATCAGGAATTTGCCCAAATAAAACATGTCCTGCATGG' +
            'CATTAGTTTGTTGGGGCAGTGCCCGGATAGCATCAACGCTGCGCTGATTTGCCGTGGCGAGAAAATGTCGATCGCCATTA' +
            'TGGCCGGCGTATTAGAAGCGCGCGGTCACAACGTTACTGTTATCGATCCGGTCGAAAAACTGCTGGCAGTGGGGCATTAC' +
            'CTCGAATCTACCGTCGATATTGCTGAGTCCACCCGCCGTATTGCGGCAAGCCGCATTCCGGCTGATCACATGGTGCTGAT' +
            'GGCAGGTTTCACCGCCGGTAATGAAAAAGGCGAACTGGTGGTGCTTGGACGCAACGGTTCCGACTACTCTGCTGCGGTGC' +
            'TGGCTGCCTGTTTACGCGCCGATTGTTGCGAGATTTGGACGGACGTTGACGGGGTCTATACCTGCGACCCGCGTCAGGTG' +
            'CCCGATGCGAGGTTGTTGAAGTCGATGTCCTACCAGGAAGCGATGGAGCTTTCCTACTTCGGCGCTAAAGTTCTTCACCC' +
            'CCGCACCATTACCCCCATCGCCCAGTTCCAGATCCCTTGCCTGATTAAAAATACCGGAAATCCTCAAGCACCAGGTACGC' +
            'TCATTGGTGCCAGCCGTGATGAAGACGAATTACCGGTCAAGGGCATTTCCAATCTGAATAACATGGCAATGTTCAGCGTT' +
            'TCTGGTCCGGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGT' +
            'GCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAA' +
            'TGCAGGAAGAGTTCTACCTGGAACTGAAAGAAGGCTTACTGGAGCCGCTGGCAGTGACGGAACGGCTGGCCATTATCTCG' +
            'GTGGTAGGTGATGGTATGCGCACCTTGCGTGGGATCTCGGCGAAATTCTTTGCCGCACTGGCCCGCGCCAATATCAACAT' +
            'TGTCGCCATTGCTCAGGGATCTTCTGAACGCTCAATCTCTGTCGTGGTAAATAACGATGATGCGACCACTGGCGTGCGCG' +
            'TTACTCATCAGATGCTGTTCAATACCGATCAGGTTATCGAAGTGTTTGTGATTGGCGTCGGTGGCGTTGGCGGTGCGCTG' +
            'CTGGAGCAACTGAAGCGTCAGCAAAGCTGGCTGAAGAATAAACATATCGACTTACGTGTCTGCGGTGTTGCCAACTCGAA' +
            'GGCTCTGCTCACCAATGTACATGGCCTTAATCTGGAAAACTGGCAGGAAGAACTGGCGCAAGCCAAAGAGCCGTTTAATC' +
            'TCGGGCGCTTAATTCGCCTCGTGAAAGAATATCATCTGCTGAACCCGGTCATTGTTGACTGCACTTCCAGCCAGGCAGTG' +
            'GCGGATCAATATGCCGACTTCCTGCGCGAAGGTTTCCACGTTGTCACGCCGAACAAAAAGGCCAACACCTCGTCGATGGA' +
            'TTACTACCATCAGTTGCGTTATGCGGCGGAAAAATCGCGGCGTAAATTCCTCTATGACACCAACGTTGGGGCTGGATTAC' +
            'CGGTTATTGAGAACCTGCAAAATCTGCTCAATGCAGGTGATGAATTGATGAAGTTCTCCGGCATTCTTTCTGGTTCGCTT' +
            'TCTTATATCTTCGGCAAGTTAGACGAAGGCATGAGTTTCTCCGAGGCGACCACGCTGGCGCGGGAAATGGGTTATACCGA' +
            'ACCGGACCCGCGAGATGATCTTTCTGGTATGGATGTGGCGCGTAAACTATTGATTCTCGCTCGTGAAACGGGACGTGAAC' +
            'TGGAGCTGGCGGATATTGAAATTGAACCTGTGCTGCCCGCAGAGTTTAACGCCGAGGGTGATGTTGCCGCTTTTATGGCG' +
            'AATCTGTCACAACTCGACGATCTCTTTGCCGCGCGCGTGGCGAAGGCCCGTGATGAAGGAAAAGTTTTGCGCTATGTTGG' +
            'CAATATTGATGAAGATGGCGTCTGCCGCGTGAAGATTGCCGAAGTGGATGGTAATGATCCGCTGTTCAAAGTGAAAAATG' +
            'GCGAAAACGCCCTGGCCTTCTATAGCCACTATTATCAGCCGCTGCCGTTGGTACTGCGCGGATATGGTGCGGGCAATGAC' +
            'GTTACAGCTGCCGGTGTCTTTGCTGATCTGCTACGTACCCTCTCATGGAAGTTAGGAGTCTGA'

    if ($("[name='type-of-seq']:checked").val() === "protein") {
        $('#seq-input').val(exampleProt);
    } else if ($("[name='type-of-seq']:checked").val() === "nucleotide") {
        $('#seq-input').val(exampleNuc);
    }

    $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
}

function hmmerParse(jsonData, status) {
    var id = jsonData['results']['uuid']
    console.log(status);
    console.log(id);
    // var reqUrl = 'https://www.ebi.ac.uk/Tools/hmmer/download/' + id +
    // '/score?format=json';
    var fullRes = 'https://www.ebi.ac.uk/Tools/hmmer/results/' + id; //full results link
    console.log(fullRes)
    if (status != 'success') {
        allError(jsonData)
    } else {
        console.log(id);
        $('#full-result-link').empty();
        $('#full-result-link').append('<a href=' + fullRes + ' target="_blank">HMMER</a>');
        allSuccess(jsonData);
    }
}

function allSuccess(data) {
    $('#console-body').append('<br><span class="text-monospace text-success">Data received!</span>');
    $('#pbar').text('Completed!');
    $('#pbar').attr('class', 'progress-bar bg-success');
    $('#pbar').css("width", "100%");
    setTimeout(function () {
        $('#progress-console').collapse('toggle');
        $('#results-page').collapse('toggle');
        console.log('Graphic submission was successful.');
        console.log(data);
        showDomains(data);
    }, 2000);
}

function allError(data) {
    console.log(data);
    var msg = data['responseJSON']['seq'][0]
    $('#console-body').append('<br><span class="text-monospace text-danger">' + msg);
    $('#pbar').attr('class', 'progress-bar bg-danger');
    $('#pbar').css("width", "100%");
    $('#retry-btn-console').collapse('toggle');
    $('#continue-btn-console').collapse('toggle');
    $('#visualise-msg').text('Use the slider to select your area of interest.');
    console.log('An error occurred. (graphics)');
}

function makeSlider() {
    var slider = $('#range-input')[0];
    var maxSliderVal = ($('#seq').val().replace(/\s+/g, '').length != 0)
        ? $('#seq')
            .val()
            .replace(/\s+/g, '')
            .length
        : 100
    noUiSlider.create(slider, {
        start: [
            20, 80
        ],
        connect: true,
        margin: 10,
        step: 1,
        orientation: 'horizontal',
        range: {
            'min': 1,
            'max': maxSliderVal
        },
        format: wNumb({decimals: 0})
    });

}

//update events based on slider change

function updateSliderEvents() {
    $('#range-input')[0]
        .noUiSlider
        .on('change', function () {
            var sliderPos = $('#range-input')[0]
                .noUiSlider
                .get();
            var a = Math.round(sliderPos[0]);
            var b = Math.round(sliderPos[1]);
            $('#result-card').collapse("show");
            var newSelecSeq = getSequence(a, b);
            showFlex(newSelecSeq);
            checkCustomTag();
            showSuggestions(a + '-' + b);
        })

    $('#range-input')[0]
        .noUiSlider
        .on('slide', function () {
            var sliderPos = $('#range-input')[0]
                .noUiSlider
                .get();
            var a = Math.round(sliderPos[0]);
            var b = Math.round(sliderPos[1]);
            //                                        console.log(a,b);

            $('#badge-pills')
                .children()
                .each(function () {
                    var $currentPill = $(this);
                    var pillVal = $currentPill
                        .val()
                        .split('-');
                    //                          console.log(pillVal, a , b);

                    if ((a <= pillVal[0] && pillVal[1] <= b) || (b <= pillVal[0] && pillVal[1] <= a)) {
                        //console.log('pillVal, a, b');
                        var currentClass = $(this).attr('class');
                        $(this).addClass('badge-success');
                    } else {
                        $(this).removeClass('badge-success');
                        $(this).addClass(currentClass);
                    }

                });

            $('#start-box').val(a);
            $('#end-box').val(b);
        });
}

function afterSubmit() {
    $('#submit-btn-pfam')[0].disabled = true;
    $('#progress-console').collapse('toggle');
    $('#banner').collapse('hide');

    $('#pbar').css("width", "2%");
}

function showDomains(data) {
    console.log('show domains');
    console.log(data);
    if (data && data['results']['hits'].length != 0) {
        for (var i = 0; i < data['results']['hits'].length; i++) {
            var obj = data['results']['hits'][i]['domains'];
            var divPill = "badgepill" + i;

            $.each(obj, function (j, item) {
                if (item['display']) {
                    var divPillID = divPill + j;

                    var popTitle = item['alihmmname'] + ' (' + item['alihmmacc'] + ')<hr>';
                    var popData = '<b>' + item['alihmmdesc'] + '</b><br><br>Coordinates: ' + item['ienv'] + ' - ' + item['jenv'] + '<br>Alignment region: ' + item['iali'] + ' - ' + item['jali'];

                    $('#badge-pills').append('<a class="badge badge-pill badge-info" id="' + divPillID + '" data-toggle="popover" data-html="true" data-placement="top"  data-trigger="hov' +
                            'er" title="' + popTitle + '" data-content="' + popData + ' " href="#none" onclick="changeSlider($(this))"></a>');

                    //give name to newly added badges
                    $('#' + divPillID).append(item['alihmmname']);
                    $('#' + divPillID).val(item['ienv'] + '-' + item['jenv']);

                    //correct placement of new badges
                    var cont_size = $('#badge-pills').width() / $('#seq')
                        .val()
                        .replace(/\s+/g, '')
                        .length; //container size
                    $('#' + divPillID).css("position", "absolute");
                    $('#' + divPillID).css("height", "30px"),
                    $('#' + divPillID).css("left", (item['ienv'] * cont_size + 12) + 'px');
                    $('#' + divPillID).css("width", ((item['jenv'] - item['ienv']) * cont_size + 12) + 'px');

                }
            });
        }
    } else {
        //if no domains found show slider
        $('#progress-console').collapse('toggle');
        $('#results-page').collapse('toggle');
        $('#domain-slider').collapse('toggle');
        $('#visualise-msg').append('<br>No domains found!<br>You may select a region using the slider.');

        //show results
        makeSlider();
        var slider = $('#range-input')[0];
        $('#result-card').collapse('show');
        slider
            .noUiSlider
            .set([
                1,
                $('#seq')
                    .val()
                    .length
            ])
        updateSliderEvents();
        coveredDomains();
    }

    //activate popovers
    $(function () {
        $('[data-toggle="popover"]').popover();
    })
    makeSlider();
    updateSliderEvents();

}

function changeSlider(elem) {
    //    console.log(elem);
    if ($("#domain-slider").is('.collapse:not(.show)')) {
        $("#domain-slider").collapse('show');
    }

    var range = elem.val()
    var values = range.split('-');
    if (!(elem[0].id.match('suggestion'))) {
        //dont show new suggestions if suggestion box is clicked
        elem.popover('toggle');
        showSuggestions(range);
    }

    $('#start-box').val(values[0]);
    $('#end-box').val(values[1]);

    var slider = $('#range-input')[0];
    slider
        .noUiSlider
        .set(values);

    coveredDomains();

}

//check if slider/box values cover any of the available domains
function coveredDomains() {
    var slider = $('#range-input')[0];
    var sliderPos = slider
        .noUiSlider
        .get();
    var a = Math.round(sliderPos[0]);
    var b = Math.round(sliderPos[1]);
    //    console.log(a, b);

    $('#badge-pills')
        .children()
        .each(function () {
            var $currentPill = $(this);
            var pillVal = $currentPill
                .val()
                .split('-');
            //console.log(pillVal, a , b);

            if ((a <= pillVal[0] && pillVal[1] <= b) || (b <= pillVal[0] && pillVal[1] <= a)) {
                //console.log('pillVal, a, b');
                var currentClass = $(this).attr('class');
                $(this).addClass('badge-success');
            } else {
                $(this).removeClass('badge-success');
                $(this).addClass(currentClass);
            }

        });

    //output flexibility
    $('#result-card').collapse("show");
    // $('#graph').collapse('show');
    var newSelecSeq = getSequence(a, b);
    showFlex(newSelecSeq);
    checkCustomTag();

}

//fix popover input field value
function popOverValueSave() {
    if ((2 <= $('#sugg-settings-popover').val()) && ($('#sugg-settings-popover').val() <= 200)) {
        $('#sugg-settings-popover').removeClass('is-invalid');
        $('#sugg-settings').val($('#sugg-settings-popover').val());
        if (!($('#sugg-settings-popover').val())) {
            $('#sugg-settings').val(10);
            $('#sugg-settings-popover').val(10);
        }

        //show suggestions instantly
        var range = $('#range-input')[0]
            .noUiSlider
            .get();
        showSuggestions(range[0] + '-' + range[1]);

        $('#suggestion-popover').popover('hide');
    } else {
        $('#sugg-settings-popover').addClass('is-invalid');
    }
}

//update slider and box based on length of given sequence

function updateLength() {
    var slider = $('#range-input')[0];
    var maxSliderVal = ($('#seq').val().replace(/\s+/g, '').length != 0)
        ? $('#seq')
            .val()
            .replace(/\s+/g, '')
            .length
        : 100
    slider
        .noUiSlider
        .updateOptions({
            range: {
                'min': 1,
                'max': maxSliderVal
            }
        })

}

function getSequence(start, end) {
    var sq = $('#seq')
        .val()
        .replace(/\s+/g, '');
    var selectedSeq = (start < end)
        ? sq.slice(start - 1, end)
        : sq.slice(end - 1, start);
    return selectedSeq;
}

function checkEmpty() {
    var slider = $('#range-input')[0];
    if ($('#start-box').val().length == 0) {
        $('#start-box').val(slider.noUiSlider.get()[0]);
    }
    if ($('#end-box').val().length == 0) {
        $('#end-box').val(slider.noUiSlider.get()[1]);
    }
}

function flexibility(seq) {
    //adapted from biopython
    var flexibilities = {
        "A": 0.984,
        "C": 0.906,
        "E": 1.094,
        "D": 1.068,
        "G": 1.031,
        "F": 0.915,
        "I": 0.927,
        "H": 0.950,
        "K": 1.102,
        "M": 0.952,
        "L": 0.935,
        "N": 1.048,
        "Q": 1.037,
        "P": 1.049,
        "S": 1.046,
        "R": 1.008,
        "T": 0.997,
        "W": 0.904,
        "V": 0.931,
        "Y": 0.929
    }
    var win_size = 9;
    var weights = [0.25, 0.4375, 0.625, 0.8125, 1];
    var scores = [];

    for (var i = 0; i < (seq.length - win_size); i++) {
        var subseq = seq.slice(i, i + win_size);
        var score = 0.0;

        for (var j = 0; j < Math.floor(win_size / 2); j++) {
            front = subseq[j];
            back = subseq[win_size - j - 1];
            score += (flexibilities[front] + flexibilities[back]) * weights[j]
        }

        middle = subseq[Math.floor(win_size / 2) + 1]
        score += flexibilities[middle]
        scores.push(score / 5.25)

    }
    return scores

}

function hydropathy(seq) {
    //adapted from flexibility
    var kd = {
        "A": 1.8,
        "R": -4.5,
        "N": -3.5,
        "D": -3.5,
        "C": 2.5,
        "Q": -3.5,
        "E": -3.5,
        "G": -0.4,
        "H": -3.2,
        "I": 4.5,
        "L": 3.8,
        "K": -3.9,
        "M": 1.9,
        "F": 2.8,
        "P": -1.6,
        "S": -0.8,
        "T": -0.7,
        "W": -0.9,
        "Y": -1.3,
        "V": 4.2
    }
    var win_size = 9;
    //    var weights = [0.25, 0.4375, 0.625, 0.8125, 1];
    var weights = [1, 1, 1, 1, 1]; //equal weights for hydrophobicity
    var scores = [];

    for (var i = 0; i < (seq.length - win_size); i++) {
        var subseq = seq.slice(i, i + win_size);
        var score = 0.0;

        for (var j = 0; j < Math.floor(win_size / 2); j++) {
            front = subseq[j];
            back = subseq[win_size - j - 1];
            score += (kd[front] + kd[back]) * weights[j]
        }

        middle = subseq[Math.floor(win_size / 2) + 1]
        score += kd[middle]
        scores.push(score / 5.25)

    }
    return scores

}

function aminoAcidSolubilityIndex(seq) {
    var aas = {'A': 0.8356956599678218,
 'C': 0.5219207324456876,
 'E': 0.9868660417547442,
 'D': 0.9075983546378998,
 'G': 0.8003827946673535,
 'F': 0.5821934635876957,
 'I': 0.6790449304566072,
 'H': 0.8963977585570367,
 'K': 0.9259165090012061,
 'M': 0.6299964100098959,
 'L': 0.6546922237065839,
 'N': 0.8604957042204235,
 'Q': 0.7895650031998229,
 'P': 0.822104415564934,
 'S': 0.7442464390120463,
 'R': 0.771055152304471,
 'T': 0.8098670971949234,
 'W': 0.6386931894494416,
 'V': 0.7344952876686051,
 'Y': 0.6125581495225544}



    var scores = [];

    for (var i = 0; i < seq.length; i++) {
        scores.push(aas[seq[i]])
    }
    return averageArr(scores)

}

function averageArr(scores) {
    //compute average flexibilities
    var sum = 0;
    for (var k = 0; k < scores.length; k++) {
        sum += scores[k];
    }

    var avg = sum / scores.length;
    return avg
}

function gravy(seq) {
    //biopython
    var kd = {
        "A": 1.8,
        "R": -4.5,
        "N": -3.5,
        "D": -3.5,
        "C": 2.5,
        "Q": -3.5,
        "E": -3.5,
        "G": -0.4,
        "H": -3.2,
        "I": 4.5,
        "L": 3.8,
        "K": -3.9,
        "M": 1.9,
        "F": 2.8,
        "P": -1.6,
        "S": -0.8,
        "T": -0.7,
        "W": -0.9,
        "Y": -1.3,
        "V": 4.2
    }
    var scores = [];

    for (var i = 0; i < seq.length; i++) {
        scores.push(kd[seq[i]])
    }
    return scores
}

function avr_gravy(seq) {
    var scores = gravy(seq)
    return averageArr(scores)
}

// function equaliseHeights() {    //equalise height between plot and result
// cards    var resCardH = $("#results-card-body").height();    var plotlyH =
// $("#plotly-chart").height();
//
//
// $("#right-card-graph").height($("#left-card-results").height());
// //$("#results-card-body").height($("#plotly-chart").height());
// $("#plotly-chart").height($("#results-card-body").height());
//
//}

function plotFlex(scores, seq) {
    var num_residues = scores.length;

    //x coordinates for plot. They start from 0,1,2...
    var x_vals = Array
        .apply(null, {length: num_residues})
        .map(Number.call, Number);

    // var x_vals_flex = Array.apply(null, {        length: num_residues
    // }).map(Number.call, Number);    var x_vals_gravy = Array.apply(null, {
    // length: num_residues    }).map(Number.call, Number);

    var start = Number($('#start-box').val());
    var end = Number($('#end-box').val());

    if (start > $('#seq').val().replace(/\s+/g, '').length) {
        start = $('#seq')
            .val()
            .replace(/\s+/g, '')
            .length;
    }

    if (end > $('#seq').val().replace(/\s+/g, '').length) {
        end = $('#seq')
            .val()
            .replace(/\s+/g, '')
            .length;
    }

    //correct position where flexibility starts
    correct_start = (start < end)
        ? start
        : end; //pick smaller one for start pos

    // increment x_vals according to the start position increment x_vals according
    // to the start position eg: 'MAGAASPCANG' -> [1.0107142857142857,
    // 1.0041190476190476] for SP. correct residues are in range(5,-4) in 0 based
    // index.
    correct_seq = seq
        .slice(5, -4)
        .split('');

    // add sequence position to x positions to get actual position in sequence.
    // for (var i = 0; i < x_vals_flex.length; i++) {        x_vals_flex[i] +=
    // correct_start + 5;    }    for (var i = 0; i < x_vals_gravy.length; i++) {
    // x_vals_gravy[i] += correct_start;    }

    for (var i = 0; i < x_vals.length; i++) {
        x_vals[i] += correct_start + 5;
    }


    var hydrophob = {
        x: x_vals, //x_vals_gravy
        y: hydropathy(seq),
        type: 'scatter',
        mode: 'lines',
        line: {
            shape: 'spline'
        },
        marker: {
            color: 'rgb(55, 83, 109)'
        },
        text: correct_seq, //seq.split(''), //for simple hydrophobicity plot
        name: 'Hydrophobicity'
    }
    
    
    
    var flexib = {
        x: x_vals, //x_vals_flex
        y: scores,
        type: 'scatter',
        mode: 'lines',
        line: {
            shape: 'spline'
        },
        marker: {
            color: 'rgb(255,127,14)'
        },
        text: correct_seq,
        name: 'Flexibility'
    };

    



    var data = [flexib, hydrophob];

    var layout = {
        autosize: true,
        title: 'Flexibility and hydrophobicity profiles for the selected region',

        xaxis: {
            title: 'Position of amino acid residue'
        },
        yaxis: {
            title: ''
        },
        // margin: {            l: 50,            r: 10,            b: 80,            t:
        // 30,            pad: 2        },     shapes: [{         type: 'line',
        // xref: 'paper',         x0: 0,         y0: averageArr(scores),         x1: 1,
        // y1: averageArr(scores),         line: {             //color: 'rgb(255, 0,
        // 0)',             width: 1,             dash: 'dot'         } }]
    };

    Plotly.newPlot('plotly-chart', data, layout, {scrollZoom: true}); //{displayModeBar: false}
}

function settingForSuggestion() {
    //this is to show currently set value on popover
    $('#suggestion-popover')
        .on('shown.bs.popover', function () {
            $('#sugg-settings-popover').val($('#sugg-settings').val());
        })
}

function showFlex(seq) {

    var Format = wNumb({decimals: 4});

    var scores = flexibility(seq);
    var avgF = averageArr(scores);
    var aas = aminoAcidSolubilityIndex(seq);
    var prob = logistic(aas);
    var gra = avr_gravy(seq);
    plotFlex([], seq); //reset plot by sending empty array
    plotFlex(scores, seq);
    $('#proba').val(Format.to(prob));
    $('#flex-res').val(Format.to(avgF));
    $('#gravy-res').val(Format.to(gra));
    $('#result-seq').text(seq);
    showNucleotide();
}

//show nucleotide sequence as well if input is nucleotide sequence
function showNucleotide() {
    if ($("[name='type-of-seq']:checked").val() === "nucleotide") {
        positions = $('#range-input')[0]
            .noUiSlider
            .get();
        sequence = $('#nt-seq').val();
        currentSeq = sequence.substring((positions[0] - 1) * 3, positions[1] * 3)
        $('#result-nt').collapse('show');
        $('#result-seq-nt').text(currentSeq);

        $('#input-sequence').text();
        $('#input-sequence').text('ATG' + currentSeq + 'TGA');
        $('.floating-label .custom-select, .floating-label .form-control').floatinglabel();
        //        $('#optimise-to-tisigner').removeClass('disabled');
    }
}

//Simulated annealing

function substr(seq, pos) {
    a = Number(pos.split('-')[0]) - 1
    b = Number(pos.split('-')[1])
    subst = seq.substring(a, b)
    return subst
}

function subsq(seq, pos, maxRange) {
    if (maxRange <= 1) {
        maxRange = 2;
    } else if (maxRange >= 200) {
        maxRange = 200;
    }
    var subst = substr(seq, pos);
    a = Number(pos.split('-')[0]) - 1
    b = Number(pos.split('-')[1])
    var l = Math.floor((Math.random() * Number(maxRange)));
    var r = Math.floor((Math.random() * Number(maxRange - l)));

    var leftString = seq.substring(a - l, a);
    var rightString = seq.substring(b, b + r);
    /* console.log(a, b, l, r, leftString, subst, rightString); */
    return leftString + subst + rightString;

}

function avr_flex(seq) {
    var flex_scores = flexibility(seq);
    return averageArr(flex_scores);
}

const cost_func = function () {
    let cache = {};
    return function (seq) {
        if (!(seq in cache)) {
            // cache[seq] = logistic(avr_flex(seq)); //maximise probability
            cache[seq] = logistic(aminoAcidSolubilityIndex(seq)); //maximise probability
        }
        return cache[seq]
    }
}();

function simulatedAnnealing(seq, pos, maxRange = 200, niter = 50) {
    var temp = 1;

    //initial region
    var subseq = substr(seq, pos);

    //current and best
    var scurr = subseq;
    var sbest = scurr;
    var initial_cost = cost_func(subseq);
    var curr_cost = cost_func(scurr);
    var curr_best_cost = cost_func(scurr);

    for (var i = 0; i < niter; i++) {
        //expand the initial region a bit
        var snew = subsq(seq, pos, maxRange);
        var new_cost = cost_func(snew);

        if ((new_cost / 1000) > (curr_cost / 1000)) {
            scurr = snew;
            curr_cost = cost_func(scurr);
            if ((curr_cost / 1000) > (curr_best_cost / 1000)) {
                sbest = snew;
                curr_best_cost = cost_func(sbest);
            }
        } else if (Math.exp(-(new_cost - curr_cost) / (1000 * temp)) < Math.random()) {
            scurr = snew;
            curr_cost = cost_func(scurr);
        }
        temp -= 0.01;

    }

    var results = {};
    //check if result is actually better then original sequence
    if (cost_func(sbest) > initial_cost) {
        results.Sequence = sbest
        results.aminoAcidSolubility = cost_func(sbest)
        return results
    }
}

function repeatSimAnneal(seq, region, maxRange, niter = 50) {
    var results = {}
    sequences = [];
    aas = [];
    for (i = 0; i < 10; i++) {
        new_res = simulatedAnnealing(seq, region, maxRange, niter);
        if (new_res) {
            if (!(sequences.includes(new_res.Sequence))) {
                sequences.push(new_res.Sequence);
                aas.push(new_res.aminoAcidSolubility);
            }
        }
    }
    results.Sequence = sequences;
    results.aminoAcidSolubility = aas;

    // console.log(JSON.stringify(results));
    return results
}

//Run simulated annealing after clicking domain buttons
function showSuggestions(range) {
    var sequence = $('#seq').val();
    var defaultMaxVal = 50;
    var maxVal = Number($('#sugg-settings').val());
    console.log('maxVal', maxVal);
    if (maxVal < 1 || maxVal > 200) {
        maxVal = defaultMaxVal;
    }
    // console.log('maxVal', maxVal);
    var new_results = repeatSimAnneal(seq = sequence, pos = range, maxRange = maxVal);
    var btnName = "suggestionBox"

    //clear div before adding new buttons
    $('#regionSuggestions').empty();

    if (new_results.Sequence.length != 0) {
        //show a badge of how many new suggestions
        $('#numSuggReg').text(new_results.Sequence.length);

        //make buttons for new regions
        $.each(new_results.Sequence, function (index, element) {
            var btnId = btnName + index;
            var re = new RegExp(element, "g");
            var matches = re.exec(sequence);
            if (matches) {
                matchStart = matches.index + 1;
                matchEnd = element.length + matches.index;
                $('#regionSuggestions').append('<a class="badge badge-info" id="' + btnId + '" href="#none" onclick="changeSlider($(this))">' + matchStart + ' - ' + matchEnd + '</a>&nbsp;')
                $('#' + btnId).val(matchStart + '-' + matchEnd);

                // console.log($('#' + btnId).val());
            }
        });
    } else {
        $('#numSuggReg').empty();
    }
}

/* Input sequence validation */

function checkFasta(arr) {

    if (arr[0][0] == ">") {
        arr.shift()
        seq = arr
            .join('')
            .toUpperCase();
        if (seq.split('>').length >= 2) {
            throw "Multi-fasta not supported."
        } else {
            return seq
        }
    } else {
        return arr
            .join('')
            .toUpperCase();
    }
}

function checkValidNucleotideSequence(seq) {
    var seq = seq.toUpperCase();
    var ntreg = /^[ATGCU]*$/;
    var stop = [
        "TAG",
        "TGA",
        "TAA",
        "UAG",
        "UGA",
        "UAA"
    ];
    if (seq.length < 80000) {
        if (!ntreg.test(seq)) {
            throw "Ambiguity/unrecognised nucleotide codes."
        } else {
            if (seq.length % 3 != 0) {
                throw "Sequence length is not a multiple of 3 (codon)."
            } else {
                var codons = seq.match(/.{1,3}/g);
                if (codons[0] != 'ATG') {
                    throw "ATG/AUG start codon is absent."
                } else if (!(stop.includes(codons[codons.length - 1]))) {
                    throw "Stop codon is absent."
                } else {
                    codons.shift();
                    codons.pop();
                    // if (stop.includes(codons[codons.length - 1])) {
                    // codons.pop(); //remove stop codon 							}
                }
                var common = codons.filter(value => stop.includes(value))
                if (common.length != 0) {
                    throw "Early stop codon found."
                }
            }
        }
    } else {
        throw "Sequence length should be less than 80,000."
    }
}

function translateSequence(seq) {
    var seq = seq
        .replace(/U/gi, 'T')
        .toUpperCase();
    codonToAminoAcid = {
        'TTT': 'F',
        'TCT': 'S',
        'TAT': 'Y',
        'TGT': 'C',
        'TTC': 'F',
        'TCC': 'S',
        'TAC': 'Y',
        'TGC': 'C',
        'TTA': 'L',
        'TCA': 'S',
        'TTG': 'L',
        'TCG': 'S',
        'TGG': 'W',
        'CTT': 'L',
        'CCT': 'P',
        'CAT': 'H',
        'CGT': 'R',
        'CTC': 'L',
        'CCC': 'P',
        'CAC': 'H',
        'CGC': 'R',
        'CTA': 'L',
        'CCA': 'P',
        'CAA': 'Q',
        'CGA': 'R',
        'CTG': 'L',
        'CCG': 'P',
        'CAG': 'Q',
        'CGG': 'R',
        'ATT': 'I',
        'ACT': 'T',
        'AAT': 'N',
        'AGT': 'S',
        'ATC': 'I',
        'ACC': 'T',
        'AAC': 'N',
        'AGC': 'S',
        'ATA': 'I',
        'ACA': 'T',
        'AAA': 'K',
        'AGA': 'R',
        'ATG': 'M',
        'ACG': 'T',
        'AAG': 'K',
        'AGG': 'R',
        'GTT': 'V',
        'GCT': 'A',
        'GAT': 'D',
        'GGT': 'G',
        'GTC': 'V',
        'GCC': 'A',
        'GAC': 'D',
        'GGC': 'G',
        'GTA': 'V',
        'GCA': 'A',
        'GAA': 'E',
        'GGA': 'G',
        'GTG': 'V',
        'GCG': 'A',
        'GAG': 'E',
        'GGG': 'G'
    }

    codons = seq.match(/.{1,3}/g);
    codons.pop(); //remove stop codon
    var proteinSeq = ''
    $.each(codons, function (index, element) {
        proteinSeq += codonToAminoAcid[element]
    });
    return proteinSeq
}

function checkValidProtein(seq) {
    var seq = seq.toUpperCase();
    /*   codes = ['A',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'K',
        'L',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'V',
        'W',
        'Y',
        '*'
      ] */
    var ntreg = /^[ATGCU]*$/;
    var protreg = /^[ACDEFGHIKLMNPQRSTVWY*]*$/;

    if (!ntreg.test(seq)) {
        if (seq.length <= 10000) {
            if (!protreg.test(seq)) {
                throw "Ambiguity/unrecognised amino acid codes."
            } else if ((seq.match(/\*/g) || []).length > 1) {
                throw "Multiple stop characters."
            } else if (seq.split('*')[1]) {
                throw "* is allowed only at the end."
            }
            /* else if (seq[0] != 'M') {
                 throw "Sequence did not start with Methionine."
               } */

        } else {
            console.log(seq.length >= 10001)
            throw "Sequence length should be less then 10,000."
        }
    } else {
        //        throw "Possibly a nucleotide sequence!"
    }
}

function validateInput(event) {
    //validates sequence in the displayed form
    var re = /\r\n|\n\r|\n|\r/g;
    var fasta = $('#seq-input').val();
    var arr = fasta
        .replace(re, "\n")
        .split("\n");

    //if sequence type is not checked throw error
    if (!$("[name='type-of-seq']:checked").val()) {
        $('#seq-validation').text('Please select a sequence type!');
        $('#seq-input').addClass('is-invalid');
        event.preventDefault();
    }

    try {
        tstseq = checkFasta(arr)
        //    console.log(tstseq);
        if ($("[name='type-of-seq']:checked").val() === "protein") {
            try {
                checkValidProtein(tstseq);
                $('#seq').val(tstseq);
                return true;
            } catch (err) {
                $('#seq-validation').text(err);
                $('#seq-input').addClass('is-invalid');
                event.preventDefault();
            }
        } else if ($("[name='type-of-seq']:checked").val() === "nucleotide") {
            try {
                checkValidNucleotideSequence(tstseq);
                $('#nt-seq').val(tstseq); // add nt to seperate input field for later use
                $('#seq').val(translateSequence(tstseq)); //add prot seq to usual field
                return true;
            } catch (err) {
                $('#seq-validation').empty();
                $('#seq-validation').text(err);
                $('#seq-input').addClass('is-invalid');
                event.preventDefault();
            }
        }

    } catch (err) {
        $('#seq-validation').text(err);
        $('#seq-input').addClass('is-invalid');
        event.preventDefault();
    }

}

// getting probability from flexibility a and b were determined by logistic
// regression
function logistic(x, a = 81.1496, b = -62.8379) {
    return 1 / (1 + (Math.exp(-(a * x + b))))
}

// selecting solubility tags Graph for custom tags

function propertiesWithTags(seq, cust_tag) {
    //cust_tag should be a protein
    var Format = wNumb({decimals: 4});

    var tags = {
        'No tag': '',
        'Trx': 'ATGAGCGATAAAATTATTCACCTGACTGACGACAGTTTTGACACGGATGTACTCAAAGCGGACGGGGCGATCCTCGTCGA' +
                'TTTCTGGGCAGAGTGGTGCGGTCCGTGCAAAATGATCGCCCCGATTCTGGATGAAATCGCTGACGAATATCAGGGCAAAC' +
                'TGACCGTTGCAAAACTGAACATCGATCAAAACCCTGGCACTGCGCCGAAATATGGCATCCGTGGTATCCCGACTCTGCTG' +
                'CTGTTCAAAAACGGTGAAGTGGCGGCAACCAAAGTGGGTGCACTGTCTAAAGGTCAGTTGAAAGAGTTCCTCGACGCTAA' +
                'CCTGGCC',
        'MBP': 'ATGAAAATCGAAGAAGGTAAACTGGTAATCTGGATTAACGGCGATAAAGGCTATAACGGTCTCGCTGAAGTCGGTAAGAA' +
                'ATTCGAGAAAGATACCGGAATTAAAGTCACCGTTGAGCATCCGGATAAACTGGAAGAGAAATTCCCACAGGTTGCGGCAA' +
                'CTGGCGATGGCCCTGACATTATCTTCTGGGCACACGACCGCTTTGGTGGCTACGCTCAATCTGGCCTGTTGGCTGAAATC' +
                'ACCCCGGACAAAGCGTTCCAGGACAAGCTGTATCCGTTTACCTGGGATGCCGTACGTTACAACGGCAAGCTGATTGCTTA' +
                'CCCGATCGCTGTTGAAGCGTTATCGCTGATTTATAACAAAGATCTGCTGCCGAACCCGCCAAAAACCTGGGAAGAGATCC' +
                'CGGCGCTGGATAAAGAACTGAAAGCGAAAGGTAAGAGCGCGCTGATGTTCAACCTGCAAGAACCGTACTTCACCTGGCCG' +
                'CTGATTGCTGCTGACGGGGGTTATGCGTTCAAGTATGAAAACGGCAAGTACGACATTAAAGACGTGGGCGTGGATAACGC' +
                'TGGCGCGAAAGCGGGTCTGACCTTCCTGGTTGACCTGATTAAAAACAAACACATGAATGCAGACACCGATTACTCCATCG' +
                'CAGAAGCTGCCTTTAATAAAGGCGAAACAGCGATGACCATCAACGGCCCGTGGGCATGGTCCAACATCGACACCAGCAAA' +
                'GTGAATTATGGTGTAACGGTACTGCCGACCTTCAAGGGTCAACCATCCAAACCGTTCGTTGGCGTGCTGAGCGCAGGTAT' +
                'TAACGCCGCCAGTCCGAACAAAGAGCTGGCAAAAGAGTTCCTCGAAAACTATCTGCTGACTGATGAAGGTCTGGAAGCGG' +
                'TTAATAAAGACAAACCGCTGGGTGCCGTAGCGCTGAAGTCTTACGAGGAAGAGTTGGCGAAAGATCCACGTATTGCCGCC' +
                'ACTATGGAAAACGCCCAGAAAGGTGAAATCATGCCGAACATCCCGCAGATGTCCGCTTTCTGGTATGCCGTGCGTACTGC' +
                'GGTGATCAACGCCGCCAGCGGTCGTCAGACTGTCGATGAAGCCCTGAAAGACGCGCAGACT',
        'SUMO': 'ATGTCGGACTCAGAAGTCAATCAAGAAGCTAAGCCAGAGGTCAAGCCAGAAGTCAAGCCTGAGACTCACATCAATTTAAA' +
                'GGTGTCCGATGGATCTTCAGAGATCTTCTTCAAGATCAAAAAGACCACTCCTTTAAGAAGGCTGATGGAAGCGTTCGCTA' +
                'AAAGACAGGGTAAGGAAATGGACTCCTTAAGATTCTTGTACGACGGTATTAGAATTCAAGCTGATCAGACCCCTGAAGAT' +
                'TTGGACATGGAGGATAACGATATTATTGAGGCTCACAGAGAACAGATTGGTGGT',
        'GST': 'ATGTCCCCTATACTAGGTTATTGGAAAATTAAGGGCCTTGTGCAACCCACTCGACTTCTTTTGGAATATCTTGAAGAAAA' +
                'ATATGAAGAGCATTTGTATGAGCGCGATGAAGGTGATAAATGGCGAAACAAAAAGTTTGAATTGGGTTTGGAGTTTCCCA' +
                'ATCTTCCTTATTATATTGATGGTGATGTTAAATTAACACAGTCTATGGCCATCATACGTTATATAGCTGACAAGCACAAC' +
                'ATGTTGGGTGGTTGTCCAAAAGAGCGTGCAGAGATTTCAATGCTTGAAGGAGCGGTTTTGGATATTAGATACGGTGTTTC' +
                'GAGAATTGCATATAGTAAAGACTTTGAAACTCTCAAAGTTGATTTTCTTAGCAAGCTACCTGAAATGCTGAAAATGTTCG' +
                'AAGATCGTTTATGTCATAAAACATATTTAAATGGTGATCATGTAACCCATCCTGACTTCATGTTGTATGACGCTCTTGAT' +
                'GTTGTTTTATACATGGACCCAATGTGCCTGGATGCGTTCCCAAAATTAGTTTGTTTTAAAAAACGTATTGAAGCTATCCC' +
                'ACAAATTGATAAGTACTTGAAATCCAGCAAGTATATAGCATGGCCTTTGCAGGGCTGGCAAGCCACGTTTGGTGGTGGCG' +
                'ACCATCCTCCAAAA'
    };
    if (cust_tag) {
        tags['Custom'] = cust_tag;
        // console.log(tags)
    }

    tag_names = []
    probs = [];
    flexs = [];
    grav = [];

    $.each(tags, function (n, elem) {
        tag_names.push(n);
        if ((n === 'Custom') || (n === 'No tag')) {
            tag_prot = elem
        } else {
            tag_prot = translateSequence(elem)
        }

        fused = tag_prot + seq
        var avgF = Format.to(averageArr(flexibility(fused)));
        var aas = aminoAcidSolubilityIndex(fused);
        var prob = Format.to(logistic(aas));
        var gra = Format.to(avr_gravy(fused));
        probs.push(prob);
        flexs.push(avgF);
        grav.push(gra);
    })
    return [tag_names, probs, flexs, grav]
}

function plotWithTags(seq, cust_tag) {
    data = propertiesWithTags(seq, cust_tag)
    props = ['Probability of solubility', 'Flexibility', 'GRAVY']

    var trace1 = {
        x: data[0],
        y: data[1],
        name: props[0],
        type: 'bar'
    };

    var trace2 = {
        x: data[0],
        y: data[2],
        name: props[1],
        type: 'bar'
    };

    var trace3 = {
        x: data[0],
        y: data[3],
        name: props[2],
        type: 'bar',
        marker: {
            color: 'rgb(55, 83, 109)'
        }
    };

    var data = [trace1, trace2, trace3];

    var layout = {
        title: 'Selected region with or without solubility tags',
        autosize: true,
        barmode: 'group'
    };

    Plotly.newPlot('plotly-chart-tag', data, layout, {scrollZoom: true});

}
