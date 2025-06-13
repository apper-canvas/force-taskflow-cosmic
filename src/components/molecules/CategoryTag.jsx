const CategoryTag = ({ categoryName }) => {
  if (!categoryName) return null;
  return (
    &lt;span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full">
      {categoryName}
    &lt;/span>
  );
};

export default CategoryTag;