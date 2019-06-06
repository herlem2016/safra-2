﻿
window.onresize = function () {
    //EstablecerDimensiones();
}

$(document).ajaxSuccess(function (event, xhr, settings,data) {
    if (GetValor(xhr.responseXML, "mensaje").indexOf("sesion_inactiva")>0){
        IniciarSesion_back(function () {
            $.ajax(settings);
        });
    }
});

function IniciarApp() {
    InicializarApp();
    document.getElementById("main").style.display = "none";
    if (window.localStorage.getItem("codigoActivacion")) {
        if (window.localStorage.getItem("email_")) {
            IniciarSesion();            
        } else {
            PantallaMostrar("login", "section", true);
        }
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
    styleStr += ".menu li {height:" + (heightApp - 50) / 6 + "px !important;margin-bottom:" + (heightApp - 50) /40 + "px !important;}";
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
        var datos = [{ name:'codigoActivacion',value:clave}];
        $.post(url + 'logic/controlador.aspx' + '?op=ActivarAplicacion&seccion=seguridad', datos, function (xmlDoc) {
            var estatus = GetValor(xmlDoc, "estatus");
            if (estatus == 1) {
                window.localStorage.setItem("codigoActivacion", GetValor(xmlDoc, "codigoActivacion"));
                window.localStorage.setItem("srclogo ", GetValor(xmlDoc, "srclogo")); 
                InicializarApp(); 
                document.getElementById("main").style.display = "block";
                PantallaMostrar("reg-usuario", "section", true);
            } else {
                if (GetValor(xmlDoc, "codigoActivacion") && estatus == 0) {
                    alert("Su comite de administración tiene un proceso pendiente, consulte a su administrador.");
                } else {
                    alert(GetValor(xmlDoc,"mensaje"));
                }
            }
        });
    } else {
        alert("Debe ingresar clave de activación");
    }
}

function EstablecerLogo() {
    var urllogo = url + "img/logotime.png";
    if (window.localStorage.getItem("codigoActivacion")) {
        urllogo = url + "/src-img/fraccionamientos/_" + window.localStorage.getItem("codigoActivacion") + "/logo.png";
    }
    var imgs = $("img.logo");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].onerror = function () { this.src = url + "img/logotime.png"; }
        imgs[i].setAttribute("src", urllogo);
    }
}


function RegistrarUsuario() {
    var codigoActivacion = window.localStorage.getItem("codigoActivacion");
    if (codigoActivacion) {
        var titular = prompt("Por favor escriba el nombre del titular registrado");
        if (titular.trim().length) {
            var datos = $("#frmRegUsuario").serializeArray();
            datos.push({ name: 'fraccionamiento', value: codigoActivacion });
            datos.push({ name: 'titular', value: titular });
            $.post(url + 'logic/controlador.aspx?op=RegistrarUsuario&seccion=seguridad', datos, function (xmlDoc) {
                if (GetValor(xmlDoc, "estatus") == 1) {
                    IniciarSesion("frmRegUsuario");
                } else {
                    alert(GetValor(xmlDoc, "mensaje"));
                }
            });
        } else {
            alert("Para poder registrar su cuenta necesita indicar el nombre del titular");
        }
    } else {
        alert("No ha activado la aplicación");
    }
}

function IniciarSesion(frm) {
    var datos;
    if (frm) {
        datos = $("#" + frm).serializeArray();
    } else {
        datos = [{ name: "email", value: window.localStorage.getItem("email_") }, { name: "contrasena", value: window.localStorage.getItem("contrasena_") }];
    }
    IniciarSesion_back(function () {
        RegistrarNotificaciones();
        document.getElementById("main").style.display = "block";
        PantallaMostrar("home", "section", true);
    },datos);    
}


function IniciarSesion_back(callback, datos) {
    if (!datos) {
        datos = [{ name: "email", value: window.localStorage.getItem("email_") }, { name: "contrasena", value: window.localStorage.getItem("contrasena_") }];
    }    
    $.post(url + 'logic/controlador.aspx?op=IniciarSesion&seccion=seguridad', datos, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1){
            RegistrarVariables(datos, xmlDoc);
            if (callback) callback();
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

function RegistrarVariables(datos,xmlDoc) {
    window.localStorage.setItem("usuario_", GetValor(xmlDoc, "clave"));
    window.localStorage.setItem("fracc_", GetValor(xmlDoc, "fraccionamiento")); 
    window.localStorage.setItem("email_", datos[0].value);
    window.localStorage.setItem("contrasena_", datos[1].value);
    window.localStorage.setItem("domicilio", GetValor(xmlDoc, "domicilio"));
    document.getElementById("nombre-usuario").innerHTML = GetValor(xmlDoc, "nombre");
    document.getElementById("u-fraccionamiento").innerHTML = GetValor(xmlDoc, "s_nfracc");
    document.getElementById("u-domicilio").innerHTML = GetValor(xmlDoc, "s_domicilio");
    document.getElementById("tipo-usuario").innerHTML = GetValor(xmlDoc, "cargo");
}


function CerrarSesion() {
    $.post(url + 'logic/controlador.aspx?op=CerrarSesion&seccion=seguridad', function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus") == 1) {
            window.localStorage.setItem("email_", "");
            window.localStorage.setItem("contrasena_", "");
            CambioPantalla('login', 'main');
        } else {
            alert(GetValor(xmlDoc, "mensaje"));
        }
    });
}

var i_unsubs = 0;
function UnSuscribir() {
    if (i_unsubs < 9) {
        i_unsubs++;
        FCMPlugin.unsubscribeFromTopic('FRA_' + window.localStorage.getItem("codigoActivacion") + "-fun_" + i_unsubs, function () {
            UnSuscribir(); alert("ok:" + i_unsubs);
        }, function () {
            UnSuscribir(); alert("no:" + i_unsubs);
        }
        );
    } else {
        Suscribir();
    }
}

var i_subs = 0, l_s = 0,fs;
function Suscribir() {
    alert("sub:" +l_s);
    if (i_subs < l_s) {
        FCMPlugin.subscribeToTopic('FRA_' + window.localStorage.getItem("codigoActivacion") + "-fun_" + GetValor(funciones[i_subs], "clave_funcion"), function () {
            if (i_subs < l_s) { Suscribir(GetValor(fs[i_subs++], "clave_funcion")); alert("ok:" + i_subs);}
        }, function () {
            if (i_subs < l_s) { Suscribir(GetValor(fs[i_subs++], "clave_funcion")); alert("no:" + i_subs); }
        });
    } else {
        FCMPlugin.subscribeToTopic('FRA_' + window.localStorage.getItem("codigoActivacion"));
        FCMPlugin.subscribeToTopic('FRA_' + window.localStorage.getItem("codigoActivacion") + "-dom_" + window.localStorage.getItem("domicilio"));
    }
}

