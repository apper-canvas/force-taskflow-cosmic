const SectionHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-surface-900">{title}</h2>
        {subtitle && <p className="text-surface-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default SectionHeader;