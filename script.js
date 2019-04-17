function MostrarOpcionesHabilitadas(){
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
                ToogleOpcionesUsuario('opciones-usuario');
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

        function Mostrar(p1,p2,catalogo,clave) {
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

        function PintarItem(catalogo, clave, xmlDoc0){
            var cont = "", imgsTexto;
            var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
            switch (catalogo) {
                case "comunicados":
                    cont =
                        '<div class="titulo">' + catalogo.toUpperCase() + ' <button class="regresar" onclick="Mostrar(\'detalle-' + catalogo + '\', \'lista-' + catalogo + '\'); ">Regresar</button></div>' +
                        '<div class="pantalla-3">' +
                    '<div class="btns-up"><button class="edit-btn" clave_funcion="3" style="display:none;" control="edit-' + catalogo.substring(0, 3) + '-3" id="edit-' + catalogo.substring(0, 3) + '-3" onclick="IniciarEditar(false,\'' + catalogo + '\',this);"  clave="' + clave + '" catalogo="' + catalogo + '" ><img src="img/edit.png" /></button><button style="display:none;" onclick="IniciarEliminar(this);" clave="'+ clave +'" catalogo="' + catalogo + '" clave_funcion="4" control="del-' + catalogo.substring(0, 3) + '-4" id="del-com-4" class="delete-btn"><img src="img/del.png" /></button><hr class="clearn" /></div>' +
                        '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(xmlDoc, "nombre") + ' (' + GetValor(xmlDoc, "cargo") + ')</span>' +
                        '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                        '<span class="t-4">' + GetValor(xmlDoc, "mensaje") + '</span>';
                    imgsTexto = xmlDoc0.getElementsByTagName("Table1");
                    for (var j = 0; j < imgsTexto.length; j++) {
                        cont += '<img class="file" src="' + url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random()'" />' +
                            '<p>' + GetValor(imgsTexto[j], "descripcion") + '</p>'+
                            '<hr />';
                    }                       
                    cont += '</div>';
                    document.getElementById("detalle-" + catalogo).innerHTML = cont;
                    ; break;
                case "directorio": ; break;
                case "notificaciones": ; break;
            }
        }

        function PintarItemEditar(catalogo, clave, xmlDoc0) {
            var cont = "", imgsTexto;
            var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
            switch (catalogo) {
                case "comunicados":
                    var frm = document.getElementById("frm-edit-" + catalogo);
                    frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
                    document.getElementById("clave-" + catalogo).value = clave;
                    frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "mensaje");                   
                    imgsTexto = xmlDoc0.getElementsByTagName("Table1");
                    var imagenesTextos = document.getElementById("c-e-" + catalogo);
                    imagenesTextos.innerHTML = "";
                    var unImagentexto;
                    for (var j = 0; j < imgsTexto.length; j++) {
                        unImagentexto = IAgregarImagenTexto(imagenesTextos);
                        unImagentexto.setAttribute("indice", GetValor(imgsTexto[j], "indice"));
                        unImagentexto.imagen.setAttribute("sel",1);
                        unImagentexto.imagen.src = url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random();
                        unImagentexto.texto.value=src = GetValor(imgsTexto[j], "descripcion");                       
                    }
                    ; break;
                case "directorio": ; break;
                case "notificaciones": ; break;
            }
        }


        function IniciarEditar(esNuevo, catalogo, objeto) {
            if (esNuevo) {
                document.getElementById('op-' + catalogo).value="true";
                document.getElementById("c-e-" + catalogo).innerHTML = "";
                IAgregarImagenTexto('c-e-' + catalogo);
                Mostrar('lista-' + catalogo, 'p-edicion-' + catalogo);
                document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar('p-edicion-' + catalogo, 'lista-' + catalogo); }
            } else {
                document.getElementById('op-' + catalogo).value="false";
                var catalogo = objeto.getAttribute("catalogo");
                var clave = objeto.getAttribute("clave");
                Mostrar('detalle-' + catalogo, 'p-edicion-' + catalogo);
                document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar('p-edicion-' + catalogo, 'detalle-'+ catalogo); }
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
                    //QuitarEspera();
                    PintarItemEditar(catalogo, clave, xmlDoc);
                });
            }
            
        }


        function IniciarEliminar(objeto) {
            if(confirm("Confirme que desea eliminar")){
                var catalogo =objeto.getAttribute("catalogo");
                var clave = objeto.getAttribute("clave");
                $.post(url + 'logic/controlador.aspx' + '?op=EliminarItem&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
                    CargarCatalogo(catalogo, function () {
                        Mostrar('detalle-' + catalogo, 'lista-' + catalogo);
                    });                        
                });
            }
        }

        function IniciarEditarDirectorio(esNuevo) {
            Mostrar('lista-directorio', 'p-edicion-directorio');
        }

        
        function IniciarConfigurarNotificaciones() {
            Mostrar('detalle-notificaciones', 'p-edicion-notificaciones');
        }

        function IniciarEditarSolmtto() {
            Mostrar('detalle-solmtto', 'p-edicion-solmtto');
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

        function BuscarProdServ() {
            Mostrar('buscador-prodserv', 'lista-prodserv');
        }

        window.onresize = function () {
            //EstablecerDimensiones();
        }

        function IniciarApp() {
            EstablecerDimensiones();
            PantallaMostrar("home", "section",true);
            var tabInicioPro = document.getElementById("tab-inicio-pro");
            TabMostrar(tabInicioPro, tabInicioPro.parentNode, 'pro-ejecucion');
        }

        function EstablecerDimensiones() {
            var style = document.getElementById("css-sizes");
            var styleStr = ".login fieldset{height:" + parseInt(0.7 * window.innerHeight, 10) + "px !important;margin-top:" + parseInt(0.10 * window.innerHeight,10) + "px;}";
            var heightApp = parseInt(window.innerHeight - 40, 10) + 5;
            styleStr += ".pantalla {height:" + heightApp + "px !important;}";
            styleStr += ".menu button img {height:" + (heightApp-100)/7 + "px !important;}";
            styleStr += ".pantalla-2 {height:" + (heightApp - 64) + "px !important;}";
            styleStr += ".pantalla-3 {height:" + (heightApp - 27) + "px !important;}";
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

        function IniciarRegistrarErogacion() {
            Mostrar('lista-erogacion', 'p-edicion-erogacion');
        }

        function TabMostrar(tab, raiz, id) {
            try { raiz.seleccionado.className="tab"; } catch (e) { }
            raiz.seleccionado = tab;
            raiz.seleccionado.className = "tab tab-sel";
            var tabs = raiz.getAttribute("tabs").split(',');
            for (var i = 0; i < tabs.length; i++) {
                document.getElementById(tabs[i]).style.display = "none";
            }
            document.getElementById(id).style.display = "block";
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

        function RegistrarEvento(catalogo) {
            switch (catalogo) {
                case "comunicados": CargarComunicados(); break;
                case "directorio": CargarDirectorio(); break;
                case "notificaciones": CargarNotificaciones(); break;
            }
        }

        function CargarCatalogo(catalogo,callback) {
            $.post(url + 'logic/controlador.aspx' + '?op=cargar&seccion=' + catalogo, function (xmlDoc) {
                var items = xmlDoc.getElementsByTagName("Table");
                var lista = document.getElementById(catalogo).getElementsByTagName("ul")[0];
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
            switch (catalogo){
                case "comunicados":
                    itemli.onclick = function () { Mostrar('lista-'+  catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
                    itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(item, "nombre") + '</span>' +
                        '<span class="t-3">' + GetValor(item, "fecha1") + '</span>'; break;
                case "directorio": ; break;
            }
            return itemli;
        }

        function LimpiarForm(catalogo) {
            document.getElementById('frm-edit-' + catalogo).reset();
            document.getElementById('c-e-' + catalogo).innerHTML = "";
        }

        function Guardar(boton,catalogo,callback) {
            var datos = $("#frm-edit-" + catalogo).serializeArray();
            PonerEspera(boton,catalogo);
            $.post(url + 'logic/controlador.aspx' + '?op=Guardar&seccion=' + catalogo, datos, function (xmlDoc) {  
                if (GetValor(xmlDoc, "estatus") == 1) {
                    try {
                        var claveItem = GetValor(xmlDoc, "clave");
                        var imagenes = document.getElementById("c-e-" + catalogo).getElementsByTagName("table");
                        var imagenesCambio = [];
                        var textosCambio = [];
                        for (var i = 0; i < imagenes.length; i++) {
                            if (imagenes[i].getAttribute("cambioImagen") == "true") {
                                imagenesCambio.push(imagenes[i]);
                            } else if (imagenes[i].getAttribute("cambioTexto") == "true") {
                                textosCambio.push(imagenes[i]);
                            }
                        }
                        if (imagenesCambio.length > 0) {
                            GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback,claveItem,catalogo);
                        } else if(textosCambio.length>0){
                            GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo);
                        }                  
                    } catch (e) {
                        QuitarEspera();
                        alert(e.message);
                    }
                } else {
                    QuitarEspera();
                    alert(GetValor(xmlDoc, "mensaje"));
                }
            });            
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

        function GuardarUnaImagenTexto(imagenes,textosCambio,i, callback,claveItem,catalogo) {
            var imagen = imagenes[i].getElementsByTagName("img")[0];
            var  descripcion = imagenes[i].getElementsByTagName("textarea")[0].value;
            if (imagen.getAttribute("sel") == 1) {
                var ft = new FileTransfer();
                var options = new FileUploadOptions();
                options.fileKey = "vImage";
                options.fileName = imagen.src.substr(imagen.src.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                var params = new Object();
                params.catalogo = catalogo;
                params.claveItem = claveItem;
                params.descripcion = descripcion;
                options.params = params;
                options.chunkedMode = false;
                ft.upload(imagen.src, url + 'logic/controlador.aspx' + '?op=GuardarArchivo&seccion=Generico' + (imagenes[i].getAttribute("indice") ? "&indice=" + imagenes[i].getAttribute("indice"):""), function (r) {
                    i++;
                    imagen.setAttribute("clave", GetValor(r.response, "clave"));
                    alert(GetValor(r.response, "mensaje"));
                    if (i < imagenes.length) {
                        try {
                            GuardarUnaImagenTexto(imagenes, textosCambio, i++, callback, claveItem, catalogo);
                        } catch (e) {
                            QuitarEspera();
                            alert("Verifique guardado");
                            callback();
                        }
                    } else {
                        if (textosCambio.length > 0) {
                            try {
                                GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo);
                            } catch (e){
                                QuitarEspera();
                                alert(e.message);
                                callback();
                            }
                        } else {
                            QuitarEspera();
                            alert("Guardado correctamente");
                            callback();
                        }
                    }
                }, function (error) {
                    QuitarEspera();
                    alert("Verifique guardado.");
                }, options);
            } else {
                QuitarEspera();
                alert("Guardado correctamente");
                callback();
            }
        }

        function GuardarUnTexto(textosCambio, i, callback, clave, catalogo) {
            var datos = { descripcion: textosCambio[i].getElementsByTagName('textarea')[0].value, indice: textosCambio[i].getAttribute("clave") };
            $.post(url + 'logic/controlador.aspx' + '?op=ActualizarDescripcion&seccion=' + catalogo,datos, function (xmlDoc) {
                i++;
                if (i < textosCambio.length) {
                    try {
                        GuardarUnTexto(textosCambio, i++, callback, clave, catalogo);
                    } catch (e) {
                        QuitarEspera();
                        alert(e.message);
                        callback();
                   }
                } else {
                    QuitarEspera();
                    alert("Guardado correctamente");
                    callback();
                }
            });    
        }

        function IAgregarImagenTexto(id) {
            var contenedor = (typeof id =="object"? id:document.getElementById(id));
            var imagenes = contenedor.getElementsByTagName("table");
            if (imagenes.length == 0 || (imagenes.length > 0 && imagenes[imagenes.length - 1].getElementsByTagName("img")[0].getAttribute("sel") == 1)) {
                var item = document.createElement("table");
                item.className = "lista-files";
                item.innerHTML = '<tbody>' +
                    '<tr> <td style="width:90%"><img src="img/upload.png" onclick="IAdjuntarImagenes(this);" /></td> <td style="width:10%" rowspan="2" class="del"><button onclick="QuitarEIT(this);" class="del-btn"><img src="img/del.png" /></button></td></tr >' +
                    '<tr><td><textarea maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"></textarea></td></tr>' +
                    '</tbody>';
                item.imagen=item.getElementsByTagName("img")[0];
                item.texto = item.getElementsByTagName("textarea")[0];
                contenedor.appendChild(item);                
            }
            return item;
        }

function QuitarEIT(obj) {
    var objP = obj.parentNode.parentNode.parentNode.parentNode;
    objP.parentNode.removeChild(objP);
}

function IAdjuntarImagenes(img) {
    try {
        window.imagePicker.getPictures(
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    img.src = results[i];
                    img.setAttribute("sel", 1);
                    img.parentNode.parentNode.parentNode.parentNode.setAttribute('cambioImagen', 'true');
                }
            }, function (error) {
                alert('Error: ' + error);
            }
        );
    } catch (e) { alert(e.message); }
}