import { useEffect, useState } from "react";
import { useProductos } from "../context/ProductosContext";
import { CiShoppingCart } from "react-icons/ci";
import { ImFileEmpty } from "react-icons/im";
import { BsFolderPlus } from "react-icons/bs";
import { TableProducts } from "../components/products/TableProducts";
import { IoClose, IoFilterOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import ModalFormProducts from "../components/modals/ModalFormProducts";
import ModalCategorias from "../components/modals/ModalCategorias";
import ModalColores from "../components/modals/ModalColores";
import video from "../assets/video/producto.mp4";

export function ProductosPage() {
  useEffect(() => {
    // Muestra el diálogo automáticamente cuando el componente se monta
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.showModal();
    }
  }, []); // El array vacío garantiza que el efecto solo se ejecute una vez al montar el componente

  let [isOpen, setIsOpen] = useState(false);
  let [isOpenCategorias, setIsOpenCategorias] = useState(false);
  let [isOpenColor, setIsOpenColor] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModalCategorias() {
    setIsOpenCategorias(false);
  }

  function openModalCategoiras() {
    setIsOpenCategorias(true);
  }

  function closeModalColores() {
    setIsOpenColor(false);
  }

  function openModalColores() {
    setIsOpenColor(true);
  }

  const { productos, getProductos } = useProductos();

  useEffect(() => {
    getProductos();
  }, []);

  const [idObtenida, setObtenerId] = useState(null);

  const handleID = (id) => setObtenerId(id);

  return (
    <div>
      <div className="bg-white w-full flex justify-between items-center ">
        <div className="flex">
          <Link
            to={"/productos"}
            className="bg-sky-100 px-8 text-[16px] py-4 text-sky-500 font-semibold cursor-pointer"
          >
            Productos
          </Link>
        </div>
        <div className="mx-5 z-[0] flex gap-2">
          <button className="text-sm font-semibold bg-green-500 py-2 px-5 rounded-2xl text-white group flex gap-3 items-center relative transition-all ease-linear duration-300 z-0">
            <Link
              to={"/colores"}
              className="transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            >
              Crear nuevo color
            </Link>
            <IoIosAddCircleOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
          </button>
          <Link
            to={"/categorias"}
            className="text-sm font-semibold bg-green-500 py-2 px-5 rounded-2xl text-white group flex gap-3 items-center relative transition-all ease-linear duration-300 z-0"
          >
            <span className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
              Crear categorias
            </span>
            <IoIosAddCircleOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
          </Link>
          <button className="text-sm font-semibold bg-green-500 py-2 px-5 rounded-2xl text-white group flex gap-3 items-center relative transition-all ease-linear duration-300 z-0">
            <Link
              to={"/crear-producto"}
              className="transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            >
              Crear nuevo producto
            </Link>
            <IoIosAddCircleOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
          </button>
        </div>
      </div>

      {productos.length === 0 && (
        <div className="flex flex-col gap-6 justify-center items-center p-10 bg-white w-1/3 mx-auto my-10 rounded-xl">
          <div>
            <ImFileEmpty className="text-6xl text-sky-500 m-auto my-2" />
            <h1 className="font-bold text-lg text-slate-500">
              No hay ningun producto cargado ahún, carga uno ahora
            </h1>
          </div>
          <div>
            <Link
              to={"/crear-producto"}
              className="bg-sky-500 text-white py-3 px-6 rounded-full text-sm font-semibold hover:shadow-md transition-all ease-linear flex gap-2 items-center"
              // to={"/crear-producto"}
            >
              Crear nuevo producto
              <BsFolderPlus className="text-2xl" />
            </Link>
          </div>
        </div>
      )}

      {productos.length === 0 && (
        <div className="flex justify-center w-full">
          <button
            className="bg-sky-500 rounded-full text-base px-5 py-3 text-white font-bold hover:shadow-lg transition-all"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Ver tutorial de como crear un perfil de aluminio
          </button>
          <dialog
            id="my_modal_1"
            className="modal w-full max-w-none" // Ancho completo para el modal
          >
            <div
              className="modal-box w-full py-0"
              style={{ maxWidth: "1000px" }}
            >
              <div className="modal-action">
                <form method="dialog">
                  {/* Botón para cerrar el diálogo */}
                  <button className="bg-gray-100 hover:bg-gray-200 transition-all py-3 px-3 rounded-full outline-none">
                    <IoClose className="text-2xl text-sky-500" />
                  </button>
                </form>
              </div>
              <div className="py-5">
                <h3 className="text-xl text-yellow-500 font-bold">
                  Mira el video tutorial de como crear un perfil de aluminio ✋
                </h3>
                <p className="text-sm mt-2 font-medium">
                  ¡Segui todos los pasos para crear tu primer producto!
                </p>

                <video className="h-full w-full rounded-lg mt-5" controls>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </dialog>
        </div>
      )}

      {productos.length > 0 && (
        <div className="flex flex-col gap-5 mx-10">
          <section className="py-10 grid grid-cols-3 gap-4">
            <article className="bg-white shadow-xl rounded-xl py-8 px-5 transition-all ease-linear flex justify-between items-center">
              <div className="flex flex-col items-end gap-4">
                <div className="bg-sky-100 py-2 px-3 rounded-xl">
                  <p className="text-xs  text-sky-700 font-bold">
                    Porcentaje de productos cargados
                  </p>
                </div>
                <div>
                  <p className="font-normal text-gray-600 text-base">
                    Productos cargados hasta el momento{" "}
                    <span className="font-bold text-sky-700 bg-sky-100 py-2 px-2 rounded-xl">
                      {100}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          </section>
          <div className="bg-white rounded-xl py-5 px-5 transition-all ease-linear flex gap-2 text-sm">
            <Link
              to={"/crear-producto"}
              className="bg-sky-500 font-semibold py-3 px-6 rounded-full text-white group flex gap-3 items-center relative transition-all"
            >
              <span className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                Crear nuevo producto
              </span>
              <BsFolderPlus className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
            </Link>
            <Link
              to={"/categorias"}
              className="bg-green-500/90 py-3 px-6 rounded-full text-white font-semibold group flex gap-3 items-center relative transition-all"
            >
              <span className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                Crear nuevas categorias
              </span>
              <IoFilterOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
            </Link>
            <Link
              to={"/colores"}
              className="bg-orange-500/90 py-3 px-6 rounded-full text-white font-semibold group flex gap-3 items-center relative transition-all"
            >
              <span className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                Crear nuevos colores
              </span>
              <IoFilterOutline className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 top-0 bottom-0 m-auto" />
            </Link>
          </div>

          <TableProducts
            handleID={handleID}
            openModal={openModal}
            productos={productos}
          />
        </div>
      )}
      <ModalFormProducts
        idObtenida={idObtenida}
        isOpen={isOpen}
        closeModal={closeModal}
      />
      <ModalCategorias
        isOpen={isOpenCategorias}
        closeModal={closeModalCategorias}
        idObtenida={idObtenida}
      />
      <ModalColores
        isOpen={isOpenColor}
        closeModal={closeModalColores}
        idObtenida={idObtenida}
      />
    </div>
  );
}
