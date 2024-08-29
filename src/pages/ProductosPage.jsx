import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductos } from "../context/ProductosContext";
import { ImFileEmpty } from "react-icons/im";
import { BsFolderPlus } from "react-icons/bs";
import { TableProducts } from "../components/products/TableProducts";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { IoIosAddCircleOutline, IoIosMore } from "react-icons/io";
import { useForm } from "react-hook-form";
import { Message } from "../components/ui/Message";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdOutlineMenuOpen } from "react-icons/md";
import { useObtenerId } from "../helpers/obtenerId";
import { FaSearch } from "react-icons/fa";
//imports comunes
import axios from "axios";
import FileDropZone from "../components/ui/FileDropZone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// import video from "../assets/video/producto.mp4";

export function ProductosPage() {
  const {
    productos,
    categorias,
    getProductos,
    getCategorias,
    getColores,
    colores,
  } = useProductos();

  const { handleObtenerId, idObtenida } = useObtenerId();

  useEffect(() => {
    getProductos();
    getCategorias();
    getColores();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    const colorMatches =
      selectedColor === "all" || product.color === selectedColor;

    return searchTermMatches && categoryMatches && colorMatches;
  });

  const sortedProducts = filteredProducts.sort((a, b) => b.stock - a.stock);

  return (
    <div>
      <div className="bg-gray-100 py-14 px-14 flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-900 text-xl">
            Cargar nuevos perfiles, colores, categorias.
          </p>
        </div>
        <div>
          <button
            onClick={() =>
              document
                .getElementById("my_modal_crear_perfil_aluminio")
                .showModal()
            }
            className="bg-primary text-white font-bold text-sm py-1.5 px-4 rounded-md hover:bg-gray-800 transition-all"
          >
            Crear nuevo perfil de aluminio
          </button>
        </div>
      </div>

      <div className="px-10 py-10 flex gap-2">
        <button
          onClick={() =>
            document.getElementById("my_modal_categorias").showModal()
          }
          className="bg-gray-800 py-2 px-4 rounded-md text-white font-semibold text-sm hover:shadow-md transition-all"
        >
          Crear nuevas categorias
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_colores").showModal()
          }
          className="bg-gray-800 py-2 px-4 rounded-md text-white font-semibold text-sm hover:shadow-md transition-all"
        >
          Crear nuevos colores
        </button>
      </div>

      {productos.length === 0 && (
        <div className="flex flex-col gap-6 justify-center items-center p-12 bg-white w-1/3 mx-auto my-10 rounded-xl border border-gray-300">
          <div>
            <ImFileEmpty className="text-6xl text-primary m-auto my-2" />
            <h1 className="font-medium text-base text-gray-800">
              No hay ningun producto cargado ahún, carga uno ahora
            </h1>
          </div>
          <div>
            <Link
              to={"/crear-producto"}
              className="bg-blue-500 text-white py-2 px-6 rounded-md text-sm font-semibold hover:shadow-md transition-all ease-linear flex gap-2 items-center"
              // to={"/crear-producto"}
            >
              Crear nuevo perfil de aluminio
              <BsFolderPlus className="text-2xl" />
            </Link>
          </div>
        </div>
      )}

      <div className="px-10 pb-5 flex gap-2 max-md:flex-col">
        <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="outline-none font-medium w-full"
            placeholder="Buscar por nombre.."
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

      <div className="px-10">
        <table className="table">
          <thead className="text-gray-800 text-sm">
            <tr>
              <th>Referencia</th>
              <th>Codigo</th>
              <th>Descripción</th>
              <th>Color</th>
              <th>Linea</th>
              <th>Kg aprox.</th>
              <th>Tipo</th>
              <th>Stock actual</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((p) => (
              <tr key={p._id} className="text-xs font-medium uppercase">
                <th>{p._id}</th>
                <td>{p.codigo}</td>
                <td>{p.detalle}</td>
                <td>{p.color}</td>
                <td>{p.categoria}</td>
                <td>{p.kg_barra_estimado} kgs.</td>
                <td>
                  <div className="flex">
                    <p className="font-bold bg-blue-600 py-1.5 text-white px-4 rounded-md">
                      {p.tipo}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="flex">
                    <p
                      className={`py-1 px-2 rounded-md font-bold ${
                        p.stock > 0
                          ? "bg-green-100/90 text-green-700"
                          : "bg-red-100/90 text-red-700 "
                      }`}
                    >
                      {p.stock}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="flex">
                    <p
                      className={`py-1 px-2 rounded-md font-bold ${
                        p.stock > 0
                          ? "bg-green-100/90 text-green-700"
                          : "bg-red-100/90 text-red-700 "
                      }`}
                    >
                      {p.stock ? "Hay stock" : "Sin stock"}
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
                      <IoIosMore className="text-2xl" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu w-52 rounded-md p-1 z-[100] border bg-white border-gray-300"
                    >
                      <li>
                        <button
                          onClick={() => {
                            {
                              handleObtenerId(p._id),
                                document
                                  .getElementById("my_modal_actualizar_perfil")
                                  .showModal();
                            }
                          }}
                          type="button"
                          className="font-semibold text-xs hover:bg-gray-800 hover:text-white rounded-md"
                        >
                          Actualizar perfil
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            {
                              handleObtenerId(p._id),
                                document
                                  .getElementById("my_modal_eliminar")
                                  .showModal();
                            }
                          }}
                          type="button"
                          className="font-semibold text-xs hover:bg-gray-800 hover:text-white rounded-md"
                        >
                          Eliminar perfil
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

      <ModalCrearPerfil />
      <CrearNuevasCategorias />
      <CrearNuevosColores />
      <ModalEditarPerfil idObtenida={idObtenida} />
      <ModalEliminar idObtenida={idObtenida} />
    </div>
  );
}

