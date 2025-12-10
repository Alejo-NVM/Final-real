import { useEffect, useState } from "react";
import api from "./api";
import ListadoProductos from "./ListadoProductos.js";
import FormularioProducto from "./FormularioProducto.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  //inizialated
  async function cargarDatos() {
    try {
      const resProd = await api.get("/productos");
      const resTipos = await api.get("/tipos");

      setProductos(resProd.data);
      setTipos(resTipos.data);
    } catch (err) {
      toast.error("Error cargando datos");
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);
  /////////////////////////////

//hanlders ABM
  function abrirNuevo() {
    setProductoEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(prod) {
    setProductoEditando(prod);
    setModalAbierto(true);
  }

  async function eliminar(id) {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      toast.success("Producto eliminado");
      cargarDatos();
    } catch {
      toast.error("Error al eliminar");
    }
  }
/////////////////////////////
  return (
    <div className="container mt-4">
      <ToastContainer />

      <h1>productos</h1>

      <button className="btn btn-primary mb-3" onClick={abrirNuevo}>
        Nuevo producto
      </button>

      <ListadoProductos
        productos={productos}
        editar={abrirEditar}
        eliminar={eliminar}
      />

      <FormularioProducto
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        tipos={tipos}
        producto={productoEditando}
        refrescar={cargarDatos}
      />
    </div>
  );
}

export default App;
