var isPhonegapApp = false;
var d_r = 0;
var ondeviceready = function () {
    isPhonegapApp = true;
}


/*FIN*/
function IniciarApp() {	
    InicializarApp();
    try { cordova.plugins.autoStart.enable(); } catch (e) { }    
    try {
        cordova.plugins.backgroundMode.setEnabled(true);
    } catch (e) { }
    try { cordova.plugins.notification.local.requestPermission(function (granted) {}); } catch (e){ }
    domicilios_reg = [];
    d_r = 0;
    _func_hab_ = [];
    document.getElementById("main").style.display = "none";    
    if (top.localStorage.getItem("email_")) {
        IniciarSesion();
    } else {
        PantallaMostrar("activacion", "section", true);
    }
}

function InicializarApp() {
    EstablecerDimensiones();
    EstablecerLogo();
}

function EstablecerDimensiones() {
    var style = document.getElementById("css-sizes");
    var styleStr = "";
    var heightApp = parseInt(window.innerHeight - 40, 10) + 5;
    styleStr += ".pantalla {height:" + heightApp + "px !important;}";
    styleStr += ".menu button img {height:" + (heightApp - 100) / 9 + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-2 {height:" + (heightApp - 54) + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-21 {height:" + (heightApp - 91) + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-3 {height:" + (heightApp - 132) + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-31 {height:" + (heightApp - 104) + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-4 {height:" + (heightApp - 27) + "px !important;overflow-y:auto;}";
    styleStr += ".scrollable {height:" + (heightApp - 136) + "px !important;overflow-y:auto;}";
    styleStr += ".scrollable-2 {height:" + (heightApp - 168) + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-5 {height:" + (heightApp - 190) + "px !important;overflow-y:auto;}";
    styleStr += ".pantalla-51 {height:" + (heightApp - 230) + "px !important;overflow-y:auto;}";
    styleStr += ".menu li {height:" + (heightApp - 50) / 6 + "px !important;margin-bottom:" + (heightApp - 50) / 40 + "px !important;}";
    style.innerHTML = styleStr;
    RegistrarGrafica();
}

function RegistrarGrafica() {
    Chart.pluginService.register({
        beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
                //Get ctx from string
                var ctx = chart.chart.ctx;

                //Get options from the center object in options
                var centerConfig = chart.config.options.elements.center;
                var fontStyle = centerConfig.fontStyle || 'Arial';
                var txt = centerConfig.text;
                var color = centerConfig.color || '#000';
                var sidePadding = centerConfig.sidePadding || 20;
                var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
                //Start with a base font of 30px
                ctx.font = "30px " + fontStyle;

                //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                var stringWidth = ctx.measureText(txt).width;
                var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                // Find out how much the font can grow in width.
                var widthRatio = elementWidth / stringWidth;
                var newFontSize = Math.floor(30 * widthRatio);
                var elementHeight = (chart.innerRadius * 2);

                // Pick a new font size so it will not be larger than the height of label.
                var fontSizeToUse = Math.min(newFontSize, elementHeight);

                //Set font settings to draw it correctly.
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.font = fontSizeToUse + "px " + fontStyle;
                ctx.fillStyle = color;

                //Draw text in center
                ctx.fillText(txt, centerX, centerY);
            }
        }
    });
}

function ActivarAplicacion(objeto) {
    var clave = document.getElementById("codigoactivacion").value;
    if (clave) {
        var datos = [{ name: 'codigoActivacion', value: clave }];
        $.post(url + 'logic/controlador.aspx' + '?op=ActivarAplicacion&seccion=seguridad', datos, function (xmlDoc) {
            var estatus = GetValor(xmlDoc, "estatus");
            if (estatus == 1) {
                top.localStorage.setItem("codigoActivacion", GetValor(xmlDoc, "codigoActivacion"));
                top.localStorage.setItem("srclogo ", GetValor(xmlDoc, "srclogo"));
                InicializarApp();
                document.getElementById("main").style.display = "block";
                PantallaMostrar("reg-usuario", "section", true);
            } else {
                if (GetValor(xmlDoc, "codigoActivacion") && estatus == 0) {
                    alert("Su comite de administración tiene un proceso pendiente, consulte a su administrador.");
                } else {
                    alert(GetValor(xmlnDoc, "mensaje"));
                }
            }
        });
    } else {
        alert("Debe ingresar clave de activación");
    }
}

function ObtenerDomiciliosCoincidentes(nombre) {
    if (!nombre) {
        nombre = document.getElementById("t-apellidos").value + ' ' + document.getElementById("t-nombre").value;
    }
    $.post(url + 'logic/controlador.aspx?op=ObtenerDomiciliosCoincidentes&seccion=ap_domicilios', { nombre: nombre, public: true }, function (xmlDoc) {
        var domicilios = xmlDoc.getElementsByTagName("Table");
        var undom, domis = "";
        for (var i = 0; i < domicilios.length; i++) {
            domis = domis + "<input type='checkbox' name='domicilio' value='" + GetValor(domicilios[i], "clave") + "' style='margin:0px;width:auto;margin-right:10px;display:inline;'/><span>" + GetValor(domicilios[i], "domicilio") + "</span>";
        }
        if (!document.getElementById("op-si").checked && !document.getElementById("op-no").checked) {
            document.getElementById("b-domicilios").innerHTML = "<p style='color: red;'>Seleccione una opción de propietario.</p>";
        } else if (domis.length == 0) {
            document.getElementById("b-domicilios").innerHTML = "<p style='color: red;'>No hay domicilios con el titular ingresado, por favor verifíque o llame a su administrador.</p>";
        } else {
            document.getElementById("b-domicilios").innerHTML = "<p>Selecciona tu domicilio(s)</p>" + domis;
        }
    });
}

function EstablecerLogo() {
    if (top.localStorage.getItem("codigoActivacion")) {
        var portada = document.getElementById("portada");
        portada.onerror = function () { this.src = url + "img/portadatime.jpg"; }
        portada.src = url + "/src-img/fraccionamientos/_" + top.localStorage.getItem("codigoActivacion") + "/portada.png";
    }
    var imgs = $("img.logo");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].setAttribute("src", "img/logo.jpg?v=1.0");
    }
}


function RegistrarUsuario() {
    var codigoActivacion = top.localStorage.getItem("codigoActivacion");
    if (codigoActivacion) {
        var datos = $("#frmRegUsuario").serializeArray();
        datos.push({ name: 'fraccionamiento', value: codigoActivacion });
        $.post(url + 'logic/controlador.aspx?op=RegistrarUsuario&seccion=seguridad', datos, function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == 1) {
                IniciarSesion("frmRegUsuario");
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        });
    } else {
        alert("No ha activado la aplicación");
    }
}

function IniciarSesion(frm) {
    var datos;
    if (frm) {
        datos = $("#" + frm).serializeArray();
    } else {
        datos = [{ name: "email", value: top.localStorage.getItem("email_") }, { name: "contrasena", value: top.localStorage.getItem("contrasena_") }];
    }
    IniciarSesion_back(function (xmlDoc) {
        if (GetValor(xmlDoc, "BloquearNotificaciones")) {
            RemoverNotificaciones();
        } else {
            RegistrarNotificaciones();
        }
        document.getElementById("main").style.display = "block";
        if (GetValor(xmlDoc, "es_vigilancia") == "true") {
            IntercambioVisual("menu-vig", "menu");
            PantallaMostrar("home", "section", true);
        } else if (GetValor(xmlDoc, "solo_rev_ucuotas") == "true") {
            IntercambioVisual("menu-revcuotas", "menu");
            PantallaMostrar("home", "section", true);
        }else if (GetValor(xmlDoc, "es_resp_fracc") == "true" || GetValor(xmlDoc, "ya_verifico") == "true" || GetValor(xmlDoc, "es_adminivo") == "true") {
            IntercambioVisual("menu", "menu-vig");
            PantallaMostrar("home", "section", true);
        } else {
            PantallaMostrar("no-activacion", "section", true);
        }
    }, datos);
}


function IniciarSesion_back(callback, datos) {
    if (!datos) {
        datos = [{ name: "email", value: top.localStorage.getItem("email_") }, { name: "contrasena", value: top.localStorage.getItem("contrasena_") }];
    }
    $.post(url + 'logic/controlador.aspx?op=IniciarSesion&seccion=seguridad&fraccionamiento=' + top.localStorage.getItem("codigoActivacion"), datos, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            RegistrarVariables(datos, xmlDoc);
            if (callback) callback(xmlDoc);
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function RegistrarVariables(datos, xmlDoc) {
    top.localStorage.setItem("usuario_", GetValor(xmlDoc, "clave"));
    top.localStorage.setItem("fracc_", GetValor(xmlDoc, "fraccionamiento"));
    top.localStorage.setItem("email_", datos[0].value);
    top.localStorage.setItem("contrasena_", datos[1].value);
    top.localStorage.setItem("domicilios", GetValor(xmlDoc, "domicilios"));
    document.getElementById("nombre-usuario").innerHTML = GetValor(xmlDoc, "nombre");
    document.getElementById("u-fraccionamiento").innerHTML = GetValor(xmlDoc, "s_nfracc");
    document.getElementById("u-domicilio").innerHTML = GetValor(xmlDoc, "s_domicilio");
    document.getElementById("tipo-usuario").innerHTML = GetValor(xmlDoc, "cargo");
}


function CerrarSesion() {
    $.post(url + 'logic/controlador.aspx?op=CerrarSesion&seccion=seguridad', function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            top.localStorage.setItem("email_", "");
            top.localStorage.setItem("contrasena_", "");
            CambioPantalla('login', 'main');
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}


var i_unsubs_r = 0;
function RemoverNotificaciones() {
    i_unsubs_r++;
    top.FCMPlugin.unsubscribeFromTopic('FRA_1_' + top.localStorage.getItem("codigoActivacion") + "-fun_" + i_unsubs_r, function () {
        if (i_unsubs_r < 9) {
            RemoverNotificaciones();
        }
    });
}


/**/
var i_unsubs = 0;
function UnSuscribir() {
    i_unsubs++;
    top.FCMPlugin.unsubscribeFromTopic('FRA_1_' + top.localStorage.getItem("codigoActivacion") + "-fun_" + i_unsubs, function () {
        if (i_unsubs < 9) {
            UnSuscribir();
        } else {
            Suscribir();
        }
    });
}

var i_subs = 0, l_s = 0, fs;
function Suscribir() {
    if (i_subs < l_s) {
		alert("intentando suscribir");
        top.FCMPlugin.subscribeToTopic('FRA_1_' + top.localStorage.getItem("codigoActivacion") + "-fun_" + GetValor(fs[i_subs], "clave_funcion"), function () {
			alert("suscrito");
            if (i_subs < l_s) { Suscribir(GetValor(fs[i_subs++], "clave_funcion")); }
        });
    }
}

var _func_hab_ = [];
var domicilios_reg = [];
function RegistrarNotificaciones() {
    try {
        if (top.localStorage.getItem("email_")) {
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerFuncionesHabilitadas&seccion=seguridad&funciones=6', function (xmlDoc) {
                _func_hab_ = [];
                var funcionesRecibidas = xmlDoc.getElementsByTagName("Table");
                for (var n = 0; n < funcionesRecibidas.length; n++) {
                    _func_hab_.push(GetValor(funcionesRecibidas[n], "clave_funcion"));
                }
                fs = xmlDoc.getElementsByTagName("Table");
                l_s = fs.length;
                i_subs = 0;
                i_unsubs = 0;
                UnSuscribir();
            });
            domicilios_reg = top.localStorage.getItem("domicilios").split(",");
            top.FCMPlugin.subscribeToTopic('FRA_1_' + top.localStorage.getItem("codigoActivacion"), function () {
                RegistrarDomicilio();
            });           
             
            top.FCMPlugin.onNotification(function (data) {
                document.getElementById("notifi-audio").play();
                cordova.plugins.notification.badge.increase(1, function () { });  
                PantallaMostrar("notificaciones", "section");
                if (data.modulo == 1) {
                    ActivarAlarma_(data.contenidovoz);
                } else if (data.modulo == 2) {
                    ActivarTimbre_(data.contenidovoz);
                    /*var permitir = window.confirm("¿Permite la visita?");
                    $.post(url + 'logic/controlador.aspx?op=PermitirVisita&seccion=vigilancia&permitir=' + permitir + '&clave=' + data.clave, function (xmlDoc) {
                        alert(GetValor(xmlDoc, "mensaje"));
                    });*/
                } 
            });
        }
    } catch (e) { }
}

function RegistrarDomicilio() {
    if (d_r < domicilios_reg.length) {		
        top.FCMPlugin.subscribeToTopic('FRA_1_' + top.localStorage.getItem("codigoActivacion") + "-dom_" + domicilios_reg[d_r++], function () {
			alert("Domicilio registrado");
            RegistrarDomicilio();
        });
    }
}

function PresentarVisita() {
    document.getElementById("timbre-v").src = undefined;
    document.getElementById("timbre-v").onended = function () { };
    document.getElementById("alarma-timbre").onended = function () { };
    document.getElementById("timbre").style.display = "none";
    $.post(url + 'logic/controlador.aspx?op=RegistrarRecepcion&seccion=vigilancia&clave=' + document.getElementById("timbre").clavevisita, function (xmlDoc) {
        //alert(GetValor(xmlDoc, "mensaje"));
    });
}

function PresentarConfirmacion() {
    /*var permitir = window.confirm(document.getElementById("timbre").data.contenidovoz);
    $.post(url + 'logic/controlador.aspx?op=PermitirVisita&seccion=vigilancia&permitir=' + permitir + '&clave=' + document.getElementById("timbre").clavevisita, function (xmlDoc) {
        alert(GetValor(xmlDoc, "mensaje"));
    });*/
}

function InsertarNotificacion(dato, modulo) {
    alert(dato + ", Modulo:" + modulo);
}

function MostrarBuscar(id, catalogo, redim, c0, c1, callback, params) {
    var obj = document.getElementById(id);
    var redim_ = document.getElementById(redim);
    if (redim_ && !c0) {
        c0 = redim_.getAttribute("classToggle").split(",")[0];
        c1 = redim_.getAttribute("classToggle").split(",")[1];
    }
    if (obj.style.display == "none") {
        MostrarOpcionesHabilitadas(true);
        obj.style.display = "block";
        if (redim_) ReplaceClass(redim, c0, c1);
    } else {
        obj.style.display = "none";
        obj.getElementsByTagName("input")[0].value = "";
        var datos = { buscar: '' };
        for (var param in params) {
            datos[param] = params[param];
        }
        if (callback) callback();
        else CargarCatalogo(catalogo, undefined, datos);
        if (redim_) ReplaceClass(redim, c1, c0);
    }
}

function ActivarAlarma() {
    if (confirm("Confirme que desea activar la Alarma Vecinal, Recuerde que todo abuso sera sancionado.")) {
        $.post(url + 'logic/controlador.aspx?op=ActivarAlarmaVecinal&seccion=seguridad', function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == 1) {
                alert("Alarma enviada");
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        });
    }
}

function ActivarTimbre_(contenidovoz) {
    cordova.plugins.notification.local.schedule({
        id: 1,
        title: "SAFRA",
        message: "Tiene Visita"
    });

    cordova.plugins.notification.local.on("click", function (notification) {
        PresentarVisita(); 
    });

    document.getElementById("timbre-v").src = contenidovoz;
    document.getElementById("timbre-v").onended = function () { document.getElementById("alarma-timbre").play(); };
    document.getElementById("alarma-timbre").onended = function () { document.getElementById("timbre-v").play(); };
    document.getElementById("alarma-timbre").play();
    document.getElementById("timbre").style.display = 'block';
}

function ActivarAlarma_(contenidovoz) {
    var alarmaVoz = document.getElementById("alarma-v");
    var alarma = document.getElementById("alarma-s");
    alarmaVoz.setAttribute("src", contenidovoz);
    alarma.setAttribute("src", url + "audios/alerta2.mp3");
    alarmaVoz.play();
    alarma.play();
    alarma.volume = 0.7;
    document.getElementById("alarma").style.display = "block";
    cordova.plugins.notification.local.schedule({
        id: 2,
        title: "SAFRA",
        message: "Alarma Vecinal"
    });

    cordova.plugins.notification.local.on("click", function (notification) {
        DesactivarAlarma();
    });
}

function DesactivarAlarma() {
    document.getElementById("alarma").style.display = "none";
    document.getElementById("alarma-v").pause();
}

function ReplaceClass(id, c0, c1) {
    var obj = (typeof (id) == "string" ? document.getElementById(id) : id);
    $(obj).removeClass(c0);
    $(obj).addClass(c1);
}

function MostrarOpcionesHabilitadas(limpiar) {
    var wraper = window.pvisible;
    if (wraper) {
        if (limpiar) wraper.toggle = 1;
        var redim = wraper.getAttribute("redim");
        if (redim) {
            var obj = document.getElementById(redim);
            var classToggle = obj.getAttribute("classToggle").split(',');
            var c0 = classToggle[0];
            var c1 = classToggle[1];
            if (wraper.toggle == 1) {
                $(obj).removeClass(c1);
                $(obj).addClass(c0);
            } else {
                var hide = obj.getAttribute("hide");
                if (hide) document.getElementById(hide).style.display = "none";
                $(obj).removeClass(c0);
                $(obj).addClass(c1);
            }
        }
        var funcionesEnPantalla = { btns: [], claves: [] };
        var botones = wraper.getElementsByTagName("button");
        var j = 0;
        for (var i = 0; i < botones.length; i++) {
            if (botones[i].getAttribute("clave_funcion")) {
                funcionesEnPantalla.claves[j] = botones[i].getAttribute("clave_funcion");
                funcionesEnPantalla.btns[j++] = botones[i];
            }
        }
        if (wraper.toggle == 1) {
            for (var k = 0; k < funcionesEnPantalla.btns.length; k++) {
                document.getElementById(funcionesEnPantalla.btns[k].getAttribute("control")).style.display = "none";
            }
            wraper.toggle = 0;
        } else {
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerFuncionesHabilitadas&seccion=seguridad&funciones=' + funcionesEnPantalla.claves.join(","), function (xmlDoc) {
                var funcionesRecibidas = xmlDoc.getElementsByTagName("Table");
                for (var n = 0; n < funcionesRecibidas.length; n++) {
                    for (var k = 0; k < funcionesEnPantalla.btns.length; k++) {
                        if (funcionesEnPantalla.btns[k].getAttribute("clave_funcion") == GetValor(funcionesRecibidas[n], "clave_funcion")) {
                            try { document.getElementById(funcionesEnPantalla.btns[k].getAttribute("control")).style.display = "block"; } catch (e) { }
                        }
                    }
                }
                wraper.toggle = 1;
            });
        }
    }
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
    CambioPantalla(p2, p1);
    if (catalogo) {
        //PonerEspera(boton, catalogo);
        $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
            //QuitarEspera();
            document.getElementById(p2).setAttribute("clave", clave);
            PintarItem(catalogo, clave, xmlDoc);
        });
    }
}

var consultasPago = 0;
function ContinuarPagando() {
    var dom_sel = document.getElementById("w-datos-persona").getAttribute("domicilio_sel");
    var datos = { c: conceptospagar.join("|"), d: + dom_sel };
    $.post(url + 'logic/controlador.aspx' + '?op=ValidarFormaPago&seccion=aportaciones', datos, function (xmlDoc) {
        var tipopago = 0;
        var monto = MoneyFormat(parseFloat(GetValor(xmlDoc, "monto")));
        if (GetValor(xmlDoc, "tarjeta")) {
            tipopago = 1;
        } else if (GetValor(xmlDoc, "otroadmin")) {
            if (confirm("Confirme que desea aplicar el pago para: " + GetValor(xmlDoc, "domicilio") + " por " + monto)) {
                tipopago = 2;
            } else {
                tipopago = 0;
            }
        } else if (GetValor(xmlDoc, "mismoadmin")) {
            if (confirm("Confirme que desea aplicar el pago para su domicilio: " + GetValor(xmlDoc, "domicilio") + " por " + monto)) {
                if (confirm("¿Desea registrar el pago con tarjeta?")) {
                    tipopago = 1;
                } else {
                    tipopago = 2;
                }
            } else {
                tipopago = 0;
            }
        }
        if (tipopago == 1) {
            /*if (win) win.close();
            var win = AbrirDocumento(url + 'logic/controlador.aspx?op=PresentarPagador&c=' + conceptospagar.join("|") + "&d=" + dom_sel + "&fracc=" + top.localStorage.getItem("fracc_") + "&usuario=" + top.localStorage.getItem("usuario_"), "_system");
            consultasPago = 0;
            window.setInterval(function () {
                consultasPago++;
            }, 5000);*/
        } else if (tipopago == 2) {
            $.post(url + 'logic/controlador.aspx' + '?op=RegistrarPagoEfectivo&seccion=aportaciones', datos, function (xmlDoc) {
                alert(GetValor(xmlDoc, "mensaje"));
                CargarAportaciones(false);
            });
        } else {
            CargarAportaciones(false);
        }
    });
}

