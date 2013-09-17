
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

function Tile(baslik, resim, onStil, arkaStil, buyuk)
{
    this.Baslik = baslik;
    this.Resim = resim;
    this.OnStil = "";
    this.ArkaStil = "";

    if (onStil.contains("#"))
        this.OnStil = 'background-color:' + onStil;
    else
        this.OnStil = 'background-image:url(' + onStil + ')';

    if (arkaStil.contains("#"))
        this.ArkaStil = 'background-color:' + arkaStil;
    else
        this.ArkaStil = 'background-image:url(' + arkaStil + ')';

    this.Buyuk = buyuk;
    this.OnActive = function() {
    };

    this.URL = "";
    this.Anchor = function(url)
    {
        this.URL = url;

        this.OnActive = function()
        {
            Window.location = this.URL;
        };
    };
}

function Metro(yer)
{
    this.Yer = "." + yer;
    this.CalisanVar = false;

    this.Tiles = [];

    this.ColSize = 3;
    this.RowSize = 2;

    this.CurrentColRow = 0;
    this.CurrentRowTile = 0;

    this.RowHeight = (getViewport()[1] - 300) / this.ColSize;

    this.Draw = function()
    {
        this.NewMetro();
        for (i = 0; i < this.Tiles.length; i++) {
            this.DrawNextTile();
        }
        this.DoneDrawing();
    };

    this.Tile = 0;
    this.DrawNextTile = function()
    {
        var CurrentTile = this.Tiles[this.Tile];

        if (CurrentTile.Baslik != "$nextTile")
        {
            if (CurrentTile.Buyuk && this.CurrentRowTile != 0)
            {
                this.NextRow();
                this.CurrentRowTile = this.RowSize;
            }

            $(this.Yer + " .col:last table:last tr:last").append(
                    '<td>' +
                    '<div index="' + this.Tile + '" class="tile' + (CurrentTile.Buyuk ? ' big' : '') + '">' +
                    '<div class="front" style="' + CurrentTile.OnStil + '">' +
                    '<div class="icerik" style="background-image: url(' + CurrentTile.Resim + ')" />' +
                    '<div class="baslik">' + CurrentTile.Baslik + '</div>' +
                    '</div>' +
                    '<div class="back" style="' + CurrentTile.ArkaStil + '"/>' +
                    '</div>' +
                    '</td>');
        }
        this.Tile++;

        this.NextTile();
    };

    this.CheckRow = function()
    {
        if (this.CurrentRowTile >= this.RowSize)
            this.NextRow();
    };

    this.CheckCol = function()
    {
        if (this.CurrentColRow >= this.ColSize)
            this.NextCol();
    };

    this.NextTile = function()
    {
        this.CheckRow();
        this.CurrentRowTile++;
    };

    this.NextRow = function()
    {
        this.CurrentRowTile = 0;
        this.CheckCol();
        $(this.Yer + " .col:last").append('<table border="0" cellpadding="0" cellspacing="0" width="520" class="satirTablo"><tr height="' + this.RowHeight + '"></tr></table><br />');
        this.CurrentColRow++;
    };

    this.NextCol = function()
    {
        $(this.Yer).append("<div class='col'></div>");
        this.CurrentColRow = 0;
        this.CurrentRowTile = 0;
    };

    this.NewMetro = function()
    {
        window.metro = this;
        $(this.Yer).html("");
        this.NextCol();
        this.NextRow();

        window.onresize = function()
        {
            metro.RowHeight = (getViewport()[1] - 300) / metro.ColSize;

            $(".tile").css("height", metro.RowHeight);
            $(".satirTablo tr").css("height", metro.RowHeight);
            $(".icerik").css("height", metro.RowHeight - 40);
        };
    };

    this.DoneDrawing = function()
    {
        $(".icerik").css("height", this.RowHeight - 40);
        $(".mainContainer").wrapInner('<table border="0" cellpadding="30" cellspacing="0" id="tablo"><tr>');
        $(".col").wrap("<td>");

        $(".tile").click(function() {
            if (!this.CalisanVar)
            {
                $(this).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    metro.Tiles[$(this).attr("index")].OnActive();
                });
                $(this).children(".back").css("background-image", "url('" + metro.Tiles[$(this).attr("index")].Resim + "')");
                $(this).addClass("flip");
                $(this).transition({x: -$(this).position().left + window.scrollX, y: -$(this).position().top + window.scrollY, width: getViewport()[0], height: getViewport()[1] + 150, duration: 800});
                this.CalisanVar = true;
            }
            else
            {
                //$(this).removeClass("flip");
                //appOpen = false;
            }
        });
        window.onresize();
    };
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