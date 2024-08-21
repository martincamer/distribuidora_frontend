import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { useProductos } from "../../context/ProductosContext";
import { generateRandomNumericId } from "../../helpers/generateId";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export default function ModalProductos({ isOpen, closeModal, addToProducto }) {
  const { productos, getProductos } = useProductos();
  const [productoData, setProductoData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [productosPerPage] = useState(10); // Número de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda

  // Índices para la paginación
  const indexOfLastVenta = currentPage * productosPerPage;
  const indexOfFirstVenta = indexOfLastVenta - productosPerPage;
  const currentProductos = productos.slice(indexOfFirstVenta, indexOfLastVenta); // Elementos a mostrar

  // Cambiar la página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Manejar búsqueda
  const handleSearch = (event) => {
    setCurrentPage(1); // Restablecer la página al buscar
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  // Filtrar ventas por el término de búsqueda
  const filteredVentas = productos.filter(
    (venta) =>
      venta?.codigo?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      venta?.detalle?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const totalPages = Math.ceil(productos.length / productosPerPage); // Calcular el total de páginas

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

  useEffect(() => {
    getProductos();
  }, []);

  dayjs.extend(utc);
  const fechaActual = dayjs().utc().format();

  const handleInputChange = (index, field, value) => {
    setProductoData((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleAddProducto = (index, producto) => {
    const data = productoData[index] || {};

    addToProducto(
      producto._id,
      generateRandomNumericId(),
      producto.codigo,
      producto.detalle,
      producto.imagen,
      producto.color,
      producto.categoria,
      productoData[index]?.kilogramos,
      parseFloat(
        data.kilogramos || productoData[index]?.kilogramos * data.cantidad
      ) || 0,
      parseFloat(data.precio) || 0,
      Number(
        (parseFloat(data.kilogramos || productoData[index]?.kilogramos) || 0) *
          (parseFloat(data.cantidad) || 0)
      ) * (parseFloat(data.precio) || 0),
      parseFloat(data.cantidad) || 0,
      fechaActual
    );

    setProductoData({});
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[103]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform h-full overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end py-2">
                  <IoMdClose
                    onClick={closeModal}
                    className="hover:text-sky-700 rounded-full transition-all cursor-pointer text-4xl py-1.5 text-slate-800 bg-gray-200"
                  />
                </div>

                <div className="flex flex-col gap-5 items-center">
                  <p className="font-semibold text-slate-700 text-lg">
                    Seleccionar productos 👋
                  </p>

                  <div className="w-full">
                    {" "}
                    <input
                      type="text"
                      placeholder="Buscar producto por el codigo o detalle..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="px-4 py-2.5 ml-3 rounded-full shadow-lg outline-none focus:ring-sky-500 focus:border-sky-500 font-bold text-sm w-[400px] border"
                    />
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="table table-auto w-full">
                      <thead>
                        <tr className="text-gray-800 text-sm font-bold">
                          <th>Código</th>
                          <th>Detalle</th>
                          <th>Categoria</th>
                          <th>Color</th>
                          <th>Stock/Fabrica</th>
                          {/* <th>Kilogramos/peso barra</th> */}
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-medium uppercase">
                        {filteredVentas.map((producto, index) => (
                          <tr key={index}>
                            <th className="">{producto.codigo}</th>
                            <td className="">{producto.detalle}</td>
                            <td className="">{producto.categoria}</td>
                            <td className="">{producto.color}</td>
                            <td className="">
                              <div className="flex">
                                <p
                                  className={`${
                                    producto.stock <= 0
                                      ? "bg-red-100/90 text-red-700"
                                      : "bg-green-100/90 text-green-700"
                                  } py-1.5 px-2 rounded-md font-bold`}
                                >
                                  {producto.stock}
                                </p>
                              </div>
                            </td>
                            {/* <th className="text-blue-500">
                              {producto.kg_barra_estimado} kgs
                            </th> */}

                            <td>
                              <button
                                className="bg-primary text-white py-1.5 px-4 rounded-md text-sm font-semibold"
                                // onClick={() =>
                                //   handleAddProducto(index, producto)
                                // }
                              >
                                Seleccionar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
