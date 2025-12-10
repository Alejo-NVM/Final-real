import Modal from "react-modal";
import { useEffect, useState } from "react";
import api from "./api";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

function FormularioProducto({ abierto, cerrar, tipos, producto, refrescar }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setPrecio(producto.precio);
      setTipo(producto.tipos_id);
    } else {
      setNombre("");
      setPrecio("");
      setTipo(tipos[0]?.id || "");
    }
  }, [producto, tipos]);

  async function guardar(e) {
    e.preventDefault(); // CLAVE: evitamos que el form recargue la página

    try {
      const body = {
        nombre,
        precio,
        tipos_id: tipo,
      };

      if (producto) {
        await api.put(`/productos/${producto.id}`, body);
        toast.success("Producto actualizado");
      } else {
        await api.post("/productos", body);
        toast.success("Producto creado");
      }

      cerrar();
      refrescar();
    } catch (error) {
        if (error.response) {
          const data = error.response.data;

          if (error.response.status === 422 && Array.isArray(data.errores)) {
            data.errores.forEach(err => toast.error(err));
            return;
          }

          if (data.mensaje) {
            toast.error(data.mensaje);
            return;
          }
        }
        toast.error("Error al guardar");
    }
  }

  return (
    <Modal
      isOpen={abierto}
      onRequestClose={cerrar}
      overlayClassName="modal-fondo"
      className="modal-contenido"
    >
      <h4>{producto ? "Editar Producto" : "Nuevo Producto"}</h4>

      <form onSubmit={guardar}>
        <div className="mb-2">
          <label>Nombre</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Precio</label>
          <input
            className="form-control"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Tipo</label>
          <select
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="text-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={cerrar}
          >
            Cancelar
          </button>

          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default FormularioProducto;
