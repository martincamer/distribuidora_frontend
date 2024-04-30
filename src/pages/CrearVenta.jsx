import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useVentas } from "../context/VentasContext"; // Cambia al contexto de ventas
import { useEffect, useState } from "react";
import { useModal } from "../helpers/modal";
import ModalClientes from "../components/ventas/ModalClientes";
import ModalProductos from "../components/ventas/ModalProductos.jsx";

export function CrearVenta() {
  const [clienteSeleccionado, setClienteSeleccionado] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isOpenProducto,
    openModal: openProducto,
    closeModal: closeProducto,
  } = useModal();

  const { createVenta, getVentas } = useVentas(); // Cambia al método para crear venta
  const navigate = useNavigate(); // Para redirigir después de crear

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Uso de React Hook Form para validación

  useEffect(() => {
    getVentas(); // Obtiene ventas si es necesario al montar el componente
  }, []);

  const onSubmit = async (formData) => {
    try {
      await createVenta(formData); // Crea la nueva venta con el formulario
      navigate("/ventas"); // Redirige a la lista de ventas después de la creación
    } catch (error) {
      console.error("Error creando venta:", error);
    }
  };

  const addToCliente = (
    id,
    nombre,
    apellido,
    email,
    dni,
    telefono,
    localidad,
    provincia
  ) => {
    const nuevoCliente = {
      id,
      nombre,
      apellido,
      email,
      dni,
      telefono,
      localidad,
      provincia,
    };

    setClienteSeleccionado(...clienteSeleccionado, nuevoCliente);
  };

  const handleResetCliente = () => {
    setClienteSeleccionado([]);
  };

  const addToProducto = (
    id,
    codigo,
    detalle,
    imagen,
    color,
    categoria,
    kg_barra_estimado,
    total_kilogramos,
    precio,
    total_dinero,
    cantidad,
    date
  ) => {
    const nuevoProducto = {
      id,
      codigo,
      detalle,
      imagen,
      color,
      categoria,
      kg_barra_estimado,
      total_kilogramos,
      precio,
      total_dinero,
      cantidad,
      date,
    };

    setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
  };

  const handleResetProducto = () => {
    setProductosSeleccionados([]);
  };

  console.log(productosSeleccionados);

  return (
    <section>
      {/* Navegación para volver a la página de ventas */}
      <div className="bg-white w-full flex justify-between items-center">
        <div className="flex">
          <Link
            to={"/ventas"}
            className="px-8 text-base py-4 text-gray-700 font-medium hover:text-sky-700 transition-all"
          >
            Ventas
          </Link>
          <Link
            to={"/crear-venta"}
            className="bg-sky-100 px-8 text-base py-4 text-sky-600 font-medium hover:bg-gray-100 transition-all"
          >
            Crear venta
          </Link>
        </div>
        <div className="flex mx-9">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl cursor-pointer font-bold"
                  to={"/home"}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  className="bg-sky-100 text-sky-700 py-2 px-4 rounded-xl cursor-pointer font-bold"
                  to={"/ventas"}
                >
                  Ventas
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulario para crear una nueva venta */}
      <div className="mx-10 flex justify-start items-start gap-16">
        <div className="w-1/2">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-slate-700 mt-10 text-xl">
              Crear nueva venta
            </p>
            <p className="text-slate-600 font-normal text-sm">
              En esta sección podrás crear nuevas ventas.
            </p>
          </div>

          <div className="bg-white my-5 rounded-xl shadow-lg flex flex-col gap-3">
            <div className="bg-gray-100 py-4 rounded-t-xl">
              <p className="text-sky-700 text-center text-base font-semibold">
                Formulario
              </p>
            </div>
            <div className="px-10 py-8 flex flex-col gap-5">
              <form
                onSubmit={handleSubmit(onSubmit)} // Maneja el envío del formulario
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 uppercase">
                    Tipo de venta
                  </label>
                  <select
                    {...register("tipo", { required: true })} // Registro del campo con validación
                    className="uppercase text-sm text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-700"
                  >
                    <option value="" disabled selected>
                      Seleccione tipo de venta
                    </option>
                    <option value="venta">Venta</option> // Opciones disponibles
                    <option value="presupuesto">Presupuesto</option>
                  </select>
                  {errors.tipo && (
                    <span className="text-red-500 text-sm uppercase">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="font-bold text-slate-700 uppercase text-sm">
                    Seleccionar el cliente de la venta
                  </p>
                  <button
                    onClick={() => openModal()}
                    className="bg-orange-500 text-white hover:bg-orange-500/90 rounded-full py-3 px-8 text-sm font-semibold"
                    type="button"
                  >
                    Seleccionar cliente
                  </button>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th className="text-slate-500 text-sm">Nombre</th>
                        <th className="text-slate-500 text-sm">Apellido</th>
                        <th className="text-slate-500 text-sm">
                          Localidad
                        </th>{" "}
                        <th className="text-slate-500 text-sm">Provincia</th>{" "}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="capitalize">
                          {clienteSeleccionado.nombre}
                        </th>
                        <th className="capitalize">
                          {clienteSeleccionado.apellido}
                        </th>
                        <th className="capitalize">
                          {clienteSeleccionado.localidad}
                        </th>
                        <th className="capitalize">
                          {clienteSeleccionado.provincia}
                        </th>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              handleResetCliente();
                            }}
                            className="bg-orange-600/90 py-2 px-6 rounded-full text-white font-semibold"
                          >
                            Resetear
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="font-bold text-slate-700 uppercase text-sm">
                    Seleccionar los productos de la venta
                  </p>
                  <button
                    onClick={() => openProducto()}
                    className="bg-sky-700 text-white hover:bg-sky-700/90 rounded-full py-3 px-8 text-sm font-semibold"
                    type="button"
                  >
                    Seleccionar los productos
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-green-500 py-2 px-4 text-sm rounded-xl font-bold text-white mt-3 hover:bg-green-600/90 cursor-pointer uppercase"
                >
                  Guardar venta
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ModalClientes
        addToCliente={addToCliente}
        isOpen={isOpen}
        closeModal={closeModal}
      />
      <ModalProductos
        addToProducto={addToProducto}
        isOpen={isOpenProducto}
        closeModal={closeProducto}
      />
    </section>
  );
}
