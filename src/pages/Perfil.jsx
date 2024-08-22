import { ModalEditarDatosFacturacion } from "../components/facturacion/ModalEditarDatosFacturacion";
import ModalCargarImagen from "../components/users/ModalCargarImagen";
import { useAuth } from "../context/authContext";
import { useModal } from "../helpers/modal";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import axios from "axios";
import FileDropZone from "../components/ui/FileDropZone";
import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { PresupuestoDocument } from "../components/pdfs/PresupuestoDocument";

export const Perfil = () => {
  const { user } = useAuth();

  const { closeModal, isOpen, openModal } = useModal();

  const {
    closeModal: closeModalImagen,
    isOpen: isOpenImagen,
    openModal: openModalImagen,
  } = useModal();

  return (
    <section className="container mx-auto my-10">
      <div className="bg-white py-6 px-6 rounded-md border-gray-300 border w-1/2 mx-auto flex justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={
              user?.imagen ||
              "https://ppstatic.s3.amazonaws.com/expenses/uploads/people/app-243391-35471-888.blob"
            }
            className="w-[80px]
           rounded-full"
          />
          <div>
            <p className="font-semibold capitalize text-gray-700 text-sm">
              {user?.username}
            </p>
          </div>
        </div>
        <div>
          <div>
            <p className="text-sm text-gray-700 font-semibold">
              Ultima actualización del perfil
            </p>
            <p className="font-bold capitalize text-gray-500 text-sm text-end">
              {new Date(user?.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={() => openModalImagen()}
              type="button"
              className="border-[1px] border-blue-500 py-2 px-5 rounded-full text-blue-500 font-bold text-sm shadow"
            >
              Cargar imagen usuario
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md border-gray-300 border w-1/2 mx-auto mt-5">
        <div className=" py-8 px-8 border-b border-gray-300">
          <p className="text-gray-800 font-bold text-sm">Mi Perfil</p>
        </div>
        <div className="bg-white py-8 px-8 grid grid-cols-3 rounded-md">
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Nombre y apellido{" "}
            <span className="font-semibold text-slate-400">
              {user?.username}
            </span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Email{" "}
            <span className="font-semibold text-slate-400">{user?.email}</span>
          </p>
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Identificación{" "}
            <span className="font-semibold text-slate-400"></span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-300 w-1/2 mx-auto mt-5">
        <div className=" py-8 px-5 border-b border-gray-300">
          <p className="text-gray-800 font-bold text-sm">Seguridad</p>
        </div>
        <div className="bg-white py-8 px-8  rounded-xl flex justify-between">
          <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
            Contraseña
            <span className="font-semibold text-slate-400">
              {"***************"}
            </span>
          </p>

          <div>
            <div>
              <p className="text-gray-400 font-semibold text-sm mb-2">
                Última modificación: Hace un año
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="border-[1px] border-blue-500 py-2 px-5 rounded-full text-blue-500 font-bold text-sm shadow"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-300 w-1/2 mx-auto mt-5">
        <div className=" py-8 px-5 border-b border-gray-300">
          <p className="text-gray-800 font-bold text-sm">
            Datos de la facturación
          </p>
        </div>
        <div className="bg-white py-8 px-8  rounded-xl flex justify-between">
          <div className="grid grid-cols-3 gap-8 w-full">
            <p className="flex flex-col gap-1 text-gray-700 font-bold text-sm">
              Logo de la factura
              <img
                src={user?.imagen_facturacion}
                className="w-[100px]
           rounded-full object-cover shadow-xl"
              />
            </p>
            <div className="text-sm font-bold text-gray-700">
              <p>Dni</p>
              <p className="text-xs font-semibold text-gray-500">
                {user?.dni_facturacion ||
                  "Edita tus datos para poder ver el dni"}
              </p>
            </div>
            <div className="text-sm font-bold text-gray-700">
              <p>Telefono</p>
              <p className="text-xs font-semibold text-gray-500">
                {user?.telefono_facturacion ||
                  "Edita tus datos para poder ver el dni"}
              </p>
            </div>
            <div className="text-sm font-bold text-gray-700">
              <p>Email</p>
              <p className="text-xs font-semibold text-gray-500">
                {user?.email_facturacion ||
                  "Edita tus datos para poder ver el dni"}
              </p>
            </div>
            <div className="text-sm font-bold text-gray-700">
              <p>Localidad</p>
              <p className="text-xs font-semibold text-gray-500">
                {user?.localidad_facturacion ||
                  "Edita tus datos para poder ver el dni"}
              </p>
            </div>
            <div className="text-sm font-bold text-gray-700">
              <p>Provincia</p>
              <p className="text-xs font-semibold text-gray-500">
                {user?.provincia_facturacion ||
                  "Edita tus datos para poder ver el dni"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end py-6 px-4">
          <button
            // onClick={() => openModal()}
            onClick={() =>
              document.getElementById("my_modal_datos_facturacion").showModal()
            }
            type="button"
            className="border-[1px] border-blue-500 py-2 px-5 rounded-full text-blue-500 font-bold text-sm shadow"
          >
            Editar los datos facturación
          </button>
        </div>
      </div>

      {/* <ModalEditarDatosFacturacion
        isOpenEditarDatos={isOpen}
        closeModalEditarDatos={closeModal}
      /> */}
      <ModalDatosFacturacion />
      <ModalCargarImagen closeModal={closeModalImagen} isOpen={isOpenImagen} />
    </section>
  );
};

const ModalDatosFacturacion = () => {
  const { updateUserApi, user } = useAuth();

  const { register, handleSubmit, setValue } = useForm();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Función para subir la imagen a Cloudinary y obtener la URL
  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "imagenes");

    try {
      const api = `https://api.cloudinary.com/v1_1/doguyttkd/image/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data; // Obtenemos la URL segura
      return secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  // Event handlers for drag and drop
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

  useEffect(() => {
    setValue("dni_facturacion", user?.dni_facturacion);
    setValue("localidad_facturacion", user?.localidad_facturacion);
    setValue("provincia_facturacion", user?.provincia_facturacion);
    setValue("email_facturacion", user?.email_facturacion);
    setValue("telefono_facturacion", user?.telefono_facturacion);
  }, [user]);

  const onSubmit = async (formData) => {
    try {
      // Subimos la imagen a Cloudinary y obtenemos la URL
      const imageURL = await uploadFile(uploadedFile);

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const productData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
        imagen_facturacion: imageURL, // Añadimos la URL de la imagen
      };

      await updateUserApi(user?.id, productData);

      document.getElementById("my_modal_datos_facturacion").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  return (
    <dialog id="my_modal_datos_facturacion" className="modal">
      <div className="modal-box rounded-md h-full max-w-full scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Cargar tus datos de facturación..</h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-0 mt-4 flex flex-col gap-6 mb-6"
        >
          <div className="flex flex-col gap-2 w-full">
            <div>
              <label className="font-semibold text-sm text-gray-700">
                Cargar logo facturación, si ya tenes no agregar nada.
              </label>
            </div>
            <div className="w-1/3 flex gap-3 items-start">
              <FileDropZone
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
              {user?.imagen_facturacion && (
                <div>
                  <p className="font-semibold text-sm text-gray-500 mb-2">
                    Logo actual
                  </p>
                  <img
                    className="w-[150px] rounded-2xl shadow-md border"
                    src={user?.imagen_facturacion}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Dni facturación
              </label>
              <input
                {...register("dni_facturacion")}
                type="text"
                placeholder="Escribe el dni de la factura"
                className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">
                Telefono facturación
              </label>
              <input
                {...register("telefono_facturacion")}
                type="text"
                placeholder="Telefono facturación"
                className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">
                Email facturación
              </label>
              <input
                {...register("email_facturacion")}
                type="text"
                placeholder="Email facturación"
                className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">
                Localidad facturación
              </label>
              <input
                {...register("localidad_facturacion")}
                type="text"
                placeholder="Localidad facturación"
                className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">
                Provincia facturación
              </label>
              <input
                {...register("provincia_facturacion")}
                type="text"
                placeholder="Provincia facturación"
                className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
              />
            </div>
            <div></div>
            <div>
              <button className="font-semibold bg-blue-500 py-3 px-5 rounded-md text-white text-sm">
                Editar los campos de la facturación
              </button>
            </div>
          </div>
        </form>
        <PDFViewer style={{ width: "50%", height: "50vh" }}>
          <PresupuestoDocument user={user} datos={""} />
        </PDFViewer>
      </div>
    </dialog>
  );
};
