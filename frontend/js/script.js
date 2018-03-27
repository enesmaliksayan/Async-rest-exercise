var dersler;
var dersim = {
    id: "",
    dersKodu: "",
    dersAdi: "",
    dersIcerigi: ""
};
var kodlanmisVeri = "";
var lastType = "";
$(document).ready(function () {

    $('#xmlGetir').click(() => {
        lastType = "XML";
        xmlGetir(dersim.id);
    })

    $('#jsonGetir').click(() => {
        lastType = "JSON";
        jsonGetir(dersim.id);
    })

    function xmlGetir(id) {
        $.ajax({
            type: 'GET',
            url: `http://localhost:3000/getDersXml?id=${id}`,
            success: (data) => {
                console.log(data);
                $('#kodlanmisVeri').show();

                kodlanmisVeri = new XMLSerializer().serializeToString(new window.DOMParser().parseFromString(data, "text/xml"));
                kodlanmisVeri = formatXml(kodlanmisVeri);

                kodlanmisVeri = kodlanmisVeri.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');

                $('#kodlanmisVeriTextArea').html(kodlanmisVeri);
            }
        })
    }

    function jsonGetir(id) {
        $.ajax({
            type: 'GET',
            url: `http://localhost:3000/getDersJson?id=${id}`,
            success: (data) => {
                $('#kodlanmisVeri').show();
                kodlanmisVeri = JSON.stringify(data, null, 2);
                $('#kodlanmisVeriTextArea').val(kodlanmisVeri);
            }
        })
    }


    function getDersler() {
        $('#tbody').empty();
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/',
            async: false,
            success: (data) => {
                dersler = data.dersler;
                dersler.forEach(ders => {
                    if (ders.index % 5 != 3) {
                        $('#tablo tbody').append(
                            `<tr>
                        <td scope="row"> ${ders.index}</td >
                        <td>${ders.dersKodu}</td>
                        <td>${ders.dersAdi}</td>
                        </tr>`
                        );
                    } else {
                        $('#tablo tbody').append(
                            `<tr style="background-color:red" id="dersim">
                        <td scope="row"> ${ders.index}</td >
                        <td>${ders.dersKodu}</td>
                        <td>${ders.dersAdi}</td>
                        </tr>`
                        );

                        dersim.id = ders._id;
                        dersim.dersKodu = ders.dersKodu;
                        dersim.dersAdi = ders.dersAdi;
                        dersim.dersIcerigi = ders.dersIcerigi;
                    }
                });
            }
        })
    }

    getDersler();

    $('#dersim').click(() => {
        getDetay(dersim.id);
    });

    function getDetay(id) {
        $.ajax({
            type: 'GET',
            url: `http://localhost:3000/getDetay?id=${id}`,
            success: (data) => {
                $('#dersinKoduInput').val(data.ders.dersKodu);
                $('#dersinAdiInput').val(data.ders.dersAdi);
                $('#dersinIcerigiInput').val(data.ders.dersIcerigi);
                $('#editDers').show();
            }
        })
    }

    $('#dersinKoduInput').keyup(() => {
        dersim.dersKodu = $('#dersinKoduInput').val();
        dersim.dersAdi = $('#dersinAdiInput').val();
        dersim.dersIcerigi = $('#dersinIcerigiInput').val();

        guncelle();
    })

    $('#dersinAdiInput').keyup(() => {
        dersim.dersKodu = $('#dersinKoduInput').val();
        dersim.dersAdi = $('#dersinAdiInput').val();
        dersim.dersIcerigi = $('#dersinIcerigiInput').val();

        guncelle();
    })

    $('#dersinIcerigiInput').keyup(() => {
        dersim.dersKodu = $('#dersinKoduInput').val();
        dersim.dersAdi = $('#dersinAdiInput').val();
        dersim.dersIcerigi = $('#dersinIcerigiInput').val();

        guncelle();
    })

    function guncelle() {
        $.ajax({
            type: 'POST',
            url: `http://localhost:3000/updateDers`,
            dataType: 'json',
            data: dersim,
            success: (data) => {
                getDersler();
                if (lastType == "XML") xmlGetir(dersim.id);
                else if (lastType == "JSON") jsonGetir(dersim.id);
            }
        })
    }



    // Pretty for XML
    function formatXml(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function (index, node) {
            var indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }







});
