import { useState } from "react";
import { useVentas } from "../../context/VentasContext"; // Asegúrate de tener un contexto de ventas
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Iconos para la paginación
import { IoIosMore } from "react-icons/io"; // Para el menú de acciones
import { CiCreditCard1, CiLocationArrow1 } from "react-icons/ci";
import { Link } from "react-router-dom"; // Para enlaces de navegación
import { Tab } from "@headlessui/react";
import { updateFecha } from "../../helpers/FechaUpdate";
import ModalEstado from "./ModalEstado";
import { useObtenerId } from "../../helpers/obtenerId";

export const TableVentas = ({ ventas }) => {
  const { deleteVenta } = useVentas(); // Asegúrate de tener la función para eliminar ventas

  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(15); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleObtenerId, idObtenida } = useObtenerId();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const tabStyle = (isSelected) => `
  py-2 px-5 font-semibold capitalize rounded-full  flex gap-2 items-center
  ${
    isSelected
      ? "bg-sky-700 text-white border-sky-700 border-[1px]"
      : "bg-white text-gray-700 border-[1px] border-gray-300"
  } transition  ease-linear outline-none
`;

  return (
    <div className="my-5">
      {/* Campo para búsqueda */}
      <input
        type="text"
        placeholder="Buscar por tipo o cliente..."
        value={searchTerm}
        onChange={handleSearch}
        className="block px-4 py-2.5 mb-3 w-1/3 rounded-xl shadow-md transition-all outline-none focus:ring-sky-500 focus:border-sky-500"
      />

      <Tab.Group>
        <Tab.List className={"gap-3 flex mt-8"}>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Ventas <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Presupuestos <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="transition-all ease-linear rounded-2xl mt-3 py-5">
              <table className="min-w-full divide-y-[1px] divide-slate-200 bg-white text-sm rounded-2xl">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Total Brs
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Total Kgs
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Total
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Fecha
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700">
                      Estado de la venta
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredVentas
                    .filter((v) => v.tipo === "venta") // Filtra solo los elementos con tipo "venta"
                    .map((v) => (
                      <tr
                        key={v._id}
                        className="hover:bg-gray-100/50 cursor-pointer"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-700 capitalize">
                          {v.tipo}
                        </td>
                        <td className="px-4 py-4 text-gray-700 font-semibold capitalize">
                          {v.cliente.nombre} {v.cliente.apellido}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex">
                            <p className="text-white bg-yellow-500/90 py-2 px-5 font-bold rounded-full">
                              {v.productos.reduce(
                                (total, producto) => total + producto.cantidad,
                                0
                              )}{" "}
                              brs
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex">
                            <p className="text-white bg-green-500/90 py-2 px-5 font-bold rounded-full">
                              {v.productos
                                .reduce(
                                  (total, producto) =>
                                    total + producto.total_kilogramos,
                                  0
                                )
                                .toFixed(2)}{" "}
                              kgs
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 ">
                          <div className="flex">
                            <p className="text-white bg-sky-700 py-2 px-5 font-bold rounded-full">
                              {v.productos
                                .reduce(
                                  (total, producto) =>
                                    total + producto.total_dinero,
                                  0
                                )
                                .toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                })}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-gray-700 font-semibold">
                          {updateFecha(v.date)}
                        </td>
                        <td className="px-4 py-4 text-gray-700 font-semibold">
                          <div className="flex">
                            <p
                              className={`font-semibold py-2.5 px-5 rounded-2xl ${
                                (v.estado === "aceptada" &&
                                  "bg-green-200/90 text-green-700 ") ||
                                (v.estado === "pendiente" &&
                                  "bg-orange-200/90 text-orange-700 ") ||
                                (v.estado === "rechazada" &&
                                  "bg-red-200/90 text-red-700 ")
                              }`}
                            >
                              {(v.estado === "aceptada" && "aceptada") ||
                                (v.estado === "pendiente" && "Pendiente") ||
                                (v.estado === "rechazada" && "Rechazada")}
                            </p>
                          </div>
                        </td>
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
                                <Link
                                  className="capitalize"
                                  onClick={() => {
                                    handleObtenerId(v._id), openModal();
                                  }}
                                >
                                  Editar estado
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="capitalize"
                                  to={`/venta/${v._id}`}
                                >
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
          </Tab.Panel>
          <Tab.Panel>
            <div className="transition-all ease-linear rounded-2xl mt-3">
              <table className="min-w-full divide-y-[1px] divide-slate-200 bg-white text-sm rounded-2xl">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Total Brs
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Total Kgs
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Total
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 capitalize">
                      Fecha
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700">
                      Estado del presupuesto
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredVentas
                    .filter((v) => v.tipo === "presupuesto") // Filtra solo los elementos con tipo "venta"
                    .map((v) => (
                      <tr
                        key={v._id}
                        className="hover:bg-gray-100/50 cursor-pointer"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-700 capitalize">
                          {v.tipo}
                        </td>
                        <td className="px-4 py-4 text-gray-700 font-semibold capitalize">
                          {v.cliente.nombre} {v.cliente.apellido}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex">
                            <p className="text-white bg-yellow-500/90 py-2 px-5 font-bold rounded-full">
                              {v.productos.reduce(
                                (total, producto) => total + producto.cantidad,
                                0
                              )}{" "}
                              brs
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex">
                            <p className="text-white bg-green-500/90 py-2 px-5 font-bold rounded-full">
                              {v.productos
                                .reduce(
                                  (total, producto) =>
                                    total + producto.total_kilogramos,
                                  0
                                )
                                .toFixed(2)}{" "}
                              kgs
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 ">
                          <div className="flex">
                            <p className="text-white bg-sky-700 py-2 px-5 font-bold rounded-full">
                              {v.productos
                                .reduce(
                                  (total, producto) =>
                                    total + producto.total_dinero,
                                  0
                                )
                                .toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                })}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-gray-700 font-semibold">
                          {updateFecha(v.date)}
                        </td>
                        <td className="px-4 py-4 text-gray-700 font-semibold">
                          <div className="flex">
                            <p
                              className={`font-semibold py-2.5 px-5 rounded-2xl ${
                                (v.estado === "aceptada" &&
                                  "bg-green-200/90 text-green-700 ") ||
                                (v.estado === "pendiente" &&
                                  "bg-orange-200/90 text-orange-700 ") ||
                                (v.estado === "rechazada" &&
                                  "bg-red-200/90 text-red-700 ")
                              }`}
                            >
                              {(v.estado === "aceptada" && "aceptado") ||
                                (v.estado === "pendiente" && "Pendiente") ||
                                (v.estado === "rechazado" && "Rechazado")}
                            </p>
                          </div>
                        </td>
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
                                <Link
                                  className="capitalize"
                                  onClick={() => {
                                    handleObtenerId(v._id), openModal();
                                  }}
                                >
                                  Editar estado
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="capitalize"
                                  to={`/venta/${v._id}`}
                                >
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
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      {/* Tabla de ventas */}
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

      <ModalEstado
        closeModal={closeModal}
        isOpen={isModalOpen}
        idObtenida={idObtenida}
      />
    </div>
  );
};
