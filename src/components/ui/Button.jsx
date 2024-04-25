export function Button({ onClick, children }) {
  return (
    <button
      className="text-sky-700 uppercase hover:shadow-md transition-all hover:bg-sky-500 hover:text-white bg-sky-100 px-4 py-3 rounded-xl my-2 disabled:bg-violet-300 flex gap-2 items-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
