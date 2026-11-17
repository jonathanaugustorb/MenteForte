function RodapeProgress() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
        <div className="lg:w-2/5">
          <span className="text-xs font-semibold tracking-wider text-texto-fraco uppercase">
            CALCULADORAS PESSOAIS // CONCEITOS AO LADO DE CADA NÚMERO
          </span>
        </div>

        <div className="lg:w-3/5">
          <p className="text-sm text-texto-suave wrap-break-word">
            <span className="font-semibold text-white">Como usar? </span>
            Atualize os números a cada sessão de treino. Para ajustes finos,
            consulte um profissional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RodapeProgress;
