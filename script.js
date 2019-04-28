function ActivarAlarma() {
    if (confirm("Confirme que desea activr la Alarma Vecinal, Recuerde que todo abuso sera sancionado.")) {
        ActivarAlarma_();
    }
}


function ActivarAlarma_() {
    var alarmaVoz = document.getElementById("alarma-v");
    var alarma = document.getElementById("alarma-s");
    alarmaVoz.setAttribute("src", urlNotas);
    alarma.setAttribute("src", "audios/alerta3.mp3");
    alarmaVoz.play();
    alarma.play();
    alarma.volume = 0.5;
    document.getElementById("alarma").style.display = "block";
}

function DesactivarAlarma() {
    document.getElementById("alarma").style.display = "none";
    document.getElementById("alarma-v").pause();
}

function MostrarOpcionesHabilitadas(evitarToggle) {
            var funcionesEnPantalla = { btns: [], claves: [] };
            var botones = document.getElementsByTagName("button");
            var j = 0;
            for (var i = 0; i < botones.length;i++){
                if (botones[i].getAttribute("clave_funcion")){
                    funcionesEnPantalla.claves[j] = botones[i].getAttribute("clave_funcion");
                    funcionesEnPantalla.btns[j++] = botones[i];
                }
            }
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerFuncionesHabilitadas&seccion=seguridad&funciones=' + funcionesEnPantalla.claves.join(","), function (xmlDoc) {
                var funcionesRecibidas = xmlDoc.getElementsByTagName("Table");
                for (var n = 0; n<funcionesRecibidas.length;n++){
                    for (var k = 0; k < funcionesEnPantalla.btns.length; k++){
                        if (funcionesEnPantalla.btns[k].getAttribute("clave_funcion") == GetValor(funcionesRecibidas[n], "clave_funcion")) {
                            try { document.getElementById(funcionesEnPantalla.btns[k].getAttribute("control")).style.display = "block"; } catch (e){ }
                        }
                    }
                }
                if (!evitarToggle) {
                    ToogleOpcionesUsuario('opciones-usuario');
                }
                document.getElementById("mostrar-opciones").style.display = "none";
                document.getElementById("ocultar-opciones").style.display = "block";
            });
        }

        function OcultarOpciones() {
            var funcionesEnPantalla = { btns: [], claves: [] };
            var botones = document.getElementsByTagName("button");
            var j = 0;
            for (var i = 0; i < botones.length; i++) {
                if (botones[i].getAttribute("clave_funcion")) {
                    funcionesEnPantalla.claves[j] = botones[i].getAttribute("clave_funcion");
                    funcionesEnPantalla.btns[j++] = botones[i];
                }
            }
            for (var k = 0; k < funcionesEnPantalla.btns.length; k++) {
                try {
                    document.getElementById(funcionesEnPantalla.btns[k].getAttribute("control")).style.display = "none";
                }catch(e){}
            }
            ToogleOpcionesUsuario('opciones-usuario');
            document.getElementById("mostrar-opciones").style.display = "block";
            document.getElementById("ocultar-opciones").style.display = "none";
        }

        function ToogleOpcionesUsuario(obj) {
            obj = document.getElementById(obj);
            if (obj.style.display == "none") {
                obj.style.display = "block";
            } else {
                obj.style.display = "none";
            }
        }


        function GetValor(domXML, tag) {
            if (typeof domXML == "string") {
                var domXML2 = document.createElement("xml");
                domXML2.innerHTML = domXML;
                domXML = domXML2;
            }
            var valor = "";
            try { valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue; } catch (e) { }
            return valor;
        }

        function Mostrar(p1, p2, catalogo, clave) {
            document.getElementById(p1).style.display = "none";
            document.getElementById(p2).style.display = "block";
            if (catalogo) {
                //PonerEspera(boton, catalogo);
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
                    //QuitarEspera();
                    PintarItem(catalogo, clave, xmlDoc);
                });
            }
        }