function ContinuarPagandoFraccion() {
    if (HayUnMesSeleccionado()) {
        var cantidad = parseFloat(prompt("Ingrese el monto que va a pagar."));
        if (cantidad > 0) {
            var dom_sel = document.getElementById("w-datos-persona").getAttribute("domicilio_sel");
            var datos = { c: conceptospagar.join("|"), d: + dom_sel };
            $.post(url + 'logic/controlador.aspx' + '?op=ValidarFormaPago&seccion=aportaciones', datos, function (xmlDoc) {
                var tipopago = 0;
                var monto = MoneyFormat(cantidad);
                if (GetValor(xmlDoc, "tarjeta")) {
                    alert("Solo puede pagar parcialidad en oficinas");
                } else if (GetValor(xmlDoc, "otroadmin")) {
                    if (confirm("Confirme que desea aplicar el pago para: " + GetValor(xmlDoc, "domicilio") + " por " + monto)) {
                        tipopago = 2;
                    } else {
                        tipopago = 0;
                    }
                } else if (GetValor(xmlDoc, "mismoadmin")) {
                    if (confirm("Confirme que desea aplicar el pago para su domicilio: " + GetValor(xmlDoc, "domicilio") + " por " + monto)) {
                        tipopago = 2;
                    } else {
                        tipopago = 0;
                    }
                }
                datos["monto"] = monto;
                if (tipopago == 2) {
                    $.post(url + 'logic/controlador.aspx' + '?op=RegistrarParcialidadPagoEfectivo&seccion=aportaciones', datos, function (xmlDoc) {
                        alert(GetValor(xmlDoc, "mensaje"));
                        CargarAportaciones(false);
                    });
                } else {
                    CargarAportaciones(false);
                }
            });
        } else {
            alert("Ingrese una cantidad válida.");
        }
    }
}

function CerrarPago(event, ventana) {
    if (event.url == url + 'logic/controlador.aspx?op=Finalizar') {
        ventana.close();
    }
}

function GuardarItem(obj, catalogo, detalle, datos, callback) {
    Guardar(obj, catalogo, function (claveItem) {
        LimpiarForm(catalogo);
        CargarCatalogo(catalogo, function () {
            if (detalle) {
                Mostrar('p-edicion-' + catalogo, 'detalle-' + catalogo, catalogo, claveItem);
            } else {
                CambioPantalla('lista-' + catalogo, 'p-edicion-' + catalogo);
            }
        }, datos);
        if (callback) { callback(claveItem, datos); }
    });
}

