import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProductos } from "../../context/ProductosContext";
import { useEffect, useState } from "react";
import { Message } from "../ui/Message";
import FileDropZone from "../ui/FileDropZone";
import axios from "axios"; // Importamos axios para la llamada a Cloudinary
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export const ModalCrearPerfil = () => {
  const {
    createProducto,
    colores,
    categorias,
    getColores,
    getCategorias,
    error,
  } = useProductos();

  const { register, handleSubmit, reset } = useForm();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    getColores();
    getCategorias();
  }, []);

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

  const onSubmit = async (formData) => {
    try {
      // Subimos la imagen a Cloudinary y obtenemos la URL
      const imageURL = await uploadFile(uploadedFile);

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const productData = {
        ...formData,
        date: dayjs.utc(formData.date).format(),
        imagen: imageURL, // Añadimos la URL de la imagen
      };

      await createProducto(productData);

      //   document.getElementById("my_modal_3").onclose();
      document.getElementById("my_modal_3").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
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

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box h-full w-full min-h-full rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="flex justify-end w-full">
            <IoMdClose className="cursor-pointer text-4xl text-red-800 hover:shadow-md transition-all ease-linear bg-red-100 py-2 px-2 rounded-full" />
          </button>
        </form>
        <h3 className="font-bold text-lg text-sky-700">Crea un nuevo perfil</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras crear un nuevo perfil de aluminio.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-5"
        >
          {error.length > 0 ? <Message message={error} /> : ""}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              El codigo
            </label>
            <input
              autoFocus
              {...register("codigo")}
              type="text"
              placeholder="Ej: Tkpr1"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              La descripción
            </label>
            <input
              {...register("detalle")}
              type="text"
              placeholder="Ej: Marco pesado"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Seleccionar un color
            </label>
            <select
              {...register("color")}
              type="text"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3.5 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            >
              <option>Seleccionar el color</option>
              {colores.map((c) => (
                <option key={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Seleccionar una categoria
            </label>
            <select
              {...register("categoria")}
              type="text"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3.5 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            >
              <option>Seleccionar la categoria</option>
              {categorias.map((c) => (
                <option key={c._id}>{c.detalle}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Kg del perfil
            </label>
            <input
              {...register("kg_barra_estimado")}
              type="text"
              placeholder="Ej: 1.556, siempre es con punto '.' no con coma ','"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Stock del producto en fabrica
            </label>
            <input
              {...register("stock")}
              type="text"
              placeholder="Ej: 100"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Stock del producto minimo
            </label>
            <input
              {...register("stock_minimo")}
              type="text"
              placeholder="Ej: 200"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              Stock del producto maximo
            </label>
            <input
              {...register("stock_maximo")}
              type="text"
              placeholder="Ej: 300"
              className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1 font-bold"
            />
          </div>

          <div className="mt-2">
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
          </div>

          <div>
            <button
              type="submit"
              className="bg-green-500 py-3 px-8 text-sm rounded-full font-semibold text-white mt-3 hover:bg-green-500/90 cursor-pointer max-md:w-full"
            >
              Guardar perfil de aluminio
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
