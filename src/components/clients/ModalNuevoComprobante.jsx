import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from "uuid"; // Para generar IDs únicos
import { useForm } from "react-hook-form";
import { agregarComprobante } from "../../api/clientes";
import axios from "axios"; // Para solicitudes HTTP
import FileDropZoneClient from "./FileDropZoneClients"; // Componente para cargar archivos
import dayjs from "dayjs";
import { toast } from "react-toastify";

export default function ModalNuevoComprobante({
  isOpen,
  closeModal,
  idObtenida,
  setComprobante,
  setCliente,
}) {
  const { register, handleSubmit, watch, reset } = useForm();

  const total = watch("total") || 0;

  const [uploadedFile, setUploadedFile] = useState(null); // Estado para el archivo cargado
  const [dragging, setDragging] = useState(false); // Estado para el drag-and-drop

  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const data = new FormData(); // Para datos de tipo `multipart/form-data`
    data.append("file", file);
    data.append("upload_preset", "productos"); // Configuración para Cloudinary

    try {
      const api = `https://api.cloudinary.com/v1_1/dgchynrxl/image/upload`; // Endpoint de Cloudinary
      const res = await axios.post(api, data); // Subir la imagen
      const { secure_url } = res.data; // URL segura de la imagen
      return secure_url; // Devuelve la URL de la imagen
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      const imageURL = await uploadFile(uploadedFile); // Subir la imagen

      const comprobanteData = {
        ...formData,
        id: uuidv4(), // Generar un ID único
        imagen: imageURL, // Añadir la URL de la imagen
        date: dayjs().format("YYYY-MM-DD"),
      };

      const res = await agregarComprobante(idObtenida, comprobanteData); // Llama a la función para agregar el comprobante

      if (res.status === 200 && res.data) {
        const clienteActualizado = res.data.comprobantes;
        console.log("asd", clienteActualizado);
        // Actualizar el estado del cliente para reflejar el cambio
        setComprobante(clienteActualizado); // Actualiza el estado del cliente con la nueva lista de comprobantes
        setCliente(res.data);
        console.log("Comprobante creado exitosamente:", res.data);
      } else {
        console.error("Error: No se pudo agregar el comprobante.");
      }

      closeModal(); // Cierra el modal

      reset();

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
        // transition: "Bounce",
      });
    } catch (error) {
      console.error("Error creando comprobante:", error);
    }
  };

  // Controladores para drag-and-drop
  const handleDragOver = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado
    setDragging(true); // Activa el estado de arrastre
  };

  const handleDragLeave = () => {
    setDragging(false); // Desactiva el estado de arrastre
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0]; // Obtiene el archivo del evento
    if (file) {
      setUploadedFile(file); // Establece el archivo cargado
      setDragging(false); // Desactiva el estado de arrastre
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Obtiene el archivo del input
    if (file) {
      setUploadedFile(file); // Establece el archivo cargado
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null); // Elimina el archivo cargado
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end py-2">
                  <IoMdClose
                    onClick={closeModal} // Cierra el modal al hacer clic
                    className="hover:text-sky-700 hover:bg-gray-100 transition-all cursor-pointer text-4xl text-slate-800 bg-gray-200 py-2 px-2 rounded-full"
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-2 w-full">
                    <label>Total del comprobante:</label>
                    <div className="flex gap-2 items-center">
                      <input
                        className="bg-gray-200/60 text-slae-700 placeholder:text-slate-400 uppercase text-sm py-3 px-3 rounded-xl outline-none ease-linear transition-all focus:outline-sky-700 w-full"
                        type="number"
                        placeholder="Ingresa el total del comprobante ej: $100.000"
                        {...register("total", { required: true })} // Campo requerido
                      />

                      <div className="bg-sky-500 text-white py-2 px-4 rounded-xl font-bold">
                        {Number(total)?.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </div>
                    </div>

                    <FileDropZoneClient
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
                    className="mt-4 bg-sky-700 text-white py-2 px-6 font-semibold text-sm rounded-full hover:bg-sky-700/90 transition-all"
                  >
                    Crear el comprobante
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
