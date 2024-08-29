import { Link, useParams } from "react-router-dom";
import { useClientes } from "../context/ClientesContext"; // Contexto de clientes
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPencilAlt } from "react-icons/fa"; // Icono para editar
import { useModal } from "../helpers/modal"; // Para el uso de modales
import { useObtenerId } from "../helpers/obtenerId";
import { IoIosMore } from "react-icons/io";
import { v4 as uuidv4 } from "uuid"; // Para generar IDs únicos
import { BsCash } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { agregarComprobante } from "../../../frontend/src/api/clientes";
import ModalEliminarCliente from "../components/clients/ModalEliminarCliente"; // El modal para eliminar clientes
import ModalNuevoComprobante from "../components/clients/ModalNuevoComprobante";
import dayjs from "dayjs"; // Para formatear fechas
import instance from "../api/axios";
import utc from "dayjs/plugin/utc";
import FileDropZoneClientsPdfs from "../components/clients/FileDropZoneClientsPdfs";
import { formatearDinero } from "../helpers/FormatearDinero";
import { toast } from "react-toastify";
import axios from "axios";

export function Cliente() {
  const { getCliente } = useClientes(); // Función para obtener un cliente
  const [comprobante, setComprobante] = useState([]);
  const { openModal, closeModal, isOpen } = useModal(); // Para abrir y cerrar el modal

  const {
    openModal: openModalComprobante,
    closeModal: closeModalComprobante,
    isOpen: isOpenComprobante,
  } = useModal(); // Para abrir y cerrar el modal
  const { handleObtenerId, idObtenida } = useObtenerId();

  const [cliente, setCliente] = useState({}); // Estado para almacenar el cliente
  const params = useParams(); // Para obtener el ID del cliente desde la URL

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getCliente(params.id); // Obtiene el cliente por ID
        setCliente(res); // Establece el estado del cliente
      } catch (error) {
        console.error("Error al cargar el cliente:", error); // Manejo de errores
      }
    };

    loadData(); // Carga los datos del cliente cuando el componente se monta
  }, [params.id, getCliente]); // Asegúrate de incluir las dependencias necesarias

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY"); // Formato de fecha
  };

  const getComprobantesDelMesRequest = async () => {
    try {
      const response = await instance.get(
        `/clientes/${params.id}/comprobantes-mes`
      );

      // Llama a la función para actualizar el cliente en el backend

      return setComprobante(response.data); // Devuelve los comprobantes del mes actual
    } catch (error) {
      console.error("Error al obtener comprobantes del mes:", error);
      throw error; // Re-lanza el error para manejo posterior
    }
  };

  useEffect(() => {
    getComprobantesDelMesRequest();
  }, [params.id]);

  const [isModalVisible, setModalVisible] = useState(false); // Estado para la visibilidad del modal
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada

  // Abre el modal y establece la imagen seleccionada
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Los meses son 0-based, por eso sumamos 1

  // Inicializar el estado con el año y mes actuales
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filteredComprobantes = comprobante.filter((c) => {
    const date = new Date(c.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based

    return (
      (selectedYear ? year === parseInt(selectedYear, 10) : true) &&
      (selectedMonth ? month === parseInt(selectedMonth, 10) : true)
    );
  });

  const sortedComprobantes = filteredComprobantes.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const totalComprobantes = cliente?.comprobantes?.reduce(
    (acc, comprobante) => {
      return acc + Number(comprobante.total); // Suma el campo total
    },
    0
  ); // Valor inicial de acumulador es 0

  // Formatear el total como moneda argentina
  const totalFormateado = totalComprobantes?.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <div className="pb-12">
      <div className="mx-10 py-10 max-md:mx-5">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-700 text-xl">
            Datos del cliente{" "}
            <span className="text-primary capitalize">
              {cliente.nombre} {cliente.apellido}
            </span>
          </p>
          <p className="text-slate-600 font-medium text-sm">
            Aquí puedes ver información detallada del cliente.
          </p>
        </div>

        <div className="flex gap-10 mt-10 max-md:flex-col-reverse">
          <div className="bg-white rounded-xl w-4/5 max-md:w-full max-md:text-sm">
            <div className="py-10 px-10 bg-gray-800 text-gray-400 rounded-t-xl flex justify-between max-md:px-5 max-md:py-5">
              <div className="flex flex-col gap-5">
                <p>
                  Fecha de creación{" "}
                  <span className="text-white font-bold">
                    {formatDate(cliente.date)} {/* Fecha de creación */}
                  </span>
                </p>
                <p>
                  Nombre completo{" "}
                  <span className="text-white font-bold capitalize">
                    {cliente.nombre} {cliente.apellido}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p>
                  Localidad{" "}
                  <span className="text-white font-bold capitalize">
                    {cliente.localidad}
                  </span>
                </p>
                <p>
                  Provincia{" "}
                  <span className="text-white font-bold capitalize">
                    {cliente.provincia}
                  </span>
                </p>
              </div>
            </div>
            <div className="py-5 px-5 bg-primary text-white text-center  font-bold">
              Información del cliente
            </div>
            <div className="py-10 px-10 bg-gray-50 grid grid-cols-2 gap-6 max-md:px-5 max-md:py-5">
              <p className="font-bold flex flex-col">
                DNI{" "}
                <span className="text-gray-600 font-normal">{cliente.dni}</span>
              </p>
              <p className="font-bold flex flex-col">
                Teléfono{" "}
                <span className="text-gray-600 font-normal">
                  {cliente.telefono}
                </span>
              </p>
              <p className="font-bold flex flex-col">
                Email{" "}
                <span className="text-gray-600 font-normal">
                  {cliente.email}
                </span>
              </p>
            </div>

            <div className="py-10 px-10 bg-gray-50 rounded-b-xl max-md:px-2 max-md:py-2 max-md:text-xs">
              <div className="flex justify-end gap-6 my-4 max-md:justify-center">
                <button
                  onClick={() => {
                    handleObtenerId(cliente._id),
                      document
                        .getElementById("my_modal_actualizar_cliente")
                        .showModal();
                  }}
                  type="button"
                  className="bg-blue-500 text-white font-semibold text-sm px-6 py-2 rounded-md transition-all flex items-center gap-2 hover:bg-blue-500"
                >
                  Editar cliente
                  <FaPencilAlt className="w-4 h-4" /> {/* Icono para editar */}
                </button>
              </div>
            </div>
          </div>
          <div class="w-full mx-auto">
            <div class="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-md:text-sm">
              <div
                id="jh-stats-positive"
                class="flex flex-col justify-center px-4 py-4  bg-white rounded-xl sm:mt-0 border border-gray-300"
              >
                <div>
                  <div>
                    <p class="flex items-center justify-end text-green-500 text-md">
                      <span class="font-bold">
                        {Number(totalComprobantes & 100).toFixed(2)}%
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="heroicon-ui"
                          d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"
                        />
                      </svg>
                    </p>
                  </div>
                  <p class="text-3xl font-semibold text-center text-gray-800">
                    {totalFormateado}
                  </p>
                  <p class="text-base text-center text-gray-500">
                    Total cargado en comprobantes
                  </p>
                </div>
              </div>

              <div
                id="jh-stats-negative"
                class="flex flex-col justify-center px-4 py-4  bg-white rounded-xl sm:mt-0 border border-gray-300"
              >
                <div>
                  <div>
                    <p class="flex items-center justify-end text-red-500 text-md">
                      <span class="font-bold">
                        {Number(cliente.total & 100).toFixed(2)}%
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="heroicon-ui"
                          d="M20 9a1 1 0 012 0v8a1 1 0 01-1 1h-8a1 1 0 010-2h5.59L13 10.41l-3.3 3.3a1 1 0 01-1.4 0l-6-6a1 1 0 011.4-1.42L9 11.6l3.3-3.3a1 1 0 011.4 0l6.3 6.3V9z"
                        />
                      </svg>
                    </p>
                  </div>
                  <p class="text-3xl font-semibold text-center text-gray-800">
                    {cliente?.total?.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                  <p class="text-base text-center text-gray-500">
                    Total deuda cliente
                  </p>
                </div>
              </div>

              <div
                id="jh-stats-neutral"
                class="flex flex-col justify-center px-4 py-4  bg-white rounded-xl sm:mt-0 border border-gray-300"
              >
                <div>
                  <div>
                    <p class="flex items-center justify-end text-gray-500 text-md">
                      <span class="font-bold">{comprobante.length & 100}%</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="heroicon-ui"
                          d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"
                        />
                      </svg>
                    </p>
                  </div>
                  <p class="text-3xl font-semibold text-center text-gray-800">
                    {comprobante.length}
                  </p>
                  <p class="text-base text-center text-gray-500">
                    Total comprobantes cargados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between mx-10 max-md:flex-col max-md:gap-3 max-md:mx-5">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-700 text-xl">
            Comprobantes de pago del cliente{" "}
          </p>
          <p className="text-gray-600 font-medium text-sm">
            Aquí puedes ver información detallada de los comprobantes del mes,
            semanales, etc.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="text-white bg-green-500/90 py-2 px-6 rounded-md font-bold text-sm flex gap-2 items-center"
            // onClick={() => openModalComprobante()}
            onClick={() =>
              document.getElementById("my_modal_cargar_comprobante").showModal()
            }
          >
            Cargar nuevo comprobante de pago <BsCash className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="px-10">
        <div className="flex gap-2 mb-4">
          <select
            className="outline-none border border-gray-300 py-2 px-2 rounded-md text-sm font-bold"
            onChange={handleYearChange}
            value={selectedYear}
          >
            <option className="font-bold" value="">
              Seleccione el año
            </option>
            {/* Generar opciones de años dinámicamente */}
            {Array.from(
              new Set(comprobante.map((c) => new Date(c.date).getFullYear()))
            ).map((year) => (
              <option className="font-semibold" key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Selector para mes */}
          <select
            className="outline-none border border-gray-300 py-2 px-2 rounded-md text-sm font-bold capitalize"
            onChange={handleMonthChange}
            value={selectedMonth}
          >
            <option className="font-bold" value="">
              Seleccione el mes
            </option>
            {/* Generar opciones de meses */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option
                className="font-semibold capitalize"
                key={month}
                value={month}
              >
                {new Date(0, month - 1).toLocaleString("es-ES", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <table className="table bg-white">
          {/* head */}
          <thead className="font-bold text-gray-800 text-sm">
            <tr>
              <th>Fecha de emisión</th>
              <th>Total del comprobante/$</th>
            </tr>
          </thead>
          <tbody className="text-xs font-bold">
            {sortedComprobantes.map((c) => (
              <tr key={c.id}>
                <th className="">{c.date}</th>
                <th className="uppercase">{c.tipo_pago}</th>
                <td className="">
                  <div className="flex">
                    <p className="bg-green-100/90 text-green-700 font-bold py-2 px-3 rounded-md">
                      {Number(c.total).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </p>
                  </div>
                </td>
                <td className="py-5">
                  <div className="dropdown dropdown-left drop-shadow-lg">
                    <div
                      tabIndex={0}
                      role="button"
                      className="py-2 px-2 transition-all hover:bg-gray-800 hover:text-white  border-none rounded-full"
                    >
                      <IoIosMore className="text-2xl" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-md w-52 gap-1"
                    >
                      <li>
                        <button
                          className="capitalize hover:bg-gray-800 hover:text-white font-semibold text-gray-700"
                          onClick={() => handleViewImage(c.imagen)} // Abre el modal con la imagen
                        >
                          Ver comprobante
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

      <ModalComprobante
        setCliente={setCliente}
        setComprobante={setComprobante}
        idObtenida={cliente._id}
      />

      <ImageModal
        isVisible={isModalVisible}
        onClose={handleCloseModal} // Cierra el modal
        imageUrl={selectedImage} // URL de la imagen seleccionada
      />
      <ModalActualizarCliente idObtenida={idObtenida} />

      <div className="fixed bottom-3 left-5 bg-white border border-slate-300 py-3 px-3 rounded-full hover:text-primary text-primary/20 cursor-pointer">
        <Link to={"/clientes"}>
          <FaArrowLeft className="text-2xl " />
        </Link>
      </div>
    </div>
  );
}

const ImageModal = ({ isVisible, onClose, imageUrl }) => {
  if (!isVisible) return null; // Si el modal no está visible, no renderizar nada

  const handleClickOutside = (event) => {
    // Cierra el modal si haces clic fuera del contenido
    onClose();
  };

  const handleContentClick = (event) => {
    // Evitar la propagación del clic para no cerrar el modal cuando haces clic en el contenido
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleClickOutside} // Cierra el modal al hacer clic fuera
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div onClick={handleContentClick} className="relative p-5">
        {imageUrl && imageUrl.toLowerCase().endsWith(".pdf") ? (
          // Si la URL termina en ".pdf", mostrar el archivo PDF en un iframe
          <iframe
            src={imageUrl}
            title="Archivo PDF"
            className="w-[1220px] h-screen"
          />
        ) : (
          // Si no, mostrar la imagen
          <img src={imageUrl} alt="Comprobante" className="w-full h-auto" />
        )}
      </div>
    </div>
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

export const ModalComprobante = ({
  idObtenida,
  setCliente,
  setComprobante,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();

  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const data = new FormData();
    data.append("file", file);

    // Set the upload preset based on the file type
    const uploadPreset = file.type.startsWith("image/")
      ? "imagenes"
      : "documentos";
    data.append("upload_preset", uploadPreset);

    try {
      const api = `https://api.cloudinary.com/v1_1/doguyttkd/${
        file.type.startsWith("image/") ? "image" : "raw"
      }/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      const imageURL = await uploadFile(uploadedFile);

      const comprobanteData = {
        ...formData,
        id: uuidv4(),
        imagen: imageURL,
        date: dayjs().format("YYYY-MM-DD"),
      };

      const res = await agregarComprobante(idObtenida, comprobanteData);

      if (res.status === 200 && res.data) {
        const clienteActualizado = res.data.comprobantes;
        setComprobante(clienteActualizado);
        setCliente(res.data);
      } else {
        console.error("Error: No se pudo agregar el comprobante.");
      }

      reset();
      setUploadedFile(null);

      toast.success("Comprobante creado correctamente", {
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

      document.getElementById("my_modal_cargar_comprobante").close();
    } catch (error) {
      console.error("Error creando comprobante:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setDragging(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const total = watch("total");

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };
  return (
    <dialog id="my_modal_cargar_comprobante" className="modal">
      <div className="modal-box rounded-md max-w-xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 w-full items-start">
            <div className="cursor-pointer" onClick={handleInputClick}>
              {isEditable ? (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Total del comprobante
                  </label>
                  <input
                    {...register("total", { required: true })}
                    onBlur={() => {
                      setIsEditable(false);
                    }}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Total del comprobante
                  </label>

                  <p className="border border-gray-300 font-bold py-2 px-2 rounded-md capitalize text-sm outline-none w-auto">
                    {formatearDinero(Number(total) || 0)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Seleccionar el método de pago
              </label>
              <select
                {...register("tipo_pago", { required: true })}
                className="text-sm border rounded-md py-2 px-2 outline-none font-medium"
              >
                <option
                  className="font-bold text-primary"
                  value=""
                  disabled
                  selected
                >
                  Elige un método de pago
                </option>
                <option
                  className="text-xs font-semibold"
                  value="transferencia bancaria"
                >
                  Transferencia Bancaria
                </option>
                <option
                  className="text-xs font-semibold"
                  value="tarjeta credito"
                >
                  Tarjeta de Crédito
                </option>
                <option
                  className="text-xs font-semibold"
                  value="tarjeta debito"
                >
                  Tarjeta de Débito
                </option>
                <option className="text-xs font-semibold" value="paypal">
                  PayPal
                </option>
                <option className="text-xs font-semibold" value="efectivo">
                  Efectivo
                </option>
                <option className="text-xs font-semibold" value="cheque">
                  Cheque
                </option>
                <option className="text-xs font-semibold" value="bitcoin">
                  Bitcoin
                </option>
                <option className="text-xs font-semibold" value="otros">
                  Otros
                </option>
              </select>
            </div>

            <FileDropZoneClientsPdfs
              dragging={dragging}
              handleDragLeave={handleDragLeave}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
              setDragging={setDragging}
              setUploadedFile={setUploadedFile}
              uploadedFile={uploadedFile}
            />
          </div>

          <button
            type="submit"
            className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
          >
            Cargar el comprobante de pago
          </button>
        </form>
      </div>
    </dialog>
  );
};