function RegistrarVotoProP(voto) {
    $.post(url + 'logic/controlador.aspx' + '?op=RegistrarVotoProP&seccion=pro_propuestas' + '&voto=' + voto + "&clave=" + document.getElementById("clave-pro_propuesta").value, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            CargarCatalogo('pro_propuestas', function () {
                CambioPantalla('lista-pro_propuestas', 'detalle-pro_propuestas');
            });
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function IniciarAsociarCargo() {
    CambioPantalla("lista-cargos", "detalle-usuarios");
    CargarCatalogo("cargos");
}

function AgregarProrroga(check, domicilio, fecha_negociada) {
    $.post(url + 'logic/controlador.aspx?op=AgregarProrroga&seccion=ap_domicilios&domicilio=' + domicilio, { fecha_negociada: fecha_negociada }, function (xmlDoc) {
        check.checked = (GetValor(xmlDoc, "es_activo") == "true");
        if (GetValor(xmlDoc, "estatus") == "1") {
            EjecutarRestriccionTags(false, domicilio);
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function ActivarTag(check, domicilio) {
    $.post(url + 'logic/controlador.aspx?op=ActivarTag&seccion=ap_domicilios&domicilio=' + domicilio + '&poner=' + check.checked, function (xmlDoc) {
        check.checked = (GetValor(xmlDoc, "es_activo") == "true");
        if (GetValor(xmlDoc, "estatus") == "1") {
            EjecutarRestriccionTags(false, domicilio);
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function PintarItem(catalogo, clave, xmlDoc0) {
    var cont = "", imgsTexto;
    var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
    switch (catalogo) {
        case "reservaciones":
            cont =
                '<span class="t-2">' + GetValor(xmlDoc, "descripcion") + '</span>' +
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>';
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "proyectos":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            document.getElementById("clave-proyectos").value = clave;
            cont =
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                '<span class="t-2">' + GetValor(xmlDoc, "descripcion").replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</span>';
            cont += PintarImagenesTexto(xmlDoc0);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "pro_propuestas":
            var voto = GetValor(xmlDoc, "voto");
            document.getElementById("votos-pp").disabled = (voto ? true : false);
            if (voto == 1) {
                document.getElementById("voto-p-no").className = "v-p-no";
                document.getElementById("voto-p-si").className = "v-p-si";
            } else if (voto == 2) {
                document.getElementById("voto-p-no").className = "v-p-si";
                document.getElementById("voto-p-si").className = "v-p-no";
            } else {
                document.getElementById("voto-p-no").removeAttribute("class");
                document.getElementById("voto-p-si").removeAttribute("class");
            }
            document.getElementById("edit-pro_p").style.display = (GetValor(xmlDoc, "realizo") && !GetValor(xmlDoc, "cuenta") ? "block" : "none");
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            document.getElementById("clave-pro_propuesta").value = clave;
            cont =
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                '<span class="t-2">' + GetValor(xmlDoc, "descripcion").replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</span>';
            cont += PintarImagenesTexto(xmlDoc0);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "ap_domicilios":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1" style="font-size:0.85em;">' + GetValor(xmlDoc, "domicilio") + '</span>' +
                '<span class="t-2">' + GetValor(xmlDoc, "titular") + '</span>' +
                '<span class="t-41"><b>Registró: </b>' + GetValor(xmlDoc, "usuario_registro") + ', ' + GetValor(xmlDoc, "fecha_alta") + '</span>' +
                '<span class="t-41"><b>Modificaciones iniciales: </b>' + GetValor(xmlDoc, "insercionesini") + '</span>' +
                (GetValor(xmlDoc, "usuario_modifico") ? '<span class="t-41"><b>Última modificación:</b>' + GetValor(xmlDoc, "usuario_modifico") + ',' + GetValor(xmlDoc, "fecha_modifico") + '</span>' : "") +
                '<span class="t-2">' + GetValor(xmlDoc, "descripcion") + '</span>' +
                '<fieldset ' + (_func_hab_.indexOf("21") > 0 ? "":'style="display:none;"') + ' class="notificar-form" ><legend>Enviar notificación</legend><input placeholder="Titulo de notifocación"/><textarea height="50px;width:95%;" placeholder="Escriba su mensaje.."  ></textarea><button class="btn-item" onclick="EnviarNotificacion(this);">Enviar notificación</button></fieldset>' +
                '<button class="aceptar" style="margin-top:20px;" onclick="VerTags(' + clave + ');">Ver TAGs</button>' +
                '<button class="aceptar" style="margin-top:20px;margin-bottom:20px;" onclick="VerConvenios(' + clave + ');">Convenios</button>' +
                '<hr class="clearn" />'+
                (_func_hab_.indexOf("10") > 0 ?
                '<div class="check-activacion" id="check-tag-d-' + clave + '"><label class="etiqueta" style="font-weight:bolder;font-size:1.3em;margin-top:10px;width:50%;">Prorroga</label><input style="float:left;width:30%;padding:5px;border:1px solid #999;margin-top:10px;" placeholder="Fecha negociada" id="fecha_negociada_tag" value="' + GetValor(xmlDoc, "fecha_prorroga") + '" onkeypress="if(ValidarEnter(event)){AgregarProrroga(document.getElementById(\'check-tag\'),' + clave + ',document.getElementById(\'fecha_negociada_tag\').value);}" /><label class="switch" style="float:right;"><input id="check-tag" type="checkbox" ' + (GetValor(xmlDoc, "es_activo") == "true" ? "checked=checked" : "") + ' onchange="ActivarTag(this,' + clave + ');" /><span class="slider round"></span></label><hr class="clearn" /></div>' 
                : "") +                
                (_func_hab_.indexOf("23") > 0 ?                    
                    '<div style="display:none;" class="check-activacion" id="check-pag_s_mora-d-' + clave + '"><button style="display:none;" clave_funcion="23" control="check-pag_s_mora-d-' + clave + '"></button><label class="etiqueta" style="font-weight:bolder;font-size:1.3em;margin-top:10px;width:50%;">Conceder próximo pago sin mora</label><label class="switch" style="float:right;"><input id="check-tag" type="checkbox" ' + (GetValor(xmlDoc, "proxpagosinmora") == "true" ? "checked=checked" : "") + ' onchange="PonerProxPagoSinMora(this,' + clave + ');" /><span class="slider round"></span></label><hr class="clearn" /></div>'
                : "") +
                '<hr class="clearn" />' +
                '<form id="frm-edit-expediente" onsubmit="return false;" style="display:none;"><fieldset><label class="etiqueta">Notas y documentos</label><input type="hidden" id="dom-exp" name="domicilio"/><div id="c-e-expediente"></div><button class="aceptar" control="frm-edit-expediente" clave_funcion="22" style="margin-top:30px;margin-bottom:50px;" onclick="document.getElementById(\'dom-exp\').value=document.getElementById(\'detalle-ap_domicilios\').getAttribute(\'clave\');Guardar(this,\'expediente\', function () { Mostrar(\'detalle-ap_domicilios\', \'detalle-ap_domicilios\', \'ap_domicilios\', document.getElementById(\'detalle-ap_domicilios\').getAttribute(\'clave\'));});">Aceptar</button><div id="dom-expediente">' + PintarImagenesTexto(xmlDoc0) + '</div></fieldset></form>';

            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            var contenedor = document.getElementById("c-e-expediente");
            var control = IAgregarImagenTexto(contenedor, undefined, undefined, true);

            ; break;
        case "ap_conceptos":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "nombre") + '</span>' +
                '<span class="t-3">' + MoneyFormat(parseFloat(GetValor(xmlDoc, "monto"))) + '</span>' +
                '<span class="t-41"><b>Registró: </b>' + GetValor(xmlDoc, "usuario_registro") + ', ' + GetValor(xmlDoc, "fecha_alta") + '</span>' +
                (GetValor(xmlDoc, "usuario_modifico") ? '<span class="t-41"><b>Última modificación:</b>' + GetValor(xmlDoc, "usuario_modifico") + ',' + GetValor(xmlDoc, "fecha_modifico") + '</span>' : "") +
                '<span class="t-2">' + GetValor(xmlDoc, "descripcion") + '</span>';

            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "usuarios":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            var cargo = GetValor(xmlDoc, "cargo");
            var clave_cargo = GetValor(xmlDoc, "clave_cargo");
            var usuario = GetValor(xmlDoc, "usuario");
            cont = '<div class="padd30 btnsm30" style="line-height:20px;">' +
                '<div id="usu-' + clave + '"><span class="t-1"><b>Nombre: </b>' + usuario + '</span></div>' +
                (cargo ?
                    '<span class="t-2"><b>Cargo: </b>' + GetValor(xmlDoc, "cargo") + '</span>' +
                    '<button class="btn2" onclick="RemoverCargoUsuario(' + clave + ',' + clave_cargo + ');">Remover Cargo</button>'
                    :
                    '<button class="btn2" onclick="IniciarAsociarCargo();">Asociar Cargo</button>'
                ) +
                '<span><button class="btn2" onclick="AsociarDomiciliosPropietario();">Asociar domicilios del propietario</button></span>' +
                '<span><button class="btn2" onclick="IniciarEditar(false,\'usuarios\')">Editar cuenta</button></span>' +
                '<button class="btn2" onclick="CerrarSesionesRemotas(' + clave + ');">Cerrar Sesión Usuario</button>' +
                '<div class="check-activacion" ><label class="etiqueta" style="font-weight:bolder;font-size:1.3em;margin-top:10px;width:50%;">Cuenta activa</label><label class="switch" style="float:right;"><input id="check-sav" type="checkbox" ' + (GetValor(xmlDoc, "deshabilitado") == "true" ? "" : "checked") + ' onchange="ActivarDesactivarUsuario(this,' + clave + ');" /><span class="slider round"></span></label><hr class="clearn" /></div>' +
                '<div class="check-activacion" ><label class="etiqueta" style="font-weight:bolder;font-size:1.3em;margin-top:10px;width:50%;">Alarma Vecinal Activa</label><input title="Fecha de suspensión" disabled=true style="float:left;width:30%;padding:5px;border:1px solid #999;margin-top:10px;" placeholder="Fecha suspensión" id="fecha_suspension_av" value="' + GetValor(xmlDoc, "fechasuspension") + '" /><label class="switch" style="float:right;"><input id="check-sav" type="checkbox" ' + (GetValor(xmlDoc, "activo_AV") == "true" ? "checked" : "") + ' onchange="SuspenderAlarmaVecinal(this,' + clave + ');" /><span class="slider round"></span></label><hr class="clearn" /></div>'
                ;
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "aportaciones":
            var obs = GetValor(xmlDoc, "observaciones");
            var residente = GetValor(xmlDoc, "residente");
            document.getElementById("wrap-detalle-aportaciones").innerHTML =
                '<div class="' + GetValor(xmlDoc, "leyenda") + '" style="padding:35px;font-size:13px;line-height:7px;">' +
                '<span class="t-3" style="font-size:15px;"><b>' + GetValor(xmlDoc, "leyenda") + '</b><p>' + MoneyFormat(parseFloat(GetValor(xmlDoc, "monto"))) + '</p></span><hr class="clearn"/>' +
                '<div class="t-1"><b>Concepto:</b><p>' + GetValor(xmlDoc, "concepto") + "</p><b>Fecha:</b><p>" + GetValor(xmlDoc, "fecha_registro") + "</p><br/><b>Residente:</b><p>" + residente + "</p><br/><b>Fecha de registro:</b><p>" + GetValor(xmlDoc, "fecha") + '</p></div>' +
                '<div class="t-2"><b>Tipo de pago: </b><p>' + GetValor(xmlDoc, "forma_pago") + '</p><br/><b>Recibió:</b><p>' + GetValor(xmlDoc, "recibio") + '</p><br/><b>Canceló:</b><p>' + GetValor(xmlDoc, "cancelo") + '</p><br/></div>' +
                '<div class="t-2"><b>Observaciones: </b><p>' + GetValor(xmlDoc, "observaciones") + '</p></div>' +
                '</div>';
            break;
        case "estados_cuenta":
            var cont = PintarImagenesTexto(xmlDoc0);
            document.getElementById("c-e-estados_cuenta").innerHTML = cont;
            break;
        case "regen_egrepro":
        case "regen_tiposgastos":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "concepto") + '</span>' +
                '<span class="t-3">' + MoneyFormat(parseFloat(GetValor(xmlDoc, "importe"))) + '</span>' +
                '<span class="t-2">' + GetValor(xmlDoc, "fecha") + '</span>' +
                '<span class="t-4" style="text-align:left;">Responsable:' + GetValor(xmlDoc, "nombre") + "(" + GetValor(xmlDoc, "cargo") + ")" + '</span>' +
                '<span class="t-4">' + GetValor(xmlDoc, "descripcion").replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</span>';
            cont += PintarImagenesTexto(xmlDoc0);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "tiposgastos":
        case "egrepro":
            var control = IAgregarCosto('c-e-regen_' + catalogo);
            document.getElementById("tgrupo-regen_" + catalogo).value = GetValor(xmlDoc, "titulo");
            document.getElementById("in-regen_" + catalogo).value = GetValor(xmlDoc, "indice");
            //ObtenerPagosClasificacion
            break;
        case "talleres":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                '<span class="t-2">' + GetValor(xmlDoc, "nombre") + '</span>' +
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                '<span class="t-4">' + GetValor(xmlDoc, "descripcion").replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</span>';
            cont += PintarImagenesTexto(xmlDoc0);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "depositos_banco":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "descripcion") + '</span>' +
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>';
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "convenios":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "descripcion") + '</span>' +
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>';
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "config_pagos":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "descripcion") + '</span>' +
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>';
                document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "comunicados":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                '<span class="t-4">' + GetValor(xmlDoc, "mensaje").replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</span>';
            cont += PintarImagenesTexto(xmlDoc0);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "solicitudes_seg":
        case "solicitudes":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            cont =
                '<div class="nota-principal"><span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                '<span class="t-2">' + GetValor(xmlDoc, "nombre") + (GetValor(xmlDoc, "cargo") ? ' (' + GetValor(xmlDoc, "cargo") + ')' : "") + "</span>" +
                '<span class="t-3" style="width:90%;font-size:0.85em;">' + GetValor(xmlDoc, "fecha") + '</span>' +
                '<span class="t-2"><i>' + GetValor(xmlDoc, "descripcion") + '</i></span><hr class="clearn"/></div>';
            cont += PintarImagenesTexto(xmlDoc0, true);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            var contenedor = document.getElementById("wrap-detalle-" + catalogo);
            var control = IAgregarImagenTexto(contenedor, 1, true, true);
            var btn = document.createElement("div");
            btn.className = "agregar btn-normal";
            btn.innerHTML = "<button>Responder</button>";
            contenedor.appendChild(btn);
            btn.clave = clave;
            btn.onclick = function () {
                var clave = this.clave;
                var contenedor = document.getElementById("wrap-detalle-" + catalogo);
                PonerEspera(this, catalogo);
                GuardarUnTexto(contenedor.getElementsByTagName("table"), 0, function () {
                    Mostrar('detalle-' + catalogo, 'detalle-' + catalogo, catalogo, clave);
                }, clave, catalogo);
            }
                ; break;
        case "prodserv":
            var pantalla = document.getElementById("detalle-" + catalogo);
            pantalla.setAttribute("clave", clave);
            var btn = document.getElementById("activar-negocio");
            btn.checked = (GetValor(xmlDoc, "activo") == "true");
            btn.value = clave;
            cont =
                '<span class="t-1">' + GetValor(xmlDoc, "NombreNegocio") + '</span>' +
                '<span class="t-2">Teléfono(s)' + GetValor(xmlDoc, "telefonos") + '</span>' +
                '<span class="t-3">Horario: ' + GetValor(xmlDoc, "horario") + '</span>' +
                '<span class="t-4">' + GetValor(xmlDoc, "mensaje").replace(/(?:\r\n|\r|\n)/g, '<br/>') + '</span>';
            cont += PintarImagenesTexto(xmlDoc0);
            document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
            ; break;
        case "notificaciones":

            ; break;
    }
}

function PonerProxPagoSinMora(obj, clave) {
    $.post(url + 'logic/controlador.aspx?op=' + (obj.checked ? "ConcederPagoSinMora" :"QuitarPagoSinMora") + '&seccion=aportaciones', { domicilio: clave }, function (xmlDoc) {
        obj.checked = (GetValor(xmlDoc, "existe") == "true");
        if (GetValor(xmlDoc, "estatus") == "1") {
            //
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function EnviarNotificacion(obj) {
    var titulo=obj.parentNode.getElementsByTagName("input")[0].value;
    var mensaje = obj.parentNode.getElementsByTagName("textarea")[0].value;    
    $.post(url + 'logic/controlador.aspx?op=Guardar&seccion=notificaciones', {domicilio: document.getElementById("detalle-ap_domicilios").getAttribute("clave"),titulo:titulo,mensaje:mensaje}, function (xmlDoc) {
        alert(GetValor(xmlDoc, "mensaje_"));
    });
}

function VerConvenios(clave) {
    document.getElementById("dom-conv").value = clave;
    CargarCatalogo('convenios', function () {
        CambioPantalla('lista-convenios','detalle-ap_domicilios');
    }, {domicilio:clave});
}


function VerConfigurarPagos() {    
    CargarCatalogo('config_pagos', function () {
        CambioPantalla('lista-config_pagos', 'p-edicion-config');
    });
}

function CerrarSesionesRemotas(clave) {
    $.post(url + 'logic/controlador.aspx?op=CerrarSesiones&seccion=usuarios&clave=' + clave, function (xmlDoc) {
        alert(GetValor(xmlDoc, "mensaje"));
    });
}

function SuspenderAlarmaVecinal(check, usuario) {
    $.post(url + 'logic/controlador.aspx?op=PermitirAlarmaVecinal&seccion=usuarios&usuario=' + usuario + "&activar=" + check.checked, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            check.checked = (GetValor(xmlDoc, "activo_AV") == "true");
            document.getElementById("fecha_suspension_av").value = GetValor(xmlDoc, "fechasuspension")
        } else {
            check.checked = !check.checked;
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function ActivarDesactivarUsuario(check, usuario) {
    $.post(url + 'logic/controlador.aspx?op=ActivarDesactivarUsuario&seccion=usuarios&usuario=' + usuario + "&activar=" + check.checked, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            check.checked = (GetValor(xmlDoc, "activo") == 1);
        } else {
            check.checked = !check.checked;
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function MostrarEstadosCuenta() {
    $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=estados_cuenta&claveItem=1', function (xmlDoc) {
        var cont = PintarImagenesTexto(xmlDoc);
        if (xmlDoc.getElementsByTagName("Table1").length > 0) {
            document.getElementById("c-e-estados_cuenta").innerHTML = cont;
        } else {
            document.getElementById("c-e-estados_cuenta").innerHTML = "<p><img src='img/warning.png' style='width:15%;'/><b>NO EXISTEN ESTADOS DE CUENTA BANCARIOS INFORMADOS AL SISTEMA DE SU FRACCIONAMIENTO. SOLICITE A SU COMITE QUE SE INTEGRE ESTE DOCUMENTO ACTUALIZADO. <br /></b></p>";
        }
    });
}

function XmlToStr(xmlNode) {
    try {
        // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
        return (new XMLSerializer()).serializeToString(xmlNode);
    }
    catch (e) {
        try {
            // Internet Explorer.
            return xmlNode.xml;
        }
        catch (e) {
            //Other browsers without XML Serializer
            alert('Xmlserializer not supported');
        }
    }
    return false;
}

function EjecutarRestriccionTags(general, domicilio) {
    $.post(url + 'logic/controlador.aspx?op=ObtenerEstatusDomicilios&seccion=ap_domicilios&general=' + general + (domicilio ? '&domicilio=' + domicilio : ""), function (xmlDoc) {
        $.ajax({
            url: urlLocal + '/controlador.aspx?op=ProcesarRestriccionTags&seccion=ap_domicilios',
            data: XmlToStr(xmlDoc),
            type: 'POST',
            contentType: "text/xml",
            dataType: "xml",
            success: function (xmlDocR) {
                //if (GetValor(xmlDocR, "estatus") == "1") {
                //} else {
                alert(GetValor(xmlDocR, "mensaje"));
                //}                
            }, error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    });
}

function RealizarPagoRes() {
    var folio = document.getElementById("lista-pagos_res").getAttribute("folio");
    var abono = parseFloat(prompt("Ingrese la cantidad a registrar:"));
    if (abono > 0.0) {
        $.post(url + 'logic/controlador.aspx?op=RealizarPagoRes&seccion=pagos_res', { solicitud: folio, abono: abono }, function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == "1") {
                VerPagosRes(folio);
                CargarCatalogo("solicitudes_res");
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        });
    } else {
        alert("Ingrese un valor válido.");
    }
}

function AsociarDomiciliosPropietario() {
    var usuario = document.getElementById("detalle-usuarios").getAttribute("clave");
    document.getElementById("usuario-prop").innerHTML = document.getElementById("usu-" + usuario).innerHTML;
    CambioPantalla("lista-propdomicilios", "detalle-usuarios");
    document.getElementById("claveusuario").value = usuario;
    CargarCatalogo("propdomicilios", function () { }, { usuario: usuario });
}

function BloquearNotificaciones(clave_usuario) {
    $.post(url + 'logic/controlador.aspx' + '?op=BloquearNotificaciones&seccion=usuarios', function (xmlDoc) {
        alert(GetValor(xmlDoc, "mensaje"));
    });
}

function PintarImagenesTexto(xmlDoc0, crearApartados) {
    var persona_i, persona_ii, colores = [];
    imgsTexto = xmlDoc0.getElementsByTagName("Table1");
    var cont = "";
    for (var j = 0; j < imgsTexto.length; j++) {
        persona_i = GetValor(imgsTexto[j], "usuario");
        if (crearApartados) {
            if (!colores[persona_i]) colores[persona_i] = getRandomColor();
            if (persona_i != persona_ii) {
                cont += "<div class='firma-hist'><span>" + GetValor(imgsTexto[j], "nombre") + (GetValor(imgsTexto[j - 1], "cargo") ? "(" + GetValor(imgsTexto[j], "cargo") + ")" : "") + ", </span><span>" + GetValor(imgsTexto[j], "fecha") + "</span></div>";
                cont += "<hr style='border:5px solid " + colores[GetValor(imgsTexto[j], "usuario")] + ";clear:both;width:60%;margin-top:2px;margin-bottom:2px;'/>";
            }
            persona_ii = persona_i;
        }
        var extension = GetValor(imgsTexto[j], "extension");
        var re = new RegExp(".gif|.jpg|.jpeg|.tiff|.png", "gi");
        if (re.test(extension)) {
            cont += (GetValor(imgsTexto[j], "path") ? '<img class="file" src="' + url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random() + '" />' : "") +
                (GetValor(imgsTexto[j], "descripcion").length > 0 ? '<p>' + GetValor(imgsTexto[j], "descripcion") + '</p>' : '');
        } else {
            cont += (GetValor(imgsTexto[j], "path") ? '<a class="file-link" onclick="javascript:AbrirDocumento(\'' + url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random() + '\',\'_system\');" >Documento' + extension + '</a>' : "") +
                (GetValor(imgsTexto[j], "descripcion").length > 0 ? '<p>' + GetValor(imgsTexto[j], "descripcion") + '</p>' : '');
        }
    }
    return cont;
}

function AbrirDocumento(url, target, extension) {
    var nombreArch = url.split("?")[0];
    nombreArch = nombreArch.split('/')[nombreArch.split("/").length - 1];
    if (!isPhonegapApp) {
        window.open(url, target);
    } else {
        downloadFile(url, nombreArch, function (filenntry) {
            var localpath = filenntry.toURL();
            try {
                cordova.plugins.fileOpener2.open(
                    localpath,
                    (extension == "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : (extension == "img" ? "image/png" : "application/pdf")),
                    {
                        error: function () { },
                        success: function () { }
                    }
                );
            } catch (e) { }
        }, function () { alert("Falló descarga de archivo."); })
    }
}

function VerTags(domicilio) {
    CargarCatalogo("tags", function () {
        CambioPantalla('lista-tags', 'detalle-ap_domicilios');
    }, { d: domicilio });
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

function AutorizarNegocio(objeto) {
    $.post(url + 'logic/controlador.aspx' + '?op=Moderar&seccion=prodserv' + '&claveItem=' + objeto.value + "&activar=" + objeto.checked, function (xmlDoc) {
        var btn = document.getElementById("autorizar-negocio");
        btn.checked = (GetValor(xmlDoc, "activo") == "true");
    });
}

function PintarItemEditar(catalogo, clave, xmlDoc0) {
    var cont = "", imgsTexto;
    var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
    var frm = document.getElementById("frm-edit-" + catalogo);
    switch (catalogo) {
        case "config_pagos":
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-config_pagos', descripcion: 'desc-config_pagos', cuota: 'cuota-config_pagos', porcent_mora: 'porcent_mora-config_pagos', ctd_mes_dcto: 'ctd_mes_dcto', es_paq: 'es_paq', es_mayor_que: 'es_mayor_que', fecha: 'fecha_config_pagos', cat_default:'cat_default',dia_corte:'cp_dia_corte' });
            break;
        case "convenios":
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-convenios', descripcion: 'desc-conv', domicilio: 'dom-conv', porcentaje_pago: 'prcp-conv', porcentaje_dcto: 'prcd-conv', ctd_meses_ant: 'ma-conv', ctd_meses_actuales: 'mr-conv'});
            break;
        case "depositos_banco":
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-depositos_banco', fecha_comprobante: 'db-fecha', monto: 'db-monto', origen:'db-origen'});
            break;
        case "tags":
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-tags', descripcion: 'desc-vehi', domicilio: 'd-vehi', placas: 'placas-vehi', no_tag: 'tag-vehi', marbete: 'marb-vehi', nombre_usuario: 'usuario-vehi', id_usuario_disp: 'id_usuario_disp' });
            break;
        case "reservaciones":
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-reservaciones', descripcion: 'res-descripcion', inicio: 'res-inicio', fin: 'res-fin', fecha_reservada: 'fecha_reservada', inmueble: 'ed-res-inmueble' });
            break;
        case "ap_domicilios":
            CargarDatosFrmMap(xmlDoc, { clave: 'clave-ap_domicilios', calle: 'dom-calle', titular: 'dom-titular', manzana: 'dom-mz', lote: 'dom-lt', numero: 'dom-numero', no_interior: 'dom-no_int', fecha_entrega: 'fecha_entrega', segmento: 'seg-dom', email: 'email-dom', telefono: 'tel-dom', dia_corte: 'dia_corte-dom', config_pagos:'config_pag-dom' });
            break;
        case "ap_conceptos":
            CargarDatosFrmMap(xmlDoc, { clave: 'clave-ap_conceptos', nombre: 'con-nombre', descripcion: 'con-descripcion', monto: 'con-monto' });
            break;
        case "cargos":
            CargarDatosFrmMap(xmlDoc, { clave: 'clave-cargos', nombre: 'nombre-cargos', descripcion: 'descripcion-cargos' });
            break;
        case "usuarios":
            CargarDatosFrmMap(xmlDoc, { clave: 'clave-usu', usuario: 'nombre-usu', apellidos: 'apellidos-usu', correo: "email-usu" });
            break;
        case "egrepro":
            document.getElementById("clave-" + catalogo).value = clave;
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-egrepro', titulo: 'egrepro-titulo', proyecto: 's-egre-propro' });
            break;
        case "inmuebles":
            document.getElementById("clave-" + catalogo).value = clave;
            CargarDatosFrmMap(xmlDoc, { indice: 'clave-inmuebles', titulo: 'in-titulo', descripcion: 'in-descripcion', cuotah: 'cuotah' });
            break;
        case "tiposgastos":
        case "pro_propuestas":
        case "comunicados":
        case "talleres":
        case "solicitudes":
        case "solicitudes_seg":
        case "prodserv":
        case "proyectos":
            document.getElementById("clave-" + catalogo).value = clave;
            if (catalogo == "prodserv") {
                document.getElementById("check-negocio").style.display = (GetValor(xmlDoc, "esmismo") ? "block" : "none");
                frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "descripcion");
                frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "NombreNegocio");
                document.getElementById("prodserv-telefonos").value = GetValor(xmlDoc, "telefonos");
                document.getElementById("prodserv-horario").value = GetValor(xmlDoc, "horario");
                document.getElementById("prodserv-palabrasclave").value = GetValor(xmlDoc, "palabrasclave");
            } else if (catalogo == "comunicados") {
                document.getElementById("desc-com").value = GetValor(xmlDoc, "mensaje");
                frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
            } else if (catalogo == "pro_propuestas") {
                frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "titulo");
                frm.getElementsByTagName("textarea")[1].value = GetValor(xmlDoc, "descripcion");
            } else if (catalogo == "solicitudes") {
                frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "descripcion");
                frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
                SetValor(xmlDoc, "tipoSolicitud", 's-tipossolicitudatencion');
            } else if (catalogo == "solicitudes_seg") {
                frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "descripcion");
                frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
            } else if (catalogo == "talleres") {
                frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "horario");
                frm.getElementsByTagName("textarea")[1].value = GetValor(xmlDoc, "descripcion");
                frm.getElementsByTagName("input")[0].value = GetValor(xmlDoc, "titulo");
                frm.getElementsByTagName("input")[1].value = GetValor(xmlDoc, "telefonos");
                frm.getElementsByTagName("input")[2].value = GetValor(xmlDoc, "email");
            } else if (catalogo == "proyectos") {
                frm.getElementsByTagName("textarea")[0].value = GetValor(xmlDoc, "titulo");
                if (GetValor(xmlDoc, "propuesta")) {
                    document.getElementById("div-prop").style.display = "block";
                } else {
                    document.getElementById("div-prop").style.display = "none";
                }
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
                unImagentexto.imagen.setAttribute("sel", 1);
                var extension = GetValor(imgsTexto[j], "extension");
                var re = new RegExp(".gif|.jpg|.jpeg|.tiff|.png", "gi");
                if (re.test(extension)) {
                    unImagentexto.imagen.src = url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random();
                } else {
                    unImagentexto.imagen.src = 'img/pdf.png';
                }
                unImagentexto.texto.value = GetValor(imgsTexto[j], "descripcion");
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
                unTexto.setAttribute("cambioTexto", "true");
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

function CargarDatosFrmPref(xmlDoc, tags, pref) {    //Los tag name del xml se buscan en el formulario por id, si coinciden se carga el dato.
    for (var i = 0; i < tags.length; i++) {
        try { SetValor(xmlDoc, tags[i], pref + tags[i]); } catch (e) { }
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

function IniciarEditar(esNuevo, catalogo, solotexto, intercambio, clave, callback) {
    if (window.event) window.event.stopPropagation();
    if (esNuevo) {
        document.getElementById('op-' + catalogo).value = "true";
        if (solotexto != 2 || solotexto == undefined || solotexto == null) {
            document.getElementById("c-e-" + catalogo).innerHTML = "";
            IAgregarImagenTexto('c-e-' + catalogo, solotexto);
        }
        if (intercambio) {
            Mostrar(intercambio.a, intercambio.b);
            document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar(intercambio.b, intercambio.a); }
        } else {
            Mostrar('lista-' + catalogo, 'p-edicion-' + catalogo);
            document.getElementById("cancelar-edit-" + catalogo).onclick = function () { Mostrar('p-edicion-' + catalogo, 'lista-' + catalogo); }
        }
        var frm = document.getElementById("frm-edit-" + catalogo);
        if (frm) {
            frm.reset();
        }
        if (callback) callback();
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
        var frm = document.getElementById("frm-edit-" + catalogo);
        if (frm) {
            frm.reset();
        }
        var datos = { claveItem: clave };
        if (typeof (clave) != "object") {
            { claveItem: clave };
        } else {
            datos = clave;
        }
        $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo, datos, function (xmlDoc) {
            //QuitarEspera();
            if (callback) {
                callback(xmlDoc);
            } else {
                PintarItemEditar(catalogo, clave, xmlDoc);
            }
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


function IniciarEliminar(objeto, catalogo, clave, intercambio, noImgTxt, datos, callback) {
    if (confirm("Confirme que desea eliminar")) {
        if (!clave) {
            clave = document.getElementById("detalle-" + catalogo).getAttribute("clave");
        }
        $.post(url + 'logic/controlador.aspx?op=' + (noImgTxt ? 'Eliminar' : 'EliminarItem') + '&seccion=' + catalogo + '&claveItem=' + clave, function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == 1) {
                if (intercambio) {
                    Mostrar(intercambio.a, intercambio.b);
                    if (callback) callback();
                } else {
                    Mostrar('detalle-' + catalogo, 'lista-' + catalogo);
                }
                CargarCatalogo(catalogo, function () {
                    MostrarOpcionesHabilitadas(true);
                }, datos);
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
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
    CargarCatalogo("prodserv", function () { Mostrar('buscador-prodserv', 'lista-prodserv'); }, { buscar: inp.value });
}

function ValidarEnter(ev) {
    if (ev) {
        return (ev.which == 13 || ev.keyCode == 13);
    }
}


function VerAgregarRecibosHistorial() {
    CargarCatalogo("ap_domiciliosH", function () {
        CambioPantalla('lista-ap_domiciliosH', 'p-edicion-aportaciones');
    });
}

function SeleccionarConceptoPagar(objeto, clave_concepto) {
    if ($(objeto).hasClass("seleccionado")) {
        if (!$(objeto).hasClass("fijo")) {
            $(objeto).removeClass("seleccionado");
        }
    } else {
       $(objeto).addClass("seleccionado");
    }
    CalcularAportacion();
}

var conceptospagar = [];
var mesespagar = [];
function CalcularAportacion() {
    var items = $("#lista-aportaciones div.seleccionado span.t-1");
    var cuenta = 0;
    conceptospagar = [];
    mesespagar = [];
    var percio = 0;
    for (var i = 0; i < items.length; i++) {
        precio = parseFloat(items[i].getAttribute("precio"));
        cuenta += precio;
        if (items[i].getAttribute("es_cuotamensual") == "true") {
            mesespagar.push(items[i].getAttribute("mes") + '-' + items[i].getAttribute("anio"));
        } else {
            conceptospagar.push(items[i].getAttribute("concepto"));
        }
    }
    if (items.length > 0) {
        document.getElementById("sele-n").innerHTML = items.length;
    } else {
        document.getElementById("sele-n").innerHTML = "";
    }
    var btn = document.getElementById("aportacion");
    btn.conceptospagar = conceptospagar;
    btn.mesespagar = mesespagar;
    btn.onclick = function () {
        var redimAp = document.getElementById("redim-aportaciones");
        redimAp.btnAplicar = this;
        if (_es_admin_) {
            if (this.conceptospagar.length > 0 || this.mesespagar.length > 0) {
                redimAp.innerHTML = "<li class='resumen'><fieldset style='border:1px solid #999;border-radius:10px;margin-bottom:12px;text-align:center;font-weight:bold;font-size:0.9em;'><div style='background:transparent;padding:0px;margin:0px;'><label>Tipo de pago:</label><select id='s_tipo_p' style='width:60%;margin-bottom:5px;margin-right:10px;' name='tipopago' onchange='ResolverUIFormaPago(this);'><option value='11'>EFECTIVO</option><option value='10'>DEPOSITO</option></select><span>Compuesto</span><input type='checkbox' name='es_compuesto' id='es_compuesto' value='true'/>" +
                    "<div id='sel_efectivo'><span id='sel_mismodia'><input checked='checked' type='radio' value='true' name='es_mismodia' onclick='document.getElementById(\"ef_f_pago_d\").style.display=\"none\";ObtenerTicketDefault();'><label style='margin-right:50px;'><b>Mismo día</b></label><input type='radio' value='false' name='es_mismodia' onclick='document.getElementById(\"ef_f_pago_d\").style.display=\"block\";'><label><b>Diferente día</b></label></span><div style='display:none;' id='ef_f_pago_d'><br/><label>Fecha de pago:</label><input id='ef_fecha_pago' type='text' name='fecha_pago' placeholder='dd/mm/aaaa' onblur='CambiarFecha(this);' onkeypress='if(ValidarEnter(event)){CambiarFecha(this);}return SoloNumeros(event,\"\/\");'/></div></div>" +
                    "<div style='display:none;' id='sel_deposito'><br/>" +
                    "<span id='deposito_opc' style='padding-bottom:20px;display:block;'><b>No registrado</b><input type='radio' checked='checked' value='false' name='dep_existe' onclick='document.getElementById(\"dep_no_existe\").style.display=\"block\";document.getElementById(\"dep_existe\").style.display=\"none\";'/><b style='margin-left:100px;'>Ya registrado</b><input type='radio' value='true' name='dep_existe' onclick='document.getElementById(\"dep_no_existe\").style.display=\"none\";document.getElementById(\"dep_existe\").style.display=\"block\";ObtenerTicketDefault();'></span>" +
                    "<div id='dep_existe' style='display:none;'>" +
                    "<button class='btn-item' style='float:none;' onclick='SeleccionarDeposito();'>Seleccionar Deposito</button><br/>" +
                    "<div id='wrap-sel_dep'></div>" +
                    "</div>" +
                    "<div id='dep_no_existe' style=''><label>Fecha de pago:</label><input id='f_pago_d' type='text' name='fecha_pago' placeholder='dd/mm/aaaa' onblur='CambiarFecha(this);' onkeypress='if(ValidarEnter(event)){CambiarFecha(this);}return SoloNumeros(event,\"\/\");'  style='margin-right:30px;'/><br/>" +
                    "<br/><label>Origen:</label><input id='dep_origen' type='text' name='origen' style='margin-right:30px;'/><br/>" +
                    "</div>" +
                    "<br/> Capture comprobante: <div id='wrap-detalle-DepositosBancoR' style=''></div></div><br/> </div></fieldset>" +
                    "<fieldset class='gafet-p' style='border:1px solid #999;border-radius:10px;margin-bottom:12px;text-align:center;font-weight:bold;font-size:0.9em;'><legend>Gallardetes</legend><div><input id='gafetes-p' type='text' style='width: 90%;padding: 5px;border:1px solid #aaa;text-align:center;font-size:1.1em;' placeholder='#gallardete1:placas,#gallardete2:placas2,...'/></div><div id='tipo_gafete'><span style='margin-left:15px;'>Mensual</span><input checked='checked' type='radio' value='1' name='tipo_gafete' /><span style='margin-left:15px;'>Semestral</span><input type='radio' value='2' name='tipo_gafete' /><span style='margin-left:15px;'>Anual</span><input type='radio' value='3' name='tipo_gafete'/></div></fieldset>" +
                    "<div style='background:transparent;padding:0px;margin:0px;' id='ticket'></div></li>";

                var contenedor = document.getElementById("wrap-detalle-DepositosBancoR");
                var control = IAgregarImagenTexto(contenedor, undefined, undefined, true);

                var sl = redimAp.getElementsByTagName("select")[0];
                ObtenerTicket(undefined, this, document.getElementById("ticket"), sl.options[sl.selectedIndex].value);

                document.getElementById("gafetes-p").onkeypress = function (ev) {
                    if (ValidarEnter(ev)) {
                        var s_tipo_p = document.getElementById("s_tipo_p");
                        var inF = s_tipo_p.parentNode.getElementsByTagName("input")[1];
                        ObtenerTicket(undefined, document.getElementById("redim-aportaciones").btnAplicar, document.getElementById("ticket"), s_tipo_p.options[s_tipo_p.selectedIndex].value,true);
                    }
                }
            }
        } else {
            if (this.conceptospagar.length > 0 || this.mesespagar.length > 0) {
                var redimAp = document.getElementById("redim-aportaciones");
                redimAp.btnAplicar = this;
                redimAp.innerHTML = "<li class='resumen'><div style='background:transparent;padding:0px;margin:0px;' id='ticket'></div></li>";
                ObtenerTicketResidente(document.getElementById("ticket"));
            }
        }
        btn.innerHTML = "Calcular";
    }
}

function CambiarFecha(obj) {
    var inF = obj;
    ObtenerTicket(inF.value, document.getElementById("redim-aportaciones").btnAplicar, document.getElementById("ticket"), 10);
}

function ObtenerTicketResidente(dom) {
    var redimAp = document.getElementById("redim-aportaciones");
    redimAp.btnAplicar.conceptos = this.conceptospagar;
    redimAp.btnAplicar.mesespagar = this.mesespagar;
    
    $.post(url + 'logic/controlador.aspx' + '?op=GenerarTicket&seccion=aportaciones' + (this.conceptospagar.length > 0 ? '&conceptos=' + this.conceptospagar.join(",") : '') + (this.mesespagar.length > 0 ? "&meses=" + this.mesespagar.join(",") : '') + "&domicilio=" + document.getElementById("w-datos-persona").getAttribute("domicilio_sel"), function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == -1) {
            CargarAportaciones();
            alert(GetValor(xmlDoc, "mensaje"));
        } else{
            var sem = GetValor(xmlDoc, "sem"), ret = GetValor(xmlDoc, "ret"), norm = GetValor(xmlDoc, "norm"), a_cuenta = GetValor(xmlDoc, "a_cuenta"), p_conc = GetValor(xmlDoc, "p_conc"), cont_oc = GetValor(xmlDoc, "cont_oc");
            dom.innerHTML =
                "<p id='datos-contacto' class='leyenda'></p>" +
                "<table class='transparente' style='font-size:0.85em;font-family:verdana;'><thead><tr><th>Cantidad</th><th>Concepto</th><th>Importe</th></tr></thead>" +
                (sem > 0 ? "<tr><td style='text-align:center;'>" + sem + "</td><td>Cuotas con descuento por adelanto<br/>(A partir del sexto mes)</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_sem")) + "</td></tr>" : "") +
                (norm > 0 ? "<tr><td style='text-align:center;'>" + norm + "</td><td>Cuotas mensuales</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_norm")) + "</td></tr>" : "") +
                (ret > 0 ? "<tr><td style='text-align:center;'>" + ret + "</td><td>Cuotas con mora</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_ret")) + "</td></tr>" : "") +
                (cont_oc > 0 ? "<tr><td style='text-align:center;'>" + cont_oc + "</td><td>Otras cuotas</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_conc")) + "</td></tr>" : "") +
                (parseFloat(GetValor(xmlDoc, "pago_req")) > 0 ? "<tr><td colspan=2 style='text-align:right;color:#666;border-top:1px solid #666;font-size:0.95em'>Máximo requerido por convenio(" + GetValor(xmlDoc, "c_pago") + "%): " + MoneyFormat(GetValor(xmlDoc, "pago_req")) + "</td><td style='text-align:right;color:#666;font-size:0.95em;border-top:1px solid #666;'></td></tr>" : "") +
                "<tr><td colspan=2 style='text-align:right;border-top:1px solid #333;'>Cuenta:</td><td style='text-align:right;border-top:1px solid #333;'>" + MoneyFormat(GetValor(xmlDoc, "subtotal")) +
                "</td></tr>" +
                "<tr><td colspan=2 style='text-align:right;'>Tiene a cuenta:</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "a_cuenta")) + "</td></tr>" +
            (parseFloat(GetValor(xmlDoc, "descuento")) > 0 ? "<tr><td colspan=2 style='text-align:right;'>Descuento(" + GetValor(xmlDoc, "p_desc") + "%):</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "descuento")) + "</td></tr>" : "") +
                "<tr><td colspan=2 style='text-align:right;'>Total:</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "total")) + "</td></tr>" +
                "</table><form onsubmit='return false;' id='frm-edit-depositos_banco_res'><fieldset><input type='hidden' value='true' name='esNuevo' id='op-depositos_banco' /><input type='hidden' name='clave' id='clave-depositos_banco' /><input type='hidden' name='domicilio' value='" + document.getElementById("w-datos-persona").getAttribute("domicilio_sel") + "'/><input type='hidden' name='validacion' value='3' /><div id='c-e-depositos_banco'></div>" +
                "<button style='display:none;'></button><button class='aceptar' style='margin-top:0px;' name='pagar' id='btn_pagar_p'>Enviar Comprobante</button></fieldset></form></li>";

            var contenedor = document.getElementById("c-e-depositos_banco");
            var control = IAgregarImagenTexto(contenedor, undefined, undefined, true);

            var btn_pagar = document.getElementById("btn_pagar_p");
            btn_pagar.btnAplicar = redimAp.btnAplicar;
            btn_pagar.onclick = function () {
                var btn = this;
                Guardar(btn, "depositos_banco", function () { alert("Guardado correctamente."); CargarAportaciones();}, undefined, document.getElementById("frm-edit-depositos_banco_res"));  
            }
            redimAp.btnAplicar.innerHTML = "Reiniciar";
            redimAp.btnAplicar.onclick = function () {
                CargarAportaciones();
            }
        }
    });
}

function SeleccionarDeposito() {
    CargarCatalogo("depositos_banco_sel", function () {
        CambioPantalla("lista-depositos_banco_sel", "lista-aportaciones");
    }, {buscar:"",domicilio:document.getElementById("w-datos-persona").getAttribute("domicilio_sel")});
}

function AgregarPermisoCapturaRecibos() {
    var foliospermiso = window.prompt("Capture folios de recibo(Separe por comas, p.ej. 45689,45893,etc.):");
    $.post(url + 'logic/controlador.aspx' + '?op=AgregarPermisoRecibosCaptura&seccion=aportaciones', { folios: foliospermiso }, function (xmlDoc1) {
        alert(GetValor(xmlDoc1, "mensaje"));
    });
}

function ResolverUIFormaPago(obj) {
    if (obj.selectedIndex == 1) {
        document.getElementById("sel_deposito").style.display = 'block';
        document.getElementById("sel_efectivo").style.display = 'none';
    } else {
        document.getElementById("sel_efectivo").style.display = 'block';
        document.getElementById("sel_deposito").style.display = 'none';
        //obj.parentNode.getElementsByTagName("input")[1].parentNode.style.display = "none";        
    }
    ObtenerTicketDefault();
}

function ObtenerTicketDefault() {
    var obj = document.getElementById("s_tipo_p");
    ObtenerTicket(undefined, document.getElementById("redim-aportaciones").btnAplicar, document.getElementById("ticket"), obj.options[obj.selectedIndex].value);
}

function ObtenerTicket(fecha, btnAplicar, dom, tipo_pago,mantenerFecha) {
    var redimAp = document.getElementById("redim-aportaciones");
    btnAplicar.conceptos = this.conceptospagar;
    btnAplicar.mesespagar = this.mesespagar;
    var gallardetes = document.getElementById("gafetes-p").value;
    var no_g = gallardetes.split(",");
    var tipoGafetes = $("#tipo_gafete input[name='tipo_gafete']:checked").val();
    $.post(url + 'logic/controlador.aspx' + '?op=GenerarTicket&seccion=aportaciones' + (this.conceptospagar.length > 0 ? '&conceptos=' + this.conceptospagar.join(",") : '') + (this.mesespagar.length > 0 ? "&meses=" + this.mesespagar.join(",") : '') + "&domicilio=" + document.getElementById("w-datos-persona").getAttribute("domicilio_sel") + (fecha ? "&fecha_pago=" + fecha : ""), { gafetes: gallardetes, tipo_g: tipoGafetes }, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == -1) {
            CargarAportaciones();
            alert(GetValor(xmlDoc, "mensaje"));
        } else {
            var sem = GetValor(xmlDoc, "sem"), ret = GetValor(xmlDoc, "ret"), norm = GetValor(xmlDoc, "norm"), a_cuenta = GetValor(xmlDoc, "a_cuenta"), p_conc = GetValor(xmlDoc, "p_conc"), cont_oc = GetValor(xmlDoc, "cont_oc");
            if (GetValor(xmlDoc, "comp").length > 0) {
                var d_comp = document.getElementById("es_compuesto");
                d_comp.checked = true;
                d_comp.disabled = true;
            }
            dom.innerHTML =
                "<table class='transparente' style='font-size:0.85em;font-family:verdana;'><thead><tr><th>Cantidad</th><th>Concepto</th><th>Importe</th></tr></thead>" +
                (sem > 0 ? "<tr><td style='text-align:center;'>" + sem + "</td><td>Cuotas con descuento por adelanto<br/>(A partir del sexto mes)</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_sem")) + "</td></tr>" : "") +
                (norm > 0 ? "<tr><td style='text-align:center;'>" + norm + "</td><td>Cuotas mensuales</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_norm")) + "</td></tr>" : "") +
                (ret > 0 ? "<tr><td style='text-align:center;'>" + ret + "</td><td>Cuotas con mora</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_ret")) + "</td></tr>" : "") +
                (cont_oc > 0 ? "<tr><td style='text-align:center;'>" + cont_oc + "</td><td>Otras cuotas</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "p_conc")) + "</td></tr>" : "") +
                (parseFloat(GetValor(xmlDoc, "pago_req")) > 0 ? "<tr><td colspan=2 style='text-align:right;color:#666;border-top:1px solid #666;font-size:0.95em'>Máximo requerido por convenio(" + GetValor(xmlDoc, "c_pago") + "%): " + MoneyFormat(GetValor(xmlDoc, "pago_req")) + "</td><td style='text-align:right;color:#666;font-size:0.95em;border-top:1px solid #666;'></td></tr>" : "") +
                "<tr><td colspan=2 style='text-align:right;border-top:1px solid #333;'>Cuenta:</td><td style='text-align:right;border-top:1px solid #333;'>" + MoneyFormat(GetValor(xmlDoc, "subtotal")) +
                "</td></tr>" +
                "<tr><td colspan=2 style='text-align:right;'>Tiene a cuenta:</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "a_cuenta")) + "</td></tr>" +
                (parseFloat(GetValor(xmlDoc, "descuento")) > 0 ? "<tr><td colspan=2 style='text-align:right;'>Descuento(" + GetValor(xmlDoc, "p_desc") + "%):</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "descuento")) + "</td></tr>" : "") +
                "<tr><td colspan=2 style='text-align:right;'>Total:</td><td style='text-align:right;'>" + MoneyFormat(GetValor(xmlDoc, "total")) + "</td></tr>" +
                "</table>" +
                "<form class='edicion compact' style='overflow-x:hidden;' onsubmit='return false;' ><div style='float:left;width:49%;overflow:hidden;'><label>Cantidad que recibe:</label><input type='text' name='recibe' id='recibe_p' placeholder='Cantidad que recibe' />" +
                "<input type='hidden' name='total' value='" + GetValor(xmlDoc, "total") + "' />" +
                "<input type='hidden' name='deposito_asociado' id='deposito_asociado' />" +
                "<label>Deja a cuenta:</label><input type='text' name='deja_a_cuenta' id='deja_a_cuenta' placeholder='Ingrese monto' />" +
                "</div><div style='float:right;width:49%;overflow:hidden;'><label>Cambio:</label><input type='text' readonly=readonly name='cambio' id='cambio_p' placeholder='Cambio' /><hr class='clearn'/>" +
                "<label>Recibo No.:</label><input type='text' name='recibo' id='recibo_n' maxlength=5 placeholder='Ingrese no. recibo' /></div>" +
                "<label>Persona que paga:</label><input type='text' name='pagador' placeholder='Persona que paga' id='pagador_p' />" +
                "<button style='display:none;'></button><button class='aceptar' style='margin-top:0px;' name='pagar' id='btn_pagar_p'>Pagar</button></form></li>";
            var in_recibe = $(dom).find("input[name='recibe']")[0];
            var btn_pagar = document.getElementById("btn_pagar_p");
            btn_pagar.conceptospagar = btnAplicar.conceptos;
            btn_pagar.mesespagar = btnAplicar.mesespagar;
            in_recibe.v_t = parseFloat(GetValor(xmlDoc, "total"));
            in_recibe.onblur = function (ev) {
                var diferencia = parseFloat(this.value) - this.v_t;
                try {
                    if (diferencia >= 0.00) {
                        document.getElementById("cambio_p").value = MoneyFormat(diferencia);
                    } else {
                        document.getElementById("cambio_p").value = "-E";
                    }
                    ev.stopPropagation();
                } catch (e) { }; return SoloNumeros(event, '.');
                //this.value = MoneyFormat(this.value);
            }

            in_recibe.onkeypress = function (ev) {
                if (ValidarEnter(ev)) {
                    this.onblur();
                    document.getElementById("recibo_n").focus();
                }
            }
            if (!mantenerFecha) { btn_pagar.fecha = fecha };
            btn_pagar.onclick = function () {
                if (confirm("Confirme que desea aplicar pago:")) {
                    var num;
                    var gallardetes = document.getElementById("gafetes-p").value;
                    var no_g = gallardetes.split(",");
                    var sl = document.getElementById("redim-aportaciones").getElementsByTagName("select")[0];
                    var tipo_pago = sl.options[sl.selectedIndex].value;
                    var tipoGafetes = $("#tipo_gafete input[name='tipo_gafete']:checked").val();
                    if (document.getElementById("es_compuesto").checked && (num = window.prompt("Ingrese numeración[1,2,..]")).trim().length > 0 || !document.getElementById("es_compuesto").checked) {
                        $.post(url + 'logic/controlador.aspx' + '?op=PagarTicket&seccion=aportaciones' + (this.conceptospagar.length > 0 ? '&conceptos=' + this.conceptospagar.join(",") : '') + (this.mesespagar.length > 0 ? "&meses=" + this.mesespagar.join(",") : '') + "&domicilio=" + document.getElementById("w-datos-persona").getAttribute("domicilio_sel") + (this.fecha ? "&fecha_pago=" + this.fecha : "") + "&tipopago=" + tipo_pago + "&es_compuesto=" + document.getElementById("es_compuesto").checked + "&parte=" + num + "&gafetes=" + gallardetes + "&tipo_g=" + tipoGafetes + "&origen=" + document.getElementById("dep_origen").value, $($(redimAp).find("form")[0]).serializeArray(), function (xmlDoc1) {
                            alert(GetValor(xmlDoc1, "mensaje"));
                            if (GetValor(xmlDoc1, "estatus") == 1) {
                                ImprimirReciboCuotas(GetValor(xmlDoc1, "recibo"), GetValor(xmlDoc1, "folio"), GetValor(xmlDoc1, "domicilio"));
                                CargarAportaciones();
                                try { GuardarImagenesTextos(GetValor(xmlDoc1, "deposito_asociado"), "wrap-detalle-DepositosBancoR", "depositos_banco"); } catch (e) { }
                                try { EnviarReciboEmail(null, GetValor(xmlDoc1, "folio"), false); } catch (e) { }
                                try { EjecutarRestriccionTags(false, document.getElementById("w-datos-persona").getAttribute("domicilio_sel")); } catch (e) { }
                            }
                        });
                    } else {
                        alert("Debe ingresar un dato.");
                    }
                }
            }
            btnAplicar.innerHTML = "Reiniciar";
            btnAplicar.onclick = function () {
                CargarAportaciones();
            }
        }
    });
}


function GuardarImagenesTextos(claveItem, contenedor, catalogo, callback, subitemCatalogo) {
    try {
        var imagenes = document.getElementById(contenedor).getElementsByTagName("table");
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
            GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback, claveItem, catalogo);
        } else if (textosCambio.length > 0) {
            GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, subitemCatalogo);
        } else {
            if (callback) callback(claveItem);
        }
    } catch (e) {
        alert(e.message);
    }

}


