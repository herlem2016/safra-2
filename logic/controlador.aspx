<%@ Page Language="C#"%>
<%@ Import Namespace="System.Data"%>
<%@ Import Namespace="Server"%>
<script runat="server">

    Modelo oModelo = new Modelo(HttpContext.Current.Server.MapPath("~") + "logic/dbo.xml",true);

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string op = Request["op"], seccion=Request["seccion"];
        if(op !=null && seccion != null) {
            switch (op)
            {
                case "GuardarArchivo": GuardarArchivo();break;
                default: oModelo.GenerarOperacionCX(op, seccion, null, true).WriteXml(Response.OutputStream); break;
            }
        }else {
            Response.Write("<mensaje>No se recibieron parametros op y sección.</mensaje>");
        }
    }

    public void GuardarArchivo() {
        DataSet ds = new DataSet();
        foreach (string f in Request.Files){
            try
            {
                ds=oModelo.GenerarOperacionCX("GuardarArchivo_", "Generico", null, true);
                if (ds.Tables[0].Rows[0]["estatus"].ToString() == "1")
                {
                    int clave = (int)ds.Tables[0].Rows[0]["clave"];
                    if (!System.IO.Directory.Exists(Server.MapPath("~/src-img") + "/" + Request["catalogo"])) System.IO.Directory.CreateDirectory(Server.MapPath("~/src-img") + "/" + Request["catalogo"]);
                    if (!System.IO.Directory.Exists(Server.MapPath("~/src-img") + "/" + Request["catalogo"] + "/" + "_" + Request["claveItem"])) System.IO.Directory.CreateDirectory(Server.MapPath("~/src-img") + "/" + Request["catalogo"] + "/" + "_" + Request["claveItem"]);
                    Request.Files[f].SaveAs(Server.MapPath("~/src-img") + "/" + Request["catalogo"] + "/" + "_" + Request["claveItem"] + "/" + "_" + clave + Util.ObtenerExtensionArchivoPost(Request.Files[f]));                 
                }
            }
            catch (Exception e) {
                ds=Util.agregarCampoValor("estatus", "-1",ds);
                ds=Util.agregarCampoValor("mensaje", e.Message,ds);
            }
        }
        ds.WriteXml(Response.OutputStream);
    }



    </script>

