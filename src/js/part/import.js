$(document).ready(function() {

	var apiKey = {
		key : '5543661',
		verificationCode : 'rZe4wGBKFl47jyIcrCVFmb9nSAK9Gur13yB9kYpITs5hyw1QMYfQDONlLJqX8tHT'
	};

	var url = 'https://api.eveonline.com';
	var apiType = '/corp/StarbaseList.xml.aspx?';
    var apiPosType = '/corp/StarbaseDetail.xml.aspx?';
	var xml;

	var getApi = url+apiType+'keyID='+apiKey.key+'&vCode='+apiKey.verificationCode;

	var jsonObj = {};

	var posState = [
		'Unanchored',
		'Anchored / Offline',
		'Onlining',
		'Reinforced',
		'Online'
	]


    var getThisSystem = function(thisSystemId, number) {
        systemUrl = 'https://www.fuzzwork.co.uk/api/mapdata.php?solarsystemid='+thisSystemId+'&format=xml';
        var thisSystem;
        $.ajax({
             type: "GET",
             url: systemUrl,
             dataType: "xml",
             success: function(system) {
                var x2js = new X2JS();

                var jsonObj = x2js.xml2json(system);

                thisSystem = jsonObj.eveapi.row[0].solarsystemname;
            },
            complete: function() {
                $('#content').find('tr').eq(number+1).find('td').eq(1).text(thisSystem);
            }
        });
    }

    var getThisType = function(thisTypeId, number) {
        typeUrl = 'https://www.fuzzwork.co.uk/api/typeid.php?typeid='+thisTypeId+'&format=xml';
        var thisType;
        $.ajax({
             type: "GET",
             url: typeUrl,
             dataType: "xml",
             success: function(type) {
                var x2js = new X2JS();
                var jsonObj = x2js.xml2json(type);
                thisType = jsonObj.eveapi.result.rowset.row._typeName;
            },
            complete: function() {
                $('#content').find('tr').eq(number+1).find('td').eq(0).text(thisType);
            }
        });
    }

    var getThisMoon = function(thisMoonId, number) {
        var thisMoon = thisMoonId;
        $.ajax({
            type: "POST",
            data: {'moon': thisMoon},
            url: 'ajax/moon.php',
            success: function(date) {
                //
                $('#content').find('tr').eq(number+1).find('td').eq(2).text(date);
            },
            complete: function(date) {
            }
        });
    }

    $.ajax({
        type: "GET",
        url: getApi,
        dataType: "xml",
        success: function(xmlDoc) {
            var x2js = new X2JS({
                attributePrefix : 'pos__'
            });

            var jsonObj = x2js.xml2json(xmlDoc);

            rows = jsonObj.eveapi.result.rowset.row;

            for (var i = rows.length - 1; i >= 0; i--) {
                thisPosState = posState[rows[i].pos__state];

                var thisSystemId = rows[i].pos__locationID;
                var thisTypeId = rows[i].pos__typeID;
                var thisMoonId = rows[i].pos__moonID;

                getThisSystem(thisSystemId, i);
                getThisType(thisTypeId, i);
                getThisMoon(thisMoonId, i);

      			$('#content').append('<tr><td>Загрузка</td><td>'+'Загрузка'+'</td><td>'+rows[i].pos__moonID+'</td><td>'+thisPosState+'</td><td><a class="show-more" href="#" data-pos="'+rows[i].pos__itemID+'">Открыть</a></td></tr>');
      		}
        }
    });

    $(document).on('click', '.show-more', function() {
        var thisPosId = $(this).data('pos');
        var getPosApi = url+apiPosType+'keyID='+apiKey.key+'&vCode='+apiKey.verificationCode+'&itemID='+thisPosId;
        console.log();
        $.ajax({
            type: "GET",
            url: getPosApi,
            dataType: "xml",
            success: function(xmlDoc) {
                var x2js = new X2JS({
                    attributePrefix : 'pos__'
                });

                var jsonObj = x2js.xml2json(xmlDoc);
                console.log(jsonObj);
                rows = jsonObj.eveapi.result.rowset.row;

                
            },
            complete: function(date) {

            }
        });
    });





});