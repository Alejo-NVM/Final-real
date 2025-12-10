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

  async function guardar() {
    try {
      const body = {
        nombre,
        precio,
        tipos_id: tipo
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
    } catch {
      toast.error("Error al guardar");
    }
  }

  return (
    <Modal
      isOpen={abierto}
      onRequestClose={cerrar}
      className="modal-dialog modal-dialog-centered"
      overlayClassName="modal-backdrop show d-block"
    >
      <div className="modal-content p-3">
        <h4>{producto ? "Editar Producto" : "Nuevo Producto"}</h4>

        <div className="mb-2">
          <label>Nombre</label>
          <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>

        <div className="mb-2">
          <label>Precio</label>
          <input className="form-control" type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Tipo</label>
          <select className="form-control" value={tipo} onChange={e => setTipo(e.target.value)}>
            {tipos.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div className="text-end">
          <button className="btn btn-secondary me-2" onClick={cerrar}>Cancelar</button>
          <button className="btn btn-success" onClick={guardar}>Guardar</button>
        </div>

      </div>
    </Modal>
  );
}

export default FormularioProducto;
