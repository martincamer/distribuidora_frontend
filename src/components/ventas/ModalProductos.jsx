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
      producto.kg_barra_estimado,
      parseFloat(
        data.kilogramos || producto.kg_barra_estimado * data.cantidad
      ) || 0,
      parseFloat(data.precio) || 0,
      (parseFloat(data.kilogramos || producto.kg_barra_estimado) || 0) *
        (parseFloat(data.precio) || 0) *
        (parseFloat(data.cantidad) || 1),
      parseFloat(data.cantidad) || 1,
      fechaActual
    );

    setProductoData({});
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end py-2">
                  <IoMdClose
                    onClick={closeModal}
                    className="hover:text-sky-700 transition-all cursor-pointer text-4xl text-slate-800 bg-gray-200"
                  />
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <p className="font-semibold text-slate-700 text-lg">
                    Seleccionar productos 👋
                  </p>

                  <div className="overflow-x-auto w-full capitalize">
                    <table className="table table-auto w-full">
                      <thead>
                        <tr>
                          <th className="font-bold text-sm">Código</th>
                          <th className="font-bold text-sm">Detalle</th>
                          <th className="font-bold text-sm">Color</th>
                          <th className="font-bold text-sm">
                            Kilogramos/peso barra
                          </th>
                          <th className="font-bold text-sm">Cantidad</th>
                          <th className="font-bold text-sm">Precio del kg</th>
                          <th className="font-bold text-sm">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((producto, index) => (
                          <tr key={index}>
                            <th className="text-sm">{producto.codigo}</th>
                            <th className="text-sm uppercase">
                              {producto.detalle}
                            </th>
                            <th className="text-sm">{producto.color}</th>
                            <th className="text-sm">
                              <input
                                type="text"
                                placeholder="PESO BARRA KG"
                                value={
                                  productoData[index]?.kilogramos ||
                                  producto.kg_barra_estimado
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "kilogramos",
                                    e.target.value
                                  )
                                }
                                className="bg-gray-200 rounded-xl py-2 px-3 placeholder:font-bold placeholder:text-slate-400 text-gray-700 outline-none focus:outline-sky-500"
                              />
                            </th>
                            <th>
                              <input
                                type="text"
                                placeholder="CANTIDAD BARRAS"
                                value={productoData[index]?.cantidad || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "cantidad",
                                    e.target.value
                                  )
                                }
                                className="bg-gray-200 rounded-xl py-2 px-3 placeholder:font-bold placeholder:text-slate-400 text-gray-700 outline-none focus:outline-sky-500"
                              />
                            </th>
                            <th>
                              <input
                                type="text"
                                placeholder="$ PRECIO EN MONEDA ARS"
                                value={productoData[index]?.precio || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "precio",
                                    e.target.value
                                  )
                                }
                                className="bg-gray-200 rounded-xl py-2 px-3 placeholder:font-bold placeholder:text-slate-400 text-gray-700 outline-none focus:outline-sky-500"
                              />
                            </th>
                            <td>
                              <button
                                className="bg-sky-700 text-white py-2 px-6 rounded-full font-semibold"
                                onClick={() =>
                                  handleAddProducto(index, producto)
                                }
                              >
                                Agregar
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
