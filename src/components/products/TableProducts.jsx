import { useState } from "react";
import { useProductos } from "../../context/ProductosContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Importar los iconos de flecha
import { IoIosMore } from "react-icons/io";
import { Link } from "react-router-dom";

export const TableProducts = ({ productos }) => {
  const { deleleteProducto } = useProductos();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setCurrentPage(1);
    setSearchTerm(event.target.value);
  };

  const filteredProducts = currentProducts.filter((product) =>
    product.detalle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(productos.length / productsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = Math.min(currentPage + 4, totalPages); // Mostrar hasta 5 páginas
    const startPage = Math.max(1, maxPages - 4); // Comenzar desde la página adecuada
    for (let i = startPage; i <= maxPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  return (
    <div className="my-6">
      <input
        type="text"
        placeholder="Buscar producto por codigo o detalle..."
        value={searchTerm}
        onChange={handleSearch}
        className="block px-4 py-2.5 mb-3 w-1/3 rounded-xl shadow-md transition-all outline-none focus:ring-sky-500 focus:border-sky-500"
      />
      <div className="transition-all ease-linear rounded-2xl mt-6">
        <table className="min-w-full divide-y-[1px] divide-slate-200 bg-white text-sm rounded-2xl">
          <thead>
            <tr>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Codigo
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Detalle
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Color
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Categoria
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Kg Estimativo
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Stock
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Stock Minimo
              </th>
              <th className="text-left px-4 py-4 font-semibold text-sky-700 uppercase text-sm">
                Stock Máximo
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredProducts.map((p) => (
              <tr className="hover:bg-gray-100/50 cursor-pointer" key={p._id}>
                <td className="px-4 py-4 font-medium text-gray-900 uppercase text-sm">
                  {p.codigo}
                </td>
                <td className="px-4 py-4 text-gray-700 uppercase font-light text-sm">
                  {p.detalle}
                </td>
                <td className="px-4 py-4 text-gray-700 uppercase font-light text-sm">
                  {p.color}
                </td>
                <td className="px-4 py-4 text-gray-700 uppercase font-light text-sm">
                  {p.categoria}
                </td>
                <td className="px-4 py-4 text-gray-700 uppercase font-light text-sm">
                  {p.kg_barra_estimado}
                </td>
                <td className="px-4 py-4 text-sky-700 font-bold uppercase text-sm flex">
                  <p className="py-2 px-2.5 bg-sky-500/10 rounded-xl">
                    {p.stock}
                  </p>
                </td>
                <td className="px-4 py-4 text-sky-700 font-bold uppercase text-sm">
                  {p.stock_minimo}
                </td>
                <td className="px-4 py-4 text-sky-700 font-bold uppercase text-sm">
                  {p.stock_maximo}
                </td>
                <td className="px-4 py-4 text-gray-700 uppercase font-light text-sm">
                  <div className="dropdown dropdown-left drop-shadow-lg">
                    <div
                      tabIndex={0}
                      role="button"
                      className="py-2 px-2 transition-all hover:bg-sky-500 hover:text-white border-none rounded-full"
                    >
                      <IoIosMore className="text-2xl" />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link
                          className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                          to={`/editar-producto/${p._id}`}
                          // onClick={() => {
                          //   handleID(p._id), openModal();
                          // }}
                        >
                          Editar el producto
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                          to={`/producto/${p._id}`}
                          // onClick={() => {
                          //   handleID(p._id), openModal();
                          // }}
                        >
                          Ver el producto
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => deleleteProducto(p._id)}
                          type="button"
                          className="capitalize hover:bg-sky-500 hover:text-white font-semibold text-gray-700"
                        >
                          Eliminar el producto
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
      <div className="mt-3 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft />
        </button>
        <ul className="flex space-x-2">
          {getPageNumbers().map((number) => (
            <li key={number} className="cursor-pointer">
              <button
                onClick={() => paginate(number)}
                className={`${
                  currentPage === number ? "bg-white" : "bg-gray-300"
                } py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-white py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};
