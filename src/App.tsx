import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./hooks/useAuth";
import AppRouter from "./Router";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Toaster />
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
