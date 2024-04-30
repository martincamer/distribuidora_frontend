import { useState } from "react";
import { useVentas } from "../../context/VentasContext"; // Asegúrate de tener un contexto de ventas
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Iconos para la paginación
import { IoIosMore } from "react-icons/io"; // Para el menú de acciones
import { Link } from "react-router-dom"; // Para enlaces de navegación

export const TableVentas = ({ ventas }) => {
  const { deleteVenta } = useVentas(); // Asegúrate de tener la función para eliminar ventas

  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(15); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda

  // Índices para la paginación
  const indexOfLastVenta = currentPage * ventasPerPage;
  const indexOfFirstVenta = indexOfLastVenta - ventasPerPage;
  const currentVentas = ventas.slice(indexOfFirstVenta, indexOfLastVenta); // Elementos a mostrar

  // Cambiar la página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Manejar búsqueda
  const handleSearch = (event) => {
    setCurrentPage(1); // Restablecer la página al buscar
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  // Filtrar ventas por el término de búsqueda
  const filteredVentas = currentVentas.filter(
    (venta) =>
      venta.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(ventas.length / ventasPerPage); // Calcular el total de páginas

  // Obtener los números de las páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="mt-5">
      {/* Campo para búsqueda */}
      <input
        type="text"
        placeholder="Buscar por tipo o cliente..."
        value={searchTerm}
        onChange={handleSearch}
        className="block px-4 py-2.5 mb-3 w-1/3 rounded-xl shadow-md transition-all outline-none focus:ring-sky-500 focus:border-sky-500"
      />

      {/* Tabla de ventas */}
      <div className="transition-all ease-linear rounded-2xl mt-6">
        <table className="min-w-full divide-y-[1px] divide-slate-200 bg-white text-sm rounded-2xl">
          <thead>
            <tr>
              <th className="text-left px-4 py-4 font-medium text-gray-900 uppercase">
                Tipo
              </th>
              <th className="text-left px-4 py-4 font-medium text-gray-900 uppercase">
                Cliente
              </th>
              <th className="text-left px-4 py-4 font-medium text-gray-900 uppercase">
                Total
              </th>
              <th className="text-left px-4 py-4 font-medium text-gray-900 uppercase">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredVentas.map((v) => (
              <tr key={v._id} className="hover:bg-gray-100/50 cursor-pointer">
                <td className="px-4 py-4 font-medium text-gray-900">
                  {v.tipo}
                </td>
                <td className="px-4 py-4 text-gray-700">{v.cliente.nombre}</td>
                <td className="px-4 py-4 text-sky-600">{v.total}</td>
                <td className="px-4 py-4 text-gray-700">{v.date}</td>
                <td className="px-4 py-4">
                  <div className="dropdown dropdown-left drop-shadow-lg">
                    <div
                      tabIndex={0}
                      role="button"
                      className="py-2 px-3 transition-all hover:bg-sky-100 hover:text-sky-700 border-none rounded-2xl"
                    >
                      <IoIosMore className="text-2xl" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link
                          className="capitalize"
                          to={`/editar-venta/${v._id}`}
                        >
                          Editar venta
                        </Link>
                      </li>
                      <li>
                        <Link className="capitalize" to={`/venta/${v._id}`}>
                          Ver detalles
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => deleteVenta(v._id)} // Función para eliminar venta
                          type="button"
                          className="capitalize"
                        >
                          Eliminar venta
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-3 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft /> {/* Icono para la flecha izquierda */}
        </button>
        <ul className="flex space-x-2">
          {getPageNumbers().map((number) => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-white" : "bg-gray-300"
                } py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100`}
              >
                {number} {/* Número de página */}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight /> {/* Icono para la flecha derecha */}
        </button>
      </div>
    </div>
  );
};