function ContinuarPagando() {
    window.open(url + 'logic/controlador.aspx?op=PresentarPagador', "_blank","location=yes");
}

        function PintarItem(catalogo, clave, xmlDoc0){
            var cont = "", imgsTexto;
            var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
            switch (catalogo) {
                case "inmuebles":
                    $("#calendario-ev-inm").datepicker();
                    document.getElementById("tgrupo-regen_" + catalogo).value = GetValor(xmlDoc, "titulo");
                    document.getElementById("in-regen_" + catalogo).value = GetValor(xmlDoc, "indice");
                    break;
                case "tiposgastos":
                case "egrepro":
                    var control = IAgregarComprobante('c-e-regen_' + catalogo);
                    document.getElementById("tgrupo-regen_" + catalogo).value = GetValor(xmlDoc,"titulo");
                    document.getElementById("in-regen_" + catalogo).value = GetValor(xmlDoc, "indice");
                    //ObtenerPagosClasificacion
                    break;
                case "comunicados":
                    var pantalla = document.getElementById("detalle-" + catalogo);
                    pantalla.setAttribute("clave", clave);
                    cont =
                        '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(xmlDoc, "nombre") + ' (' + GetValor(xmlDoc, "cargo") + ')</span>' +
                        '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                        '<span class="t-4">' + GetValor(xmlDoc, "mensaje") + '</span>';
                    cont += PintarImagenesTexto(xmlDoc0);
                    document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
                    ; break;
                case "solicitudes":
                    var pantalla = document.getElementById("detalle-" + catalogo);
                    pantalla.setAttribute("clave", clave);
                    cont =                    
                        '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(xmlDoc, "nombre") + ' (' + GetValor(xmlDoc, "cargo") + ')</span>' +
                        '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                        '<span class="t-4">' + GetValor(xmlDoc, "descripcion") + '</span>';
                    cont += PintarImagenesTexto(xmlDoc0, true);
                    document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
                    var contenedor = document.getElementById("wrap-detalle-solicitudes");
                    var control=IAgregarImagenTexto(contenedor, 1, true,true);
                    var btn = document.createElement("div");                    
                    btn.className = "agregar";
                    btn.innerHTML = "<button>Responder</button>";
                    contenedor.appendChild(btn);
                    btn.clave = clave;
                    btn.onclick = function () {
                        var clave = this.clave;
                        var contenedor = document.getElementById("wrap-detalle-solicitudes");
                        PonerEspera(this, 'solicitudes');
                        GuardarUnTexto(contenedor.getElementsByTagName("table"), 0, function () {
                            Mostrar('detalle-solicitudes', 'detalle-solicitudes', 'solicitudes', clave);
                        }, clave, 'solicitudes');
                    }
                    ; break;
                case "prodserv":
                    var pantalla = document.getElementById("detalle-" + catalogo);
                    pantalla.setAttribute("clave", clave);
                    var btn = document.getElementById("activar-negocio");
                    btn.checked = (GetValor(xmlDoc, "activo")=="true");
                    btn.value = clave;
                    cont =                        
                        '<span class="t-1">' + GetValor(xmlDoc, "NombreNegocio") + '</span>' +
                        '<span class="t-2">Teléfono(s)' + GetValor(xmlDoc, "telefonos") + '</span>' +
                        '<span class="t-3">Horario: ' + GetValor(xmlDoc, "horario") + '</span>' +
                        '<span class="t-4">' + GetValor(xmlDoc, "mensaje") + '</span>';
                    cont += PintarImagenesTexto(xmlDoc0);
                    document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
                    ; break;                
                case "notificaciones": ; break;
            }
        }

        function PintarImagenesTexto(xmlDoc0, crearApartados) {
            var persona_i, persona_ii;
            if (crearApartados) {
                persona_i = GetValor(xmlDoc0, "persona");
            }
            imgsTexto = xmlDoc0.getElementsByTagName("Table1");
            var cont = "";
            for (var j = 0; j < imgsTexto.length; j++) {
                if (crearApartados) {
                    persona_ii = GetValor(imgsTexto[j], "persona");
                    if (persona_i != persona_ii ) {
                        cont += "<div class='firma-hist'><span>" + GetValor(xmlDoc0, "nombre") + ", </span><span>" + GetValor(imgsTexto[j], "fecha") + "</span></div>";
                        cont += "<hr style='border:5px solid #ccc;clear:both;width:60%;'/>";
                    }
                }
                cont += (GetValor(imgsTexto[j], "path")?'<img class="file" src="' + url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random() + '" />':"") +
                    '<p>' + GetValor(imgsTexto[j], "descripcion") + '</p>';                
                if (crearApartados) {
                    if (j == imgsTexto.length - 1) {
                        cont += "<div class='firma-hist'><span>" + GetValor(imgsTexto[j], "nombre") + ", </span><span>" + GetValor(imgsTexto[j], "fecha") + "</span></div>";
                        cont += "<hr style='border:5px solid #ccc;clear:both;width:60%;'/>";
                    }
                    persona_ii = persona_i;
                }
            }
            return cont;
        }


        function LlenarSelect(url, idSelect, leyenda, clave, descripcion, callback, parametros, defaults) {
            var selectUI;
            if (idSelect) {
                selectUI = document.getElementById(idSelect);
            } else {
                selectUI = document.createElement("select");
            }
            selectUI.innerHTML = "";
            var optionitem;
            if (leyenda != null) {
                optionitem = document.createElement("option");
                optionitem.innerHTML = leyenda;
                optionitem.value = (defaults ? defaults : "");
                optionitem.setAttribute("value", (defaults ? defaults : ""));
                selectUI.appendChild(optionitem);
            }
            $.post(url).done(function (xmlDoc) {
                var dbItem = xmlDoc.getElementsByTagName("Table");
                for (var i = 0; i < dbItem.length; i++) {
                    optionitem = document.createElement("option");
                    optionitem.innerHTML = GetValor(dbItem[i], descripcion);
                    optionitem.title = GetValor(dbItem[i], descripcion);
                    optionitem.value = GetValor(dbItem[i], clave);
                    optionitem.nodoXML = dbItem[i];
                    if (parametros) {
                        for (var j = 0; j < parametros.length; j++) {
                            optionitem[parametros[j]] = GetValor(dbItem[i], parametros[j]);
                        }
                    }
                    selectUI.appendChild(optionitem);
                }
                if (callback != undefined) {
                    callback(selectUI);
                }
            });
        }

        function ActivarNegocio(objeto) {
            $.post(url + 'logic/controlador.aspx' + '?op=Activar&seccion=prodserv' + '&claveItem=' + objeto.value + "&activar=" + objeto.checked, function (xmlDoc) {
                var btn = document.getElementById("activar-negocio");
                btn.checked = (GetValor(xmlDoc, "activo") == "true");
            });
        }

        function PintarItemEditar(catalogo, clave, xmlDoc0) {
            var cont = "", imgsTexto;
            var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
            var frm = document.getElementById("frm-edit-" + catalogo);
            switch (catalogo) {
                case "egrepro":
                    document.getElementById("clave-" + catalogo).value = clave;
                    CargarDatosFrmMap(xmlDoc, { indice: 'clave-egrepro', titulo: 'egrepro-titulo', proyecto: 's-egre-propro' });
                    break;
                case "inmuebles":
                case "tiposgastos":
                    document.getElementById("clave-" + catalogo).value = clave;
                    CargarDatosFrmMap(xmlDoc, { indice: 'clave-tiposgastos', titulo:'tg-titulo',descripcion:'tg-descripcion'});
                    break;
                case "comunicados":
                case "solicitudes":
                case "prodserv":
                    document.getElementById("clave-" + catalogo).value = clave;
                    frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "descripcion");  
                    if (catalogo == "prodserv") {
                        frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "NombreNegocio");
                        document.getElementById("prodserv-telefonos").value = GetValor(xmlDoc, "telefonos");
                        document.getElementById("prodserv-horario").value = GetValor(xmlDoc, "horario");
                        document.getElementById("prodserv-palabrasclave").value = GetValor(xmlDoc, "palabrasclave");
                    } else if (catalogo == "comunicados"){
                        frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
                    }else if (catalogo == "solicitudes") {
                        frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
                        SetValor(xmlDoc, "tipoSolicitud",'s-tipossolicitudatencion');
                    }
                    imgsTexto = xmlDoc0.getElementsByTagName("Table1");
                    var imagenesTextos = document.getElementById("c-e-" + catalogo);
                    imagenesTextos.innerHTML = "";
                    var unImagentexto;
                    for (var j = 0; j < imgsTexto.length; j++) {
                        unImagentexto = IAgregarImagenTexto(imagenesTextos);
                        unImagentexto.setAttribute("indice", GetValor(imgsTexto[j], "indice"));
                        unImagentexto.setAttribute("catalogo", catalogo);
                        unImagentexto.setAttribute("claveItem", clave);
                        unImagentexto.imagen.setAttribute("sel",1);
                        unImagentexto.imagen.src = url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random();
                        unImagentexto.texto.value=src = GetValor(imgsTexto[j], "descripcion");                       
                    }
                    ; break;
                case "directorio":
                    frm.getElementsByTagName("input")[2].value = GetValor(xmlDoc, "nombre");
                    frm.getElementsByTagName("input")[3].value = GetValor(xmlDoc, "telefono1");
                    frm.getElementsByTagName("input")[4].value = GetValor(xmlDoc, "telefono2");
                    frm.getElementsByTagName("input")[5].value = GetValor(xmlDoc, "telefono3");                    
                    ; break;
                case "encuestas":
                    CargarDatosFrmPref(xmlDoc, ['clave', 'pregunta'], 'enc-');
                    textos = xmlDoc0.getElementsByTagName("Table1");
                    var domtextos = document.getElementById("c-e-" + catalogo);
                    domtextos.innerHTML = "";
                    var unTexto;
                    for (var j = 0; j < textos.length; j++) {
                        unTexto = IAgregarImagenTexto(domtextos, 1);
                        unTexto.setAttribute("cambioTexto","true");
                        unTexto.setAttribute("indice", GetValor(textos[j], "clave"));
                        unTexto.setAttribute("catalogo", catalogo);
                        unTexto.setAttribute("claveItem", clave);
                        unTexto.texto.value = src = GetValor(textos[j], "respuesta");
                    }
                    ; break;
                case "notificaciones": ; break;
            }
        }


        function CargarDatosFrmMap(xmlDoc, tags) {    //Los tag name del xml se buscan en el formulario por id, si coinciden se carga el dato.
            for (var tag in tags) {
                try { SetValor(xmlDoc, tag, tags[tag]); } catch (e) { }
            }
        }

        function CargarDatosFrmPref(xmlDoc, tags,pref) {    //Los tag name del xml se buscan en el formulario por id, si coinciden se carga el dato.
            for (var i = 0; i < tags.length; i++){
                try { SetValor(xmlDoc, tags[i], pref + tags[i]); } catch (e) {}
            }
        }

        function CargarDatosFrm(item, reemplazos, permitidos, pref) {    //Los tag name del xml se buscan en el formulario por id, si coinciden se carga el dato.
            var campos = $(item).children();
            for (var i = 0; i < campos.length; i++) {
                if (permitidos && $.inArray(campos[i].tagName, permitidos) || !permitidos) {
                    if (reemplazos && reemplazos[campos[i].tagName]) {
                        try { SetValor(item, campos[i].tagName, pref + reemplazos[campos[i].tagName]); } catch (e) { }
                    } else {
                        try { SetValor(item, campos[i].tagName, pref + campos[i].tagName); } catch (e) { }
                    }
                }
            }
        }


        function SetValorDx(domElemento, valor) {
            if (typeof domElemento == "string") {
                domElemento = document.getElementById(domElemento);
            }
            SetValor(undefined, undefined, undefined, undefined, undefined, domElemento, valor);
        }

        function SetValor(domXML, tag, idDomElemento, tipo, alias, _domElemento, _valor, callback) {
            _valor = $.trim(_valor);
            //Se obtiene el valor
            var valor = "";
            var domElemento = idDomElemento ? document.getElementById(idDomElemento) : _domElemento;

            if (domXML) {
                try { valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue; } catch (e) { }
            } else {
                valor = _valor;
            }
            if (tipo == "bool") {
                valor = valor.toString();
            }
            else if (tipo === "date") {
                var meses = [
                    "Ene", "Feb", "Mar",
                    "Abr", "May", "Jun", "Jul",
                    "Ago", "Sep", "Oct",
                    "Nov", "Dic"
                ];

                var data = valor.split("/");
                var fechas = new Date(data[2], data[1], data[0]);
                valor = fechas.getDate() + '/' + meses[fechas.getMonth() - 1] + '/' + fechas.getFullYear();
            }
            if (alias) {
                valor = valor == "true" ? alias.split(":")[0] : alias.split(":")[1];
            }
            //Se asigna el valor
            if (domElemento.tagName == "INPUT" || domElemento.tagName == "TEXTAREA") {
                if (domElemento.getAttribute("type") && domElemento.getAttribute("type").toLowerCase() == "checkbox") {
                    domElemento.checked = ((valor == "1") || (valor.toString() == "true"));
                } else {
                    domElemento.value = valor;
                }
            } else if (domElemento.tagName == "SELECT") {
                var opciones = domElemento.options;
                for (var i = 0; i < opciones.length; i++) {
                    if (opciones[i].value.toString() == valor.toString()) {
                        domElemento.selectedIndex = i;
                        if (callback) {
                            callback(opciones[i]);
                        }
                    }
                }
            } else {
                domElemento.innerHTML = valor;
            }
            return valor;
        }

        function IniciarEditar(esNuevo, catalogo, solotexto, intercambio, clave) {
            window.event.stopPropagation();
            if (esNuevo) {
                document.getElementById('op-' + catalogo).value="true";
                if (solotexto != 2 || solotexto==undefined || solotexto==null) {
                    document.getElementById("c-e-" + catalogo).innerHTML = "";
                    IAgregarImagenTexto('c-e-' + catalogo, solotexto);
                }                
                if (intercambio) {
                    Mostrar(intercambio.a, intercambio.b);
                    document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar(intercambio.b, intercambio.a); }
                }else{
                    Mostrar('lista-' + catalogo, 'p-edicion-' + catalogo);
                    document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar('p-edicion-' + catalogo, 'lista-' + catalogo); }
                }
            } else {
                document.getElementById('op-' + catalogo).value = "false";                
                if (intercambio) {
                    Mostrar(intercambio.a, intercambio.b);
                    document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar(intercambio.b, intercambio.a); }
                } else {
                    clave = document.getElementById("detalle-" + catalogo).getAttribute("clave");
                    Mostrar('detalle-' + catalogo, 'p-edicion-' + catalogo);
                    document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar('p-edicion-' + catalogo, 'detalle-' + catalogo); }
                }
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
                    //QuitarEspera();
                    PintarItemEditar(catalogo, clave, xmlDoc);
                });
            }            
        }

        function GuardarDirectorio(boton) {
            var datos = $("#frm-edit-directorio").serializeArray();
            PonerEspera(boton, 'directorio');
            $.post(url + 'logic/controlador.aspx' + '?op=Guardar&seccion=' + catalogo, datos, function (xmlDoc) {
                QuitarEspera();
                if (GetValor(xmlDoc, "estatus") == 1) { 
                    CargarCatalogo(catalogo, function () {
                        Mostrar('p-edicion-directorio', 'lista-directorio');                      
                    });                    
                } else {
                    alert(GetValor(xmlDoc, "mensaje"));
                }
            });  
        }


        function IniciarEliminar(objeto,catalogo,clave,intercambio,noImgTxt) {
            if(confirm("Confirme que desea eliminar")){
                if (!clave) {
                    clave = document.getElementById("detalle-" + catalogo).getAttribute("clave");
                }
                $.post(url + 'logic/controlador.aspx?op=' + (noImgTxt?'Eliminar':'EliminarItem') + '&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
                    if (GetValor(xmlDoc, "estatus") == 1) {
                        if (intercambio) {
                            Mostrar(intercambio.a, intercambio.b);
                        } else {
                            Mostrar('detalle-' + catalogo, 'lista-' + catalogo);
                        }                        
                        CargarCatalogo(catalogo, function () {
                            MostrarOpcionesHabilitadas(true);
                        });
                    } else {
                        alert(GetValor(xmlDoc,"mensaje"));
                    }
                });
            }
        }

        function IniciarEditarDirectorio(esNuevo, indice) {
            document.getElementById("frm-edit-directorio").reset();
            Mostrar('lista-directorio', 'p-edicion-directorio');
            if (esNuevo) {
                document.getElementById('op-directorio').value = "true";
            } else {
                document.getElementById('op-directorio').value = "false";
                document.getElementById('indice-directorio').value = indice;
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=directorio&indice=' + indice, function (xmlDoc) {
                    //QuitarEspera();
                    PintarItemEditar('directorio', indice, xmlDoc);
                });
            }
        }

        
        function IniciarConfigurarNotificaciones() {
            Mostrar('detalle-notificaciones', 'p-edicion-notificaciones');
        }

        function IniciarEditarsolicitudes() {
            Mostrar('detalle-solicitudes', 'p-edicion-solicitudes');
        }

        function IniciarEditarProdserv() {
            if (esNuevo) {
                Mostrar('lista-prodserv', 'p-edicion-prodserv');
                document.getElementById("cancelar-edit-prodserv").onclick = function () { Mostrar('p-edicion-prodserv', 'lista-prodserv'); }
            } else {
                Mostrar('detalle-prodserv', 'p-edicion-prodserv');
                document.getElementById("cancelar-edit-prodserv").onclick = function () { Mostrar('p-edicion-prodserv', 'detalle-prodserv'); }
            }
        }

        function BuscarProdServ(inp) {
            CargarCatalogo("prodserv", function () { Mostrar('buscador-prodserv', 'lista-prodserv'); }, {buscar:inp.value});
        }

        function ValidarEnter(ev) {
            return (ev.which == 13 || ev.keyCode == 13);
        }

        window.onresize = function () {
            //EstablecerDimensiones();
        }

        function IniciarApp() {
            document.getElementById("btn-buscar-ps").onkeypress = function (ev) {
                if (ValidarEnter(ev)) {
                    BuscarProdServ(ev.target);
                }
            }
            EstablecerDimensiones();
            PantallaMostrar("home", "section",true);
            var tabInicioPro = document.getElementById("tab-inicio-pro");
            TabMostrar(tabInicioPro, tabInicioPro.parentNode, 'pro-ejecucion');
            var tabInicioPag = document.getElementById("tab-inicio-pagos");
            TabMostrar(tabInicioPag, tabInicioPag.parentNode, 'tab-pcorriente','tiposgastos');
            LlenarSelect(url + 'logic/controlador.aspx?op=ObtenerClasificacion&seccion=Generico&clave=6' , 's-tipossolicitudatencion', undefined, 'indice', 'descripcion');
            LlenarSelect(url + 'logic/controlador.aspx?op=ObtenerPropuestasProy&seccion=egrepro&', 's-egre-propro', 'Seleccione proyecto', 'clave', 'titulo');
        }

        function EstablecerDimensiones() {
            var style = document.getElementById("css-sizes");
            var styleStr = ".login fieldset{height:" + parseInt(0.7 * window.innerHeight, 10) + "px !important;margin-top:" + parseInt(0.10 * window.innerHeight,10) + "px;}";
            var heightApp = parseInt(window.innerHeight - 40, 10) + 5;
            styleStr += ".pantalla {height:" + heightApp + "px !important;}";
            styleStr += ".menu button img {height:" + (heightApp-100)/8 + "px !important;}";
            styleStr += ".pantalla-2 {height:" + (heightApp - 64) + "px !important;}";
            styleStr += ".pantalla-3 {height:" + (heightApp - 132) + "px !important;}";
            styleStr += ".pantalla-4 {height:" + (heightApp - 27) + "px !important;}";
            styleStr += ".scrollable {height:" + (heightApp - 132) + "px !important;}";
            styleStr += ".scrollable-2 {height:" + (heightApp - 168) + "px !important;}";
            styleStr += ".menu li {height:" + (heightApp - 50)/5 + "px !important;}";

            style.innerHTML = styleStr;
        }

        function SeleccionarConceptoPagar(objeto){
            if (objeto.className=="seleccionado") {
                objeto.removeAttribute("class");
            } else {
                objeto.setAttribute("class","seleccionado");
            }
            CalcularAportacion();
        }

        function CalcularAportacion() {
            var items = document.getElementById("lista-conceptos").getElementsByTagName("li");
            var cuenta = 0;
            for (var i = 0; i < items.length; i++) {
                if (items[i].getElementsByTagName("span").length > 0 && items[i].getElementsByTagName("span")[0].className == "seleccionado") {
                    cuenta += parseFloat(items[i].getElementsByTagName("span")[0].getAttribute("precio"));
                }
            }
            document.getElementById("aportacion").innerHTML = "$ " + cuenta;
        }

        function TabMostrar(tab, raiz, id,catalogo) {
            try { raiz.seleccionado.className="tab"; } catch (e) { }
            raiz.seleccionado = tab;
            raiz.seleccionado.className = "tab tab-sel";
            var tabs = raiz.getAttribute("tabs").split(',');
            for (var i = 0; i < tabs.length; i++) {
                document.getElementById(tabs[i]).style.display = "none";
            }
            document.getElementById(id).style.display = "block";
            if (catalogo){
                CargarCatalogo(catalogo);
            }            
        }

        function PantallaMostrar(catalogo,tagName,no_post){
            var pants = document.getElementsByTagName(tagName);
            if (!no_post) {
                CargarCatalogo(catalogo);
            }
            for (var i = 0; i < pants.length; i++){
                pants[i].style.display = "none";
            }
            document.getElementById(catalogo).style.display = "block";
        }

        function IniciarEditarPlanPro(id) {
            document.getElementById('p-edicion-proyecto').idanterior = id;
            Mostrar(id, 'p-edicion-proyecto');
        }

        function IniciarEditarPagosPro(id) {
            document.getElementById('p-edicion-proyecto-pagos').idanterior = id;
            Mostrar(id, 'p-edicion-proyecto-pagos');
        }

        function IniciarEditarAvancesPro(id) {
            document.getElementById('p-edicion-proyecto-avance').idanterior = id;
            Mostrar(id, 'p-edicion-proyecto-avance');
        }

        function IniciarRegistrarPro() {
            Mostrar('lista-pro','p-edicion-pro');
        }

        function IniciarSesion() {
            IntercambioVisual('main','login');
        }

        function IntercambioVisual(id1,id2){
            document.getElementById(id1).style.display = "block";
            document.getElementById(id2).style.display = "none";
        }

        function CargarCatalogo(catalogo,callback,parametros) {
            $.post(url + 'logic/controlador.aspx' + '?op=cargar&seccion=' + catalogo,parametros, function (xmlDoc) {
                var items = xmlDoc.getElementsByTagName(catalogo == "encuestas" ? "Encuesta" : "Table");
                var lista = document.getElementById("lista-" + catalogo).getElementsByTagName("ul")[0];
                lista.innerHTML = "";
                for (var n = 0; n < items.length; n++) {
                    lista.appendChild(ObtenerItem(catalogo, items[n]));
                }  
                if(callback)
                    callback();
            });
        }

        function ObtenerItem(catalogo, item) {
            var itemli = document.createElement("li");
            itemli.className = "item";
            var html = "";
            switch (catalogo) {
                case "inmuebles":
                case "tiposgastos":
                case "egrepro":
                    var indice = GetValor(item, "indice");
                    itemli.onclick = function () {
                        Mostrar('lista-' + catalogo, 'p-regen_' + catalogo, catalogo, indice);
                    }
                    itemli.innerHTML =
                        '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                    '<button class="edit-btn" clave_funcion="2" control="ed-tg-' + indice + '" id="ed-tg-' + indice + '" style="display:none;"  onclick="IniciarEditar(false, \'' + catalogo + '\', 2, { a: \'lista-' + catalogo + '\', b: \'p-edicion-' + catalogo + '\' },' + indice + ');" ><img  src="img/edit.png" /></button>' +
                    '<button class="edit-btn" clave_funcion="2" control="del-tg-' + indice + '" id="del-tg-' + indice + '" style="display:none;"  onclick="IniciarEliminar(this,\'' + catalogo + '\',' + indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true);" ><img  src="img/del.png" /></button>';
                    break;
                case "comunicados":
                case "solicitudes":
                    itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
                    itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(item, "nombre") + '</span>' +
                        '<span class="t-3">' + GetValor(item, "fecha1") + '</span>'+
                        '<span class="aux-1">' + GetValor(item, "alias") + '</span>';
                    break;
                case "directorio":
                    itemli.setAttribute("nombre",GetValor(item, "nombre"));
                    html = '<span>' + GetValor(item, "nombre") + '</span>' +
                        '<button class="edit-btn" clave_funcion="2" control="ed-2-' + GetValor(item, "indice") + '" id="ed-2-' + GetValor(item, "indice") + '" style="display:none;"  onclick="IniciarEditarDirectorio(false,' + GetValor(item, "indice") + ');" ><img  src="img/edit.png" /></button>' +
                        '<button class="edit-btn" clave_funcion="2" control="del-2-' + GetValor(item, "indice") + '" id="del-2-' + GetValor(item, "indice") + '" style="display:none;"  onclick="IniciarEliminarDirectorio(' + GetValor(item, "indice") + ',this);" ><img  src="img/del.png" /></button>'+
                        '<ol>';
                     for (var k = 1; k < 4; k++) {
                         if (GetValor(item, "telefono" + k)) {
                             html += '<li>' +                                 
                                 '<span>' + GetValor(item, "telefono" + k) + '</span>' +
                                 '<a class="call-btn" href="tel://' + GetValor(item, "telefono" + k) + '"><img src="img/call.png" /></a>' +
                                 '<hr class="clear" />' +
                                 '</li>';
                         }
                    }
                    itemli.innerHTML = html + '</ol>';
                    ; break;
                case "prodserv":
                    itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
                    itemli.innerHTML =
                        '<span class="t-1">' + GetValor(item,"NombreNegocio") + '</span>' +
                    '<span class="t-2">Teléfono(s): ' + GetValor(item, "telefonos") +  '</span>' +
                    '<span class="t-3">Horario: ' + GetValor(item, "horario") + '</span>';                                  
                    break;
                case "encuestas":
                    html =
                        ' <span class="t-1">' + GetValor(item, "pregunta") + '</span>' +
                    '<button class="edit-btn" clave_funcion="2" control="ed-2-' + GetValor(item, "clave") + '" id="ed-2-' + GetValor(item, "clave") + '" style="display:none;"  onclick="IniciarEditar(false, \'encuestas\', 1, { a: \'lista-encuestas\', b: \'p-edicion-encuestas\' },' + GetValor(item, "clave") +');" ><img  src="img/edit.png" /></button>' +
                    '<button class="edit-btn" clave_funcion="2" control="del-2-' + GetValor(item, "clave") + '" id="del-2-' + GetValor(item, "clave") + '" style="display:none;"  onclick="IniciarEliminar(this,\'encuestas\',' + GetValor(item, "clave") + ',{ b: \'lista-encuestas\', a: \'p-edicion-encuestas\' });" ><img  src="img/del.png" /></button>' +
                        '<span class="t-2">' + GetValor(item, "fecha") + '</span>';                        
                    var respuestas = item.getElementsByTagName("Respuesta");
                    if (GetValor(item, "yaVoto") == 1) {
                        html += '<table class="transparente">';
                        for (var i = 0; i < respuestas.length; i++) {
                            html += '<tr ' + (GetValor(respuestas[i], "respondio")==1 ? 'class="votado"' : "") + '><td><div class="graf-barra" onclick="Mostrar(\'lista-encuesta\',\'encuesta-votantes\');"><span class="progreso" style="width:' + GetValor(respuestas[i], "porc") + '%"></span><label><b>' + GetValor(respuestas[i], "porc") + '%</b>' + GetValor(respuestas[i], "respuesta") + '</label></div></td></tr>';
                        }
                        html += '</table>';
                    } else {
                        var encuesta = GetValor(item, "clave");
                        html +=
                            '<div class="separado10 item-enc"  id="tab-resp-' + encuesta +'">' +
                            '<table>';
                        for (var i = 0; i < respuestas.length; i++) {
                            html +=
                                '<tr><td style="width:75%;"><label for="resp-' + GetValor(respuestas[i], "clave") + '">' + GetValor(respuestas[i], "respuesta") + '</label></td><td style="width:25%;"><input type="radio" id="resp-' + GetValor(respuestas[i], "clave") + '" name="enc-' + encuesta + '" onchange="MarcarVoto(this,' + encuesta + ',' + GetValor(respuestas[i], "clave") + ');"/></td></tr>';
                        }
                        html +=
                            '</table>' +
                        '<button class="centrado30" id="btn-votar-enc-' + encuesta + '" onclick="RegistrarVoto(this,' + encuesta  + ')">Votar</button>' +
                            '</div>';                        
                    }
                    itemli.innerHTML = html;
                    ; break;
            }
            return itemli;
        }

        function MarcarVoto(objeto, encuesta, respuesta) {
            document.getElementById("btn-votar-enc-" + encuesta).setAttribute("respuesta",respuesta);
        }

        function RegistrarVoto(objeto, encuesta) {
            if (objeto.getAttribute("respuesta")) {
                $.post(url + 'logic/controlador.aspx' + '?op=RegistrarVoto&seccion=encuestas&encuesta=' + encuesta + "&respuesta=" + objeto.getAttribute("respuesta"), function (xmlDoc) {
                    if (GetValor(xmlDoc, "estatus") == 1) {
                        MostrarConteoEncuesta(encuesta);
                    } else {
                        alert(GetValor(xmlDoc, "mensaje"));
                    }
                });
            } else {
                alert("Seleccione una opción");
            }
        }

        function MostrarConteoEncuesta(encuesta) {
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerConteo&seccion=encuestas&encuesta=' + encuesta, function (xmlDoc) {
                var respuestas = xmlDoc.getElementsByTagName("Table");
                var html = '<table class="transparente">';
                for (var i = 0; i < respuestas.length; i++) {
                    html += '<tr ' + (GetValor(respuestas[i], "respondio")==1?'class="votado"':"") + '><td><div class="graf-barra" onclick="Mostrar(\'lista-encuesta\',\'encuesta-votantes\');"><span class="progreso" style="width:' + GetValor(respuestas[i], "porc") + '%"></span><label><b>' + GetValor(respuestas[i], "porc") + '%</b>' + GetValor(respuestas[i], "respuesta") + '</label></div></td></tr>';
                }
                html += '</table>';
                var tabla=document.getElementById("tab-resp-" + encuesta);    
                tabla.innerHTML = html;                
            });
        }

        function IniciarEliminarDirectorio(indice, boton) {

            if (confirm("Confirme que desea eliminar " + boton.parentNode.getAttribute("nombre"))){
                $.post(url + 'logic/controlador.aspx' + '?op=Eliminar&seccion=directorio&indice=' + indice, function (xmlDoc) {
                    Mostrar('p-edicion-directorio', 'lista-directorio');
                    CargarCatalogo('directorio', function () { });
                });
            }
        }

        function LimpiarForm(catalogo) {
            document.getElementById('frm-edit-' + catalogo).reset();
            var wrap = document.getElementById('c-e-' + catalogo);
            if (wrap) {
                wrap.innerHTML = "";
            }
        }

        function Guardar(boton,catalogo,callback,subitemCatalogo) {
            var datos = $("#frm-edit-" + catalogo).serializeArray();
            PonerEspera(boton,catalogo);
            $.post(url + 'logic/controlador.aspx' + '?op=Guardar&seccion=' + catalogo, datos, function (xmlDoc) {  
                if (GetValor(xmlDoc, "estatus") == 1) {
                    if (document.getElementById("c-e-" + catalogo)){
                    try {
                        var claveItem = GetValor(xmlDoc, "clave");
                        var imagenes = document.getElementById("c-e-" + catalogo).getElementsByTagName("table");
                        var imagenesCambio = [];
                        var textosCambio = [];
                        for (var i = 0; i < imagenes.length; i++){
                            if (imagenes[i].getAttribute("cambioImagen") == "true") {
                                imagenesCambio.push(imagenes[i]);
                            } else if (imagenes[i].getAttribute("cambioTexto") == "true") {
                                textosCambio.push(imagenes[i]);
                            }
                        }
                        if (imagenesCambio.length > 0) {
                            GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback, claveItem, catalogo);
                        } else if (textosCambio.length > 0) {
                            GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, subitemCatalogo);
                        } else {
                            QuitarEspera();
                            if(callback) callback();
                        }                
                    } catch (e) {
                        QuitarEspera();
                        alert(e.message);
                        }
                    } else {
                        QuitarEspera();
                        if (callback) callback();
                    }
                } else {
                    QuitarEspera();
                    alert(GetValor(xmlDoc, "mensaje"));
                }
            });            
        }

        function GuardarComprobante(boton, catalogo, callback, subitemCatalogo) {
            var datos = $("#frm-edit-" + catalogo).serializeArray();
            PonerEspera(boton, catalogo);
            if (document.getElementById("c-e-" + catalogo)) {
                try {
                    var claveItem = document.getElementById("in-" + catalogo).value;
                    var imagenes = document.getElementById("c-e-" + catalogo).getElementsByTagName("table");
                    var imagenesCambio = [];
                    var textosCambio = [];
                    for (var i = 0; i < imagenes.length; i++) {
                        if (imagenes[i].getAttribute("cambioImagen") == "true"){
                            imagenesCambio.push(imagenes[i]);
                        } else if (imagenes[i].getAttribute("cambioTexto") == "true") {
                            textosCambio.push(imagenes[i]);
                        }
                    }
                    if (imagenesCambio.length > 0) {
                        GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback, claveItem, catalogo,true);
                    } else if (textosCambio.length > 0) {
                        GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, subitemCatalogo,true);
                    } else {
                        QuitarEspera();
                        if (callback) callback();
                    }
                } catch (e) {
                    QuitarEspera();
                    alert(e.message);
                }
            } else {
                QuitarEspera();
                if (callback) callback();
            }
        }

        function PonerEspera(elemento,catalogo) {
            var fs = document.getElementById('frm-edit-' + catalogo);
            var img = document.createElement("img");
            img.src = "img/espera.gif";
            elemento.appendChild(img);
            fs.getElementsByTagName("fieldset")[0].setAttribute("disabled", "disabled");
            $(elemento).addClass("espera");
            window.boton = elemento;
            window.catalogo = catalogo;
        }

        function QuitarEspera() {
            var imgs = window.boton.getElementsByTagName("img");
            for (var j = 0; j < imgs.length; j++) {
                if (imgs[j].src = "img/espera.gif") {
                    window.boton.removeChild(imgs[j]);
                }
            }
            var fs = document.getElementById('frm-edit-' + window.catalogo);
            fs.getElementsByTagName("fieldset")[0].removeAttribute("disabled");
            $(window.boton).removeClass("espera");
        }

        function GuardarUnaImagenTexto(imagenes, textosCambio, i, callback, claveItem, catalogo, es_comprobante) {
            var imagen = imagenes[i].getElementsByTagName("img")[(es_comprobante ? 1 : 0)];  
            if (imagen.getAttribute("sel") == 1) {
                var ft = new FileTransfer();
                var options = new FileUploadOptions();
                options.fileKey = "vImage";
                options.fileName = imagen.src.substr(imagen.src.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";

                var datos;
                if (es_comprobante) {
                    var inputs = imagenes[i].getElementsByTagName('input');
                    datos = { concepto: inputs[0].value, importe: inputs[1].value, claveItem: claveItem, catalogo:catalogo };
                } else {
                    datos = { descripcion: imagenes[i].getElementsByTagName('textarea')[0].value, claveItem: claveItem, catalogo: catalogo };
                }
                options.params = datos;
                options.chunkedMode = false;
                var ruta = url + 'logic/controlador.aspx?op=GuardarArchivo&seccion=' + (es_comprobante ? catalogo : 'Generico') + '&' + (imagenes[i].getAttribute("indice") ? "&indice=" + imagenes[i].getAttribute("indice") : "");
                alert(ruta);
                ft.upload(imagen.src, ruta, function (r) {                    
                    imagenes[i].setAttribute("indice", GetValor(r.response, "clave"));
                    i++;
                    if (i < imagenes.length) {
                        try {
                            GuardarUnaImagenTexto(imagenes, textosCambio, i++, callback, claveItem, catalogo,es_comprobante);
                        } catch (e) {
                            alert(e.message);
                            QuitarEspera();
                            alert("Verifique guardado");
                            if (callback) callback();
                        }
                    } else {
                        if (textosCambio.length > 0) {
                            try {
                                GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo,es_comprobante);
                            } catch (e){
                                QuitarEspera();
                                alert(e.message);
                                if (callback) callback();
                            }
                        } else {
                            if (GetValor(r.response, "estatus") == 1) {
                                alert("Guardado correctamente");
                            } else {
                                QuitarEspera();
                                alert(GetValor(r.response, "mensaje"));
                                if (callback) callback();
                            }                            
                        }
                    }
                }, function (error) {
                    alert(error);
                    QuitarEspera();
                    alert("Verifique guardado.");
                }, options);
            } else {
                QuitarEspera();
                alert("Guardado correctamente");
                if (callback) callback();
            }
        }

        function GuardarUnTexto(textosCambio, i, callback, clave, catalogo, subitemCatalogo,es_comprobante) {
            var datos;
            if (es_comprobante) {
                var inputs = textosCambio[i].getElementsByTagName('input');
                datos={ concepto: inputs[0].value, importe:inputs[1].value, indice: textosCambio[i].getAttribute("indice"), clave:clave, catalogo:catalogo };
            } else {
                datos = { descripcion: textosCambio[i].getElementsByTagName('textarea')[0].value, indice: textosCambio[i].getAttribute("indice"), clave: clave, catalogo: catalogo };
            }
            $.post(url + 'logic/controlador.aspx' + '?op=ActualizarDescripcion&seccion=' + (subitemCatalogo ? catalogo : "Generico"), datos, function (xmlDoc) {
                textosCambio[i].setAttribute("indice", GetValor(xmlDoc, "clave"));
                i++;
                if (i < textosCambio.length) {
                    try {
                        GuardarUnTexto(textosCambio, i++, callback, clave, catalogo, subitemCatalogo,es_comprobante);
                    } catch (e) {
                        QuitarEspera();
                        alert(e.message);
                        if (callback) callback();
                   }
                } else {
                    QuitarEspera();
                    alert("Guardado correctamente");
                    if (callback) callback();
                }
            });    
        }


        function IAgregarComprobante(id) {
            var contenedor = (typeof id == "object" ? id : document.getElementById(id));
            var imagenes = contenedor.getElementsByTagName("table");
            if (imagenes.length == 0 || (imagenes.length > 0 && imagenes[imagenes.length - 1].getElementsByTagName("img")[1].getAttribute("sel") == 1) || (imagenes[imagenes.length - 1].getAttribute("cambioTexto") == "true")) {
                var item = document.createElement("table");
                item.className = "lista-files";
                item.innerHTML = '<tbody>' +
                    '<tr><td><button onclick="QuitarEIT(this);" class="del-btn"><img src="img/del.png" /></button></td><td style="width:70%"><input maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"/></td><td style="width:30%"><input onkeypress="return SoloNumeros(window.event,\'.\');" maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"/></td><td><button class="con-btn" onclick="IAdjuntarImagenes(this.getElementsByTagName(\'img\')[0],true);"><img src="img/touch.png" /></button></td><td><button class="con-btn"><img src="img/ok.png" style="width:100%;" /></button></td></tr>' +
//                    '<tr class="resultado"><td></td><td><b>Total</b></td><td><b>$ 4,200.00</b></td><td></td><td></td></tr>' +
                    '</tbody>';
                item.imagen = item.getElementsByTagName("img")[1];
                item.texto = item.getElementsByTagName("input")[0];
                item.texto2 = item.getElementsByTagName("input")[1];                
                contenedor.appendChild(item);
            }
            return item;
        }


        function SoloNumeros(e, ecepciones) {
            var key = window.Event ? e.which : e.keyCode;
            var resultado = ((key >= 48 && key <= 57) || key == 8 || key == 127 || key == 0);
            if (ecepciones) {
                for (var i = 0; i < ecepciones.length; i++) {
                    resultado = (resultado || key === ecepciones[i].charCodeAt(0));
                }
            }
            return resultado;
        }

        function IAgregarImagenTexto(id, solotexto, mas,ocultarBtnElim) {
            var contenedor = (typeof id =="object"? id:document.getElementById(id));
            var imagenes = contenedor.getElementsByTagName("table");
            if (imagenes.length == 0 || (imagenes.length > 0 && imagenes[imagenes.length - 1].getElementsByTagName("img")[0].getAttribute("sel") == 1) || (imagenes[imagenes.length - 1].getAttribute("cambioTexto")=="true")||mas) {                
                var item = document.createElement("table");
                item.className = "lista-files";               
                item.innerHTML = '<tbody>' +
                    '<tr> <td style="width:90%">' + (solotexto ? '' : '<img src="img/upload.png" onclick="IAdjuntarImagenes(this);" />') + '</td> ' + (ocultarBtnElim ? '' : '<td style="width:10%" rowspan="2" class="del"><button onclick="QuitarEIT(this' + (solotexto ? ",1" : '') + ');" class="del-btn"><img src="img/del.png" /></button>') + '</td></tr >' +
                    '<tr><td ' + (solotexto ? 'rowspan="2"' : '') + ' ><textarea maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"></textarea></td></tr>' +
                    '</tbody>';
                item.imagen=item.getElementsByTagName("img")[0];
                item.texto = item.getElementsByTagName("textarea")[0];
               
                contenedor.appendChild(item);                
            }
            return item;
        }

function QuitarEIT(obj,solotexto) {
    var objP = obj.parentNode.parentNode.parentNode.parentNode;
    var indice = objP.getAttribute("indice");
    var catalogo = objP.getAttribute("catalogo");
    var claveItem = objP.getAttribute("claveItem");
    if (indice) {
        $.post(url + 'logic/controlador.aspx' + '?op=EliminarImgTexto&seccion='+ (solotexto?catalogo:"Generico") + '&indice=' + indice + "&catalogo=" + catalogo + "&claveItem=" + claveItem, function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == 1) {
                objP.parentNode.removeChild(objP);
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        }); 
    } else {
        objP.parentNode.removeChild(objP);
    }    
}

function IAdjuntarImagenes(img,inBtn) {
    try {
        window.imagePicker.getPictures(
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    img.src = results[i];
                    img.setAttribute("sel", 1);
                    if (inBtn) {
                        img.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute('cambioImagen', 'true');
                    } else {
                        img.parentNode.parentNode.parentNode.parentNode.setAttribute('cambioImagen', 'true');
                    }
                }
            }, function (error) {
                alert('Error: ' + error);
            }
        );
    } catch (e) { alert(e.message); }
}