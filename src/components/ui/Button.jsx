export function Button({ onClick, children }) {
  return (
    <button
      className="text-white px-6 hover:bg-blue-500 transition-all text-sm hover:shadow-md py-2 rounded-full bg-primary font-bold flex gap-2 items-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
