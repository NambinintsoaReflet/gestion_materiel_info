import { HashRouter, Route, Routes } from "react-router-dom";
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
import Rapport from "./pages/Rapport";
import Parametre from "./pages/Parametre";
import Aide from "./pages/Aide";
import Achat from "./pages/DA/Achat";
import LayoutAchat from "./pages/DA/LayoutAchat";
import AjoutAchat from "./pages/DA/AjoutAchat";
import ProtectedRoute from "./components/ProtectedRoute";
import Personnel from "./pages/Personnels/Personnel";
import LayoutPersonnel from "./pages/Personnels/LayoutPersonnel";
import AjoutPersonnel from "./pages/Personnels/AjoutPersonnel";
import AchatView from "./pages/DA/AchatView";
import ImpressionDA from "./pages/DA/impressionDA";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <HashRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/materiels" element={<LayoutMateriel />}>
                    <Route index element={<Materiel />} />
                    <Route
                      path="/materiels/ajout"
                      element={<AjoutMateriel />}
                    />
                  </Route>
                  <Route path="/achat" element={<LayoutAchat />}>
                    <Route index element={<Achat />} />
                    <Route path="/achat/ajout" element={<AjoutAchat />} />
                     <Route path="/achat/:id" element={<AchatView />} />

                  </Route>
                  <Route path="/suivie" element={<Suivie />} />
                  <Route path="/personnel" element={<LayoutPersonnel />}>
                    <Route index element={<Personnel />} />
                    <Route
                      path="/personnel/ajout"
                      element={<AjoutPersonnel />}
                    />
                  </Route>
                  <Route path="/reports" element={<Rapport />} />
                  <Route path="/settings" element={<Parametre />} />
                  <Route path="/help" element={<Aide />} />
                </Route>
               <Route path="/achat/:id/imprimer" element={<ImpressionDA />} />
              </Route>
            </Routes>
          </QueryClientProvider>
        </AuthProvider>
      </HashRouter>
    </>
  );
}

export default App;
