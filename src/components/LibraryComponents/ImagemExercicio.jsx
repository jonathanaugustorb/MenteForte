import { useState } from "react";
import { ImageOff } from "lucide-react";

function ImagemExercicio({ src, alt, altura = "h-40", ajuste = "object-cover object-[50%_30%]" }) {
  const [urlComErro, setUrlComErro] = useState(null);

  if (!src || urlComErro === src) {
    return (
      <div className={`${altura} flex w-full items-center justify-center bg-fundo text-texto-fraco`}>
        <ImageOff size={32} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`${altura} w-full overflow-hidden bg-fundo`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setUrlComErro(src)}
        className={`h-full w-full ${ajuste}`}
      />
    </div>
  );
}

export default ImagemExercicio;