function ImprimirReciboCuotas(recibo, folio, domicilio) {
    window.open(url + 'logic/controlador.aspx?op=GenerarReciboCaida&seccion=aportaciones&domicilio=' + domicilio + '&recibo=' + recibo + "&folio=" + folio, '_blank', 'width:800,height:600');
}


function RegistrarDepositoACuenta() {
    try {
        var monto = parseFloat(window.prompt("Ingrese monto a guardar"));
        $.post(url + 'logic/controlador.aspx' + '?op=DepositarACuenta&seccion=aportaciones&monto=' + monto + "&domicilio=" + document.getElementById("w-datos-persona").getAttribute("domicilio_sel"), function (xmlDoc1) {
            alert(GetValor(xmlDoc1, "mensaje"));
            if (GetValor(xmlDoc1, "estatus") == 1) {
                CargarAportaciones();
            }
        });
    } catch (e) { alert("Ingrse una cantidad válida"); }
}

var togglePagos = undefined;
function SeleccionarTodoP() {
    var objeto;
    var meses = $("#redim-aportaciones li>div");
    var n = meses.length;
    if (n > 0) {
        for (var i = 0; i < n; i++) {
            objeto = meses[i];
            if ($(objeto).hasClass("PENDIENTE")) {
                if (togglePagos) {
                    if (!$(objeto).hasClass("fijo")) {
                        $(objeto).removeClass("seleccionado");
                    }
                } else {
                    $(objeto).addClass("seleccionado");
                }
            }
        }
        togglePagos = !togglePagos;
        CalcularAportacion();
    }
}

function TabMostrar(tab, raiz, id, catalogo, callback) {
    try { raiz.seleccionado.className = "tab"; } catch (e) { }
    raiz.seleccionado = tab;
    raiz.seleccionado.className = "tab tab-sel";
    var tabs = raiz.getAttribute("tabs").split(',');
    for (var i = 0; i < tabs.length; i++) {
        document.getElementById(tabs[i]).style.display = "none";
    }
    var obj = document.getElementById(id);
    obj.style.display = "block";
    window.pvisible = obj.getElementsByTagName("div")[0];
    MostrarOpcionesHabilitadas(true);
    if (catalogo) {
        CargarCatalogo(catalogo);
    }
    if (callback) callback();
}

function PantallaMostrar(catalogo, tagName, no_post, callback, _pvisible) {
    window.pvisible = document.getElementById(catalogo).getElementsByTagName("div")[0];

    var pants = document.getElementsByTagName(tagName);
    if (!no_post) {
        CargarCatalogo(catalogo);
    }
    for (var i = 0; i < pants.length; i++) {
        pants[i].style.display = "none";
    }
    var obj = document.getElementById(catalogo);
    if (_pvisible) window.pvisible = document.getElementById(_pvisible);
    if (callback) callback();
    obj.style.display = "block";
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
    Mostrar('lista-pro', 'p-edicion-pro');
}

function CambioPantalla(id1, id2) {
    var obj = document.getElementById(id1);
    window.pvisible = obj;
    document.getElementById(id2).style.display = "none";
    obj.style.display = "block";
}

function IntercambioVisual(id1, id2) {
    document.getElementById(id2).style.display = "none";
    document.getElementById(id1).style.display = "block";
}


function CargarCatalogo(catalogo, callback, parametros, callbackin) {
    var ops = catalogo.split("."), op = "cargar", cat_ = catalogo;
    if (ops.length == 2) {
        catalogo = ops[0];
        op = ops[1];
    }
    $.post(url + 'logic/controlador.aspx' + '?op=' + op + '&seccion=' + catalogo, parametros, function (xmlDoc) {
        var items = xmlDoc.getElementsByTagName(catalogo == "encuestas" ? "Encuesta" : "Table");
        var lista = document.getElementById("lista-" + cat_).getElementsByTagName("ul")[0];
        lista.innerHTML = "";
        for (var n = 0; n < items.length; n++) {
            lista.appendChild(ObtenerItem(cat_, items[n]));
        }
        if (callback)
            callback(xmlDoc);
    });
}

function CargarAportaciones(esBusquedaF, adelanto) {
    document.getElementById("aportacion").innerHTML = "Seleccione cuotas";
    var fechas = document.getElementById('buscar-ap-fecha').value.split("-");
    var datos = {};
    if (esBusquedaF) { datos["esBusquedaF"] = 1; }
    if (fechas[0] && fechas[0].length > 0) {
        datos["fecha1"] = fechas[0];
    }
    if (fechas[1] && fechas[1].length > 0) {
        datos["fecha2"] = fechas[1];
    }
    datos["domicilio_sel"] = document.getElementById('w-datos-persona').getAttribute('domicilio_sel');
    if (adelanto) {
        datos["adelanto"] = adelanto;
    }
    CargarCatalogo('aportaciones', function (xml) {
        var n = GetValor(xml, "adelanto");
        document.getElementById("sele-n").innerHTML = "";
        CalcularAportacion();
        $.post(url + 'logic/controlador.aspx' + '?op=ValidarPagar&seccion=aportaciones', function (xmlDoc) {
            if (GetValor(xmlDoc, "admin_pago") == 1) {
                _es_admin_ = true;
            } else if (GetValor(xmlDoc, "residente")) {
                _es_admin_ = false;
            }
        });
    }, datos);
}

function VerInforme(clave, config, pdf, xls) {
    var fecha1 = document.getElementById("i-fecha1").value;
    var fecha2 = document.getElementById("i-fecha2").value;
    if (fecha1.trim().length > 0 && fecha2.trim().length > 0) {
        if (pdf || xls) {
            AbrirDocumento(url + 'logic/documento.' + (pdf ? 'pdf' : 'xlsx') + '?op=ObtenerInforme&seccion=transparencia' + (xls ? '&xls=' + xls : '') + (pdf ? '&pdf=' + pdf : '') + '&tabla=1&clave=' + clave + "&fecha1=" + fecha1 + "&fecha2=" + fecha2, "_system", pdf ? 'pdf' : 'xlsx');
        } else {
            CambioPantalla("detalle-transparencia", "lista-transparencia");
            document.getElementById("table-resultados-tr").innerHTML = "";
            if (config) {
                document.getElementById('graf-transparencia').style.display = "none";
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerInforme&seccion=transparencia&grafica=1&clave=' + clave + "&fecha1=" + fecha1 + "&fecha2=" + fecha2, function (xmlDoc) {
                    var pcanvas = document.getElementById('graf-transparencia');
                    pcanvas.style.display = "block";
                    MostrarGrafica(xmlDoc, config, pcanvas);
                });
            } else {
                document.getElementById('graf-transparencia').style.display = "none";
            }
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerInforme&seccion=transparencia&tabla=1&clave=' + clave + "&fecha1=" + fecha1 + "&fecha2=" + fecha2, function (xmlDoc) {
                var wrap = document.getElementById("table-resultados-tr");
                wrap.innerHTML = xmlDoc;
            });
        }
    } else {
        alert("Ingrese fecha inicio y fecha final.");
    }
}

