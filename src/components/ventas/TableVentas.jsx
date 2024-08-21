import { useState } from "react";
import { useVentas } from "../../context/VentasContext"; // Asegúrate de tener un contexto de ventas
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Iconos para la paginación
import { IoIosMore } from "react-icons/io"; // Para el menú de acciones
import { CiCreditCard1 } from "react-icons/ci";
import { Link } from "react-router-dom"; // Para enlaces de navegación
import { Tab, Transition } from "@headlessui/react";
import { updateFecha } from "../../helpers/FechaUpdate";
import { useObtenerId } from "../../helpers/obtenerId";
import ModalEstado from "./ModalEstado";
import { useModal } from "../../helpers/modal";
import ModalConvertirVenta from "./ModalConvertirVenta";

export const TableVentas = ({ ventas }) => {
  const { deleteVenta } = useVentas(); // Asegúrate de tener la función para eliminar ventas

  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(10); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda

  const {
    openModal: openModalGenerarVenta,
    closeModal: closeModalGenerarVenta,
    isOpen: isOpenGenerarVenta,
  } = useModal();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { handleObtenerId, idObtenida } = useObtenerId();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sortedVentas = ventas
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Manejar búsqueda
  const handleSearch = (event) => {
    setCurrentPage(1); // Restablecer la página al buscar
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  // Filtrar ventas por el término de búsqueda
  const filteredVentas = sortedVentas.filter(
    (venta) =>
      venta.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabStyle = (isSelected) => `
  py-2 px-5 font-semibold capitalize rounded-md text-sm  flex gap-2 items-center
  ${
    isSelected
      ? "bg-primary text-white border-primary border-[1px]"
      : "bg-white text-gray-700 border-[1px] border-gray-300"
  } transition  ease-linear outline-none
`;

  return (
    <div className="py-5">
      <Tab.Group>
        <Tab.List className={"gap-3 flex md:mt-8"}>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Ventas <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Presupuestos <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="mt-3">
              <table className="table">
                <thead>
                  <tr className="font-bold text-gray-800 text-sm">
                    <th className="">Tipo</th>
                    <th className="">Cliente</th>
                    <th className="">Total Brs</th>
                    <th className="">Total Kgs</th>
                    <th className="">Total</th>
                    <th className="">Fecha</th>
                    <th className=" ">Estado de la venta</th>
                  </tr>
                </thead>
                <tbody className="uppercase text-xs font-medium">
                  {filteredVentas
                    .filter((v) => v.tipo === "venta") // Filtra solo los elementos con tipo "venta"
                    .map((v) => (
                      <tr key={v._id} className="">
                        <td>{v.tipo}</td>
                        <td>
                          {v.cliente.nombre} {v.cliente.apellido}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex">
                            <p className="text-white bg-primary py-2 px-5 font-bold rounded-md">
                              {v.productos.reduce(
                                (total, producto) =>
                                  total + Number(producto.cantidad),
                                0
                              )}{" "}
                              brs
                            </p>
                          </div>
                        </td>
                        <td className="">
                          <div className="flex">
                            <p className="text-white bg-green-500/90 py-2 px-5 font-bold rounded-md">
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
                        <td className="">
                          <div className="flex">
                            <p className="text-white bg-blue-500 py-2 px-5 font-bold rounded-md">
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
                              className={`font-semibold py-2 px-5 rounded-md ${
                                (v.estado === "aceptada" &&
                                  "bg-green-100/90 text-green-700 ") ||
                                (v.estado === "pendiente" &&
                                  "bg-orange-100/90 text-orange-700 ") ||
                                (v.estado === "rechazada" &&
                                  "bg-red-100/90 text-red-700 ")
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
                              className="py-2 px-2 transition-all hover:bg-sky-500 hover:text-white border-none rounded-full"
                            >
                              <IoIosMore className="text-2xl" />
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 gap-1"
                            >
                              <li>
                                <Link
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                                  to={`/editar-venta/${v._id}`}
                                >
                                  Editar venta
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                                  onClick={() => {
                                    handleObtenerId(v._id), openModal();
                                  }}
                                >
                                  Editar estado
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                                  to={`/venta/${v._id}`}
                                >
                                  Ver venta/facturar
                                </Link>
                              </li>
                              <li>
                                <button
                                  onClick={() => deleteVenta(v._id)} // Función para eliminar venta
                                  type="button"
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
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
              <table className="min-w-full table bg-white text-sm rounded-2xl">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Tipo
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Total Brs
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Total Kgs
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Total
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Fecha
                    </th>
                    {/* <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Estado del presupuesto
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredVentas
                    .filter((v) => v.tipo === "presupuesto") // Filtra solo los elementos con tipo "venta"
                    .map((v) => (
                      <tr
                        key={v._id}
                        className="hover:bg-gray-100/50 cursor-pointer uppercase"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-700">
                          {v.tipo}
                        </td>
                        <td className="px-4 py-4 text-gray-700 font-semibold">
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

                        <td className="px-4 py-4">
                          <div className="dropdown dropdown-left drop-shadow-lg">
                            <div
                              tabIndex={0}
                              role="button"
                              className="py-2 px-2 transition-all hover:bg-sky-500 hover:text-white border-none rounded-full"
                            >
                              <IoIosMore className="text-2xl" />
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 gap-1"
                            >
                              <li>
                                <Link
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                                  to={`/editar-venta/${v._id}`}
                                >
                                  Editar venta
                                </Link>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    handleObtenerId(v._id),
                                      openModalGenerarVenta();
                                  }} // Función para eliminar venta
                                  type="button"
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                                >
                                  Generar venta manera rapida
                                </button>
                              </li>
                              <li>
                                <Link
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                                  to={`/venta/${v._id}`}
                                >
                                  Ver venta/facturar
                                </Link>
                              </li>
                              <li>
                                <button
                                  onClick={() => deleteVenta(v._id)} // Función para eliminar venta
                                  type="button"
                                  className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
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

      <ModalEstado
        closeModal={closeModal}
        isOpen={isModalOpen}
        idObtenida={idObtenida}
      />

      <ModalConvertirVenta
        closeModal={closeModalGenerarVenta}
        isOpen={isOpenGenerarVenta}
        idObtenida={idObtenida}
      />
    </div>
  );
};
