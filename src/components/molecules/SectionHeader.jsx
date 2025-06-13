const SectionHeader = ({ title, subtitle, children }) => {
  return (
    &lt;div className="flex items-center justify-between mb-6">
      &lt;div>
        &lt;h2 className="text-2xl font-heading font-bold text-surface-900">{title}&lt;/h2>
        {subtitle && &lt;p className="text-surface-600 mt-1">{subtitle}&lt;/p>}
      &lt;/div>
      {children}
    &lt;/div>
  );
};

export default SectionHeader;