function MostrarGrafica(xmlDoc, configS, pcanvas) {
    window.eval("var config=" + configS + ";");
    var datos = { data: { datasets: [], labels: [] } };
    var ds = xmlDoc.getElementsByTagName("Table");
    var datasets = []; var colores = [];
    for (var i = 0; i < config.datasets.length; i++) {
        datasets[i] = [];
    }
    for (var j = 0; j < ds.length; j++) {
        for (var i = 0; i < config.datasets.length; i++) {
            datasets[i][j] = GetValor(ds[j], config.datasets[i]);
        }
        datos.data.labels[j] = GetValor(ds[j], config.labelsTag);
        if (config.colorPorLabel) {
            colores[j] = Chart.helpers.color(getRandomColor()).alpha(0.5).rgbString();
        }
    }
    for (var i = 0; i < config.datasets.length; i++) {
        if (config.colorPorDS) {
            colores = Chart.helpers.color(getRandomColor()).alpha(0.5).rgbString();
        }
        datos.data.datasets[i] = { data: datasets[i], label: config.labelsDS[i], backgroundColor: colores };
    }
    for (var propiedad in config.otros) {
        datos[propiedad] = config.otros[propiedad];
    }
    pcanvas.innerHTML = "";
    var c = document.createElement("canvas");
    pcanvas.appendChild(c);
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    window.grafica = new Chart(ctx, datos);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function ToggleChecks(obj, id) {
    var lista = $("#" + id + " input[type=checkbox]");
    var checked = obj.checked;
    for (var i = 0; i < lista.length; i++) {
        lista[i].checked = checked;
    }
}

function ConfigurarCargo(obj, cargo) {
    var unCargo = obj.parentNode.txt;
    document.getElementById("UnCargoEd").innerHTML = unCargo;
    CambioPantalla("lista-cargosacciones", "lista-cargos");
    document.getElementById("clavecargo").value = cargo;
    CargarCatalogo("cargosacciones", function () { }, { cargo: cargo });
}

function MostrarPagarREservacion() {
    ObtenerCuentaReservaciones(undefined, true, { a: 'lista-aportaciones_res', b: 'lista-reservaciones' });
}

function VerEdicionConceptos() {
    CargarCatalogo("ap_conceptos", function () {
        CambioPantalla('lista-ap_conceptos', 'p-edicion-aportaciones');
    });
}

function VerAportacionesIniciales() {
    CargarCatalogo("ap_domicilios2", function () {
        CambioPantalla('lista-ap_domicilios2', 'p-edicion-aportaciones');
    });
}

function SeleccionarCargo(obj) {
    var clave = obj.getAttribute("clave");
    var usuario = document.getElementById("UnUsuario").getAttribute("usuario");
    $.post(url + 'logic/controlador.aspx' + '?op=RegistrarCargoUsuario&seccion=usuarios&clave_usuario=' + usuario + "&cargo=" + clave, function (xmlDoc) {
        Mostrar('lista-cargos', 'detalle-usuarios', 'usuarios', usuario);
        CargarCatalogo("usuarios");
    });
}

function RemoverCargoUsuario(usuario, cargo) {
    $.post(url + 'logic/controlador.aspx' + '?op=RemoverCargoUsuario&seccion=usuarios&clave_usuario=' + usuario + "&cargo=" + cargo, function (xmlDoc) {
        Mostrar('detalle-usuarios', 'detalle-usuarios', 'usuarios', usuario);
        CargarCatalogo("usuarios");
    });
}

function VerDomiciliosAportaciones(domicilio) {
    CargarCatalogo("domiciliosconceptosini", function () {
        CambioPantalla('lista-domiciliosconceptosini', 'lista-ap_domicilios2');
    }, { clave: domicilio });
}

function VerVotantesPP(proyecto) {
    CargarCatalogo('pro_propuestas.ObtenerVotosPP', function () {
        CambioPantalla('lista-pro_propuestas.ObtenerVotosPP', 'lista-pro_propuestas');
    }, { clave: proyecto });
}

function IniciarEditarActividad(nuevo, clave) {
    document.getElementById("c-e-planpresupuestal").innerHTML = "";
    if (nuevo) {
        document.getElementById('in-planpresupuestal').params = { proyecto: document.getElementById('clave-egrepro-OPP').value };
        IAgregarCosto('c-e-planpresupuestal', true);
        IniciarEditar(true, 'planpresupuestal', 2);
    } else {
        var datos = { proyecto: document.getElementById('clave-egrepro-OPP').value, claveItem: clave };
        document.getElementById('in-planpresupuestal').params = datos;
        var control = IAgregarCosto('c-e-planpresupuestal', true);
        IniciarEditar(false, 'planpresupuestal', 2, { b: 'p-edicion-planpresupuestal', a: 'lista-planpresupuestal' }, datos, function (xmlDoc) {
            control.setAttribute("indice", GetValor(xmlDoc, "indice"));
            control.setAttribute("catalogo", 'planpresupuestal');
            control.setAttribute("claveItem", clave);
            control.texto.value = GetValor(xmlDoc, "descripcion");
            control.texto2.value = GetValor(xmlDoc, "costo");
        });
    }
}

function IniciarEditarPago(nuevo, clave, tipo_erog) {
    document.getElementById("c-e-regen_egrepro").innerHTML = "";
    var datos = document.getElementById("in-planpresupuestal").params;
    document.getElementById("c-e-regen_" + tipo_erog).innerHTML = "";
    if (nuevo) {
        document.getElementById('in-regen_' + tipo_erog).params = (tipo_erog == "egrepro" ? document.getElementById("in-planpresupuestal").params : document.getElementById("clave-tiposgastos-OPP").params);
        document.getElementById('in-regen_' + tipo_erog).value = (tipo_erog == "egrepro" ? document.getElementById("clave-egrepro-OPP").params.clave : document.getElementById("clave-tiposgastos-OPP").params.clave);
        if (tipo_erog == "egrepro") {
            document.getElementById("ep-pro").value = document.getElementById("in-planpresupuestal").params.proyecto;
            document.getElementById("ep-act").value = document.getElementById("in-planpresupuestal").params.actividad;
        }
        IAgregarImagenTexto('c-e-regen_' + tipo_erog);
        IniciarEditar(true, 'regen_' + tipo_erog, 2);
    } else {
        /*datos["clave_pago"] = clave;
        IniciarEditar(false, 'regen_' + tipo_erog , 2, { b: 'p-edicion-regen_' + tipo_erog , a: 'lista-regen_' + tipo_erog }, datos, function (xmlDoc) {
            CargarDatosFrmMap(xmlDoc.getElementsByTagName("Table")[0], { indice: 'clave-tiposgastos', concepto: 'tg-concepto', descripcion: 'tg-descripcion', tipo_erog: 'tg-tipo_erog' });
            imgsTexto = xmlDoc0.getElementsByTagName("Table1");
            var imagenesTextos = document.getElementById("c-e-" + catalogo);
            imagenesTextos.innerHTML = "";
            var unImagentexto;
            for (var j = 0; j < imgsTexto.length; j++) {
                unImagentexto = IAgregarImagenTexto(imagenesTextos);
                unImagentexto.setAttribute("indice", GetValor(imgsTexto[j], "indice"));
                unImagentexto.setAttribute("catalogo", catalogo);
                unImagentexto.setAttribute("claveItem", clave);
                unImagentexto.imagen.setAttribute("sel", 1);
                var extension = GetValor(imgsTexto[j], "extension");
                var re = new RegExp(".gif|.jpg|.jpeg|.tiff|.png", "gi");
                if (re.test(extension)) {
                    unImagentexto.imagen.src = url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random();
                } else {
                    unImagentexto.imagen.src = 'img/pdf.png';
                }
                unImagentexto.texto.value = GetValor(imgsTexto[j], "descripcion");
            }
        });*/
    }
}

function GuardarComprobante(boton, catalogo, callback, subitemCatalogo) {
    var datos = $("#frm-edit-" + catalogo).serializeArray();
    PonerEspera(boton, catalogo);
    var inDatos = document.getElementById("in-" + catalogo);
    var claveItem = (inDatos.params ? inDatos.params : inDatos.value);
    if (document.getElementById("c-e-" + catalogo)) {
        try {
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
                GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback, claveItem, catalogo, true);
            } else if (textosCambio.length > 0) {
                GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, subitemCatalogo, true);
            } else {
                QuitarEspera();
                if (callback) callback(claveItem);
            }
        } catch (e) {
            QuitarEspera(claveItem);
            alert(e.message);
        }
    } else {
        QuitarEspera();
        if (callback) callback(claveItem);
    }
}

function VerAvanceProyecto(clave) {
    CargarCatalogo("proyectos.ObtenerAvance", function () {
        CambioPantalla('lista-proyectos.ObtenerAvance', 'lista-proyectos');
    }, { proyecto: clave });
}

function RegistrarVoBoActividad(indice, proyecto) {
    if (confirm("Confirme que desea registrar como finalizada esta actividad")) {
        $.post(url + 'logic/controlador.aspx' + '?op=RegistrarVoBoActividad&seccion=planpresupuestal', { proyecto: proyecto, indice: indice }, function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == 1) {
                CargarCatalogo("proyectos.ObtenerAvance", null, { proyecto: proyecto });
                CargarCatalogo("proyectos");
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        });
    }
}

function QuitarVoBoActividad(indice, proyecto) {
    if (confirm("Confirme que desea QUITAR el VoBo de esta actividad")) {
        $.post(url + 'logic/controlador.aspx' + '?op=QuitarVoBoActividad&seccion=planpresupuestal', { proyecto: proyecto, indice: indice }, function (xmlDoc) {
            if (GetValor(xmlDoc, "estatus") == 1) {
                CargarCatalogo("proyectos.ObtenerAvance", null, { proyecto: proyecto });
                CargarCatalogo("proyectos");
            } else {
                alert(GetValor(xmlDoc, "mensaje"));
            }
        });
    }
}

function IniciarRegistroVisita(callback) {
    ConsultarEsVigilante(function (xmlDoc) {
        var domicilio = GetValor(xmlDoc, "domicilio");
        if (GetValor(xmlDoc, "es_vigilancia") == 'true') {
            BuscarDomicilioV('');
        } else {
            document.getElementById("usu-prog").style.display = "block";
            document.getElementById("vigi-c").style.display = "none";
            document.getElementById("usu-prog").disabled = false;
            document.getElementById("domis-vis").innerHTML = "";
            $.post(url + 'logic/controlador.aspx?op=ObtenerDomiciliosCoincidentes&seccion=vigilancia', function (xmlDoc) {
                var domicilios = xmlDoc.getElementsByTagName("Table");
                var undom, domis = "";
                for (var i = 0; i < domicilios.length; i++) {
                    domis = domis + "<input type='radio' name='domicilio-vis' onclick='if(this.checked){document.getElementById(\"clave-domicilio-v\").value=this.value;}'" + (domicilios.length == 1 ? "checked" : "") + " value='" + GetValor(domicilios[i], "clave") + "' style='margin:0px;width:auto;margin-right:10px;display:inline;'/><span>" + GetValor(domicilios[i], "domicilio") + "</span>";
                }

                document.getElementById("domis-vis").innerHTML = domis;

                IniciarEditar(true, 'vigilancia', 2, { a: 'lista-vigilancia', b: 'p-edicion-vigilancia' }, undefined, function () {
                    document.getElementById("es_vigilancia").value = false;
                    document.getElementById("clave-domicilio-v").value = domicilio;
                });
                if (domicilios.length == 1) {
                    document.getElementById("clave-domicilio-v").value = GetValor(domicilios[0], "clave");
                }
            });
        }
    });
}

function ConsultarEsVigilante(callback) {
    $.post(url + 'logic/controlador.aspx' + '?op=ObtenerPerfil&seccion=vigilancia', function (xmlDoc) {
        callback(xmlDoc);
    });
}

function GuardarVisita(obj) {
    Guardar(obj, 'vigilancia', function (clave) {
        $.post(url + 'logic/controlador.aspx?op=GuardaClaveAcceso&seccion=vigilancia&clave=' + clave, function (xmlDoc) {
            document.getElementById("token").value = GetValor(xmlDoc, "token");
        });
        LimpiarForm('vigilancia');
        CargarCatalogo(catalogo); Mostrar('p-edicion-vigilancia', 'lista-vigilancia');
    });
}

function BuscarDomicilioV(buscar) {
    CargarCatalogo('vigilancia.BuscarDomicilio', function () {
        CambioPantalla('lista-vigilancia.BuscarDomicilio', 'lista-vigilancia');
    }, { buscar: buscar });
}

function IniciarEditarProyecto(catalogo, indice) {
    document.getElementById("s-proyecto").style.display = "none";
    document.getElementById("nombre-proyecto").style.display = "block";
    IniciarEditar(false, catalogo, 2, { a: 'lista-' + catalogo, b: 'p-edicion-' + catalogo }, indice, function (xmlDoc) {
        CargarDatosFrmMap(xmlDoc, { indice: 'clave-proyectos', titulo: 'proyectos-titulo', propuesta: 's-propro' });
    });
}

var _es_admin_ = undefined;

