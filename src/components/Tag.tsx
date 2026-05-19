const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full bg-tag-bg text-tag-text px-3 py-1 text-xs font-mono font-bold tracking-wide">
    {children}
  </span>
);

export default Tag;
