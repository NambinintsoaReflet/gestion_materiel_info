import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import { AuthProvider } from "./Context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./pages/Layout";
import Materiel from "./pages/Materiels/Materiel";
import LayoutMateriel from "./pages/Materiels/LayoutMateriel";
import AjoutMateriel from "./pages/Materiels/AjoutMateriel";
import Suivie from "./pages/Materiels/Suivie";
import Personnel from "./pages/Personnel";
import Rapport from "./pages/Rapport";
import Parametre from "./pages/Parametre";
import Aide from "./pages/Aide";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/materiels" element={<LayoutMateriel />}>
                  <Route index element={<Materiel />} />
                  <Route path="/materiels/ajout" element={<AjoutMateriel />} />
                </Route>
                <Route path="/suivie" element={<Suivie />} />
                <Route path="/personnel" element={<Personnel />} />
                <Route path="/reports" element={<Rapport />} />
                <Route path="/settings" element={<Parametre />} />
                <Route path="/help" element={<Aide />} />
              </Route>
            </Routes>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
