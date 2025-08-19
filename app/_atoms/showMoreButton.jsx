export const ShowMoreButton = ({ showAll, hiddenCount, onClick }) => {
  if (hiddenCount <= 0) return null;

  return (
    <button
      onClick={onClick}
      className="text-blue-600 hover:underline py-3"
    >
      {showAll ? "Show less" : `Show ${hiddenCount} more`}
    </button>
  );
};
