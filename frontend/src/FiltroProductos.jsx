import React, { useState } from "react";

function FiltroProductos({ tipos, onFiltrar }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");

  function actualizarFiltros(nuevoFiltro) {
    const filtrosActualizados = {
      tipo: nuevoFiltro.tipo ?? tipoSeleccionado,
      nombre: nuevoFiltro.nombre ?? nombre
    };

    setTipoSeleccionado(filtrosActualizados.tipo);
    setNombre(filtrosActualizados.nombre);

    onFiltrar(filtrosActualizados);
  }

  return (
    <div className="d-flex gap-3 mb-3">
      <select
        className="form-select"
        value={tipoSeleccionado}
        onChange={(e) =>
          actualizarFiltros({ tipo: e.target.value })
        }
      >
        <option value="">Todos los tipos</option>
        {tipos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre..."
        value={nombre}
        onChange={(e) =>
          actualizarFiltros({ nombre: e.target.value.toLowerCase() })
        }
      />
    </div>
  );
}

export default FiltroProductos;
