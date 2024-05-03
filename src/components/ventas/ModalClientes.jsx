import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io"; // Iconos de alerta y cerrar
import { useClientes } from "../../context/ClientesContext";

export default function ModalClientes({
  isOpen, // Estado para indicar si el modal está abierto
  closeModal, // Función para cerrar el modal
  addToCliente,
}) {
  const { clientes, getClientes } = useClientes();

  useEffect(() => {
    getClientes();
  }, []);

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end py-2">
                  <IoMdClose
                    onClick={closeModal} // Cierra el modal al hacer clic
                    className="hover:text-sky-700 hover:bg-gray-100 transition-all cursor-pointer text-4xl text-slate-800 bg-gray-200 py-2 px-2 rounded-full"
                  />
                </div>

                <div className="flex justify-center flex-col gap-2 items-center">
                  <div>
                    <p className="font-semibold text-slate-700">
                      Seleccionar el cliente de la venta
                    </p>
                  </div>

                  <div className="overflow-x-auto w-full capitalize">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th className="text-slate-500 text-sm">Nombre</th>
                          <th className="text-slate-500 text-sm">Apellido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.map((c) => (
                          <tr>
                            <th>{c.nombre}</th>
                            <th>{c.apellido}</th>
                            <td>
                              <button
                                onClick={() => {
                                  {
                                    addToCliente(
                                      c._id,
                                      c.nombre,
                                      c.apellido,
                                      c.email,
                                      c.dni,
                                      c.telefono,
                                      c.localidad,
                                      c.provincia
                                    ),
                                      closeModal();
                                  }
                                }}
                                className="bg-sky-700 py-2 px-6 rounded-full text-white font-semibold"
                              >
                                Seleccionar este cliente
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