function ObtenerItem(catalogo, item) {
    var itemli = document.createElement("li");
    itemli.className = "item";
    var html = "";
    switch (catalogo) {
        case "reservaciones":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "indice")); }
            itemli.innerHTML = '<span class="t-1" >' + " Desde " + GetValor(item, "inicio") + " Hasta " + GetValor(item, "fin") + '</span>' +
                '<span class="t-2" >' + GetValor(item, "domicilio") + '</span>' +
                '<span class="t-2">' + GetValor(item, "descripcion") + '</span>' +
                '<span class="t-3" >' + GetValor(item, "fr") + '</span>';
            break;
        case 'vigilancia.BuscarDomicilio':
            itemli.domicilio = GetValor(item, "clave");
            itemli.onclick = function () {
                document.getElementById("usu-prog").style.display = "none";
                document.getElementById("usu-prog").disabled = true;
                document.getElementById("vigi-c").style.display = "block";
                var domicilio = this.domicilio;
                IniciarEditar(true, 'vigilancia', 2, { a: 'lista-vigilancia.BuscarDomicilio', b: 'p-edicion-vigilancia' }, undefined, function () {
                    document.getElementById("es_vigilancia").value = true;
                    document.getElementById("clave-domicilio-v").value = domicilio;
                });
            }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "domicilio") + '</span>' +
                (GetValor(item, "activo") == "true" ? '<span class="t-3">ACTIVO</span>' : 'INACTIVO');
            break;
        case "vigilancia":
            itemli.indice = GetValor(item, "indice");
            itemli.programada = GetValor(item, "fecha_programada");
            itemli.realizo = GetValor(item, "U_realizo");
            itemli.onclick = function () {
                var indice = this.indice;
                if (this.realizo) {
                    Mostrar('lista-vigilancia', 'detalle-vigilancia', 'vigilancia', this.indice);
                } else {/*programada abierta*/
                    ConsultarEsVigilante(function (xmlDoc) {
                        var es_vigilancia = GetValor(xmlDoc, "es_vigilancia") == 'true';
                        if (es_vigilancia) {
                            document.getElementById("usu-prog").style.display = "block";
                            document.getElementById("vigi-c").style.display = "block";
                            document.getElementById("usu-prog").disabled = true;

                        } else {
                            document.getElementById("usu-prog").style.display = "block";
                            document.getElementById("vigi-c").style.display = "none";
                            document.getElementById("usu-prog").disabled = false;
                        }
                        IniciarEditar(false, 'vigilancia', 2, { a: 'lista-vigilancia', b: 'p-edicion-vigilancia' }, indice, function (xmlDoc) {
                            CargarDatosFrmMap(xmlDoc, { indice: 'clave-vigilancia', otro: 'v-otro', otro_programo: 'otro_programo', visita: 'v-visita', domicilio: 'clave-domicilio-v', placas: 'v-placas', fecha_programada: 'fecha_programada', token: 'token-vis' });
                            document.getElementById("es_vigilancia").value = es_vigilancia;
                        });
                    });
                }
            }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "domicilio") + '</span>' +
                (
                    itemli.programada && !itemli.realizo ? '<span class="t-2" style="float:left;color:red;">PROGRAMADA: ' + GetValor(item, "token") + '</span><span class="t-3" style="float:right;">' + GetValor(item, "fecha_programada") + '</span><hr class="clearn"/>' :
                        '<span class="t-2" > ' + GetValor(item, "visita") + '</span>' + (itemli.programada ? '<span class="t-2" style="float:left;color:red;">PROGRAMADA: ' + GetValor(item, "token") + '</span>' : "") + '<span class="t-3 style="float:right;">' + GetValor(item, "fecha") + '</span>'
                );
            break;
        case "proyectos.ObtenerAvance":
            var indice = GetValor(item, "indice");
            var proyecto = GetValor(item, "proyecto");
            itemli.innerHTML = '<span class="t-1m">' + GetValor(item, "descripcion") + '</span><div class="btn-apl">' + (GetValor(item, "resuelto") == "true" ? '<button onclick="QuitarVoBoActividad(' + indice + ',' + proyecto + ');" style="padding:7px;display:none;" clave_funcion="5" id="qav-' + indice + '" control="qav-' + indice + '" ><img src="img/del.png" /></button><img src="img/ok.png" />' : '<button onclick="RegistrarVoBoActividad(' + indice + ',' + proyecto + ');" style="padding:7px;display:none;" clave_funcion="5" id="av-' + indice + '" control="av-' + indice + '" ><img src="img/ok.png" /></button><img src="img/pendiente.png" />') + "</div>";
            break;
        case "regen_egrepro":
        case "regen_tiposgastos":
            itemli.indice = GetValor(item, "clave");
            itemli.onclick = function () {
                CambioPantalla('detalle-' + catalogo, 'lista-' + catalogo);
                if (catalogo) {
                    //PonerEspera(boton, catalogo);
                    $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo + '&claveItem=' + this.indice + (GetValor(item, "proyecto") ? '&proyecto=' + GetValor(item, "proyecto") : "") + (GetValor(item, "actividad") ? '&actividad=' + GetValor(item, "actividad") : "") + "&catalogo=" + catalogo, function (xmlDoc) {
                        //QuitarEspera();
                        document.getElementById('detalle-' + catalogo).setAttribute("clave", this.indice);
                        PintarItem(catalogo, this.indice, xmlDoc);
                    });
                }
            }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "concepto") + '</span>' +
                '<span class="t-2" style="width:50%;">' + GetValor(item, "fecha") + '</span>' +
                '<span class="t-3" style="float:right;text-align:right;padding-right:7px;width:35%;">' + MoneyFormat(parseFloat(GetValor(item, "importe"))) + '</span><hr class="clearn"/>';

            break;
        case "planpresupuestal":
            itemli.proyecto = GetValor(item, "proyecto");
            itemli.indice = GetValor(item, "indice");
            itemli.onclick = function () {
                var proyecto = this.proyecto;
                var actividad = this.indice;
                CargarCatalogo('regen_egrepro', function () {
                    document.getElementById("in-planpresupuestal").params = { proyecto: proyecto, actividad: actividad, tipo_erog: 2 };
                    CambioPantalla('lista-regen_egrepro', 'lista-planpresupuestal');
                }, { proyecto: this.proyecto, actividad: this.indice, tipo_erog: 2 });
            }
            itemli.innerHTML = '<span class="t-1">' + GetValor(item, "descripcion") + '</span>' +
                '<span class="t-2n" style="font-size:small;">PRESUPUESTADO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "presup"))) + '</span>' +
                '<span class="t-3n" style="font-size:small;">INVERTIDO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "invertido"))) + '</span>' +
                '<button class="edit-btn" clave_funcion="3" control="ed-pp-' + itemli.indice + '" id="ed-pp-' + itemli.indice + '" style="display:none;clear:left;"  onclick="IniciarEditarActividad(false,' + itemli.indice + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="3" control="del-pp-' + itemli.indice + '" id="del-pp-' + itemli.indice + '" style="display:none;"  onclick="IniciarEliminar(this,\'' + catalogo + '\',' + itemli.indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true);" ><img  src="img/del.png" /></button>';
            break;
        case "propdomicilios":
            itemli.innerHTML = "<input type='checkbox' name='domicilio' " + (GetValor(item, "es_responsable") == "true" ? "checked='checked'" : "no") + " value='" + GetValor(item, "clave") + "' style='margin:0px;width:auto;margin-right:10px;display:inline;'/><span>" + GetValor(item, "domicilio") + "</span>";
            document.getElementById("observ-prop").value = GetValor(item, "observaciones_reg_resp");
            break;
        case "proyectos":
            itemli.className = "itemg";
            var indice = GetValor(item, "indice");
            itemli.innerHTML =
                '<span class="t-1g" onclick="Mostrar(\'lista-proyectos\',\'detalle-proyectos\',\'proyectos\',' + indice + ');">' + GetValor(item, "titulo") + '</span>' +
                '<div onclick="Mostrar(\'lista-proyectos\',\'detalle-proyectos\',\'proyectos\',' + indice + ');" style="width:50%;height:180px;float:left;text-align:center;" ><img class="img-pro" src="' + (new RegExp(".pdf", "gi").test(GetValor(item, "primerimg")) ? "img/pdf.png" : (url + "/src-img/proyectos/_" + indice + "/" + GetValor(item, "primerimg"))) + '?v=' + Math.random() + '" /></div>' +
                '<div class="graf-pie" onclick="VerAvanceProyecto(' + indice + ');"><canvas></canvas></div>';
            var canvas = itemli.getElementsByTagName("canvas")[0];
            var datos = []; datos[0] = GetValor(item, "resueltos"); datos[1] = GetValor(item, "faltantes"); var av = parseInt((100 * datos[0]) / (parseInt(datos[0], 10) + parseInt(datos[1], 10)), 10);
            var config = {
                type: 'doughnut',
                data: { datasets: [{ data: datos, backgroundColor: ["#009933", window.chartColors.gray] }] },
                options: { responsive: true, legend: { display: false }, elements: { center: { text: av + "%", color: "#009933", sidePadding: 20 } }, tooltips: { enabled: false } }
            };
            new Chart(canvas.getContext("2d"), config);
            break;
        case "pro_propuestas.ObtenerVotosPP":
            itemli.innerHTML = '<span class="t-2 ' + (GetValor(item, "voto") == 'true' ? 'si' : 'no') + '">' + GetValor(item, "domicilio") + '</span>';
            ; break;
        case "pro_propuestas":
            var registrado = GetValor(item, "registrado");
            var proyecto = GetValor(item, "clave");
            var voto = GetValor(item, "voto");
            itemli.voto = voto;
            itemli.XML = item;
            var html =
                '<span class="t-1" onclick="Mostrar(\'lista-pro_propuestas\',\'detalle-pro_propuestas\',\'pro_propuestas\',' + proyecto + ');">' + GetValor(item, "titulo") + '</span>' +
                '<span class="t-2">' + GetValor(item, "fecha") + '</span>' +
                '<table class="transparente" onclick="VerVotantesPP(' + proyecto + ');">' +
                '<tr><td style="width:15%;" ' + (voto == 'false' ? 'class="votado"' : "") + ' ><span class="p12">No</span></td><td><div class="graf-barra" ><span class="progreso" style="width:' + GetValor(item, "porc_no") + '%"></span><b>' + GetValor(item, "porc_no") + '%</b></div></td></tr>' +
                '<tr><td ' + (voto == 'true' ? 'class="votado"' : "") + '><span class="p12">Si</span></td><td><div class="graf-barra"><span class="progreso" style="width:' + GetValor(item, "porc_si") + '%"></span><b>' + GetValor(item, "porc_si") + '%</b></div></td></tr>' +
                '<tr><td><span class="p12">Abst.</span></td><td><div class="graf-barra"><span class="progreso" style="width:' + GetValor(item, "porc_abst") + '%"></span><b>' + GetValor(item, "porc_abst") + '%</b></div></td></tr>' +
                '</table>' +
                (!voto ? '<div><button class="centrado30 btn2" id="btn-votar-enc-' + proyecto + '" onclick="Mostrar(\'lista-pro_propuestas\',\'detalle-pro_propuestas\',\'pro_propuestas\',' + proyecto + ');">Votar</button></div>' : "");
            itemli.innerHTML = html;
            break;
        case "domiciliosconceptosini":
            var registrado = GetValor(item, "registrado");
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "concepto") + '</span><input type="checkbox" name="concepto" value="' + GetValor(item, "mes") + '"' + (registrado ? 'checked="checked"' : '') + ' />';
            break;
        case "ap_domicilios2":
            var domicilio = GetValor(item, "clave");
            var str = '<span class="t-1" >' + GetValor(item, "domicilio") + (GetValor(item, "coincide") == 'T' ? "<i style='color:#0058ff'> : TAG</i>" : "") + (GetValor(item, "coincide") == 'G' ? "<i style='color:#0058ff'> : MARBETE</i>" : "") +'</span>' +
                '<span class="t-3">' + GetValor(item, "titular") + '</span>';
            itemli.str = str;
            itemli.onclick = function () {
                document.getElementById("clavedomicilio").value = domicilio;
                document.getElementById("UnDomicilioEd").innerHTML = this.str;
                VerDomiciliosAportaciones(domicilio);
            }
            itemli.innerHTML = str;
            break;
        case "ap_domiciliosH":
            var domicilio = GetValor(item, "clave");
            var str = '<span class="t-1" >' + GetValor(item, "domicilio") + (GetValor(item, "coincide") == 'T' ? "<i style='color:#0058ff'> : TAG</i>" : "") + (GetValor(item, "coincide") == 'G' ? "<i style='color:#0058ff'> : MARBETE</i>" : "") + '</span>' +
                '<span class="t-3">' + GetValor(item, "titular") + '</span>';
            itemli.str = str;
            itemli.onclick = function () {
                document.getElementById("clavedomicilioH").value = domicilio;
                document.getElementById("UnDomicilioEdH").innerHTML = this.str;
                CambioPantalla('lista-domiciliosH', 'lista-ap_domiciliosH');
            }
            itemli.innerHTML = str;
            break;
        case "ap_domicilios":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "domicilio") + (GetValor(item, "coincide") == 'T' ? "<i style='color:#0058ff'> : TAG</i>" : "") + (GetValor(item, "coincide") == 'G' ? "<i style='color:#0058ff'> : MARBETE</i>" : "" ) + '</span>' +
                '<span class="t-3">' + GetValor(item, "titular") + '</span>';
            break;
        case "ap_conceptos":
            var clave = GetValor(item, "clave");
            itemli.innerHTML = '<span class="t-1" style="width:55%;display:inline-block;">' + GetValor(item, "nombre") + '</span>' +
                '<button class="btn-item n1"  onclick="Mostrar(\'lista-' + catalogo + '\',\'detalle-' + catalogo + '\',\'' + catalogo + '\',' + clave + ');" >Ver</button>' +
                (GetValor(item, "de_sistema") == "true" ? '[Sistema]' : '<button onclick="AsociarConceptosD(' + clave + ');" class="btn-item n2">Asignar</button>');
            break;
        case "depositos_banco_sel":
            var indice = GetValor(item, "indice");
            var sel_dep=
                '<span style="display:block; color: #ff3000; font-size:0.8em;">' + GetValor(item, "fuente_captura") +"</span>" +
                '<span class="t-1" style="width:55%;display:inline-block;">' + GetValor(item, "origen") + '<label style="font-weight:normal;">(' + GetValor(item, "fecha") + ')</label></span>' +
                '<span class="t-3" style="float:right;width:30%;font-size:1em;">' + GetValor(item, "monto") + '<br/></span><hr class="clearn"/>' +
                '<span style="width:20%;margin-left:3%;display:inline-block;font-size:0.75em;color:#666;" title="Validación en Estado de cuenta">Valida ECB:' + GetValor(item, "usuario_valida_ecb") + '</span>';
            itemli.innerHTML = sel_dep;
            itemli.indice = indice;
            itemli.onclick = function () {
                this.parentNode.seleccionado = this.indice;
                document.getElementById("wrap-sel_dep").innerHTML = this.innerHTML;
                document.getElementById("deposito_asociado").value = this.indice;
                CambioPantalla('lista-aportaciones', 'lista-depositos_banco_sel');
            }
            break;
        case "depositos_banco":
            var indice = GetValor(item, "indice");            
            itemli.innerHTML =
                '<span style="display:block; color:#ff3000;font-size:0.8em;" onclick="document.getElementById(\'dep-del-' + indice + '\').style.display=\'inline-block\';">' + GetValor(item, "fuente_captura") + "<b style='color:#888;'> " + GetValor(item, "domicilio") + "</b></span>" +
                '<span class="t-1" style="width:55%;display:inline-block;">' + GetValor(item, "origen") + '<label style="font-weight:normal;">(' + GetValor(item, "fecha") + ')</label></span>' +
                '<span class="t-3" style="float:right;width:30%;font-size:1em;">' + GetValor(item, "monto") + '<br/></span><hr class="clearn"/>' +
                '<div class="ctrls">' +
                '<span style="width:20%;margin-left:2%;display:inline-block;color:#666;" title="Validación en Estado de cuenta">' + (GetValor(item, "u_ecb").length == 0 ? '<button class="btn-item" onclick="ValidarDeposito(' + GetValor(item, "indice") + ',1);">Validar en EC</button>' : 'Valida ECB:' + GetValor(item, "usuario_valida_ecb")) + '</span>'+
                '<span style="width:20%;margin-left:2%;display:inline-block;color:#666;" title="Validación en Estado de cuenta">' + (GetValor(item, "u_comprobante").length == 0 ? ' <button class="btn-item" onclick= "ValidarDeposito(' + GetValor(item, "indice") + ',2);" title="Validar comprobante">Comprobante</button> ' : '<a href="' + url+ "/logic/controlador.aspx?op=ObtenerComprobante&seccion=aportaciones&deposito=" + indice + '" target="_system">Comprobante validado</a>') + '</span>'+
                '<span style="width:30%;margin-left:2%;display:inline-block;font-size:0.75em;color:#666;" title="Pago aplicado">' + GetValor(item, "sfolio") + '</span>' +
                '<span style="width:20%;margin-left:2%;display:inline-block;" title="Imprimir recibo"><button class="btn-item" onclick="ImprimirReciboCuotas(0,' + GetValor(item, "folio") + ',' + GetValor(item, "domicilio1") + ');">Imprimir</button></span>' +
                '<span id="dep-del-' + indice + '" style="width:20%;margin-left:2%;display:none;" title="Eliminar recibo"><button class="btn-item" onclick="EliminarDeposito('+ indice + ');">Eliminar</button></span>' +
                '</div>';
            break;
        case "cargosacciones":
            var accion = GetValor(item, "clave_accion");
            itemli.innerHTML =
                '<span class="t-1m">' + GetValor(item, "descripcion") + '</span><input type="checkbox" name="accion" value="' + GetValor(item, "clave") + '" ' + (accion ? 'checked="checked"' : '') + ' />';
            break;
        case "cargos":
            var clave = GetValor(item, "clave");
            var txt =
                '<span class="t-1" clave="' + clave + '" onclick="SeleccionarCargo(this);">' + GetValor(item, "nombre") + '</span>' +
                '<span class="t-3"><b>' + GetValor(item, "fecha_registro") + '</b></span>';
            itemli.txt = txt;
            itemli.innerHTML =
                txt +
                '<button class="btn2 btnSPR" onclick="ConfigurarCargo(this,' + clave + ');" >Configurar</button>'
            '<hr class="clearn"/>';
            break;
        case "usuarios":
            var clave = GetValor(item, "clave");
            itemli.onclick = function () {
                var html = this.innerHTML;
                document.getElementById("UnUsuario").innerHTML = html;
                document.getElementById("UnUsuario").setAttribute("usuario", clave);
                Mostrar('lista-usuarios', 'detalle-usuarios', 'usuarios', clave);
            }
            var cargo = GetValor(item, "cargo");
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "usuario") + (cargo ? ":<b>" + cargo + '</b>' : "") + '</span>' +
                '<span class="t-3"><b>' + GetValor(item, "domicilio") + '</b></span><hr class="clearn"/>';
            break;
        case "aportaciones_res":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "indice")); }
            itemli.innerHTML = '<span class="t-1" >' + " Desde " + GetValor(item, "inicio") + " Hasta " + GetValor(item, "fin") + '</span>' +
                '<span class="t-2" >' + GetValor(item, "domicilio") + '</span>' +
                '<span class="t-2">' + GetValor(item, "descripcion") + '</span>' +
                '<span class="t-3" >' + GetValor(item, "fr") + '</span>';
            break;
        case "ap__usuarios":
            var clave = GetValor(item, "clave");
            itemli.onclick = function () {
                var html = this.innerHTML;
                document.getElementById("UnUsuario").innerHTML = html;
                document.getElementById("UnUsuario").setAttribute("usuario", clave);
                ObtenerCuentaReservaciones(clave);
            }
            var cargo = GetValor(item, "cargo");
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "usuario") + (cargo ? ":<b>" + cargo + '</b>' : "") + '</span>' +
                '<span class="t-3"><b>' + GetValor(item, "domicilio") + '</b></span><hr class="clearn"/>';
            break;
        case "transparencia":
            document.getElementById("i-fecha1").value = GetValor(item, 'fecha_actual');
            document.getElementById("i-fecha2").value = GetValor(item, 'fecha_actual');
            itemli.setAttribute("config", GetValor(item, 'config'));
            itemli.setAttribute("pdf", GetValor(item, 'pdf'));
            itemli.setAttribute("xls", GetValor(item, 'xls'));
            itemli.innerHTML = '<button  class="aceptar" onclick="VerInforme(' + GetValor(item, 'clave') + ',this.parentNode.getAttribute(\'config\'),this.parentNode.getAttribute(\'pdf\'),this.parentNode.getAttribute(\'xls\'));">' + GetValor(item, 'descripcion') + '</button>';
            break;
        case "ap_domicilios3":
            var clave = GetValor(item, "clave");
            itemli.innerHTML =
                '<span class="t-1" style="display:inline-block;width:60% !important;">' + GetValor(item, "domicilio") + (GetValor(item, "coincide") == 'T' ? "<i style='color:#0058ff'> : TAG</i>" : "") + (GetValor(item, "coincide") == 'G' ? "<i style='color:#0058ff'> : MARBETE</i>" : "") +'</span><i style="float:right;font-size:0.8em;color:#888;margin-right:15px;">[' + clave + ']</i>' +
                '<span class="t-3" style="float:left;width:90% !important;"> ' + GetValor(item, "titular") + '</span><hr class="clearn"/>';
            itemli.onclick = function () {
                var str = this.innerHTML;
                var domicilio_sel = GetValor(item, "clave");
                var datosp = document.getElementById("w-datos-persona");
                datosp.setAttribute("domicilio_sel", domicilio_sel);
                datosp.innerHTML = str;
                var t3 = $(datosp).find(".t-3")[0];
                var a = document.createElement("a");
                a.style = "float:right;color:#333;text-decoration:underline;font-weight:bold;";
                a.innerHTML = "Ver Historial de Pagos";
                a.onclick = function () { AbrirDocumento(url + 'logic/documento.pdf?op=ObtenerInforme&seccion=transparencia&pdf=true&tabla=1&clave=12&p1=' + domicilio_sel + '&fecha1=01/01/1900&fecha2=01/01/1900', "_system"); }
                t3.appendChild(a);
                CambioPantalla('lista-aportaciones', 'lista-ap_domicilios3');
                document.getElementById('buscar-ap-fecha').value = "";
                CargarAportaciones(true);                
            }
            break;
        case "solicitudes_res":
            var pagado = GetValor(item, "pagado");
            var folio = GetValor(item, "folio");
            if (pagado == "true") {
                itemli.innerHTML =
                    '<div class="PAGADO" >' +
                    '<span class="t-1">Reservación a nombre de: ' + GetValor(item, "a_nombre") + '</span>' +
                    '<span class="t-6v" style="margin-left:10px;"> Folio:' + folio + '<br/>' + GetValor(item, "fecha_reg") + '</span>' +
                    '<span class="t-3" style="float:right;"><b>PAGADO</b> <br/>' + MoneyFormat(parseFloat(GetValor(item, "pago_neg"))) + '<br/></span><hr class="clearn"/>' +
                    '<div class="btns-in"><button onclick="VerSolicitudRes(' + folio + ');">Ver Solicitud</button><button onclick="VerPagosRes(' + folio + ');">Ver Pagos</button><hr class="clearn"/></div></div>';
            } else {
                itemli.innerHTML =
                    '<div class="PENDIENTE" >' +
                    '<span class="t-1" concepto="' + GetValor(item, "clave_concepto") + '" precio="' + GetValor(item, "pago_neg") + '" style="width:60%;float:left;">Reservación a nombre de: ' + GetValor(item, "a_nombre") + '</span>' +
                    '<span class="t-3 PENDIENTE" style="float:right;width:30%;">' + GetValor(item, "leyenda") + "<br/><b style='color:#666'>" + MoneyFormat(parseFloat(GetValor(item, "a_cuenta"))) + "</b> de " + MoneyFormat(parseFloat(GetValor(item, "pago_neg"))) + '</span><hr class="clearn"/>' +
                    '<div class="btns-in"><button onclick="VerSolicitudRes(' + folio + ');">Ver Solicitud</button><button onclick="VerPagosRes(' + folio + ');">Ver Pagos</button><hr class="clearn"/></div></div>';
            }
            break;
        case "aportaciones":
            var leyenda = GetValor(item, "leyenda");
            if (leyenda == "PENDIENTE") {
                itemli.innerHTML =
                    '<div class="PENDIENTE ' + (GetValor(item, 'p_conv') == 'true'?" seleccionado fijo":"") + '" onclick="SeleccionarConceptoPagar(this,' + GetValor(item, "clave_concepto") + ');">' +
                    '<span class="t-1" mes="' + GetValor(item, "mes") + '" anio="' + GetValor(item, "anio") + '" es_cuotamensual="' + GetValor(item, "es_cuotamensual") + '" concepto="' + GetValor(item, "clave_concepto") + '" precio="' + GetValor(item, "monto") + '">' + GetValor(item, "concepto") + '</span>' +
                    '<span class="t-3 ' + GetValor(item, "leyenda") + '" style="float:right;">' + GetValor(item, "leyenda") + ' ' + (GetValor(item, "compuesto").length > 0 ? "/COMPLEMENTO<br/>" : "") + MoneyFormat(parseFloat(GetValor(item, "monto"))) + '</span><hr class="clearn"/>' +
                    '</div>';                
            } else {
                var folio = GetValor(item, "folio");
                var clave_hist = GetValor(item, "clave_hist");

                var residente = GetValor(item, "residente");
                itemli.folio = folio;
                itemli.clave_hist = clave_hist;
                itemli.tipo_pago = GetValor(item, "tipo_pago");
                itemli.domicilio = GetValor(item, "domicilio");
                itemli.onclick = function () {
                    this.onclick = function () { }
                    if (folio.length > 0) {

                        if (_es_admin_) {

                            if (_func_hab_.indexOf("14") > 0) {
                                var cancelar = document.createElement("button");
                                cancelar.innerHTML = "Cancelar Pago";
                                cancelar.className = "btn-item btn30";
                                cancelar.folio = this.folio;
                                cancelar.onclick = function (ev) {
                                    ev.stopPropagation();
                                    var observaciones = window.prompt("Ingrese el motivo de cancelación");
                                    if (window.confirm("Confirme que desea eliminar:")) {
                                        $.post(url + 'logic/controlador.aspx?op=EliminarPago&seccion=aportaciones&folio=' + this.folio, { observaciones: observaciones }, function (xmlDoc) {
                                            CargarAportaciones();
                                        });
                                    }
                                }
                                this.getElementsByTagName("div")[0].appendChild(cancelar);
                            }

                            var btnCR = document.createElement("button");
                            btnCR.innerHTML = "Reemplazar recibo";
                            btnCR.className = "btn-item btn30";
                            btnCR.title = "Cancelar recibo por error de impresión, requiere recibo nuevo.";
                            btnCR.folio = this.folio;
                            btnCR.onclick = function (ev) {
                                ev.stopPropagation();
                                var recibo_nuevo = window.prompt("Ingrese el nuevo número de recibo:");
                                if (window.confirm("Confirme que desea reemplazar/cancelar el folio:")) {
                                    $.post(url + 'logic/controlador.aspx?op=ReemplazarCancelarFolio&seccion=aportaciones&folio=' + this.folio, { recibo_nuevo: recibo_nuevo }, function (xmlDoc) {
                                        alert(GetValor(xmlDoc, "mensaje"));
                                        CargarAportaciones();
                                    });
                                }
                            }
                            this.getElementsByTagName("div")[0].appendChild(btnCR);

                            var hr = document.createElement("hr");
                            hr.className = "clearn";
                            this.getElementsByTagName("div")[0].appendChild(hr);

                            btnCR = document.createElement("button");
                            btnCR.innerHTML = "E-mail recibo";
                            btnCR.className = "btn-item btn30";
                            btnCR.title = "Reenviar recibo por e-mail.";
                            btnCR.folio = this.folio;
                            btnCR.domicilio = this.domicilio;
                            btnCR.onclick = function (ev) { EnviarReciboEmail(ev, this.folio, true); }
                            this.getElementsByTagName("div")[0].appendChild(btnCR);

                            btnCR = document.createElement("button");
                            btnCR.innerHTML = "Reimprimir recibo";
                            btnCR.className = "btn-item btn30";
                            btnCR.title = "Reimprimir recibo.";
                            btnCR.folio = this.folio;
                            btnCR.domicilio = this.domicilio;
                            btnCR.onclick = function (ev) { AbrirDocumento(url + "/logic/recibo.pdf?op=GenerarReciboCaida&seccion=aportaciones&recibo=0&folio=" + this.folio + "&domicilio=" + this.domicilio, "_system"); }
                            this.getElementsByTagName("div")[0].appendChild(btnCR);
                        }

                        var btnCR = document.createElement("button");
                        btnCR.innerHTML = "Recibo";
                        btnCR.className = "btn-item btn30";
                        btnCR.title = "Ver el recibo";
                        btnCR.folio = this.folio;
                        btnCR.domicilio = this.domicilio;
                        btnCR.onclick = function (ev) { AbrirDocumento(url + "/logic/recibo.pdf?op=GenerarRecibo&seccion=aportaciones&recibo=0&folio=" + this.folio + "&domicilio=" + this.domicilio, "_system"); }
                        this.getElementsByTagName("div")[0].appendChild(btnCR);

                        var hr = document.createElement("hr");
                        hr.className = "clearn";
                        this.getElementsByTagName("div")[0].appendChild(hr);
                        
                        if (this.tipo_pago == "10") {
                            btnCR = document.createElement("button");
                            btnCR.innerHTML = "Comprobante";
                            btnCR.className = "btn-item btn30";
                            btnCR.title = "Ver recibo";
                            btnCR.folio = this.folio;
                            btnCR.domicilio = this.domicilio;
                            btnCR.onclick = function (ev) { AbrirDocumento(url + "/logic/controlador.aspx?op=VerAdjuntoDeposito&seccion=aportaciones&domicilio=" + this.domicilio + "&folio=" + this.folio, "_system", "img"); }
                            this.getElementsByTagName("div")[0].appendChild(btnCR);
                        }

                        var hr = document.createElement("hr");
                        hr.className = "clearn";
                        this.getElementsByTagName("div")[0].appendChild(hr);

                    } /*else {
                        var clave_hist = GetValor(item, "clave_hist");
                        if (_func_hab_.indexOf("12") > 0) {
                            var editar_hist = document.createElement("button");
                            editar_hist.innerHTML = "Editar pago";
                            editar_hist.className = "aceptar";
                            editar_hist.style = "width:auto;display:inline-block;float:right;font-size:0.8em;margin-right:5%;margin-top:15px;";
                            editar_hist.onclick = function (ev) {
                                ev.stopPropagation();
                                $.post(url + 'logic/controlador.aspx?op=ObtenerPagoHist&seccion=aportaciones&clave_hist=' + this.clave_hist, function (xmlDoc) {
                                    var datohist = prompt("Capture dato correcto:", GetValor(xmlDoc, "dato_hist"));
                                    if (datohist) {
                                        $.post(url + 'logic/controlador.aspx?op=RegistrarPagoHist&seccion=aportaciones&clave_hist=' + GetValor(xmlDoc, "clave_hist"), function (xmlDoc1) {
                                            if (GetValor(xmlDoc1, "estatus") == 1) {
                                                CargarAportaciones();
                                            } else {
                                                alert(GetValor(xmlDoc1, "mensaje"));
                                            }
                                        });
                                    }
                                });
                            }
                            this.getElementsByTagName("div")[0].appendChild(editar_hist);
                            var hr = document.createElement("hr");
                            hr.className = "clearn";
                            this.getElementsByTagName("div")[0].appendChild(hr);
                        } else {
                            alert("No puede editarse, corresponde a historial o conciliación.");
                        }
                    }*/
                }
                itemli.innerHTML =
                    '<div class="' + GetValor(item, "leyenda") + '">' +
                    '<span class="t-1" style="width:60%;display:inline-block;">' + GetValor(item, "concepto") + '</span>' +
                    '<span class="t-3" style="float:right;"><b>' + leyenda + '</b><br/><img src="img/goodpay.png"/></span><hr class="clearn"/>' +
                    '</div>';
            }
            break;
        case "inmuebles":
            var indice = GetValor(item, "indice");
            itemli.clave = indice;
            itemli.onclick = function () {
                CargarCalendarioR(this.clave);
            }
            itemli.innerHTML =
                '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                '<button class="edit-btn" clave_funcion="2" control="ed-tg-' + indice + '" id="ed-tg-' + indice + '" style="display:none;"  onclick="IniciarEditar(false, \'' + catalogo + '\', 2, { a: \'lista-' + catalogo + '\', b: \'p-edicion-' + catalogo + '\' },' + indice + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="2" control="del-tg-' + indice + '" id="del-tg-' + indice + '" style="display:none;"  onclick="IniciarEliminar(this,\'' + catalogo + '\',' + indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true);" ><img  src="img/del.png" /></button>';
            break;
        case "tags":
            var indice = GetValor(item, "indice");
            itemli.clave = indice;
            itemli.onclick = function () {
                try { document.getElementById("vehi-" + this.clave).style.display = "block"; } catch (e) { }
            }
            itemli.innerHTML =
                '<fieldset ' + (GetValor(item, 'activo') == 'false' ? 'class="inactivo" disabled=true' : '') + '>' +
                '<span class="t-1" ><i style="color:#777;font-weight:normal">Usuario:</i>' + GetValor(item, "nombre_usuario") + '</span>' +
                '<span class="t-1" ><i style="color:#777;font-weight:normal">Id de usuario en controladora:</i>' + GetValor(item, "id_usuario_disp") + '</span>' +
                '<span class="t-1" >' + GetValor(item, "descripcion") + '</span>' +
                '<span class="t-1" ><i style="color:#777;font-weight:normal">TAG:</i>' + GetValor(item, "no_tag") + '</span>' +
                (GetValor(item, "placas").trim().length > 0 ?
                    '<span class="t-1" ><i style="color:#777;font-weight:normal">Marbete:</i>' + GetValor(item, "marbete") + '</span>' +
                    '<span class="t-1" ><i style="color:#777;font-weight:normal">Placas</i>:' + GetValor(item, "placas") + '</span>' : "") +
                (_func_hab_.indexOf("11") > 0 ?
                    '<div id="vehi-' + indice + '" style="display:none;"><button class="edit-btn" onclick="IniciarEditar(false, \'' + catalogo + '\', 2, { a: \'lista-' + catalogo + '\', b: \'p-edicion-' + catalogo + '\'},{d:document.getElementById(\'detalle-ap_domicilios\').getAttribute(\'clave\'),claveItem:' + indice + '});" ><img  src="img/edit.png" /></button>' +
                    '<button class="edit-btn" onclick="IniciarEliminar(this,\'' + catalogo + '\',' + indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true,{d:document.getElementById(\'detalle-ap_domicilios\').getAttribute(\'clave\')},function(){EjecutarRestriccionTags(false,document.getElementById(\'detalle-ap_domicilios\').getAttribute(\'clave\'));});" ><img title="Bloquear definitivamente" src="img/del.png" /></button>' +
                    '<button class="edit-btn" onclick="IniciarEliminar(this,\'' + catalogo + '\',' + indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true,{d:document.getElementById(\'detalle-ap_domicilios\').getAttribute(\'clave\'),reasignar:true});" ><img title="Quitar para asignar a otro" src="img/vobo.png" /></button>' +
                    '</div>' : "") + '</fieldset>';
            break;
        case "tiposgastos":
            var indice = GetValor(item, "indice");
            itemli.clave = indice;
            itemli.onclick = function () {
                var clave = this.clave;
                document.getElementById("clave-tiposgastos-OPP").params = { clave: clave, tipo_erog: 1 };
                CargarCatalogo('regen_tiposgastos', function () { CambioPantalla('lista-regen_tiposgastos', 'lista-tiposgastos') }, { clave: clave, tipo_erog: 1 });
            }
            itemli.innerHTML =
                '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                '<button class="edit-btn" clave_funcion="2" control="ed-tg-' + indice + '" id="ed-tg-' + indice + '" style="display:none;"  onclick="IniciarEditar(false, \'' + catalogo + '\', 2, { a: \'lista-' + catalogo + '\', b: \'p-edicion-' + catalogo + '\' },' + indice + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="2" control="del-tg-' + indice + '" id="del-tg-' + indice + '" style="display:none;"  onclick="IniciarEliminar(this,\'' + catalogo + '\',' + indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true);" ><img  src="img/del.png" /></button>';
            break;
        case "egrepro":
            var indice = GetValor(item, "indice");
            itemli.clave = indice;
            itemli.onclick = function () {
                var clave_ = this.clave;
                CargarCatalogo('planpresupuestal', function () {
                    CambioPantalla('lista-planpresupuestal', 'lista-egrepro');
                    document.getElementById("clave-egrepro-OPP").value = clave_;
                    document.getElementById("clave-egrepro-OPP").params = { clave: clave_, tipo_erog: 2 };
                }, [{ name: "clave", value: this.clave }]);
            }
            itemli.innerHTML =
                '<span class="t-1" style="padding-bottom:10px;">' + GetValor(item, "titulo") + '</span>' +
                '<span class="t-2n" style="font-size:small;">PRESUPUESTADO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "presup"))) + '</span>' +
                '<span class="t-3n" style="font-size:small;">INVERTIDO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "invertido"))) + '</span>';
            break;
        case "talleres":
            var clave = GetValor(item, "clave");
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, clave); }
            itemli.innerHTML =
                '<div onclick="Mostrar(\'lista-proyectos\',\'detalle-talleres\',\'talleres\',' + clave + ');" style="width:30%;height:100px;float:left;text-align:center;" ><img class="img-pro" src="' + (new RegExp(".pdf", "gi").test(GetValor(item, "primerimg")) ? "img/pdf.png" : (url + "/src-img/talleres/_" + clave + "/" + GetValor(item, "primerimg"))) + '?v=' + Math.random() + '" /></div>' +
                '<div style="width:65%;float:right;padding-top:15px;"><span class="t-1">' + GetValor(item, "titulo") + '</span>' +
                '<span class="aux-1" style="float:left;clear:left;width:100%;">' + GetValor(item, "horario") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "telefonos") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "email") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "vigencia") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "integrantes") + '</span>' +
                '<span class="t-3n"  style="float:left;clear:left;width:100%;font-size:0.9em;">' + GetValor(item, "fecha1") + '</span></div>';
            break;
        case "comunicados":
            var clave = GetValor(item, "clave");
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, clave); }
            itemli.innerHTML =
                '<div onclick="Mostrar(\'lista-proyectos\',\'detalle-comunicados\',\'comunicados\',' + clave + ');" style="width:30%;height:100px;float:left;text-align:center;" ><img class="img-pro" src="' + (new RegExp(".pdf", "gi").test(GetValor(item, "primerimg")) ? "img/pdf.png" : (url + "/src-img/comunicados/_" + clave + "/" + GetValor(item, "primerimg"))) + '?v=' + Math.random() + '" /></div>' +
                '<div style="width:65%;float:right;padding-top:15px;"><span class="t-1">' + GetValor(item, "titulo") + '</span>' +
                '<span class="aux-1" style="float:left;clear:left;width:100%;">' + GetValor(item, "alias") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "estado") + '</span>' +
                '<span class="t-3n"  style="float:left;clear:left;width:100%;font-size:0.9em;">' + GetValor(item, "fecha1") + '</span></div>';
            break;
        case "convenios":
            var clave = GetValor(item, "clave");
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, clave); }
            itemli.innerHTML =                
                '<span class="t-1">' + GetValor(item, "descripcion") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "fecha") + '</span>';
            break;
        case "config_pagos":
            var clave = GetValor(item, "clave");
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, clave); }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "descripcion") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:100%;">' + GetValor(item, "fecha") + '</span>';
            break;
        case "solicitudes_seg":
        case "solicitudes":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML =
                '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                '<span class="aux-1" style="float:left;clear:left;width:40%;">' + GetValor(item, "alias") + '</span>' +
                '<span class="t-3n" style="text-align:right">' + GetValor(item, "estado") + '</span>' +
                '<span class="t-3n"  style="float:left;clear:left;width:40%;">' + GetValor(item, "fecha1") + '</span>';
            break;
        case "directorio":
            itemli.setAttribute("nombre", GetValor(item, "nombre"));
            html = '<span class="t-1" >' + GetValor(item, "nombre") + '</span>' +
                '<ol>';
            for (var k = 1; k < 4; k++) {
                if (GetValor(item, "telefono" + k)) {
                    html += '<li class="item">' +
                        '<span class="t-2" >' + GetValor(item, "telefono" + k)  + '</span>' +
                        '<a class="call-btn" href="tel://' + GetValor(item, "telefono" + k) + '"><img src="img/call.png" /></a>' +
                        '<hr class="clear" />' +
                        '</li>';
                }
            }
            itemli.innerHTML = html + '</ol>' +
                '<button class="edit-btn" clave_funcion="2" control="ed-2-' + GetValor(item, "indice") + '" id="ed-2-' + GetValor(item, "indice") + '" style="display:none;clear:left;"  onclick="IniciarEditarDirectorio(false,' + GetValor(item, "indice") + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="2" control="del-2-' + GetValor(item, "indice") + '" id="del-2-' + GetValor(item, "indice") + '" style="display:none;"  onclick="IniciarEliminarDirectorio(' + GetValor(item, "indice") + ',this);" ><img  src="img/del.png" /></button>';
            ; break;
        case "prodserv":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "NombreNegocio") + '</span>' +
                '<span class="t-2">Teléfono(s): ' + GetValor(item, "telefonos") + '</span>' +
                '<span class="t-3">Horario: ' + GetValor(item, "horario") + '</span>';
            break;
        case "encuestas":
            html =
                ' <span class="t-1">' + GetValor(item, "pregunta") + '</span>' +
                '<button class="edit-btn" clave_funcion="2" control="ed-2-' + GetValor(item, "clave") + '" id="ed-2-' + GetValor(item, "clave") + '" style="display:none;"  onclick="IniciarEditar(false, \'encuestas\', 1, { a: \'lista-encuestas\', b: \'p-edicion-encuestas\' },' + GetValor(item, "clave") + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="2" control="del-2-' + GetValor(item, "clave") + '" id="del-2-' + GetValor(item, "clave") + '" style="display:none;"  onclick="IniciarEliminar(this,\'encuestas\',' + GetValor(item, "clave") + ',{ b: \'lista-encuestas\', a: \'p-edicion-encuestas\' });" ><img  src="img/del.png" /></button>' +
                '<span class="t-2">' + GetValor(item, "fecha") + '</span>';
            var respuestas = item.getElementsByTagName("Respuesta");
            if (GetValor(item, "yaVoto") == 1) {
                html += '<table class="transparente">';
                for (var i = 0; i < respuestas.length; i++) {
                    html += '<tr ' + (GetValor(respuestas[i], "respondio") == 1 ? 'class="votado"' : "") + '><td><div class="graf-barra" onclick="Mostrar(\'lista-encuesta\',\'encuesta-votantes\');"><span class="progreso" style="width:' + GetValor(respuestas[i], "porc") + '%"></span><label><b>' + GetValor(respuestas[i], "porc") + '%</b>' + GetValor(respuestas[i], "respuesta") + '</label></div></td></tr>';
                }
                html += '</table>';
            } else {
                var encuesta = GetValor(item, "clave");
                html +=
                    '<div class="separado10 item-enc"  id="tab-resp-' + encuesta + '">' +
                    '<table>';
                for (var i = 0; i < respuestas.length; i++) {
                    html +=
                        '<tr><td style="width:75%;"><label for="resp-' + GetValor(respuestas[i], "clave") + '">' + GetValor(respuestas[i], "respuesta") + '</label></td><td style="width:25%;"><input type="radio" id="resp-' + GetValor(respuestas[i], "clave") + '" name="enc-' + encuesta + '" onchange="MarcarVoto(this,' + encuesta + ',' + GetValor(respuestas[i], "clave") + ');"/></td></tr>';
                }
                html +=
                    '</table>' +
                    '<button class="centrado30 btn2" id="btn-votar-enc-' + encuesta + '" onclick="RegistrarVoto(this,' + encuesta + ')">Votar</button>' +
                    '</div>';
            }
            itemli.innerHTML = html;
            ; break;
        case "notificaciones":
            itemli.onclick = function () { }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "mensaje") + '</span>' +
                '<span class="t-3"> ' + GetValor(item, "fecha") + '</span>';
            break;
            ; break;
    }
    return itemli;
}