function RegistrarNotificaciones() {
    try {
        if (window.localStorage.getItem("email_")) {
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerFuncionesHabilitadas&seccion=seguridad&funciones=6', function (xmlDoc) {
                fs = xmlDoc.getElementsByTagName("Table");
                l_s = fs.length;
                i_subs = 0;
                i_unsubs = 0;
                alert('fun');
                UnSuscribir();                                     
                
            });
            FCMPlugin.onNotification(function (data) {
                cordova.plugins.notification.badge.increase(1, function () { });
                if (data.modulo == 1) {
                    ActivarAlarma_(data.contenidovoz);
                } else if (data.modulo == 2) {
                    ActivarTimbre_();
                }
            });
        }
    } catch (e){ }
}

function InsertarNotificacion(dato, modulo) {
    alert(dato+ ", Modulo:" + modulo);
}

function MostrarBuscar(id,catalogo,redim,c0,c1,callback,params) {
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

function ActivarTimbre_() {
    document.getElementById("alarma-timbre").play();
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
}

function DesactivarAlarma() {
    document.getElementById("alarma").style.display = "none";
    document.getElementById("alarma-v").pause();
}

function ReplaceClass(id,c0,c1) {
    var obj = (typeof(id)=="string"?document.getElementById(id):id);
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
                if(hide) document.getElementById(hide).style.display = "none";
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
            CambioPantalla(p2,p1);
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
            if (win) win.close();
            var win = window.open(url + 'logic/controlador.aspx?op=PresentarPagador&c=' + conceptospagar.join("|") + "&d=" + dom_sel + "&fracc=" + window.localStorage.getItem("fracc_") + "&usuario=" + window.localStorage.getItem("usuario_"), "_system", "location=yes");            
            consultasPago = 0;
            window.setInterval(function () {
                consultasPago++;
            }, 5000);
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
function CerrarPago(event,ventana) {
    if (event.url == url + 'logic/controlador.aspx?op=Finalizar') {
        ventana.close();        
    }
}

function GuardarItem(obj,catalogo,detalle){
        Guardar(obj, catalogo, function (claveItem) {
        LimpiarForm(catalogo);
        CargarCatalogo(catalogo, function () {
            if (detalle) {
                Mostrar('p-edicion-' + catalogo, 'detalle-' + catalogo, catalogo, claveItem);
            } else {
                CambioPantalla('lista-' + catalogo, 'p-edicion-' + catalogo);
            }
        });
    });
}

function RegistrarVotoProP(voto) {
    $.post(url + 'logic/controlador.aspx' + '?op=RegistrarVotoProP&seccion=pro_propuestas' + '&voto=' + voto + "&clave=" + document.getElementById("clave-pro_propuesta").value, function (xmlDoc) {
        if (GetValor(xmlDoc, "estatus")) {
            CargarCatalogo('pro_propuestas', function () {
                CambioPantalla('lista-pro_propuestas', 'detalle-pro_propuestas');
            });
        } else {
            alert(GetValor(xmlDoc,"mensaje"));
        }
    });
}

function IniciarAsociarCargo() {
    CambioPantalla("lista-cargos", "detalle-usuarios");
    CargarCatalogo("cargos");
}

        function PintarItem(catalogo, clave, xmlDoc0){
            var cont = "", imgsTexto;
            var xmlDoc = xmlDoc0.getElementsByTagName("Table")[0];
            switch (catalogo) {
                case "reservaciones":
                    cont =
                        '<span class="t-2">' + GetValor(xmlDoc, "descripcion") + '</span>' +
                        '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>';
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
                    document.getElementById("edit-pro_p").style.display = (GetValor(xmlDoc, "realizo")&& !GetValor(xmlDoc,"cuenta") ? "block" : "none");
                    var pantalla = document.getElementById("detalle-" + catalogo);
                    pantalla.setAttribute("clave", clave);
                    document.getElementById("clave-pro_propuesta").value = clave;
                    cont =
                        '<span class="t-3">' + GetValor(xmlDoc, "fecha") + '</span>' +
                        '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(xmlDoc, "descripcion") + '</span>';
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
                        '<span class="t-2">' + GetValor(xmlDoc, "descripcion") + '</span>';
                    document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
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
                cont ='<div class="padd30 btnsm30" style="line-height:20px;">'+
                    '<span class="t-1"><b>Nombre: </b>' + usuario + '</span>' +
                    '<span class="t-3"><b>Domicilio: </b>' + GetValor(xmlDoc, "domicilio") + '</span>' +
                    (cargo?
                    '<span class="t-2"><b>Cargo: </b>' + GetValor(xmlDoc, "cargo") + '</span>' +
                    '<button clave_funcion="5" id="cargo-usu" control="cargo-usu" class="btn2" style="display:none;" onclick="RemoverCargoUsuario(' + clave + ',' + clave_cargo + ');">Remover Cargo</button>' 
                    :
                    '<button clave_funcion="5" id="cargo-usu-a" control="cargo-usu-a" class="btn2" style="display:none;" onclick="IniciarAsociarCargo();">Asociar Cargo</button>' 
                    )+
                    '<span><button class="btn2">Suspender AV(Alerta Vecinal) 3 días</button></span>' +
                    '<span><button class="btn2">Bloquear cuenta</button></span>' +
                    '<button class="btn2">Cerrar Sesión Usuario</button></div>';
                document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
                ; break;
                case "aportaciones":
                    var obs = GetValor(xmlDoc, "observaciones");
                    var residente = GetValor(xmlDoc, "residente"); 
                    document.getElementById("wrap-detalle-aportaciones").innerHTML =
                        '<div class="' + GetValor(xmlDoc, "leyenda") + '" style="padding:35px;font-size:13px;line-height:7px;">' +
                    '<span class="t-3" style="font-size:15px;"><b>' + GetValor(xmlDoc, "leyenda") + '</b><p>' + MoneyFormat(parseFloat(GetValor(xmlDoc, "monto"))) + '</p></span><hr class="clearn"/>' +
                     '<div class="t-1"><b>Concepto:</b><p>' + GetValor(xmlDoc, "concepto") + "</p><b>Folio:</b><p>" + GetValor(xmlDoc, "folio") + "</p><br/><b>Residente:</b><p>" + residente + "</p><br/><b>Fecha de registro:</b><p>" + GetValor(xmlDoc, "fecha") + '</p></div>' +
                    '<div class="t-2"><b>Tipo de pago: </b><p>' + GetValor(xmlDoc, "tipoPago") + '</p><br/><b>Recibió:</b><p>' + GetValor(xmlDoc, "recibio") + '</p><br/><b>Canceló:</b><p>' + GetValor(xmlDoc, "cancelo") + '</p><br/></div>' +
                    '<div class="t-2"><b>Observaciones: </b><p>' + GetValor(xmlDoc, "observaciones") + '</p></div>' +                    
                    '</div>';
                    break;
                case "regen_egrepro":
                case "regen_tiposgastos":
                    var pantalla = document.getElementById("detalle-" + catalogo);
                    pantalla.setAttribute("clave", clave);
                    cont =
                        '<span class="t-1">' + GetValor(xmlDoc, "concepto") + '</span>' +
                        '<span class="t-3">' + MoneyFormat(parseFloat(GetValor(xmlDoc, "importe"))) +'</span>' +
                        '<span class="t-2">' + GetValor(xmlDoc, "fecha") + '</span>' +
                        '<span class="t-4" style="text-align:left;">Responsable:' + GetValor(xmlDoc, "nombre") + "(" + GetValor(xmlDoc, "cargo") + ")" + '</span>';
                    cont += PintarImagenesTexto(xmlDoc0);
                    document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
                    ; break;
                case "tiposgastos":
                case "egrepro":
                    var control = IAgregarCosto('c-e-regen_' + catalogo);
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
                case "solicitudes_seg":
                case "solicitudes":
                    var pantalla = document.getElementById("detalle-" + catalogo);
                    pantalla.setAttribute("clave", clave);
                    cont =                    
                        '<span class="t-1">' + GetValor(xmlDoc, "titulo") + '</span>' +
                        '<span class="t-2">' + GetValor(xmlDoc, "nombre") + (GetValor(xmlDoc, "cargo")?' (' + GetValor(xmlDoc, "cargo") + ')</span>':"") +
                        '<span class="t-3" style="width:90%;clear:both;font-size:0.85em;">' + GetValor(xmlDoc, "fecha") + '</span>' +
                        '<span class="t-2"><i>' + GetValor(xmlDoc, "descripcion") + '</i></span>';
                    cont += PintarImagenesTexto(xmlDoc0, true);
                    document.getElementById("wrap-detalle-" + catalogo).innerHTML = cont;
                    var contenedor = document.getElementById("wrap-detalle-" + catalogo);
                    var control=IAgregarImagenTexto(contenedor, 1, true,true);
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
                case "notificaciones":

                    ; break;
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
                        cont += "<div class='firma-hist'><span>" + GetValor(xmlDoc0, "nombre") + (GetValor(xmlDoc0, "cargo") ?"(" + GetValor(xmlDoc0, "cargo") + ")":"") + ", </span><span>" + GetValor(imgsTexto[j], "fecha") + "</span></div>";
                        cont += "<hr style='border:5px solid #ccc;clear:both;width:60%;'/>";
                    }
                }
                cont += (GetValor(imgsTexto[j], "path")?'<img class="file" src="' + url + '/' + GetValor(imgsTexto[j], "path") + "?v=" + Math.random() + '" />':"") +
                    '<p>' + GetValor(imgsTexto[j], "descripcion") + '</p>';                
                if (crearApartados) {
                    if (j == imgsTexto.length - 1) {
                        cont += "<div class='firma-hist'><span>" + GetValor(imgsTexto[j], "nombre") + (GetValor(xmlDoc0, "cargo") ? "(" + GetValor(xmlDoc0, "cargo") + ")" : "") + ", </span><span>" + GetValor(imgsTexto[j], "fecha") + "</span></div>";
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
                case "reservaciones":
                    CargarDatosFrmMap(xmlDoc, { indice: 'clave-reservaciones', descripcion: 'res-descripcion', inicio: 'res-inicio', fin: 'res-fin', fecha_reservada: 'fecha_reservada', inmueble:'ed-res-inmueble'});
                    break;
                case "ap_domicilios":
                    CargarDatosFrmMap(xmlDoc, { clave: 'clave-ap_domicilios', calle: 'dom-calle', titular: 'dom-titular',manzana:'dom-mz',lote:'dom-lt',numero:'dom-numero',no_interior:'dom-no_int' });
                    break;
                case "ap_conceptos":
                    CargarDatosFrmMap(xmlDoc, { clave: 'clave-ap_conceptos', nombre: 'con-nombre', descripcion: 'con-descripcion',monto:'con-monto' });
                    break;
                case "cargos":
                    CargarDatosFrmMap(xmlDoc, { clave: 'clave-cargos', nombre: 'nombre-cargos', descripcion: 'descripcion-cargos'});
                    break;
                case "usuarios":
                    CargarDatosFrmMap(xmlDoc, { clave: 'clave-usu', usuario: 'nombre-usu', apellidos: 'apellidos-usu',correo:"email-usu" });
                    break;
                case "egrepro":
                    document.getElementById("clave-" + catalogo).value = clave;
                    CargarDatosFrmMap(xmlDoc, { indice: 'clave-egrepro', titulo: 'egrepro-titulo', proyecto: 's-egre-propro' });
                    break;
                case "inmuebles":
                case "tiposgastos":
                    document.getElementById("clave-" + catalogo).value = clave;
                    CargarDatosFrmMap(xmlDoc, { indice: 'clave-tiposgastos', titulo:'tg-titulo',descripcion:'tg-descripcion'});
                    break;
                case "pro_propuestas":
                case "comunicados":
                case "solicitudes":
                case "prodserv":
                    document.getElementById("clave-" + catalogo).value = clave; 
                    if (catalogo == "prodserv") {
                        document.getElementById("check-negocio").style.display = (GetValor(xmlDoc,"esmismo")?"block":"none");
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
                        unImagentexto.texto.value=GetValor(imgsTexto[j], "descripcion");                       
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

        function IniciarEditar(esNuevo, catalogo, solotexto, intercambio, clave,callback) {
            if (window.event) window.event.stopPropagation();
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
                var datos = {claveItem:clave};
                if (typeof (clave) != "object") {
                    { claveItem: clave };
                } else {
                    datos = clave;
                }
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerItem&seccion=' + catalogo,datos, function (xmlDoc) {
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
            if (ev) {
                return (ev.which == 13 || ev.keyCode == 13);
            }
        }

        function SeleccionarConceptoPagar(objeto, clave_concepto) {
            $.post(url + 'logic/controlador.aspx' + '?op=ValidarAgregarPagar&seccion=aportaciones&concepto=' + clave_concepto + "&domicilio=" + document.getElementById("w-datos-persona").getAttribute("domicilio_sel"), function (xmlDoc) {
                if (GetValor(xmlDoc, "validacion") == 'CONTINUAR') {
                    if ($(objeto).hasClass("seleccionado")) {
                        $(objeto).removeClass("seleccionado");
                    } else {
                        $(objeto).addClass("seleccionado");
                    }
                    CalcularAportacion();
                } else {
                    alert(GetValor(xmlDoc, "validacion"));
                    CargarCatalogo('aportaciones', function () {
                        document.getElementById("aportacion").innerHTML = "Aportar";
                        CambioPantalla('lista-aportaciones', 'p-edicion-aportaciones');
                    });
                }              
            });            
        }
        var conceptospagar = [];
        function CalcularAportacion() {
            var items = $("#lista-aportaciones div.seleccionado span.t-1");
            var cuenta = 0;
            conceptospagar = [];
            var percio = 0;
            for (var i = 0; i < items.length; i++) {
                precio = parseFloat(items[i].getAttribute("precio"));
                cuenta += precio;
                conceptospagar.push(items[i].getAttribute("concepto")+","+precio);
            }            
            var btn = document.getElementById("aportacion");
            btn.innerHTML = "Total Aportar " + MoneyFormat(cuenta);   
            
        }

        function TabMostrar(tab, raiz, id, catalogo,callback) {
            try { raiz.seleccionado.className="tab"; } catch (e) { }
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
            for (var i = 0; i < pants.length; i++){
                pants[i].style.display = "none";
            }
            var obj = document.getElementById(catalogo);
            if (_pvisible) window.pvisible=document.getElementById(_pvisible);
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
            Mostrar('lista-pro','p-edicion-pro');
        }

        function CambioPantalla(id1,id2){
            var obj = document.getElementById(id1);
            window.pvisible = obj;
            MostrarOpcionesHabilitadas(true);
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
            $.post(url + 'logic/controlador.aspx' + '?op=' + op + '&seccion=' + catalogo,parametros, function (xmlDoc) {
                var items = xmlDoc.getElementsByTagName(catalogo == "encuestas" ? "Encuesta" : "Table");
                var lista = document.getElementById("lista-" + cat_).getElementsByTagName("ul")[0];
                lista.innerHTML = "";
                for (var n = 0; n < items.length; n++) {
                    lista.appendChild(ObtenerItem(cat_, items[n]));
                }  
                if(callback)
                    callback(xmlDoc);
            });
        }

        function CargarAportaciones(esBusquedaF) {
            document.getElementById("aportacion").innerHTML = "Aportar";   
            var fechas = document.getElementById('buscar-ap-fecha').value.split("-");
            var datos = {};               
            if (esBusquedaF) { datos["esBusquedaF"] = 1;}
            if (fechas[0] && fechas[0].length>0) {
                datos["fecha1"]=fechas[0];
            }
            if (fechas[1] && fechas[1].length > 0) {
                datos["fecha2"] = fechas[1];
            }
            datos["domicilio_sel"] = document.getElementById('w-datos-persona').getAttribute('domicilio_sel');
            CargarCatalogo('aportaciones', function () { }, datos);
        }

        function VerInforme(clave,config) {
            CambioPantalla("detalle-transparencia", "lista-transparencia");
            document.getElementById("table-resultados-tr").innerHTML = "";
            if (config) {
                document.getElementById('graf-transparencia').style.display = "none";
                $.post(url + 'logic/controlador.aspx' + '?op=ObtenerInforme&seccion=transparencia&grafica=1&clave=' + clave, function (xmlDoc) {
                    var pcanvas = document.getElementById('graf-transparencia');
                    pcanvas.style.display = "block";
                    MostrarGrafica(xmlDoc, config, pcanvas);
                });
            } else {
                document.getElementById('graf-transparencia').style.display = "none";
            }
            $.post(url + 'logic/controlador.aspx' + '?op=ObtenerInforme&seccion=transparencia&tabla=1&clave=' + clave, function (xmlDoc) {
                var wrap = document.getElementById("table-resultados-tr");
                wrap.innerHTML = xmlDoc;
            });
        }
        
        function MostrarGrafica(xmlDoc,configS,pcanvas){
            window.eval("var config=" + configS + ";");
            var datos = { data: { datasets: [] , labels: []} };
            var ds = xmlDoc.getElementsByTagName("Table");
            var datasets = []; var colores = [];
            for (var i = 0; i < config.datasets.length; i++) {
                datasets[i] = [];
            }
            for (var j = 0; j < ds.length; j++){
                for (var i = 0; i < config.datasets.length; i++){
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
                datos.data.datasets[i] = { data: datasets[i], label: config.labelsDS[i],backgroundColor:colores };                  
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

function ConfigurarCargo(obj,cargo) {
    var unCargo = obj.parentNode.txt;
    document.getElementById("UnCargoEd").innerHTML = unCargo;
    CambioPantalla("lista-cargosacciones", "lista-cargos");
    document.getElementById("clavecargo").value = cargo;
    CargarCatalogo("cargosacciones", function () { }, { cargo: cargo });
}


function VerEdicionConceptos() {
    CargarCatalogo("ap_conceptos", function(){
        CambioPantalla('lista-ap_conceptos', 'p-edicion-aportaciones');
    });    
}

function VerEdicionDomicilios() {
    CargarCatalogo("ap_domicilios", function(){
        CambioPantalla('lista-ap_domicilios','p-edicion-aportaciones');
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

function RemoverCargoUsuario(usuario,cargo) {
    $.post(url + 'logic/controlador.aspx' + '?op=RemoverCargoUsuario&seccion=usuarios&clave_usuario=' + usuario + "&cargo=" + cargo, function (xmlDoc) {
        Mostrar('detalle-usuarios', 'detalle-usuarios', 'usuarios', usuario);
        CargarCatalogo("usuarios");
    });
}

function VerDomiciliosAportaciones(domicilio) {
    CargarCatalogo("domiciliosconceptosini", function () {
        CambioPantalla('lista-domiciliosconceptosini','lista-ap_domicilios2');
    }, {clave:domicilio});
}

function VerVotantesPP(proyecto) {
    CargarCatalogo('pro_propuestas.ObtenerVotosPP', function () {
        CambioPantalla('lista-pro_propuestas.ObtenerVotosPP','lista-pro_propuestas');
    }, {clave:proyecto});
}

function IniciarEditarActividad(nuevo, clave) {
    document.getElementById("c-e-planpresupuestal").innerHTML="";
    if (nuevo) {
        document.getElementById('in-planpresupuestal').params = { proyecto: document.getElementById('clave-egrepro-OPP').value };
        IAgregarCosto('c-e-planpresupuestal', true);
        IniciarEditar(true, 'planpresupuestal', 2); 
    } else {
        var datos = { proyecto: document.getElementById('clave-egrepro-OPP').value, claveItem: clave };
        document.getElementById('in-planpresupuestal').params = datos;
        var control=IAgregarCosto('c-e-planpresupuestal', true);
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
        IAgregarCosto('c-e-regen_' + tipo_erog );
        IniciarEditar(true, 'regen_' + tipo_erog , 2);
    } else {
        datos["clave_pago"] = clave;
        var control = IAgregarCosto('c-e-regen_' + tipo_erog );
        IniciarEditar(false, 'regen_' + tipo_erog , 2, { b: 'p-edicion-regen_' + tipo_erog , a: 'lista-regen_' + tipo_erog }, datos, function (xmlDoc) {
            control.setAttribute("indice", GetValor(xmlDoc, "clave"));
            control.setAttribute("catalogo", 'regen_' + tipo_erog );
            control.setAttribute("claveItem", clave);
            control.imagen.src = url + '/' + GetValor(xmlDoc, "path") + "?v=" + Math.random();
            control.texto.value = GetValor(xmlDoc, "concepto");
            control.texto2.value = GetValor(xmlDoc, "importe");
        });
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

function VerAvanceProyecto(clave){
    CargarCatalogo("proyectos.ObtenerAvance", function () {
        CambioPantalla('lista-proyectos.ObtenerAvance','lista-proyectos');
    }, { proyecto: clave });
}

function RegistrarVoBoActividad(indice, proyecto) {
    if(confirm("Confirme que desea registrar como finalizada esta actividad")){
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
        if (GetValor(xmlDoc,"es_vigilancia") == 'true') {
            BuscarDomicilioV('');
        } else {
            document.getElementById("usu-prog").style.display = "block";
            document.getElementById("vigi-c").style.display = "none";
            document.getElementById("usu-prog").disabled = false;
            IniciarEditar(true, 'vigilancia', 2, { a: 'lista-vigilancia', b: 'p-edicion-vigilancia' }, undefined,function () {
                document.getElementById("es_vigilancia").value = false;
                document.getElementById("clave-domicilio-v").value = domicilio;
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
    Guardar(obj, 'vigilancia', function () {
        LimpiarForm('vigilancia');
        CargarCatalogo(catalogo); Mostrar('p-edicion-vigilancia', 'lista-vigilancia');
    });
}

function BuscarDomicilioV(buscar) {
    CargarCatalogo('vigilancia.BuscarDomicilio', function () {
        CambioPantalla('lista-vigilancia.BuscarDomicilio','lista-vigilancia');
    }, { buscar: buscar });
}

function IniciarEditarProyecto(catalogo,indice) {
    document.getElementById("s-proyecto").style.display = "none"; 
    document.getElementById("nombre-proyecto").style.display = "block";
    IniciarEditar(false, catalogo, 2, { a: 'lista-' + catalogo, b: 'p-edicion-' + catalogo }, indice, function (xmlDoc) {       
        CargarDatosFrmMap(xmlDoc, { indice: 'clave-proyectos', titulo: 'proyectos-titulo',propuesta:'s-propro'});
    });
}

function ObtenerItem(catalogo, item) {
    var itemli = document.createElement("li");
    itemli.className = "item";
    var html = "";
    switch (catalogo) {
        case "reservaciones":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "indice")); }
            itemli.innerHTML = '<span class="t-1" >' + " Desde " + GetValor(item, "inicio") + " Hasta " + GetValor(item, "fin") + '</span>' + 
                '<span class="t-2" >' + GetValor(item, "domicilio") + '</span>' + 
                '<span class="t-2">' + GetValor(item, "descripcion") + '</span>'+
                '<span class="t-3" >' + GetValor(item, "fr") + '</span>';
            break;
        case 'vigilancia.BuscarDomicilio':
            itemli.domicilio = GetValor(item, "clave");
            itemli.onclick = function () {
                document.getElementById("usu-prog").style.display = "none";
                document.getElementById("usu-prog").disabled = true;
                document.getElementById("vigi-c").style.display = "block";
                var domicilio = this.domicilio;
                IniciarEditar(true, 'vigilancia', 2, { a: 'lista-vigilancia.BuscarDomicilio', b: 'p-edicion-vigilancia' }, undefined,function () {
                    document.getElementById("es_vigilancia").value = true;
                    document.getElementById("clave-domicilio-v").value = domicilio;
                });
            }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "domicilio") + '</span>';
            break;
        case "vigilancia":
            itemli.indice = GetValor(item, "indice");
            itemli.programada = GetValor(item,"fecha_programada");
            itemli.realizo = GetValor(item, "U_realizo");
            itemli.onclick = function () {
                var indice = this.indice;
                if (this.realizo) {
                    Mostrar('lista-vigilancia','detalle-vigilancia','vigilancia',this.indice);
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
                            CargarDatosFrmMap(xmlDoc, { indice: 'clave-vigilancia', otro: 'v-otro', otro_programo: 'otro_programo', visita: 'v-visita', domicilio: 'clave-domicilio-v', placas: 'v-placas', fecha_programada: 'fecha_programada' });
                            document.getElementById("es_vigilancia").value = es_vigilancia;
                        });
                    });
                }
            }
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "domicilio") + '</span>' +                
                (
                itemli.programada&&!itemli.realizo ? '<span class="t-2" style="float:left;color:red;">PROGRAMADA</span><span class="t-3" style="float:right;">' + GetValor(item, "fecha_programada") + '</span><hr class="clearn"/>' :
                    '<span class="t-2" > ' + GetValor(item, "visita") + '</span>' + (itemli.programada?'<span class="t-2" style="float:left;color:red;">PROGRAMADA</span>':"") + '<span class="t-3 style="float:right;">' + GetValor(item, "fecha") + '</span>'
                );
            break;
        case "proyectos.ObtenerAvance":
            var indice = GetValor(item, "indice");
            var proyecto = GetValor(item, "proyecto");
            itemli.innerHTML = '<span class="t-1m">' + GetValor(item, "descripcion") + '</span><div class="btn-apl">' + (GetValor(item, "resuelto") == "true" ? '<button onclick="QuitarVoBoActividad(' + indice + ',' + proyecto + ');" style="padding:7px;display:none;" clave_funcion="5" id="qav-' + indice + '" control="qav-' + indice + '" ><img src="img/del.png" /></button><img src="img/ok.png" />':'<button onclick="RegistrarVoBoActividad(' + indice + ',' + proyecto + ');" style="padding:7px;display:none;" clave_funcion="5" id="av-' + indice + '" control="av-' + indice + '" ><img src="img/ok.png" /></button><img src="img/pendiente.png" />') + "</div>";
            break;
        case "regen_egrepro":
        case "regen_tiposgastos":
            itemli.indice = GetValor(item, "clave");
            itemli.onclick = function () {
                Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, this.indice);
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
                '<span class="t-3n" style="font-size:small;">INVERTIDO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "invertido"))) + '</span>'+
                '<button class="edit-btn" clave_funcion="3" control="ed-pp-' + itemli.indice + '" id="ed-pp-' + itemli.indice + '" style="display:none;clear:left;"  onclick="IniciarEditarActividad(false,' + itemli.indice + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="3" control="del-pp-' + itemli.indice + '" id="del-pp-' + itemli.indice + '" style="display:none;"  onclick="IniciarEliminar(this,\'' + catalogo + '\',' + itemli.indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true);" ><img  src="img/del.png" /></button>';
            break;
        case "proyectos":
            itemli.className = "itemg";
            var indice = GetValor(item, "indice");
            itemli.innerHTML = '<span class="t-1g">' + GetValor(item, "titulo") + '</span>' +
                '<button class="edit-btn" clave_funcion="2" control="ed-pro-' + indice + '" id="ed-pro-' + indice + '" style="display:none;"  onclick="IniciarEditarProyecto(\'' + catalogo + '\',' + indice + ');" ><img  src="img/edit.png" /></button>' +
                '<button class="edit-btn" clave_funcion="2" control="del-pro-' + indice + '" id="del-pro-' + indice + '" style="display:none;"  onclick="IniciarEliminar(this,\'' + catalogo + '\',' + indice + ',{ b: \'lista-' + catalogo + '\', a: \'p-edicion-' + catalogo + '\' },true);" ><img  src="img/del.png" /></button>'+
                '<div class="graf-pie" onclick="VerAvanceProyecto(' + indice + ');"><canvas></canvas></div>';
            var canvas = itemli.getElementsByTagName("canvas")[0];
            var datos = []; datos[0] = GetValor(item, "resueltos"); datos[1] = GetValor(item, "faltantes"); var av = parseInt((100 * datos[0]) / (parseInt(datos[0],10) + parseInt(datos[1],10)),10);
            var config = {
                type: 'doughnut',
                data: { datasets: [{ data: datos, backgroundColor: ["#009933", window.chartColors.gray] }] },
                options: { responsive: true, legend: { display: false }, elements: { center: { text: av+ "%",color: "#009933",sidePadding: 20}},tooltips: {enabled: false}} };
            new Chart(canvas.getContext("2d"), config);            
            break;
        case "pro_propuestas.ObtenerVotosPP":
            itemli.innerHTML = '<span class="t-2 ' + (GetValor(item,"voto")=='true'?'si':'no') + '">' + GetValor(item,"domicilio") + '</span>';
            ;break;
        case "pro_propuestas":
            var registrado = GetValor(item, "registrado");
            var proyecto = GetValor(item, "clave");
            var voto = GetValor(item, "voto");
            itemli.voto = voto;
            itemli.XML = item;            
            var html =
                '<span class="t-1" onclick="Mostrar(\'lista-pro_propuestas\',\'detalle-pro_propuestas\',\'pro_propuestas\',' + proyecto + ');">' + GetValor(item, "titulo") + '</span>' +
                '<span class="t-2">' + GetValor(item, "fecha") + '</span>'+
                '<table class="transparente" onclick="VerVotantesPP(' + proyecto +');">'+
                '<tr><td style="width:15%;" ' + (voto == 'false' ? 'class="votado"' : "") + ' ><span class="p12">No</span></td><td><div class="graf-barra" ><span class="progreso" style="width:' + GetValor(item, "porc_no") + '%"></span><b>' + GetValor(item, "porc_no") + '%</b></div></td></tr>'+                                        
                '<tr><td ' + (voto == 'true' ? 'class="votado"' : "") + '><span class="p12">Si</span></td><td><div class="graf-barra"><span class="progreso" style="width:' + GetValor(item, "porc_si") + '%"></span><b>' + GetValor(item, "porc_si") + '%</b></div></td></tr>'+                                        
                '<tr><td><span class="p12">Abst.</span></td><td><div class="graf-barra"><span class="progreso" style="width:' + GetValor(item, "porc_abst") + '%"></span><b>' + GetValor(item, "porc_abst") + '%</b></div></td></tr>'+      
                '</table>' +
                (!voto ? '<div><button class="centrado30 btn2" id="btn-votar-enc-' + proyecto + '" onclick="Mostrar(\'lista-pro_propuestas\',\'detalle-pro_propuestas\',\'pro_propuestas\',' + proyecto + ');">Votar</button></div>':"");
            itemli.innerHTML = html;                  
            break;
        case "domiciliosconceptosini":
            var registrado = GetValor(item, "registrado");
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "nombre") + '</span><span class="t-3">' + MoneyFormat(parseFloat(GetValor(item, "monto"))) + '</span><input type="checkbox" name="concepto" value="' + GetValor(item, "clave") + '" ' + (registrado ? 'checked="checked"' : '') + ' />';
            break;
        case "ap_domicilios2":
            var domicilio = GetValor(item, "clave");                
            var str = '<span class="t-1" >' + GetValor(item, "domicilio") + '</span>' +
                '<span class="t-3">' + GetValor(item, "titular") + '</span>';
            itemli.str = str;
            itemli.onclick = function () {
                document.getElementById("clavedomicilio").value = domicilio;
                document.getElementById("UnDomicilioEd").innerHTML = this.str;
                VerDomiciliosAportaciones(domicilio);
            }
            itemli.innerHTML = str;
            break;
        case "ap_domicilios":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "domicilio") + '</span>' +
                '<span class="t-3">' + GetValor(item, "titular") + '</span>';
            break;
        case "ap_conceptos":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "nombre") + '</span>' +
                '<span class="t-3">' + GetValor(item, "fecha1") + '</span>';
            break;
        case "cargosacciones":
            var accion = GetValor(item,"clave_accion");
            itemli.innerHTML =
                '<span class="t-1m">' + GetValor(item, "descripcion") + '</span><input type="checkbox" name="accion" value="' + GetValor(item, "clave") + '" ' + (accion? 'checked="checked"':'') +' />';
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
            var clave = GetValor(item,"clave");
            itemli.onclick = function () {
                var html = this.innerHTML;
                document.getElementById("UnUsuario").innerHTML = html;
                document.getElementById("UnUsuario").setAttribute("usuario",clave);
                Mostrar('lista-usuarios', 'detalle-usuarios', 'usuarios', clave);
            }
            var cargo = GetValor(item, "cargo");
            itemli.innerHTML =
                '<span class="t-1">' + GetValor(item, "usuario") + (cargo ? ":<b>" + cargo + '</b>' : "") + '</span>' +
                '<span class="t-3"><b>' + GetValor(item, "domicilio") + '</b></span><hr class="clearn"/>';
            break;
        case "transparencia":
            itemli.setAttribute("config",GetValor(item, 'config'));
            itemli.innerHTML = '<button  class="aceptar" onclick="VerInforme(' + GetValor(item, 'clave') + ',this.parentNode.getAttribute(\'config\'));">' + GetValor(item,'descripcion') + '</button>';
            break;
        case "ap_domicilios3":                    
            itemli.innerHTML =
                '<span class="t-1" style="display:inline-block;width:90% !important;">' + GetValor(item, "domicilio") + '</span>' +
                '<span class="t-3" style="float:left;width:90% !important;"> ' + GetValor(item, "titular") + '</span><hr class="clearn"/>';                    
            itemli.onclick = function () {
                var str = this.innerHTML;
                var domicilio_sel = GetValor(item, "clave");
                var datosp = document.getElementById("w-datos-persona");
                datosp.setAttribute("domicilio_sel", domicilio_sel);
                datosp.innerHTML = str;
                CambioPantalla('lista-aportaciones', 'lista-ap_domicilios3');
                document.getElementById('buscar-ap-fecha').value = "";
                CargarAportaciones(true);
            }
            break;
        case "aportaciones":
            var leyenda = GetValor(item, "leyenda");
            if (leyenda == "PENDIENTE") {       
                itemli.innerHTML =
                    '<div class="' + GetValor(item, "leyenda") + '" onclick="SeleccionarConceptoPagar(this,' + GetValor(item, "clave_concepto") + ');">'+
                    '<span class="t-1" concepto="' + GetValor(item, "clave_concepto") + '" precio="' + GetValor(item, "monto") + '">' + GetValor(item, "concepto") + '</span>' +
                    '<span class="t-3 ' + GetValor(item, "leyenda") + '" style="float:right;">' + GetValor(item, "leyenda") + ' <br/>' + MoneyFormat(parseFloat(GetValor(item, "monto"))) + '</span><hr class="clearn"/>' +
                    '</div>';
            } else {
                var folio = GetValor(item, "folio");
                itemli.onclick = function () {                        
                    Mostrar('lista-aportaciones', 'detalle-aportaciones', 'aportaciones', folio);
                }
                var residente = GetValor(item, "residente"); 
                itemli.innerHTML =
                    '<div class="' + GetValor(item, "leyenda") + '">'+
                    '<span class="t-1">' + GetValor(item, "concepto") + '</span>'+
                    '<span class="t-6v" style="margin-left:10px;">Tipo de pago: ' + GetValor(item, "tipoPago") + '<br /> Folio:' + folio + '<br/>' + GetValor(item, "fecha") + '</span>' +
                    '<span class="t-3" style="float:right;"><b>' + leyenda + '</b> <br/> ' + MoneyFormat(parseFloat(GetValor(item, "monto"))) + '<br/><img src="img/goodpay.png"/></span><hr class="clearn"/>' +
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
        case "tiposgastos":
            var indice = GetValor(item, "indice");
            itemli.clave = indice;
            itemli.onclick = function () {
                var clave = this.clave;
                document.getElementById("clave-tiposgastos-OPP").params = { clave: clave, tipo_erog: 1 };
                CargarCatalogo('regen_tiposgastos', function () {CambioPantalla('lista-regen_tiposgastos','lista-tiposgastos')}, {clave:clave,tipo_erog:1});
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
                }, [{ name: "clave", value: this.clave }]);
            }
            itemli.innerHTML =
            '<span class="t-1" style="padding-bottom:10px;">' + GetValor(item, "titulo") + '</span>' +
            '<span class="t-2n" style="font-size:small;">PRESUPUESTADO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "presup"))) + '</span>' +
            '<span class="t-3n" style="font-size:small;">INVERTIDO: <br/>' + MoneyFormat(parseFloat(GetValor(item, "invertido"))) + '</span>';     
            break;
        case "comunicados":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                '<span class="aux-1" style="float:left;clear:left;width:40%;">' + GetValor(item, "alias") + '</span>' +
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:40%;">' + GetValor(item, "estado") + '</span>' +
                '<span class="t-3n"  style="float:left;clear:left;width:40%;">' + GetValor(item, "fecha1") + '</span>';
            break;

        case "solicitudes_seg":
        case "solicitudes":
            itemli.onclick = function () { Mostrar('lista-' + catalogo, 'detalle-' + catalogo, catalogo, GetValor(item, "clave")); }
            itemli.innerHTML = '<span class="t-1" >' + GetValor(item, "titulo") + '</span>' +
                '<span class="aux-1" style="float:left;clear:left;width:40%;">' + GetValor(item, "alias") + '</span>'+
                '<span class="t-3n" style="float:right;text-align:right;clear:right;width:40%;">' + GetValor(item, "estado") + '</span>' +
                '<span class="t-3n"  style="float:left;clear:left;width:40%;">' + GetValor(item, "fecha1") + '</span>';
            break;
        case "directorio":
            itemli.setAttribute("nombre",GetValor(item, "nombre"));
            html = '<span>' + GetValor(item, "nombre") + '</span>' +                
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
                itemli.innerHTML = html + '</ol>' +
                    '<button class="edit-btn" clave_funcion="2" control="ed-2-' + GetValor(item, "indice") + '" id="ed-2-' + GetValor(item, "indice") + '" style="display:none;clear:left;"  onclick="IniciarEditarDirectorio(false,' + GetValor(item, "indice") + ');" ><img  src="img/edit.png" /></button>' +
                    '<button class="edit-btn" clave_funcion="2" control="del-2-' + GetValor(item, "indice") + '" id="del-2-' + GetValor(item, "indice") + '" style="display:none;"  onclick="IniciarEliminarDirectorio(' + GetValor(item, "indice") + ',this);" ><img  src="img/del.png" /></button>';
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
                '<button class="centrado30 btn2" id="btn-votar-enc-' + encuesta + '" onclick="RegistrarVoto(this,' + encuesta  + ')">Votar</button>' +
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

function MoneyFormat(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function LimpiarClases(id,like) {
    var clase = document.getElementById(id).getAttribute("class");
    if(clase){
        var clases = clase.split(" ");
        for (var i = 0; i < clases.length;i++){
            if (clases[i].indexOf(like) > -1) {
                $("#" + id).removeClass(clases[i]);
            }
        }
    }    
}


var CalendarioR={};
function CargarCalendarioR(clave) {
        document.getElementById("inmueble").value=clave;         
        CalendarioR.yaConsulto = false;
        CambioPantalla('p-regen_inmuebles', 'lista-inmuebles');   
        try { $("#calendario-ev-inm").datepicker("refresh"); } catch (e) { }
        $("#calendario-ev-inm").datepicker({
            dateFormat: "dd/mm/yy",
            onChangeMonthYear: function (anio, mes, cal) {
                CalendarioR.yaConsulto = false;
            },
            beforeShowDay: function (date) {
                if (date.getDate()==1 && !CalendarioR.yaConsulto) {
                    $.post(url + 'logic/controlador.aspx' + '?op=ObtenerReservaciones&seccion=reservaciones', { clave: document.getElementById("inmueble").value, mes: date.getMonth() + 1, anio: date.getFullYear() }, function (xmlDoc) {                        
                        CalendarioR.datos = xmlDoc;
                        $("#calendario-ev-inm").datepicker("refresh");
                    });
                    CalendarioR.yaConsulto=true;
                }
                var dmy = (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) + "/" + (((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1))) + "/" + date.getFullYear();
                var existefecha = false;
                if (CalendarioR.datos) {
                    var items = CalendarioR.datos.getElementsByTagName("Table");
                    for (var i = 0; i < items.length; i++) {
                        if (GetValor(items[i], "fr")==dmy) {
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
                var clave=document.getElementById("inmueble").value;
                var datos = { clave: clave, fecha: date};
                CargarCatalogo("reservaciones", function () {
                    document.getElementById("fecha-res").value = date; 
                    CambioPantalla('lista-reservaciones','p-regen_inmuebles');
                }, datos)
            }
        });
}

function GuardarConcepto() {
    var datos = $("#frm-edit-aportaciones").serializeArray();
    $.post(url + 'logic/controlador.aspx' + '?op=GuardarConcepto&seccion=aportaciones',datos, function (xmlDoc) {                
        alert(GetValor(xmlDoc, "mensaje"));
        if (GetValor(xmlDoc, "estatus") == 1) {
            CargarCatalogo('aportaciones', function () {
                CambioPantalla('lista-aportaciones', 'p-edicion-aportaciones'); 
            });
        }               
    });
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

        function Guardar(boton,catalogo,callback,subitemCatalogo) {
            var datos = $("#frm-edit-" + catalogo).serializeArray();
            PonerEspera(boton,catalogo);
            $.post(url + 'logic/controlador.aspx' + '?op=Guardar&seccion=' + catalogo, datos, function (xmlDoc) {  
                if (GetValor(xmlDoc, "estatus") == 1) {
                    var claveItem = GetValor(xmlDoc, "clave");
                    if (document.getElementById("c-e-" + catalogo)){
                        try {
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
                                if(callback) callback(claveItem);
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
                            if (callback) callback(claveItem);
                        }
                    } else {
                        if (textosCambio.length > 0) {
                            try {
                                GuardarUnTexto(textosCambio, 0, callback, claveItem, catalogo,es_comprobante);
                            } catch (e){
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

        function GuardarUnTexto(textosCambio, i, callback, clave, catalogo, subitemCatalogo,es_comprobante) {
            var datos;
            if (es_comprobante) {
                var inputs = textosCambio[i].getElementsByTagName('input');
                datos={ concepto: inputs[0].value, importe:inputs[1].value, indice: textosCambio[i].getAttribute("indice"), catalogo:catalogo };
            } else {
                datos = { descripcion: textosCambio[i].getElementsByTagName('textarea')[0].value, indice: textosCambio[i].getAttribute("indice"),catalogo: catalogo };
            }
            if (typeof (clave) == "object") {
                for(var param in clave){
                    datos[param] = clave[param];
                }
            } else {
                datos["clave"] = clave;
            }
            $.post(url + 'logic/controlador.aspx' + '?op=ActualizarDescripcion&seccion=' + (subitemCatalogo ? catalogo : "Generico"), datos, function (xmlDoc) {
                textosCambio[i].setAttribute("indice", GetValor(xmlDoc, "clave"));
                textosCambio[i].setAttribute("cambioTexto","false");
                i++;
                if (i < textosCambio.length) {
                    try {
                        GuardarUnTexto(textosCambio, i++, callback, clave, catalogo, subitemCatalogo,es_comprobante);
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


        function IAgregarCosto(id,sinImagen) {
            var contenedor = (typeof id == "object" ? id : document.getElementById(id));
            var imagenes = contenedor.getElementsByTagName("table");
            if (imagenes.length == 0 || !sinImagen && (imagenes.length > 0 && imagenes[imagenes.length - 1].getElementsByTagName("img")[1].getAttribute("sel") == 1) || (imagenes[imagenes.length - 1].getAttribute("cambioTexto") == "true") || (imagenes[imagenes.length - 1].getAttribute("cambioTexto") == "false")) {
                var item = document.createElement("table");
                item.className = "lista-files";
                item.innerHTML = '<tbody>' +
                    '<tr><td><button onclick="QuitarEIT(this);" class="del-btn"><img src="img/del.png" /></button></td><td style="width:70%"><input maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"/></td><td style="width:30%"><input onkeypress="return SoloNumeros(window.event,\'.\');" maxlength="200" onchange="this.parentNode.parentNode.parentNode.parentNode.setAttribute(\'cambioTexto\',\'true\');"/></td>' + (sinImagen ? "" : '<td><button class="con-btn" onclick="IAdjuntarImagenes(this.getElementsByTagName(\'img\')[0],true);"><img src="img/touch.png" /></button></td>') + '</tr>' +
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