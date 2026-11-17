import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/montserrat/wght.css";
import "./index.css";
import App from "./App.jsx";
import { iniciarDemonstracao } from "./demo/iniciarDemonstracao";

const raiz = createRoot(document.getElementById("root"));

iniciarDemonstracao()
  .then(() => {
    raiz.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  })
  .catch(() => {
    raiz.render(
      <p role="alert" className="p-8 text-center text-texto-suave">
        Não foi possível iniciar a demonstração neste navegador. Atualize a página ou use um navegador
        recente com o armazenamento local liberado.
      </p>,
    );
  });
