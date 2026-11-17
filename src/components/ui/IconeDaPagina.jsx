function IconeDaPagina({ icone: Icone }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-marca-600/15 text-marca-400 ring-1 ring-inset ring-marca-500/25 sm:size-14">
      <Icone size={26} aria-hidden="true" />
    </span>
  );
}

export default IconeDaPagina;
