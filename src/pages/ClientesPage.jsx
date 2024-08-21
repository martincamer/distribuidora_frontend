import { useEffect, useState } from "react";
import { useClientes } from "../context/ClientesContext"; // Cambia el contexto a Clientes
import { ImFileEmpty } from "react-icons/im";
import { BsFolderPlus } from "react-icons/bs";
import { TableClients } from "../components/clients/TableClients.jsx"; // Cambia la tabla de productos por la de clientes
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import instance from "../api/axios";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MdOutlineMenuOpen } from "react-icons/md";
import { formatearDinero } from "../helpers/FormatearDinero.js";
import { useObtenerId } from "../helpers/obtenerId.js";

export function ClientesPage() {
  const { clientes, getClientes } = useClientes(); // Cambia a clientes y función para obtener clientes

  const { idObtenida, handleObtenerId } = useObtenerId();

  const [comprobante, setComprobante] = useState([]);

  useEffect(() => {
    getClientes(); // Obtiene los clientes cuando el componente se monta
  }, []); // Recuerda agregar cualquier dependencia necesaria para evitar advertencias

  const totalDeuda = clientes.reduce((total, c) => {
    return Number(total) + Number(c.total);
  }, 0);

  const getComprobantesDelMesRequest = async () => {
    try {
      const response = await instance.get(`/clientes/comprobantes-mensuales`);

      // Llama a la función para actualizar el cliente en el backend

      return setComprobante(response.data); // Devuelve los comprobantes del mes actual
    } catch (error) {
      console.error("Error al obtener comprobantes del mes:", error);
      throw error; // Re-lanza el error para manejo posterior
    }
  };

  useEffect(() => {
    getComprobantesDelMesRequest();
  }, []);

  const totalGanancias = comprobante.reduce((total, c) => {
    return Number(total) + Number(c.total);
  }, 0);

  return (
    <div>
      <div className="bg-gray-100 py-14 px-14 flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-900 text-xl">
            Cargar nuevos clientes.
          </p>
        </div>
        <div>
          <button
            onClick={() =>
              document.getElementById("my_modal_cargar_cliente").showModal()
            }
            className="bg-primary text-white font-bold text-sm py-1.5 px-4 rounded-md hover:bg-gray-800 transition-all"
          >
            Cargar nuevo cliente para facturar
          </button>
        </div>
      </div>

      {clientes.length === 0 && (
        <div className="flex flex-col gap-6 justify-center items-center p-12 bg-white w-1/3 mx-auto my-10 rounded-xl border border-gray-300">
          <div>
            <ImFileEmpty className="text-6xl text-primary m-auto my-2" />
            <h1 className="font-medium text-base text-gray-800">
              No hay ningun cliente cargado ahún, carga uno ahora
            </h1>
          </div>
          <div>
            <button
              onClick={() =>
                document.getElementById("my_modal_cargar_cliente").showModal()
              }
              type="button"
              className="bg-blue-500 text-white py-2 px-6 rounded-md text-sm font-semibold hover:shadow-md transition-all ease-linear flex gap-2 items-center"
            >
              Crear nuevo cliente en el sistema
              <BsFolderPlus className="text-2xl" />
            </button>
          </div>
        </div>
      )}

      {clientes.length && (
        <>
          <div className="px-10">
            <table className="table">
              <thead className="text-gray-800 text-sm">
                <tr>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Telefono</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((p) => (
                  <tr key={p._id} className="text-xs font-medium uppercase">
                    {/* <th>{p._id}</th> */}
                    <td>
                      {p.nombre} {p.apellido}
                    </td>
                    <td>{p.email}</td>
                    <td>+ {p.telefono}</td>
                    <td>
                      <div className="flex">
                        <p
                          className={`py-1 px-2 rounded-md font-bold ${
                            p.total >= 0
                              ? "bg-green-100/90 text-green-700"
                              : "bg-red-100/90 text-red-700 "
                          }`}
                        >
                          {formatearDinero(p.total)}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex">
                        <p
                          className={`py-1 px-2 rounded-md font-bold ${
                            p.total >= 0
                              ? "bg-green-100/90 text-green-700"
                              : "bg-red-100/90 text-red-700 "
                          }`}
                        >
                          {p.total
                            ? "Tiene deuda el cliente"
                            : "Sin deudas el cliente"}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="text-2xl hover:bg-gray-800 py-2 px-2 hover:text-white rounded-full transition-all"
                        >
                          <MdOutlineMenuOpen />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu w-52 rounded-md p-1 z-[100] border bg-white border-gray-300"
                        >
                          <li>
                            <Link
                              className="font-semibold text-xs hover:bg-gray-800 hover:text-white rounded-md capitalize"
                              to={`/cliente/${p._id}`}
                            >
                              Cargar pagos
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                {
                                  handleObtenerId(p._id),
                                    document
                                      .getElementById(
                                        "my_modal_actualizar_cliente"
                                      )
                                      .showModal();
                                }
                              }}
                              type="button"
                              className="font-semibold text-xs hover:bg-gray-800 hover:text-white rounded-md"
                            >
                              Actualizar cliente
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
        </>
      )}

      <ModalCargarCliente />
      <ModalActualizarCliente idObtenida={idObtenida} />
    </div>
  );
}