function ObtenerPagoHistorial() {
    var dom_sel = document.getElementById("clavedomicilioH").value;
    $.post(url + 'logic/controlador.aspx?op=ObtenerPagoHist&seccion=aportaciones&recibo=' + document.getElementById("dh-recibo").value + '&domicilio=' + dom_sel, function (xmlDoc) {
        if (!GetValor(xmlDoc, 'recibo')) {
            alert('No se encontró recibo.');
        } else {
            CargarDatosFrmMap(xmlDoc, { fecha_recibo: 'dh-fecha', importe: 'dh-importe', concepto: 'dh-concepto', tipopago: 's_forma_ph', nota: 'dh-nota'});
        }
    });
}

function EliminarDeposito(indice) {
    $.post(url + 'logic/controlador.aspx?op=Eliminar&seccion=depositos_banco&claveItem=' + indice, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == "1") {
            CargarCatalogo("depositos_banco");
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function ValidarDeposito(indice,validacion) {
    $.post(url + 'logic/controlador.aspx?op=ObtenerItem&seccion=depositos_banco&claveItem=' + indice, function (xmlDoc) {
        var leyenda = "";
        switch (validacion) {
            case 1: leyenda="Validación con Estado de cuenta"; break;
            case 2: leyenda="Validación de comprobante"; break;
        }
        document.getElementById("op-depositos_banco").value = false;
        document.getElementById("cab_domicilio_deposito_banco").innerHTML = leyenda;
        PintarItemEditar('depositos_banco', indice, xmlDoc);
        document.getElementById("validar_deposito").value = validacion;
        CambioPantalla("p-edicion-depositos_banco", "lista-depositos_banco");
        $.post(url + 'logic/controlador.aspx?op=ObtenerAdjuntoDeposito&seccion=aportaciones&clave=' + indice, function (xmlDoc1) {
            document.getElementById("img-depositos_banco").src = url + "src-img/depositos_banco/_" + indice + "/" + GetValor(xmlDoc1,"nombre_archivo");
            document.getElementById("img-depositos_banco").onclick = function () { window.open(url + "src-img/depositos_banco/_" + indice + "/" + GetValor(xmlDoc1, "nombre_archivo"), "_system") };
        });
    });
}

function HabilitarECB(obj) {
    
}

function DeshabilitarPagoAplicadoB(obj) { }

function EnviarReciboEmail(ev, folio, con_carga) {
    try {
        ev.stopPropagation();
    } catch (e) { }
    $.post(url + 'logic/controlador.aspx?op=EnviarRecibo&seccion=aportaciones&folio=' + folio, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == "1") {
            if (con_carga) {
                CargarAportaciones();
            }
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function AsociarConceptosD(clave) {
    document.getElementById("clave-asig_concepto").value = clave;
    CargaConceptosD(clave, function () {
        IntercambioVisual("p-edicion-asig_conceptos", "lista-ap_conceptos");
    });
}

function CargaConceptosD(clave, callback) {
    document.getElementById("clave-asig_concepto").value = clave;
    $.post(url + 'logic/controlador.aspx' + '?op=LeerAsignacionesC&seccion=ap_conceptos&c=' + clave, function (xmlDoc) {
        MostrarItemsC(xmlDoc.getElementsByTagName("Table"), 'asig-dom', clave);
        MostrarItemsC(xmlDoc.getElementsByTagName("Table1"), 'asig-call', clave);
        MostrarItemsC(xmlDoc.getElementsByTagName("Table2"), 'asig-man', clave);
        MostrarItemsC(xmlDoc.getElementsByTagName("Table3"), 'asig-seg', clave);
        MostrarItemsC(xmlDoc.getElementsByTagName("Table4"), 'asig-general', clave);
        if (callback) {
            callback();
        }
    });
}

function downloadFile(url, filename, callback, callback_error) {
    var fileTransfer = new FileTransfer();
    var localpath = cordova.file.externalDataDirectory + filename;
    fileTransfer.download(encodeURI(url),
        localpath,
        function (thefile) {
            if (callback) callback(thefile);
        },
        function (error) {
            if (callback_error) callback_error();
        }
    );
}

function MostrarItemsC(items, id, clave) {
    var wrap = document.getElementById(id);
    if (id == "asig-general") {
        document.getElementById("activar-todos").checked = (GetValor(items[0], "valor") == "true");
    } else {
        wrap.innerHTML = "";
        var ul = document.createElement("ul");
        ul.className = "color2";
        var li;
        for (var i = 0; i < items.length; i++) {
            li = document.createElement("li");
            li.innerHTML = "<span>" + GetValor(items[i], "descripcion") + "</span><button class='btn-item' onclick='EliminarAsigC(" + GetValor(items[i], "indice") + "," + clave + ");'>x</button><hr class='clearn'/>";
            ul.appendChild(li);
        }
        wrap.appendChild(ul);
    }
}

function EliminarAsigC(indice, clave) {
    $.post(url + 'logic/controlador.aspx?op=EliminarAsigC&seccion=ap_conceptos&i=' + indice, function (xmlDoc) {
        CargaConceptosD(clave);
    });
}

function S_AsignarConceptos(wrapid, op, tipo, buscar) {
    IntercambioVisual(wrapid, "p-edicion-asig_conceptos");
    $.post(url + 'logic/controlador.aspx' + '?op=' + op + '&seccion=ap_conceptos&c=' + document.getElementById("clave-asig_concepto").value, buscar, function (xmlDoc) {
        var wrap = document.getElementById(wrapid);
        var items = xmlDoc.getElementsByTagName("Table");
        var ul = wrap.getElementsByTagName("ul")[0];
        ul.innerHTML = "";
        var li;
        var clave = document.getElementById("clave-asig_concepto").value;
        for (var i = 0; i < items.length; i++) {
            li = document.createElement("li");
            li.clave = GetValor(items[i], "valor");
            li.onclick = function () {
                $.post(url + 'logic/controlador.aspx?op=AsignarConcepto&seccion=ap_conceptos&c=' + clave + "&t_a=" + tipo + "&valor=" + this.clave, function (xmlDoc1) {
                    if (GetValor(xmlDoc1, "estatus").length == 1) {
                        alert(GetValor(xmlDoc1, "mensaje"));
                        S_AsignarConceptos(wrapid, op, tipo, buscar);
                        CargaConceptosD(clave);
                    } else {
                        alert(GetValor(xmlDoc1, "mensaje"));
                    }
                });
            }
            li.innerHTML = "<span>" + GetValor(items[i], "descripcion") + "</span>";
            ul.appendChild(li);
        }//<button class='btn-item' onclick='QuitarCD(" + GetValor(xmlDoc,"valor") + ");'>Quitar</button>
    });
}

function AgregarReservaciones() {
    if (document.getElementById("lista-ap_domicilios_sr").getAttribute("seleccion")) {
        IniciarEditar(true, 'reservaciones', 2, undefined, undefined, function () { document.getElementById('fecha_reservada').value = document.getElementById('fecha-res').value; document.getElementById('ed-res-inmueble').value = document.getElementById('inmueble').value; document.getElementById("ed-res-dom").value = document.getElementById("lista-ap_domicilios_sr").getAttribute("seleccion"); });
    } else {
        //ValidarAccesoFuncion([5].join(","), function () {
        CargaDomiciliosS("lista-ap_domicilios_sr", "lista-reservaciones");
        /*}, function () {
            IniciarEditar(true, 'reservaciones', 2, undefined, undefined, function () { document.getElementById('fecha_reservada').value = document.getElementById('fecha-res').value; document.getElementById('ed-res-inmueble').value = document.getElementById('inmueble').value; document.getElementById("ed-res-dom").value = document.getElementById("lista-ap_domicilios_sr").getAttribute("seleccion"); });
        });*/
    }
}

function CargaDomiciliosS(wrap_s, wraphide) {
    CargaDomicilios(wrap_s, wraphide, document.getElementById("b-dom-r").value, function (item) {
        document.getElementById(wrap_s).setAttribute("seleccion", item.clave);
        document.getElementById("w-datos-dom").innerHTML = item.innerHTML + "<button class='btn-item' style='margin-top:-35px;margin-right:5px;' onclick='CargaDomiciliosS(\"lista-ap_domicilios_sr\", \"lista-reservaciones\");';>Seleccionar</button>";
        IntercambioVisual(wraphide, wrap_s);
    });
}

function ValidarAccesoFuncion(funciones, calback_ok, callback_no) {
    $.post(url + 'logic/controlador.aspx?op=ValidarAccesoFunciones&seccion=seguridad&funciones=' + funciones, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == "1") {
            calback_ok();
        } else {
            callback_no();
        }
    });

}

function CargaDomicilios(wrapid, wrapidhide, buscar, callback_click) {
    IntercambioVisual(wrapid, wrapidhide);
    $.post(url + 'logic/controlador.aspx?op=ConsultarDomicilios&seccion=domicilios', { buscar: buscar }, function (xmlDoc) {
        var wrap = document.getElementById(wrapid);
        var items = xmlDoc.getElementsByTagName("Table");
        var ul = document.getElementById(wrapid).getElementsByTagName("ul")[0];
        ul.innerHTML = "";
        var li;
        for (var i = 0; i < items.length; i++) {
            li = document.createElement("li");
            li.class = "item";
            li.clave = GetValor(items[i], "clave");
            li.onclick = function () { callback_click(this); };
            li.innerHTML = "<span class='t-1' style='width:55%;clear:right;'>" + GetValor(items[i], "domicilio") + "</span><span class='t-3' style='width:55%;clear:right;'>" + GetValor(items[i], "titular") + "</span><hr class='clearn'/>";
            ul.appendChild(li);
        }
    });
}


function AsignarTodos(obj) {
    var clave = document.getElementById("clave-asig_concepto").value;
    $.post(url + 'logic/controlador.aspx?op=AsignarConcepto&seccion=ap_conceptos&c=' + clave + "&t_a=5&valor=" + obj.checked, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            obj.checked = (GetValor(xmlDoc, "estatus") == 1);
        }
    });
}

