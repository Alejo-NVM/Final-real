function ListadoProductos({ productos, editar, eliminar }) {
  return (
    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nombre}</td>
            <td>${p.precio.toFixed(2)}</td>
            <td>{p.tipo_nombre}</td>
            <td>
              <button className="btn btn-warning btn-sm me-2" onClick={() => editar(p)}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ListadoProductos;
