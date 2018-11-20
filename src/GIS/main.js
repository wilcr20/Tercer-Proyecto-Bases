var ws = new Object();
var widthSVG=0;
var heightSVG=0;

ws.xmin=0.0;
ws.ymin=0.0;
ws.xmax=0.0;
ws.ymax=0.0;
ws.width=0.0;
ws.height=0.0;
ws.factorP=0.0;

ws.capas=new Array();

function actualizar_limites()
{
    for (var i in ws.capas)
    {
        for (var j in ws.capas[i].figuras.geometria)
        {
                if ((ws.xmin==0.0) || (ws.xmin>ws.capas[i].figuras.geometria[j].xmin))
                    ws.xmin=parseFloat(ws.capas[i].figuras.geometria[j].xmin);
                if ((ws.ymin==0.0) || (ws.ymin>ws.capas[i].figuras.geometria[j].ymin))
                    ws.ymin=parseFloat(ws.capas[i].figuras.geometria[j].ymin);
                    if ((ws.xmax==0.0) || (ws.xmax<ws.capas[i].figuras.geometria[j].xmax))
                    ws.xmax=parseFloat(ws.capas[i].figuras.geometria[j].xmax);
                if ((ws.ymax==0.0) || (ws.ymax<ws.capas[i].figuras.geometria[j].ymax))
                    ws.ymax=parseFloat(ws.capas[i].figuras.geometria[j].ymax);
        }
    }
    ws.width=ws.xmax-ws.xmin;
    ws.height=ws.ymax-ws.ymin;
    ws.factorP=0.0;    
    var misvg=document.getElementById('misvg');
    misvg.setAttribute('viewBox',ws.xmin+' '+ws.ymin+' '+ws.width+' '+ws.height);
}

function dibujarPoligonos()
{
    actualizar_limites();

    var misvg=document.getElementById('misvg');

    for (var i in ws.capas)
    {
        for (var j in ws.capas[i].figuras.geometria)
        {
            var n_poly=document.createElementNS("http://www.w3.org/2000/svg",'polygon');
            n_poly.setAttribute('style','fill:'+ws.capas[i].color+';stroke:gray;stroke-width:1');
            n_poly.setAttribute('opacity',ws.capas[i].transparencia);

            var geom = ws.capas[i].figuras.geometria[j].geom;
            var ymax = parseFloat(ws.capas[i].figuras.geometria[j].ymax);
            var ymin = parseFloat(ws.capas[i].figuras.geometria[j].ymin);
            var CRTM05coords=geom.coordinates[0][0];
            var coords="";
            for (var k in CRTM05coords)
            {
                var coord=CRTM05coords[k];
                coords+=coord[0]+','+(((ws.ymax)-coord[1])+ws.ymin)+' ';
            }
            n_poly.setAttribute('points',coords);
            misvg.appendChild(n_poly);
            ws.capas[i].figuras.geometria[j].poligono=n_poly;
        }    
    }
    
}

function cargarCapa()
{
    var n_capa = new Object();
    n_capa.host=document.getElementById('input_host').value;
    n_capa.port=document.getElementById('input_port').value;
    n_capa.dbname=document.getElementById('input_dbname').value;
    n_capa.user=document.getElementById('input_user').value;
    n_capa.password=document.getElementById('input_password').value;
    n_capa.geotabla=document.getElementById('input_tablename').value;
    n_capa.schema=document.getElementById('input_schema').value;
    n_capa.color=document.getElementById('input_color').value;
    n_capa.transparencia=parseInt(document.getElementById('input_opacity').value)/100;
    n_capa.figuras="";
    n_capa.visible=true;
    n_capa.actualizarFiguras=function()
    {
        actualizarFiguras(this);
    };
    ws.capas.push(n_capa)
    actualizarFiguras(n_capa);
}

function actualizarFiguras(capa)
{
    var req = new XMLHttpRequest();

    url="capas.php?";
    url+="host="+capa.host+"&";
    url+="port="+capa.port+"&";
    url+="dbname="+capa.dbname+"&";
    url+="user="+capa.user+"&";
    url+="password="+capa.password+"&";
    url+="geotabla="+capa.geotabla+"&";
    url+="schema="+capa.schema;
console.log(url);
    req.open('GET', url, true);
    req.onreadystatechange = function (aEvt) 
    {
        if (req.readyState == 4) 
        {
            if(req.status == 200)
            {
                capa.figuras=(eval('({"geometria":'+req.responseText+'})'));
                for (var i in capa.figuras.geometria)
                {
                    capa.figuras.geometria[i].geom=eval('('+capa.figuras.geometria[i].geom+')');
                } 
                dibujarPoligonos();
            }
        }
    };
    req.send(null);
}

function limparGeometrias()
{
    for (var i in ws.capas)
        ws.capas[i].figuras="";
}

function actualizarGeometrias()
{
    for (var i in ws.capas)
        ws.capas[i].actualizarFiguras();
}

function init()
{
    widthSVG=document.getElementById('misvg').width.baseVal.value;
    heightSVG=document.getElementById('misvg').height.baseVal.value;
    //cargarCapa();
}

//eliminar poligonos dentro del SVG
function limpiarPoligonos()
{

}