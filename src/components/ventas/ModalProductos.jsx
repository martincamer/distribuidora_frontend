import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io"; // Iconos de alerta y cerrar
import { useProductos } from "../../context/ProductosContext";
import { generateRandomNumericId } from "../../helpers/generateId";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export default function ModalProductos({
  isOpen, // Estado para indicar si el modal está abierto
  closeModal, // Función para cerrar el modal
  addToProducto,
}) {
  const { productos, getProductos } = useProductos();
  const [cantidad, setCantidad] = useState("");
  const [kilogramos, setKilogramos] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    getProductos();
  }, []);

  dayjs.extend(utc);

  const fechaActual = dayjs().utc().format();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as="div"
          enter="transition-opacity"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-black/10" /> {/* Fondo oscuro */}
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
                    onClick={closeModal} // Cierra el modal al hacer clic
                    className="hover:text-sky-700 hover:bg-gray-100 transition-all cursor-pointer text-4xl text-slate-800 bg-gray-200 py-2 px-2 rounded-full"
                  />
                </div>

                <div className="flex justify-center flex-col gap-2 items-center">
                  <div>
                    <p className="font-semibold text-slate-700">
                      Seleccionar el producto de la venta
                    </p>
                  </div>

                  <div className="overflow-x-auto w-full capitalize">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th className="text-slate-500 text-sm">Codigo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((c) => (
                          <tr>
                            <th>{c.codigo}</th>
                            <th>{c.detalle}</th>
                            <th>{c.color}</th>
                            <th>
                              <input
                                value={kilogramos}
                                onChange={(e) => setKilogramos(e.target.value)}
                                className="bg-gray-200/80 rounded-xl py-2 px-3 text-slate-600 outline-none"
                                type="text"
                                placeholder="PESO BARRA KG"
                              />
                            </th>
                            <th>
                              <input
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                className="bg-gray-200/80 rounded-xl py-2 px-3 text-slate-600 outline-none"
                                type="text"
                                placeholder="CANTIDAD BARRAS"
                              />
                            </th>
                            <th className="flex gap-2 items-center">
                              <input
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                className="bg-gray-200/80 rounded-xl py-2 px-3 text-slate-600 outline-none"
                                type="text"
                                placeholder="$ PRECIO EN MONEDA ARS"
                              />
                              <p className="text-slate-500">
                                {Number(precio).toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                })}
                              </p>
                            </th>
                            <td>
                              <button
                                onClick={() => {
                                  addToProducto(
                                    generateRandomNumericId(),
                                    c.codigo,
                                    c.detalle,
                                    c.imagen,
                                    c.color,
                                    c.categoria,
                                    c.kg_barra_estimado,
                                    kilogramos,
                                    precio,
                                    kilogramos * precio * cantidad,
                                    cantidad,
                                    fechaActual
                                  );
                                }}
                                className="bg-sky-700 py-2 px-6 rounded-full text-white font-semibold"
                              >
                                Agregar producto
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
