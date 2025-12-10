import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";
import FiltroProductos from "./FiltroProductos";
import ListadoProductos from "./ListadoProductos";
import FormularioProducto from "./FormularioProducto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

function App() {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtros, setFiltros] = useState({ tipo: "", nombre: "" });
const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
const [idAEliminar, setIdAEliminar] = useState(null);

  // Inicializar datos
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

  // filtros 
  function aplicarFiltros() {
    return productos.filter((p) => {
      const coincideTipo =
        filtros.tipo === "" || p.tipos_id === Number(filtros.tipo);

      const coincideNombre =
        filtros.nombre === "" ||
        p.nombre.toLowerCase().includes(filtros.nombre);

      return coincideTipo && coincideNombre;
    });
  }

  const productosFiltrados = aplicarFiltros();

  // ABM
  function abrirNuevo() {
    setProductoEditando(null);
    setModalAbierto(true);
  }

  function abrirEditar(prod) {
    setProductoEditando(prod);
    setModalAbierto(true);
  }

  function eliminar(id) {
  setIdAEliminar(id);
  setModalConfirmOpen(true);
}
  async function confirmarEliminacion() {
    try {
      await api.delete(`/productos/${idAEliminar}`);
      toast.success("Producto eliminado");
      cargarDatos();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setModalConfirmOpen(false);
      setIdAEliminar(null);
    }
  }


  return (
    <>
      <ToastContainer />
    <div className="container mt-4">

      <h1>Productos</h1>

      <button className="btn btn-primary mb-3" onClick={abrirNuevo}>
        Nuevo producto
      </button>

      <FiltroProductos tipos={tipos} onFiltrar={setFiltros} />
      <button className="btn btn-refresh mb-3 ms-3" onClick={cargarDatos}>
        Actualizar
      </button>

      <ListadoProductos
        productos={productosFiltrados}
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
      <Modal
        isOpen={modalConfirmOpen}
        onRequestClose={() => setModalConfirmOpen(false)}
        overlayClassName="modal-fondo"
        className="modal-contenido"
      >
        <h4>Confirmar eliminación</h4>
        <p>¿Estás seguro de que querés eliminar este producto?</p>

        <div className="text-end mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setModalConfirmOpen(false)}
          >
            Cancelar
          </button>

          <button
            className="btn btn-danger"
            onClick={confirmarEliminacion}
          >
            Eliminar
          </button>
        </div>
      </Modal>

    </div>
    </>
  );
}

export default App;
