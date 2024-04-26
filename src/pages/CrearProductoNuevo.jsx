import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProductos } from "../context/ProductosContext";
import { useEffect, useState } from "react";
import axios from "axios"; // Importamos axios para la llamada a Cloudinary
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import FileDropZone from "../components/ui/FileDropZone";

dayjs.extend(utc);

export function CrearProductoNuevo() {
  const { createProducto, colores, categorias, getColores, getCategorias } =
    useProductos();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    data.append("upload_preset", "productos");

    try {
      const api = `https://api.cloudinary.com/v1_1/dgchynrxl/image/upload`;
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

      setTimeout(() => {
        navigate("/productos");
      }, 1000);
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
      <div className="bg-white w-full flex justify-between items-center ">
        <div className="flex">
          <Link
            to={"/productos"}
            className="bg-gray-100/50 px-8 text-sm py-4 text-gray-700 font-medium hover:bg-sky-100 transition-all"
          >
            Productos
          </Link>
          <Link
            to={"/categorias"}
            className="bg-sky-50 px-8 text-sm py-4 text-sky-600 font-medium hover:bg-gray-100 transition-all"
          >
            Crear producto
          </Link>
        </div>
        <div className="flex mx-9">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl cursor-pointer"
                  to={"/home"}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  className="bg-sky-100 text-sky-700 py-2 px-4 rounded-xl cursor-pointer"
                  to={"/productos"}
                >
                  Productos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-10 flex justify-start items-start gap-16">
        <div className="w-1/2">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-slate-700 mt-10 text-xl">
              Crear productos
            </p>
            <p className="text-slate-600 font-light text-sm">
              En esta sección podras crear nuevos productos.
            </p>
          </div>
          <div className="bg-white my-5 rounded-xl shadow-lg flex flex-col gap-3">
            <div className="bg-gray-100 py-4 rounded-t-xl">
              <p className="text-sky-500 text-center text-base">Formulario</p>
            </div>
            <div className="px-10 py-8 flex flex-col gap-5">
              <div>
                <p className="text-sm text-sky-600">Crear un nuevo producto</p>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    El codigo
                  </label>
                  <input
                    {...register("codigo")}
                    type="text"
                    placeholder="Ej: Tkpr1"
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    La descripción
                  </label>
                  <input
                    {...register("detalle")}
                    type="text"
                    placeholder="Ej: Tkpr1"
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Seleccionar un color
                  </label>
                  <select
                    {...register("color")}
                    type="text"
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3.5 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                  >
                    <option value="">Seleccionar el color</option>
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
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3.5 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                  >
                    <option value="">Seleccionar la categoria</option>
                    {categorias.map((c) => (
                      <option key={c._id}>{c.detalle}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Kg estimado de la barra por metro
                  </label>
                  <input
                    {...register("kg_barra_estimado")}
                    type="text"
                    placeholder="Ej: 1.05, siempre es con punto."
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
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
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
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
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
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
                    className="text-sm uppercase text-slate-700 bg-gray-100 rounded-lg py-3 px-3 outline-none ease-linear transition-all focus:outline-sky-500 outline-1"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-green-500 py-2 px-4 text-sm rounded-xl font-bold text-white mt-3 hover:bg-green-600/90 cursor-pointer"
                  >
                    Guardar categoria
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
    </section>
  );
}
