import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useVentas } from "../context/VentasContext"; // Cambia al contexto de ventas
import { useEffect, useState } from "react";
import { useModal } from "../helpers/modal";
import { toast } from "react-toastify";
import { formatearDinero } from "../helpers/FormatearDinero.js";
import { useProductos } from "../context/ProductosContext.jsx";
import { generateRandomNumericId } from "../helpers/generateId.js";
import { FaCheck, FaEdit, FaSave, FaSearch } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useObtenerId } from "../helpers/obtenerId.js";
import { useClientes } from "../context/ClientesContext.jsx";
import instance from "../api/axios.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export function CrearVenta() {
  const [clienteSeleccionado, setClienteSeleccionado] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const { createVenta, getVentas } = useVentas(); // Cambia al método para crear venta
  const navigate = useNavigate(); // Para redirigir después de crear

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm(); // Uso de React Hook Form para validación

  useEffect(() => {
    getVentas(); // Obtiene ventas si es necesario al montar el componente
  }, []);

  const tipo = watch("tipo");

  const onSubmit = async (formData) => {
    try {
      const ventaData = {
        ...formData,
        cliente: clienteSeleccionado,
        productos: productosSeleccionados,
        date: dayjs.utc(formData.date).format(),
      };

      const res = await createVenta(ventaData); // Crea la nueva venta con el formulario

      toast.success("Creado correctamente", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "10px",
          borderRadius: "15px",
        },
        // transition: "Bounce",
      });

      console.log("res", res);
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
    ObjectId,
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
      ObjectId,
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

  // Estado para controlar qué fila está en modo de edición
  const [editIndex, setEditIndex] = useState(null);

  const handleEditToggle = (index) => {
    if (editIndex === index) {
      // Si ya estamos en modo de edición para esta fila, cancelar la edición
      setEditIndex(null);
    } else {
      // De lo contrario, establecer el modo de edición para esta fila
      setEditIndex(index);
    }
  };

  const handleInputChange = (index, field, value) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][field] = value;
    setProductosSeleccionados(nuevosProductos);
  };

  // Objeto para agrupar por categoria y color
  const groupedByCategoryAndColor = {};

  // Agrupar productos por categoria y color
  productosSeleccionados.forEach((producto) => {
    const key = `${producto.categoria}-${producto.color}`; // Clave para agrupar

    if (!groupedByCategoryAndColor[key]) {
      // Si la clave no existe, crear una nueva entrada
      groupedByCategoryAndColor[key] = {
        categoria: producto.categoria,
        color: producto.color,
        total_dinero: 0,
        total_kilogramos: 0,
      };
    }

    // Sumar los valores al grupo existente
    groupedByCategoryAndColor[key].total_dinero +=
      Number(producto.kg_barra_estimado * producto.cantidad) * producto.precio;
    groupedByCategoryAndColor[key].total_kilogramos +=
      producto.kg_barra_estimado * producto.cantidad;
  });

  // Convertir el objeto a un arreglo
  const groupedProducts = Object.values(groupedByCategoryAndColor);

  useEffect(() => {
    if (tipo === "presupuesto") {
      toast(
        "Acuerdate que el presupuesto no descuenta el stock, ni se suma dinero a los clientes",
        {
          position: "bottom-center",
          autoClose: 8000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            padding: "10px",
            fontWeight: "bold",
            borderRadius: "15px",
            border: "1px solid rgb(229 231 235)",
          },
          // transition: "Bounce",
        }
      );
    } else if (tipo === "venta") {
      toast(
        "Es una venta descontara el stock y sumara el total al cliente seleccionado al generar la venta.",
        {
          position: "bottom-center",
          autoClose: 8000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            padding: "10px",
            fontWeight: "bold",
            borderRadius: "15px",
            border: "1px solid rgb(229 231 235)",
          },
          // transition: "Bounce",
        }
      );
    }
  }, [tipo]);

  const calculateFinalValue = (productos) => {
    return productos.reduce((total, producto) => {
      return total + parseFloat(producto.total_dinero);
    }, 0);
  };

  const calculateFinalValueKgs = (productos) => {
    return productos.reduce((total, producto) => {
      return total + parseFloat(producto.total_kilogramos);
    }, 0);
  };

  const finalValue = calculateFinalValue(productosSeleccionados);
  const finalValueKgs = calculateFinalValueKgs(productosSeleccionados);

  return (
    <section>
      {/* Formulario para crear una nueva venta */}
      <div className="mx-10 flex justify-start items-start gap-8">
        <div className="w-3/4 mx-auto">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-slate-700 mt-10 text-xl">
              Crear nueva/o {tipo?.length === 0 ? "venta o presupuesto" : tipo}
            </p>
            <p className="text-slate-600 font-medium text-sm">
              En esta sección podrás crear nuevas ventas.
            </p>
          </div>

          <div className="bg-white my-5 border rounded-md flex flex-col gap-3">
            <div className="bg-gray-800 py-4 rounded-t-md">
              <p className="text-white text-center text-base font-bold">
                Formulario para crear una perfil.
              </p>
            </div>

            <div className="px-10 py-8 flex flex-col gap-5">
              <form
                onSubmit={handleSubmit(onSubmit)} // Maneja el envío del formulario
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2 w-1/5 cursor-pointer">
                  <label className="text-sm font-bold text-slate-700">
                    Selecciona el tipo
                  </label>
                  <select
                    {...register("tipo", { required: true })} // Registro del campo con validación
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  >
                    <option className="font-bold" value="" disabled selected>
                      Seleccione tipo
                    </option>
                    <option className="font-semibold" value="venta">
                      Venta
                    </option>{" "}
                    // Opciones disponibles
                    <option className="font-semibold" value="presupuesto">
                      Presupuesto
                    </option>
                  </select>
                  {errors.tipo && (
                    <span className="text-red-500 text-sm uppercase">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="text-sm font-bold text-slate-700">
                    Seleccionar el cliente de la{" "}
                    {tipo?.length === 0 ? "venta o presupuesto" : tipo}.
                  </p>
                  <button
                    onClick={() =>
                      document
                        .getElementById("my_modal_cargar_cliente")
                        .showModal()
                    }
                    className="py-2 px-4 rounded-md text-white font-semibold bg-primary text-sm hover:shadow-md transition-all ease-linear"
                    type="button"
                  >
                    Seleccionar cliente
                  </button>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr className="font-bold text-gray-800 text-sm">
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Localidad</th> <th>Provincia</th>{" "}
                      </tr>
                    </thead>
                    <tbody className="capitalize text-xs">
                      <tr>
                        <th>{clienteSeleccionado.nombre}</th>
                        <th>{clienteSeleccionado.apellido}</th>
                        <th>{clienteSeleccionado.localidad}</th>
                        <th>{clienteSeleccionado.provincia}</th>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              handleResetCliente();
                            }}
                            className="bg-red-600 py-1.5 px-4 rounded-md text-white font-semibold"
                          >
                            Resetear
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-start gap-2">
                  <p className="text-sm font-bold text-slate-700">
                    {tipo?.length === 0
                      ? "  Seleccionar los productos de la venta o presupuesto"
                      : `Seleccionar los productos de la/o ${tipo}`}
                    .
                  </p>
                  <button
                    onClick={() =>
                      document
                        .getElementById("my_modal_seleccionar_productos")
                        .showModal()
                    }
                    className="py-2 px-4 rounded-md text-white font-semibold bg-primary text-sm hover:shadow-md transition-all ease-linear"
                    type="button"
                  >
                    Seleccionar los productos
                  </button>
                </div>
                <div className="w-full scroll-bar overflow-x-scroll">
                  <table className="table">
                    {/* head */}
                    <thead className="font-bold text-gray-800 text-sm">
                      <tr>
                        <th>Código</th>
                        <th>Detalle</th>
                        <th>Color</th>
                        <th>Categoría</th>
                        <th>Peso barra (kg)</th>
                        <th>Precio kg (ARS)</th>
                        <th>Total kg</th>
                        <th>Cantidad</th>
                        <th>Total final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosSeleccionados.map((producto, index) => (
                        <tr
                          className="uppercase text-xs font-medium"
                          key={index}
                        >
                          <td>{producto.codigo}</td>
                          <td>{producto.detalle}</td>
                          <td>{producto.color}</td>
                          <td>{producto.categoria}</td>
                          <td>
                            {editIndex === index ? (
                              <input
                                type="text"
                                className="p-2 rounded w-full bg-gray-200/80 text-gray-700 border-none outline-none"
                                value={producto.kg_barra_estimado}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "kg_barra_estimado",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            ) : (
                              `${Number(producto.kg_barra_estimado).toFixed(
                                2
                              )} kg`
                            )}
                          </td>
                          <td className="font-semibold">
                            {editIndex === index ? (
                              <input
                                type="number"
                                className="p-2 rounded w-full bg-gray-200/80 text-gray-700 border-none outline-none"
                                value={producto.precio}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "precio",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            ) : (
                              Number(producto.precio).toLocaleString("es-AR", {
                                style: "currency",
                                currency: "ARS",
                              })
                            )}
                          </td>
                          <td className="font-semibold">
                            {Number(
                              Number(
                                producto.kg_barra_estimado * producto.cantidad
                              ).toFixed(2)
                            )}{" "}
                          </td>
                          <td className="font-semibold">
                            {editIndex === index ? (
                              <input
                                type="number"
                                className="p-2 rounded w-full bg-gray-200/80 text-gray-700 border-none outline-none"
                                value={producto.cantidad}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    "cantidad",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            ) : (
                              producto.cantidad
                            )}
                          </td>
                          <td className="font-bold text-green-600">
                            {Number(
                              Number(
                                producto.kg_barra_estimado * producto.cantidad
                              ) * producto.precio
                            ).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setProductosSeleccionados((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                <FaDeleteLeft className="text-red-500 text-xl" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-800 py-5 px-4 rounded-md my-5 flex gap-5">
                  <div>
                    <p className="text-white font-bold text-xl">Subtotal</p>
                    <p className="text-white font-bold text-xl">
                      {formatearDinero(finalValue)}
                    </p>
                  </div>

                  <div>
                    <p className="text-white font-bold text-xl">
                      Total de klgs.
                    </p>
                    <p className="text-primary font-bold text-xl">
                      {finalValueKgs.toFixed(2)} kgs
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-green-500 py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-green-600/90 cursor-pointer"
                  >
                    {tipo?.length === 0
                      ? "Generar venta/presupuesto"
                      : `Generar ${tipo}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {productosSeleccionados?.length === 0 ? (
            ""
          ) : (
            <div className="my-10 ">
              <div className="mb-3">
                <p className="text-gray-700 font-semibold text-lg">
                  Productos seleccionados 🖐️
                </p>
                <p className="font-normal text-sm">
                  Mira por los productos creados, compara precios,etc.
                </p>
              </div>
              <div className="bg-white py-5 px-5 rounded-md grid grid-cols-4 justify-center items-center gap-2">
                {productosSeleccionados.map((p) => (
                  <div className="border py-4 px-2 rounded-xl flex flex-col gap-2 justify-center items-center h-full">
                    <img
                      className="w-[120px] object-cover"
                      src={p.imagen}
                      alt="imagen"
                    />
                    <div className="h-[8vh] overflow-y-scroll scroll-bar w-full">
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Codigo:{" "}
                          <span className="font-bold text-blue-500">
                            {p.codigo}
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Detalle:{" "}
                          <span className="font-bold text-blue-500">
                            {p.detalle}
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Color:{" "}
                          <span className="font-bold text-blue-500">
                            {p.color}
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Categoria:{" "}
                          <span className="font-bold text-blue-500">
                            {p.categoria}
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Kg de la barra:{" "}
                          <span className="font-bold text-blue-500">
                            {Number(p?.kg_barra_estimado)?.toFixed(2)} kgs
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Total de kgs:{" "}
                          <span className="font-bold text-blue-500">
                            {Number(
                              p?.kg_barra_estimado * p?.cantidad
                            )?.toFixed(2)}{" "}
                            kgs
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Precio kg:{" "}
                          <span className="font-bold text-blue-500">
                            {Number(p.precio).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Precio total:{" "}
                          <span className="font-bold text-blue-500">
                            {Number(
                              Number(p.kg_barra_estimado * p.cantidad) *
                                p.precio
                            ).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            })}
                          </span>
                        </p>
                      </div>
                      <div className="w-full px-2">
                        <p className="text-sm font-bold text-gray-700 uppercase">
                          {" "}
                          Cantidad:{" "}
                          <span className="font-bold text-blue-500">
                            {p.cantidad}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {productosSeleccionados?.length === 0 ? (
          ""
        ) : (
          <div className="my-28  py-4 px-4 rounded-md flex flex-col gap-2 bg-gray-800">
            <div className="mb-2">
              <p className="text-white font-semibold text-lg">
                Productos seleccionados 🖐️
              </p>
              <p className="font-normal text-sm text-white">
                Mira por los productos creados, compara precios,etc.
              </p>
            </div>
            {groupedProducts.map((p) => (
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm uppercase  text-white">
                  Linea <span className="text-primary">{p.categoria}</span>
                </p>
                <p className="font-semibold text-sm uppercase  text-white">
                  Color <span className="text-primary">{p.color}</span>
                </p>
                <p className="font-semibold text-sm uppercase  text-white">
                  Total de kgs{" "}
                  <span className="text-primary">
                    {Number(p.total_kilogramos).toFixed(2)}
                  </span>
                </p>
                <p className="font-semibold text-sm uppercase  text-white">
                  Precio total{" "}
                  <span className="text-primary">
                    {formatearDinero(p.total_dinero)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SeleccionarProductos addToProducto={addToProducto} />
      <CargarCliente addToCliente={addToCliente} />
    </section>
  );
}

const SeleccionarProductos = ({ addToProducto }) => {
  const {
    productos,
    getProductos,
    categorias,
    getCategorias,
    colores,
    getColores,
  } = useProductos();
  const [productoData, setProductoData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");

  // Filtrar productos antes de la paginación
  const filteredVentas = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    const colorMatches =
      selectedColor === "all" || product.color === selectedColor;

    return searchTermMatches && categoryMatches && colorMatches;
  });

  const sortedProducts = filteredVentas.sort((a, b) => b.stock - a.stock);

  useEffect(() => {
    getProductos();
    getCategorias();
    getColores();
  }, []);

  dayjs.extend(utc);

  const fechaActual = dayjs().utc().format();

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <dialog id="my_modal_seleccionar_productos" className="modal">
      <div className="modal-box h-full max-w-full rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg pb-4">
          Seleccionar los productos de la venta o presupuesto.
        </h3>

        <div className="py-2 flex gap-2">
          <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="outline-none font-medium w-full"
              placeholder="Buscar por el codigo o detalle.."
            />
            <FaSearch className="text-gray-700" />
          </div>
          <div>
            <select
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option className="font-bold text-blue-500" value="all">
                Todas las lineas
              </option>
              {categorias.map((c) => (
                <option className="font-semibold uppercase text-xs" key={c.id}>
                  {c?.detalle}
                </option>
              ))}
            </select>
          </div>{" "}
          <div>
            <select
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option className="font-bold text-blue-500" value="all">
                Todos los colores
              </option>
              {colores.map((c) => (
                <option className="font-semibold uppercase text-xs" key={c.id}>
                  {c?.name}
                </option>
              ))}
            </select>
          </div>
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
              {sortedProducts.map((producto, index) => (
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

                  <td>
                    <button
                      onClick={() => {
                        handleObtenerId(producto._id),
                          document
                            .getElementById("my_modal_seleccionar_cantidad")
                            .showModal();
                      }}
                      className="bg-primary text-white py-1.5 px-4 rounded-md text-sm font-semibold"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SeleccionarCantidadProducto
          fechaActual={fechaActual}
          addToProducto={addToProducto}
          idObtenida={idObtenida}
        />
      </div>
    </dialog>
  );
};

const SeleccionarCantidadProducto = ({
  idObtenida,
  addToProducto,
  fechaActual,
}) => {
  const [producto, setProducto] = useState([]);
  const [kg_estimado, setKgEstimado] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await instance.get(`/productos/${idObtenida}`);
      setProducto(res.data);
      setKgEstimado(res.data.kg_barra_estimado);
      console.log("asdsaddasdasddasdasdasd", res.data);
    };

    obtenerDatos();
  }, [idObtenida]);

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  const handleAddProducto = (producto) => {
    addToProducto(
      producto._id,
      generateRandomNumericId(),
      producto.codigo,
      producto.detalle,
      producto.imagen,
      producto.color,
      producto.categoria,
      kg_estimado,
      kg_estimado * cantidad,
      precio,
      Number(kg_estimado * cantidad) * Number(precio),
      cantidad,
      fechaActual
    );

    setKgEstimado(0);
    // setPrecio(0);
    setCantidad(0);

    document.getElementById("my_modal_seleccionar_cantidad").close();
    document.getElementById("my_modal_seleccionar_productos").close();

    toast.success("Perfil cargado correctamente", {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        padding: "10px",
        borderRadius: "15px",
      },
    });
  };

  return (
    <dialog id="my_modal_seleccionar_cantidad" className="modal">
      <div className="modal-box rounded-md max-w-6xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Perfil seleccionado.</h3>
        <div>
          <p className="font-bold text-base pt-2 underline">
            Datos del perfil seleccionado a cargar.
          </p>
          <div className="text-sm flex gap-2 mt-1">
            <p className="border border-gray-300 py-1 px-2 rounded-md shadow">
              Codigo <span className="font-bold">{producto.codigo}</span>
            </p>
            <p className="border border-gray-300 py-1 px-2 rounded-md shadow">
              Detalle <span className="font-bold">{producto.detalle}</span>
            </p>
            <p className="border border-gray-300 py-1 px-2 rounded-md shadow">
              Color <span className="font-bold">{producto.color}</span>
            </p>
            <p className="border border-gray-300 py-1 px-2 rounded-md shadow">
              Linea <span className="font-bold">{producto.categoria}</span>
            </p>
            <p className="border border-gray-300 py-1 px-2 rounded-md shadow">
              Stock{" "}
              <span
                className={`font-bold ${
                  producto.stock <= 0 ? "text-red-700" : "text-green-600"
                }`}
              >
                {producto.stock}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-2">
          <p className="font-bold text-base pt-2 underline">
            Seleccionar cantidad y kgs.
          </p>

          <div className="grid grid-cols-4 gap-4">
            <div onClick={handleInputClick} className="cursor-pointer">
              {isEditable ? (
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-bold text-slate-700">
                    Kg aproximado de la barra del perfil.
                  </label>
                  <input
                    value={kg_estimado}
                    onChange={(e) => setKgEstimado(e.target.value)}
                    onBlur={() => {
                      setIsEditable(false);
                    }}
                    type="text"
                    className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-bold text-slate-700">
                    Kg aproximado de la barra del perfil.
                  </label>

                  <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                    {Number(kg_estimado).toFixed(2) || 0} kg
                  </p>
                </div>
              )}
            </div>
            <div onClick={handleInputClick} className="cursor-pointer">
              {isEditable ? (
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-bold text-slate-700">
                    Precio del aluminio actual.
                  </label>
                  <input
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    onBlur={() => {
                      setIsEditable(false);
                    }}
                    type="text"
                    className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-bold text-slate-700">
                    Precio del aluminio actual.
                  </label>

                  <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                    {formatearDinero(Number(precio)) || 0}
                  </p>
                </div>
              )}
            </div>
            <div onClick={handleInputClick} className="cursor-pointer">
              {isEditable ? (
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-bold text-slate-700">
                    Cantidad de perfiles/barras
                  </label>
                  <input
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    onBlur={() => {
                      setIsEditable(false);
                    }}
                    type="text"
                    className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-sm font-bold text-slate-700">
                    Cantidad de perfiles/barras
                  </label>

                  <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                    {Number(cantidad) || 0} barras.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <p className="font-bold text-base pt-2 underline">
              Final kgs, monto.
            </p>
            <div className=" flex items-center gap-4">
              <p className="text-sm font-medium">
                Kgs:{" "}
                <span className="font-bold">
                  {parseFloat(Number(cantidad) * Number(kg_estimado)).toFixed(
                    2
                  )}{" "}
                  kgs
                </span>
              </p>
              <p className="text-sm font-medium">
                Precio Final:{" "}
                <span className="font-bold text-blue-600 bg-blue-100/90 py-1 px-2 rounded-md">
                  {formatearDinero(
                    Number(
                      Number(cantidad) * Number(kg_estimado) * Number(precio)
                    )
                  )}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => handleAddProducto(producto)}
              className="bg-primary py-1.5 px-4 rounded-md text-sm font-semibold text-white group flex gap-3 items-center relative transition-all"
              type="button"
            >
              Cargar perfil <FaCheck />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

const CargarCliente = ({ addToCliente }) => {
  const { clientes, getClientes } = useClientes();

  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda

  // Manejar búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  // Filtrar ventas por el término de búsqueda
  const filteredClientes = clientes.filter(
    (venta) =>
      venta?.nombre?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      venta?.apellido?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  useEffect(() => {
    getClientes();
  }, []);

  return (
    <dialog id="my_modal_cargar_cliente" className="modal">
      <div className="modal-box rounded-md max-w-3xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-2">
          Cargar nuevo cliente al presupuesto/venta.
        </h3>

        <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-2/3 max-md:w-full">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="outline-none font-medium w-full"
            placeholder="Buscar por el cliente, nombre, apellido, etc.."
          />
          <FaSearch className="text-gray-700" />
        </div>

        <div className="overflow-x-auto w-full capitalize">
          <table className="table">
            {/* head */}
            <thead className="font-bold text-sm text-gray-800">
              <tr>
                <th className="">Nombre</th>
                <th className="">Apellido</th>
              </tr>
            </thead>
            <tbody className="uppercase text-xs font-medium">
              {filteredClientes.map((c) => (
                <tr>
                  <td>{c.nombre}</td>
                  <td>{c.apellido}</td>
                  <td>
                    <button
                      onClick={() => {
                        {
                          document
                            .getElementById("my_modal_cargar_cliente")
                            .close(),
                            addToCliente(
                              c._id,
                              c.nombre,
                              c.apellido,
                              c.email,
                              c.dni,
                              c.telefono,
                              c.localidad,
                              c.provincia
                            );
                        }
                      }}
                      className="py-2 px-4 rounded-md bg-primary text-white font-bold"
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
    </dialog>
  );
};
