import { useState, } from "react";
import './App.css'
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";

const App: React.FC = () => {
  const [idInstance, setIdInstance] = useState<string>(localStorage.getItem("idInstance") || "");
  const [apiTokenInstance, setApiTokenInstance] = useState<string>(localStorage.getItem("apiTokenInstance") || "");

  const handleLogin = (idInstance: string, apiTokenInstance: string) => {
    setIdInstance(idInstance);
    setApiTokenInstance(apiTokenInstance);
    localStorage.setItem("idInstance", idInstance);
    localStorage.setItem("apiTokenInstance", apiTokenInstance);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {idInstance && apiTokenInstance ? (
        <Chat idInstance={idInstance} apiTokenInstance={apiTokenInstance} />
      ) : (
        <Login
          idInstance={idInstance}
          apiTokenInstance={apiTokenInstance}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;
