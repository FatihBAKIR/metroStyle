$(document).ready(function() {
    $("body").mousewheel(function(event, delta) {
        if (appOpen)
            return;
        this.scrollLeft -= (delta * 30);
        event.preventDefault();
    });
});
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

var appOpen = false;
var rowPerCol = 3;

var rowNow = 0;
var colNow = 2;

function AddTile(baslik, url, isBig, color, loadingColor, iconUrl)
{
    if (color == null)
        color = get_random_color();
    if (loadingColor == null)
        loadingColor = color;
    if (iconUrl == null)
        iconUrl = "";
    
    if (isBig || colNow >= 2) //Eğer yeni eklenecek karo büyükse, yada tablomuzda yer kalmadıysa yeni bir tablo oluşturuyoruz
    {
        $(".mainContainer .col:last").append('<table border="0" cellpadding="0" cellspacing="0" width="520" class="satirTablo"></table><br /><br />');
        $(".mainContainer .col:last table:last").append('<tr></tr>');
        colNow = 0;
        rowNow++;
    }

    var onStilString;
    var arkaStilString;
    if (color.contains("#"))
        onStilString = 'background-color:' + color;
    else
        onStilString = 'background-image:url(' + color + ')';

    if (loadingColor.contains("#"))
        arkaStilString = 'background-color:' + loadingColor;
    else
        arkaStilString = 'background-image:url(' + loadingColor + ')';

    $(".mainContainer .col:last table:last tr:last").append(
            '<td><div class="tile ' + (isBig ? 'big' : '') + '" link="' + url + '" icon="' + iconUrl + '">' +
            '<div class="front" style="' + onStilString + '">' +
            '<div class="icerik" style="background-image: url(' + iconUrl + ');" />' +
            '<div class="baslik">' + baslik + '</div>' +
            '</div>' +
            '<div class="back" style="' + arkaStilString + '" /></div></td>');
    colNow++;

    if (isBig)
        colNow++;

    if (rowNow >= rowPerCol && colNow >= 2) //Şu anki tablo sayımızı satır başı tablo sayımızla karşılaştırıyoruz
    {
        MetroNextCol();
    }
}

function MetroNextCol()
{
    $(".mainContainer").append("<div class='col'></div>"); // Her satır başı tablo sayısı için, bir tane col sınıfında div oluşturuyoruz
    rowNow = 0; //Şu anki tablo sayımızı sıfırlıyoruz
    colNow = 2;
}

function MetroNextRow()
{
    $(".mainContainer .col:last").append('<table border="0" cellpadding="0" cellspacing="0" width="520" class="satirTablo"></table><br /><br />');
    $(".mainContainer .col:last table:last").append('<tr></tr>');
    colNow = 2;
    rowNow++;
    if (rowNow >= rowPerCol) //Şu anki tablo sayımızı satır başı tablo sayımızla karşılaştırıyoruz
    {
        MetroNextCol();
    }
}

function MetroNextTile()
{
    colNow++;
}

function MetroInit()
{
    $(".mainContainer").html('<div class="col"></div>');
}

function MetroDone()
{
    $(".mainContainer").wrapInner('<table border="0" cellpadding="30" cellspacing="0" id="tablo"><tr>');
    $(".col").wrap("<td>");

    $(".tile").click(function() {
        if (!appOpen)
        {
            $(this).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                document.location = $(this).attr("link");
            });
            $(this).children(".back").css("background-image", "url('" + $(this).attr("icon") + "')")
            $(this).addClass("flip");
            $(this).transition({x: -$(this).position().left + window.scrollX, y: -$(this).position().top + window.scrollY, width: getViewport()[0], height: getViewport()[1] + 128, duration: 800});
            appOpen = true;
        }
        else
        {
            //$(this).removeClass("flip");
            //appOpen = false;
        }
    });

    duzelt();
}

function duzelt()
{
    $(".tile").css("height", (getViewport()[1] - 300) / rowPerCol);
    
    $(".satirTablo").css("height", (getViewport()[1] - 300) / rowPerCol);
    $(".icerik").css("height", (getViewport()[1] - 300) / rowPerCol - 40);
    $(".mainContainer").css("height", getViewport()[1]);
}

window.onresize = duzelt;

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function getViewport() {

    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth;
        viewPortHeight = window.innerHeight;
    }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
            && typeof document.documentElement.clientWidth != 'undefined'
            && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth;
        viewPortHeight = document.documentElement.clientHeight;
    }

    // older versions of IE
    else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return [viewPortWidth, viewPortHeight];
}