const ModalCargarCliente = () => {
  dayjs.extend(utc);

  const { createCliente, getClientes } = useClientes(); // Cambia al método para crear cliente

  const { register, handleSubmit, reset } = useForm(); // Uso de React Hook Form para validación

  useEffect(() => {
    getClientes(); // Si es necesario, obtiene clientes cuando se monta el componente
  }, []);

  const onSubmit = async (formData) => {
    try {
      await createCliente(formData); // Crea un nuevo cliente con el objeto de datos

      document.getElementById("my_modal_cargar_cliente").close();

      reset();
    } catch (error) {
      console.error("Error creating client:", error);
    }
  };

  return (
    <dialog id="my_modal_cargar_cliente" className="modal">
      <div className="modal-box rounded-md max-w-4xl scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Cargar nuevo cliente al sistema.</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta sesión podemos cargar un nuevo cliente.
        </p>

        <div className="flex flex-col gap-5 items-start">
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* {error.length > 0 ? <Message message={error} /> : ""} */}

              <article className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Nombre
                  </label>
                  <input
                    {...register("nombre", { required: true })}
                    type="text"
                    placeholder="Ej: Martin.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Apellido
                  </label>
                  <input
                    {...register("apellido", { required: true })}
                    type="text"
                    placeholder="Ej: Juarez.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Localidad
                  </label>
                  <input
                    {...register("localidad", { required: true })}
                    type="text"
                    placeholder="Ej: Elortondo.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Provincia
                  </label>
                  <input
                    {...register("provincia", { required: true })}
                    type="text"
                    placeholder="Ej: Santa Fe.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Dni
                  </label>
                  <input
                    {...register("dni")}
                    type="text"
                    placeholder="Ej: 44555111.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Telefono
                  </label>
                  <input
                    {...register("telefono")}
                    type="text"
                    placeholder="Ej: 3466 5551122.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="text"
                    placeholder="Ej: martina@gmail.com..."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
              </article>

              <div>
                <button
                  type="submit"
                  className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
                >
                  Cargar el cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

const ModalActualizarCliente = ({ idObtenida }) => {
  dayjs.extend(utc);
  const [cliente, setCliente] = useState({}); // Estado para almacenar datos del cliente

  const {
    updateCliente, // Método para actualizar clientes
    getCliente, // Método para obtener un cliente por su ID
  } = useClientes(); // Usar el contexto de clientes

  const {
    register, // Para registrar campos en el formulario
    handleSubmit, // Para manejar el envío del formulario
    setValue, // Para establecer valores en el formulario
  } = useForm(); // Uso de React Hook Form para el formulario

  // Efecto para cargar datos del cliente cuando el componente se monta
  useEffect(() => {
    const loadData = async () => {
      const res = await getCliente(idObtenida); // Obtiene el cliente por ID
      setValue("nombre", res.nombre);
      setValue("apellido", res.apellido);
      setValue("localidad", res.localidad);
      setValue("provincia", res.provincia);
      setValue("dni", res.dni);
      setValue("telefono", res.telefono);
      setValue("email", res.email);

      setCliente(res); // Establece el estado del cliente
    };
    loadData(); // Carga los datos del cliente al montar el componente
  }, [idObtenida]); // Asegúrate de incluir todas las dependencias necesarias

  const onSubmit = async (formData) => {
    try {
      // Crea el objeto del cliente con los datos del formulario
      const clientData = {
        ...formData,
      };

      await updateCliente(idObtenida, clientData); // Actualiza el cliente
      document.getElementById("my_modal_actualizar_cliente").close();
    } catch (error) {
      console.error("Error actualizando cliente:", error); // Manejo de errores
    }
  };

  return (
    <dialog id="my_modal_actualizar_cliente" className="modal">
      <div className="modal-box rounded-md max-w-4xl scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="flex flex-col gap-5 items-start">
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* {error.length > 0 ? <Message message={error} /> : ""} */}

              <article className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Nombre
                  </label>
                  <input
                    {...register("nombre", { required: true })}
                    type="text"
                    placeholder="Ej: Martin.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Apellido
                  </label>
                  <input
                    {...register("apellido", { required: true })}
                    type="text"
                    placeholder="Ej: Juarez.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Localidad
                  </label>
                  <input
                    {...register("localidad", { required: true })}
                    type="text"
                    placeholder="Ej: Elortondo.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Provincia
                  </label>
                  <input
                    {...register("provincia", { required: true })}
                    type="text"
                    placeholder="Ej: Santa Fe.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Dni
                  </label>
                  <input
                    {...register("dni")}
                    type="text"
                    placeholder="Ej: 44555111.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Telefono
                  </label>
                  <input
                    {...register("telefono")}
                    type="text"
                    placeholder="Ej: 3466 5551122.."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="text"
                    placeholder="Ej: martina@gmail.com..."
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
              </article>

              <div>
                <button
                  type="submit"
                  className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
                >
                  Actualizar el cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};
