import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProductos } from "../context/ProductosContext";
import { useEffect, useState } from "react";
import axios from "axios"; // Importamos axios para la llamada a Cloudinary
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import FileDropZone from "../components/ui/FileDropZone";
import { Message } from "../components/ui/Message";

dayjs.extend(utc);

export function CrearProductoNuevo() {
  const {
    createProducto,
    colores,
    categorias,
    getColores,
    getCategorias,
    error,
  } = useProductos();

  const { register, handleSubmit } = useForm();

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
    <section>
      <div className="mx-10 flex justify-start items-start gap-16 max-md:flex-col">
        <div className="w-2/3 max-md:w-full mx-auto">
          <div className="flex flex-col gap-1 my-10">
            <p className="font-bold text-slate-700 text-xl">
              Crear nuevo perfil de aluminio
            </p>
            <p className="text-slate-600 font-bold text-sm">
              En esta sección podras crear nuevos perfiles.
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
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {error.length > 0 ? <Message message={error} /> : ""}

                <article className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">
                      El codigo
                    </label>
                    <input
                      autoFocus
                      {...register("codigo")}
                      type="text"
                      placeholder="Ej: Tkpr1"
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
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
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">
                      Seleccionar un color
                    </label>
                    <select
                      {...register("color")}
                      type="text"
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
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
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
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
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
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
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
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
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
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
                      className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                    />
                  </div>
                </article>

                <div className="w-1/3">
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
                    className="bg-primary py-3 px-8 text-sm rounded-full font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
                  >
                    Guardar producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