const ModalCrearPerfil = () => {
  dayjs.extend(utc);

  const {
    createProducto,
    colores,
    categorias,
    getColores,
    getCategorias,
    error,
  } = useProductos();

  const { register, handleSubmit, watch } = useForm();

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

      document.getElementById("my_modal_crear_perfil_aluminio").close();
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

  const tipo = watch("tipo");

  return (
    <dialog id="my_modal_crear_perfil_aluminio" className="modal">
      <div className="modal-box rounded-md max-w-full scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Crear nuevo perfil de aluminio</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta sesión podemos crear un perfil de aluminio.
        </p>

        <div className="flex flex-col gap-5 items-start">
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {error.length > 0 ? <Message message={error} /> : ""}

              <article className="grid grid-cols-3 gap-3">
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
                </div>{" "}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Seleccionar el tipo
                  </label>
                  <select
                    {...register("tipo")}
                    type="text"
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium capitalize"
                  >
                    <option className="capitalize font-bold">
                      Seleccionar el tipo
                    </option>
                    <option
                      value={"unidad"}
                      className="capitalize font-semibold"
                    >
                      Unidad
                    </option>
                    <option
                      value={"paquete"}
                      className="capitalize font-semibold"
                    >
                      Paquete
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Seleccionar un color
                  </label>
                  <select
                    {...register("color")}
                    type="text"
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium capitalize"
                  >
                    <option className="capitalize font-bold">
                      Seleccionar el color
                    </option>
                    {colores.map((c) => (
                      <option className="capitalize font-semibold" key={c._id}>
                        {c.name}
                      </option>
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
                    <option className="capitalize font-bold">
                      Seleccionar la categoria
                    </option>
                    {categorias.map((c) => (
                      <option className="capitalize font-semibold" key={c._id}>
                        {c.detalle}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    {tipo === "unidad" ? "kg de la unidad" : "Kg del paquete"}
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
                    {tipo === "unidad"
                      ? "Stock de perfiles"
                      : "Stock de paquetes"}
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
                    {tipo === "unidad"
                      ? "Stock de perfiles minimo"
                      : "Stock de paquetes minimo"}
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
                    {tipo === "unidad"
                      ? "Stock de perfiles maximo"
                      : "Stock de paquetes maximo"}
                  </label>
                  <input
                    {...register("stock_maximo")}
                    type="text"
                    placeholder="Ej: 300"
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
              </article>

              <div className="w-1/4">
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
                  className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
                >
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

const CrearNuevasCategorias = () => {
  const { categorias, getCategorias, deleteCategoria } = useProductos();

  useEffect(() => {
    getCategorias();
  }, []);

  return (
    <dialog id="my_modal_categorias" className="modal">
      <div className="modal-box rounded-md max-w-4xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Cargar nuevas categorias/lineas de perfiles.
        </h3>
        <p className="py-1 text-sm font-medium">
          Observar las categorias/lineas de perfiles cargadas en el sistema.
        </p>
        <div className="mt-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_cargar_categoria").showModal()
            }
            className="bg-primary py-2 px-4 rounded-md text-white font-semibold text-sm hover:shadow-md transition-all"
          >
            Cargar categoria nueva
          </button>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {categorias.map((c) => (
            <div
              className="border py-1 px-2 rounded-md border-gray-300 flex justify-between items-center"
              key={c._id}
            >
              <p className="text-sm font-bold uppercase">{c.detalle}</p>
              <FaDeleteLeft
                onClick={() => deleteCategoria(c._id)}
                className="text-red-500 text-lg cursor-pointer transition-all"
              />
            </div>
          ))}
        </div>

        <ModalCargarCategoria />
      </div>
    </dialog>
  );
};

const ModalCargarCategoria = () => {
  const { createCategoria } = useProductos();

  const { register, handleSubmit, reset } = useForm();

  //submit crear
  const onSubmit = async (data) => {
    try {
      createCategoria({
        ...data,
        date: dayjs.utc(data.date).format(),
      });
      document.getElementById("my_modal_cargar_categoria").close();
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <dialog id="my_modal_cargar_categoria" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              El nombre de la categoria
            </label>
            <input
              {...register("detalle")}
              type="text"
              placeholder="Ej: herrero, modena, modena a30, etc"
              className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
            >
              Guardar categoria
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const CrearNuevosColores = () => {
  const { colores, getColores, deleteColor } = useProductos();

  useEffect(() => {
    getColores();
  }, []);

  return (
    <dialog id="my_modal_colores" className="modal">
      <div className="modal-box rounded-md max-w-5xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Cargar nuevos colores de perfiles.
        </h3>
        <p className="py-1 text-sm font-medium">
          Observar los colores de los perfiles cargados en el sistema.
        </p>
        <div className="mt-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_cargar_color").showModal()
            }
            className="bg-primary py-2 px-4 rounded-md text-white font-semibold text-sm hover:shadow-md transition-all"
          >
            Cargar un nuevo color
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {colores.map((c) => (
            <div
              className="border py-1 px-2 rounded-md border-gray-300 flex justify-between items-center"
              key={c._id}
            >
              <p className="text-sm font-bold uppercase">{c.name}</p>
              <FaDeleteLeft
                onClick={() => deleteColor(c._id)}
                className="text-red-500 text-lg cursor-pointer transition-all"
              />
            </div>
          ))}
        </div>

        <ModalCargarColores />
      </div>
    </dialog>
  );
};

const ModalCargarColores = () => {
  const { createColor } = useProductos();

  const { register, handleSubmit, reset } = useForm();

  //submit crear
  const onSubmit = async (data) => {
    try {
      createColor({
        ...data,
        date: dayjs.utc(data.date).format(),
      });
      document.getElementById("my_modal_cargar_color").close();
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <dialog id="my_modal_cargar_color" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">
              El nombre del color
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Ej: herrero, modena, modena a30, etc"
              className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
            >
              Guardar color
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEditarPerfil = ({ idObtenida }) => {
  const [producto, setProducto] = useState([]);

  dayjs.extend(utc);

  const {
    updateProducto,
    colores,
    categorias,
    getColores,
    getCategorias,
    getProducto,
  } = useProductos();

  const { register, handleSubmit, setValue, watch } = useForm();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    getColores();
    getCategorias();
  }, []);

  const tipo = watch("tipo");

  useEffect(() => {
    const loadData = async () => {
      const res = await getProducto(idObtenida);
      setValue("codigo", res.codigo);
      setValue("detalle", res.detalle);
      setValue("color", res.color);
      setValue("categoria", res.categoria);
      setValue("kg_barra_estimado", res.kg_barra_estimado);
      setValue("stock", res.stock);
      setValue("stock_minimo", res.stock_minimo);
      setValue("stock_maximo", res.stock_maximo);

      setProducto(res);
    };
    loadData();
  }, [idObtenida]);

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
        imagen: imageURL || producto.imagen, // Añadimos la URL de la imagen
      };

      await updateProducto(idObtenida, productData);

      document.getElementById("my_modal_actualizar_perfil").close();
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
    <dialog id="my_modal_actualizar_perfil" className="modal">
      <div className="modal-box rounded-md max-w-full scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {/* <h3 className="font-bold text-lg">Actual nuevo perfil de aluminio</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta sesión podemos crear un perfil de aluminio.
        </p> */}

        <div className="flex flex-col gap-5 items-start">
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              <article className="grid grid-cols-3 gap-3">
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
                </div>{" "}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Seleccionar el tipo
                  </label>
                  <select
                    {...register("tipo")}
                    type="text"
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium capitalize"
                  >
                    <option className="capitalize font-bold">
                      Seleccionar el tipo
                    </option>
                    <option
                      value={"unidad"}
                      className="capitalize font-semibold"
                    >
                      Unidad
                    </option>
                    <option
                      value={"paquete"}
                      className="capitalize font-semibold"
                    >
                      Paquete
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    Seleccionar un color
                  </label>
                  <select
                    {...register("color")}
                    type="text"
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium capitalize"
                  >
                    <option className="capitalize font-bold">
                      Seleccionar el color
                    </option>
                    {colores.map((c) => (
                      <option className="capitalize font-semibold" key={c._id}>
                        {c.name}
                      </option>
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
                    <option className="capitalize font-bold">
                      Seleccionar la categoria
                    </option>
                    {categorias.map((c) => (
                      <option className="capitalize font-semibold" key={c._id}>
                        {c.detalle}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">
                    {tipo === "unidad" ? "kg de la unidad" : "Kg del paquete"}
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
                    {tipo === "unidad"
                      ? "Stock de perfiles"
                      : "Stock de paquetes"}
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
                    {tipo === "unidad"
                      ? "Stock de perfiles minimo"
                      : "Stock de paquetes minimo"}
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
                    {tipo === "unidad"
                      ? "Stock de perfiles maximo"
                      : "Stock de paquetes maximo"}
                  </label>
                  <input
                    {...register("stock_maximo")}
                    type="text"
                    placeholder="Ej: 300"
                    className="text-sm border rounded-md py-2 px-4 outline-none font-medium"
                  />
                </div>
              </article>

              <div className="w-1/4">
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
                  className="bg-primary py-2 px-4 text-sm rounded-md font-semibold text-white mt-3 hover:bg-blue-500 cursor-pointer"
                >
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { deleleteProducto } = useProductos();
  return (
    <dialog id="my_modal_eliminar" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form>
          <div>
            <img
              className="w-44 mx-auto"
              src="https://app.holded.com/assets/img/document/doc_delete.png"
            />
          </div>
          <div className="font-semibold text-sm text-gray-400 text-center">
            REFERENCIA {idObtenida}
          </div>
          <div className="font-semibold text-[#FD454D] text-lg text-center">
            Eliminar el perfil..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El perfil no podra ser recuperado nunca mas...
          </div>
          <div className="mt-4 text-center w-full px-16">
            <button
              type="button"
              onClick={() => {
                deleleteProducto(idObtenida),
                  document.getElementById("my_modal_eliminar").close();
              }}
              className="bg-red-500 py-1 px-4 text-center font-bold text-white text-sm rounded-md w-full"
            >
              Confirmar
            </button>{" "}
            <button
              type="button"
              onClick={() => {
                document.getElementById("my_modal_eliminar").close();
              }}
              className="bg-orange-100 py-1 px-4 text-center font-bold text-orange-600 mt-2 text-sm rounded-md w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