function MostrarAdelanto() {
    CargarAportaciones(false, document.getElementById("in-adelanto").value);
}

function VerSolicitudRes(folio) {
    ObtenerCuentaReservaciones(undefined, false, { a: 'lista-aportaciones_res', b: 'lista-solicitudes_res' }, folio, true);
}

function VerPagosRes(folio) {
    document.getElementById("lista-pagos_res").setAttribute("folio", folio);
    $.post(url + 'logic/controlador.aspx' + '?op=cargar&seccion=pagos_res', { folio: folio }, function (xmlDoc) {
        var pagos_res = xmlDoc.getElementsByTagName("Table");
        var listado = document.getElementById("listado-pagos_res");
        listado.innerHTML = "";
        var tr, item;
        for (i = 0; i < pagos_res.length; i++) {
            item = pagos_res[i];
            tr = document.createElement("tr");
            tr.innerHTML =
                '<td style="width:30%;"><span class="t-2" >' + GetValor(item, "fecha_reg") + '</td>' +
                '<td style="width:40%;"><span class="t-2" >' + MoneyFormat(GetValor(item, "Total")) + '</span></td>' +
                '<td style="width:15%;"><span class="t-2" >' + MoneyFormat(GetValor(item, "abono")) + ' </span></td>' +
                '<td style="width:15%;"><span class="t-2" >' + MoneyFormat(GetValor(item, "restante")) + '</span></td>';
            listado.appendChild(tr);
        }
        CambioPantalla("lista-pagos_res", "lista-solicitudes_res");
    });
}

function ObtenerCuentaReservaciones(usuario, desesion, intercambio, solicitud, lectura) {
    $.post(url + 'logic/controlador.aspx' + '?op=ObtenercuentaReservaciones&seccion=reservaciones', { usuario: usuario, desesion: desesion, solicitud: solicitud }, function (xmlDoc) {
        document.getElementById("op-aportaciones_res").value = false;
        var reservaciones = xmlDoc.getElementsByTagName("Table");
        var listado = document.getElementById("listado-reserv");
        listado.innerHTML = "";
        var tr, item;
        for (i = 0; i < reservaciones.length; i++) {
            item = reservaciones[i];
            tr = document.createElement("tr");
            tr.innerHTML =
                '<td style="width:40%;"><span class="t-1" >' + GetValor(item, "descripcion").substring(0, 60) + '..</span>' +
                '<span class="t-2"> ' + GetValor(item, "inmueble") + ", Cuota por hora: " + MoneyFormat(GetValor(item, "cuotah")) + '</span></td>' +
                '<td style="width:30%;"><span class="t-2" >' + GetValor(item, "fr") + ',  <i style="display:block;">' + GetValor(item, "inicio") + " - " + GetValor(item, "fin") + '</i></span></td>' +
                '<td style="width:15%;"><span class="t-2" >' + GetValor(item, "horas") + ' Hrs.</span></td>' +
                '<td style="width:15%;"><span class="t-2" >' + MoneyFormat(GetValor(item, "importe")) + '</span></td>';
            listado.appendChild(tr);
        }
        tr = document.createElement("tr");
        tr.innerHTML = "<td colspan='3' style=padding:35px;color:#333;><b>TOTAL</b></td><td>" + MoneyFormat(GetValor(xmlDoc.getElementsByTagName("Table1")[0], "total")) + "</td>";
        var resumen = xmlDoc.getElementsByTagName("Table1")[0];
        document.getElementById("total-res").value = GetValor(resumen, "total");
        document.getElementById("usuario-res").value = GetValor(resumen, "usuario");
        listado.appendChild(tr);
        if (lectura) {
            document.getElementById("frm-reservar").style.display = "none";
        } else {
            document.getElementById("frm-reservar").style.display = "block";
        }
        if (intercambio) {
            var btnBack = document.getElementById("reg-res");
            btnBack.setAttribute("intA", intercambio.b);
            btnBack.setAttribute("intB", intercambio.a);
            CambioPantalla(intercambio.a, intercambio.b);
        } else {
            CambioPantalla("lista-aportaciones_res", "lista-ap__usuarios");
        }
    });

}

function GenerarSolicitudRes() {
    var datos = $("#frm-reservar").serializeArray();
    $.post(url + 'logic/controlador.aspx' + '?op=GenerarSolicitudRes&seccion=reservaciones', datos, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            document.getElementById("op-aportaciones_res").value = false;
        }
        alert(GetValor(xmlDoc, "mensaje"));
    });
}

function MoneyFormat(num) {
    try {
        return '$' + parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } catch (e) { return '-' }
}

function LimpiarClases(id, like) {
    var clase = document.getElementById(id).getAttribute("class");
    if (clase) {
        var clases = clase.split(" ");
        for (var i = 0; i < clases.length; i++) {
            if (clases[i].indexOf(like) > -1) {
                $("#" + id).removeClass(clases[i]);
            }
        }
    }
}


var CalendarioR = {};
function CargarCalendarioR(clave) {
    document.getElementById("inmueble").value = clave;
    CalendarioR.yaConsulto = false;
    CambioPantalla('p-regen_inmuebles', 'lista-inmuebles');
    try { $("#calendario-ev-inm").datepicker("refresh"); } catch (e) { }
    $("#calendario-ev-inm").datepicker({
        dateFormat: "dd/mm/yy",
        onChangeMonthYear: function (anio, mes, cal) {
            CalendarioR.yaConsulto = false;
        },
        beforeShowDay: function (date) {
            if (date.getDate() == 1 && !CalendarioR.yaConsulto) {
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerReservaciones&seccion=reservaciones', { clave: document.getElementById("inmueble").value, mes: date.getMonth() + 1, anio: date.getFullYear() }, function (xmlDoc) {
                    CalendarioR.datos = xmlDoc;
                    $("#calendario-ev-inm").datepicker("refresh");
                });
                CalendarioR.yaConsulto = true;
            }
            var dmy = (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) + "/" + (((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1))) + "/" + date.getFullYear();
            var existefecha = false;
            if (CalendarioR.datos) {
                var items = CalendarioR.datos.getElementsByTagName("Table");
                for (var i = 0; i < items.length; i++) {
                    if (GetValor(items[i], "fr") == dmy) {
                        existefecha = true;
                        items[i].parentNode.removeChild(items[i]);
                        break;
                    }
                }
            }
            if (existefecha) {
                return [true, "diaSel", "Día con reservaciones"];
            } else {
                return [true, ""];
            }
        },
        onSelect: function (date, instancia) {
            var clave = document.getElementById("inmueble").value;
            var datos = { clave: clave, fecha: date };
            CargarCatalogo("reservaciones", function () {
                document.getElementById("fecha-res").value = date;
                CambioPantalla('lista-reservaciones', 'p-regen_inmuebles');
            }, datos)
        }
    });
}

function GuardarConcepto() {
    var datos = $("#frm-edit-aportaciones").serializeArray();
    $.post(url + 'logic/controlador.aspx' + '?op=GuardarConcepto&seccion=aportaciones', datos, function (xmlDoc) {
        alert(GetValor(xmlDoc, "mensaje"));
        if (GetValor(xmlDoc, "estatus") == 1) {
            CargarCatalogo('aportaciones', function () {
                CambioPantalla('lista-aportaciones', 'p-edicion-aportaciones');
            });
        }
    });
}

function MarcarVoto(objeto, encuesta, respuesta) {
    document.getElementById("btn-votar-enc-" + encuesta).setAttribute("respuesta", respuesta);
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
            html += '<tr ' + (GetValor(respuestas[i], "respondio") == 1 ? 'class="votado"' : "") + '><td><div class="graf-barra" onclick="Mostrar(\'lista-encuesta\',\'encuesta-votantes\');"><span class="progreso" style="width:' + GetValor(respuestas[i], "porc") + '%"></span><label><b>' + GetValor(respuestas[i], "porc") + '%</b>' + GetValor(respuestas[i], "respuesta") + '</label></div></td></tr>';
        }
        html += '</table>';
        var tabla = document.getElementById("tab-resp-" + encuesta);
        tabla.innerHTML = html;
    });
}

function IniciarEliminarDirectorio(indice, boton) {

    if (confirm("Confirme que desea eliminar " + boton.parentNode.getAttribute("nombre"))) {
        $.post(url + 'logic/controlador.aspx' + '?op=Eliminar&seccion=directorio&indice=' + indice, function (xmlDoc) {
            Mostrar('p-edicion-directorio', 'lista-directorio');
            CargarCatalogo('directorio', function () { });
        });
    }
}

function CargaMasivaCuotas() {
    var frm = document.getElementById("carga-pagos");
    frm.submit();
}

function MostrarAportaciones(xmlDoc) {
    if (xmlDoc.getElementsByTagName('Table').length == 1) {
        document.getElementById("lista-ap_domicilios3").getElementsByTagName("li")[0].onclick();
    }
}

function LimpiarForm(catalogo) {
    document.getElementById('frm-edit-' + catalogo).reset();
    var wrap = document.getElementById('c-e-' + catalogo);
    if (wrap) {
        wrap.innerHTML = "";
    }
}

function Guardar(boton, catalogo, callback, subitemCatalogo, frm) {
    var formulario = frm ? frm : document.getElementById("frm-edit-" + catalogo);
    var datos = $(formulario).serializeArray();
    PonerEspera(boton, catalogo,formulario);
    $.post(url + 'logic/controlador.aspx' + '?op=Guardar&seccion=' + catalogo, datos, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            var claveItem = GetValor(xmlDoc, "clave");
            try {
                $(formulario).find("name[esNuevo]").value = false;
                $(formulario).find("name[clave]").value = claveItem;
            } catch (e) { }
            var wrap = document.getElementById("c-e-" + catalogo);
            if (wrap) {
                try {
                    var imagenes = wrap.getElementsByTagName("table");
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
                        GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback, claveItem, catalogo);
                    } else if (textosCambio.length > 0) {
                        GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, subitemCatalogo);
                    } else {
                        QuitarEspera();
                        if (callback) callback(claveItem);
                    }
                } catch (e) {
                    QuitarEspera();
                    alert(e.message);
                }
            } else {
                QuitarEspera();
                if (callback) callback(claveItem);
            }
        } else {
            QuitarEspera();
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}


function GuardarImagenesTextos(claveItem, contenedor, catalogo, callback, subitemCatalogo) {
    try {
        var imagenes = document.getElementById(contenedor).getElementsByTagName("table");
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
            GuardarUnaImagenTexto(imagenesCambio, textosCambio, 0, callback, claveItem, catalogo);
        } else if (textosCambio.length > 0) {
            GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, subitemCatalogo);
        } else {
            if (callback) callback(claveItem);
        }
    } catch (e) {
        alert(e.message);
    }

}


function PonerEspera(elemento, catalogo,formulario) {
    try {
        var fs = (formulario?formulario:document.getElementById('frm-edit-' + catalogo));
        var img = document.createElement("img");
        img.src = "img/espera.gif";
        elemento.appendChild(img);
        fs.getElementsByTagName("fieldset")[0].setAttribute("disabled", "disabled");
        $(elemento).addClass("espera");
        window.boton = elemento;
        window.formActivo = fs;
        window.catalogo = catalogo;
    } catch (e) { }
}

function QuitarEspera() {
    try {
        var imgs = window.boton.getElementsByTagName("img");
        for (var j = 0; j < imgs.length; j++) {
            if (imgs[j].src = "img/espera.gif") {
                window.boton.removeChild(imgs[j]);
            }
        }
        var fs = window.formActivo;
        fs.getElementsByTagName("fieldset")[0].removeAttribute("disabled");
        $(window.boton).removeClass("espera");
    } catch (e) { }
}

function GuardarUnaImagenTexto(imagenes, textosCambio, i, callback, claveItem, catalogo, es_comprobante) {
    var imagen = imagenes[i].getElementsByTagName("img")[(es_comprobante ? 1 : 0)];
    if (imagen.getAttribute("sel") == 1) {
        var ft = new FileTransferWeb();
        var options = function () { };
        if (isPhonegapApp) {
            ft = new FileTransfer();
            options = new FileUploadOptions();
            options.fileKey = "vImage";
            options.fileName = imagen.src.substr(imagen.src.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
        }
        var datos;
        if (es_comprobante) {
            var inputs = imagenes[i].getElementsByTagName('input');
            datos = { concepto: inputs[0].value, importe: inputs[1].value, claveItem: claveItem.clave, tipo_erog: claveItem.tipo_erog, catalogo: catalogo };
        } else {
            datos = { descripcion: imagenes[i].getElementsByTagName('textarea')[0].value, claveItem: claveItem, catalogo: catalogo };
        }
        options.params = datos;
        if (!isPhonegapApp) {
            options.params["base64"] = true;
            options.params["ext"] = imagen.ext;
            options.params["vImage"] = imagen.contenido;
        }
        options.chunkedMode = false;
        var ruta = url + 'logic/controlador.aspx?op=GuardarArchivo&seccion=' + (es_comprobante ? catalogo : 'Generico') + '&' + (imagenes[i].getAttribute("indice") ? "&indice=" + imagenes[i].getAttribute("indice") : "");
        ft.upload(imagen.src, ruta, function (r) {
            imagenes[i].setAttribute("indice", GetValor(r.response, "clave"));
            i++;
            if (i < imagenes.length) {
                try {
                    GuardarUnaImagenTexto(imagenes, textosCambio, i++, callback, claveItem, catalogo, es_comprobante);
                } catch (e) {
                    alert(e.message);
                    QuitarEspera();
                    alert("Verifique guardado");
                    if (callback) callback(claveItem);
                }
            } else {
                if (textosCambio.length > 0) {
                    try {
                        GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo, es_comprobante);
                    } catch (e) {
                        QuitarEspera();
                        alert(e.message);
                        if (callback) callback(claveItem);
                    }
                } else {
                    if (GetValor(r.response, "estatus") == 1) {
                        QuitarEspera();
                        if (callback) callback(claveItem);
                    }
                }
            }
        }, function (error) {
            QuitarEspera();
            alert("Verifique guardado.");
        }, options);
    } else {
        QuitarEspera();
        if (callback) callback(claveItem);
    }
}

var FileTransferWeb = function () { }
FileTransferWeb.prototype.upload = function (src, url, success, error, opciones) {
    $.post(url, opciones.params, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            success({ response: xmlDoc });
        } else {
            error({ response: xmlDoc });
        }
    });
}

function GuardarUnTexto(textosCambio, i, callback, clave, catalogo, subitemCatalogo, es_comprobante) {
    var datos;
    if (es_comprobante) {
        var inputs = textosCambio[i].getElementsByTagName('input');
        datos = { concepto: inputs[0].value, importe: inputs[1].value, indice: textosCambio[i].getAttribute("indice"), catalogo: catalogo };
    } else {
        datos = { descripcion: textosCambio[i].getElementsByTagName('textarea')[0].value, indice: textosCambio[i].getAttribute("indice"), catalogo: catalogo };
    }
    if (typeof (clave) == "object") {
        for (var param in clave) {
            datos[param] = clave[param];
        }
    } else {
        datos["clave"] = clave;
    }
    $.post(url + 'logic/controlador.aspx' + '?op=ActualizarDescripcion&seccion=' + (subitemCatalogo ? catalogo : "Generico"), datos, function (xmlDoc) {
        textosCambio[i].setAttribute("indice", GetValor(xmlDoc, "clave"));
        textosCambio[i].setAttribute("cambioTexto", "false");
        i++;
        if (i < textosCambio.length) {
            try {
                GuardarUnTexto(textosCambio, i++, callback, clave, catalogo, subitemCatalogo, es_comprobante);
            } catch (e) {
                QuitarEspera();
                alert(e.message);
                if (callback) callback(clave);
            }
        } else {
            QuitarEspera();
            if (GetValor(xmlDoc, "estatus") == "1") {
                if (callback) {
                    callback(clave);
                } else {
                    alert("Guardado correctamente");
                }
            } else {
                GetValor(xmlDoc, "mensaje")
            }
        }
    });
}


function IAgregarCosto(id, sinImagen) {
    var contenedor = (typeof id == "object" ? id : document.getElementById(id));
    var imagenes = contenedor.getElementsByTagName("table");
    if (imagenes.length == 0 || !sinImagen && (imagenes.length > 0 && imagenes[imagenes.length - 1].getElementsByTagName("img")[1].getAttribute("sel") == 1) || (imagenes[imagenes.length - 1].getAttribute("cambioTexto") == "true") || (imagenes[imagenes.length - 1].getAttribute("cambioTexto") == "false")) {
        var item = document.createElement("table");
        item.className = "lista-files";
        item.innerHTML = '<tbody>' +
            '<tr><td><button onclick="QuitarEIT(this);" class="del-btn"><img src="img/del.png" /></button></td><td style="width:70%"><input maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"/></td><td style="width:30%"><input onkeypress="return SoloNumeros(window.event,\'.\');" maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"/></td>' + (sinImagen ? "" : '<td style="position:relative;"><button class="con-btn" onclick="IAdjuntarImagenes(this.getElementsByTagName(\'img\')[0],true);">' + (!isPhonegapApp ? '<input type=file name="vImage" style="position:absolute;left:0px;top:0px;width:100%;height:100%;opacity:0;" onchange="var reader = new FileReader();reader.inp=this;reader.readAsDataURL(this.files[0]);reader.in=true;reader.onload=CargarImagenNav;"/>' : '') + '<img src="img/touch.png" /></button></td>') + '</tr>' +
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

function IAgregarImagenTexto(id, solotexto, mas, ocultarBtnElim) {
    var contenedor = (typeof id == "object" ? id : document.getElementById(id));
    var imagenes = contenedor.getElementsByTagName("table");
    if (imagenes.length == 0 || (imagenes.length > 0 && imagenes[imagenes.length - 1].getElementsByTagName("img")[0].getAttribute("sel") == 1) || (imagenes[imagenes.length - 1].getAttribute("cambioTexto") == "true") || mas) {
        var item = document.createElement("table");
        item.className = "lista-files";
        item.innerHTML = '<tbody>' +
            '<tr> <td style="position:relative;width:90%;">' + (solotexto ? '' : '<img src="img/upload.png" onclick="IAdjuntarImagenes(this);" />' + (!isPhonegapApp ? '<input type=file name="vImage" style="position:absolute;left:0px;top:0px;width:100%;height:100%;opacity:0;" onchange="var reader = new FileReader();reader.inp=this;reader.readAsDataURL(this.files[0]);reader.onload=CargarImagenNav;"/>' : '')) + '</td> ' + (ocultarBtnElim ? '' : '<td style="width: 10 % " rowspan="2" class="del"><button onclick="QuitarEIT(this' + (solotexto ? ",1" : '') + ');" class="del-btn"><img src="img/del.png" /></button>') + '</td></tr >' +
            '<tr><td ' + (solotexto ? 'rowspan="2"' : '') + ' ><textarea maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"></textarea></td></tr>' +
            '</tbody>';
        item.imagen = item.getElementsByTagName("img")[0];
        item.texto = item.getElementsByTagName("textarea")[0];
        contenedor.appendChild(item);
    }
    return item;
}

function CargarImagenNav(e) {
    var img = this.inp.parentNode.getElementsByTagName('img')[0];
    img.contenido = this.result.split('base64,')[1];
    img.ext = this.result.split('base64,')[0].split('/')[1].split(';')[0];
    if (new RegExp("pdf", "gi").test(img.ext)) {
        MarcarImagenAdjunta(img, "img/pdf.png", this.in);
    } else {
        img.src = e.target.result;
        MarcarImagenAdjunta(img, e.target.result, this.in);
    }
    img.onclick = function () { window.open(img.src,"_system");}
}

function QuitarEIT(obj, solotexto) {
    var objP = obj.parentNode.parentNode.parentNode.parentNode;
    var indice = objP.getAttribute("indice");
    var catalogo = objP.getAttribute("catalogo");
    var claveItem = objP.getAttribute("claveItem");
    if (indice) {
        $.post(url + 'logic/controlador.aspx' + '?op=EliminarImgTexto&seccion=' + (solotexto ? catalogo : "Generico") + '&indice=' + indice + "&catalogo=" + catalogo + "&claveItem=" + claveItem, function (xmlDoc) {
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

function IAdjuntarImagenes(img, inBtn) {
    try {
        window.imagePicker.getPictures(
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    MarcarImagenAdjunta(img, results[i], inBtn);
                }
            }, function (error) {
                alert('Error: ' + error);
            }
        );
    } catch (e) { }
}

function MarcarImagenAdjunta(img, src, inBtn) {
    img.src = src;
    img.setAttribute("sel", 1);
    if (inBtn) {
        img.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute('cambioImagen', 'true');
    } else {
        img.parentNode.parentNode.parentNode.parentNode.setAttribute('cambioImagen', 'true');
    }
}