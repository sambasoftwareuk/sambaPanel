
export const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
};
