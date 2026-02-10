import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Welcome from "./pages/Welcome";
import Game from "./pages/Game";
import ParentDashboard from "./pages/ParentDashboard";
import { initAudioFromUserGesture, playClickSfx } from "@/lib/sfx";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Welcome} />
      <Route path={"/game"} component={Game} />
      <Route path={"/parent"} component={ParentDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <div
            onPointerDownCapture={(e) => {
              void initAudioFromUserGesture();
              const t = e.target as HTMLElement | null;
              if (!t) return;
              // déclenche uniquement pour les interactions type bouton (enfantin, pas envahissant)
              const hit = t.closest?.("button, [role=\"button\"], a");
              if (!hit) return;
              // évite inputs/textarea/select
              if (t.closest?.("input, textarea, select")) return;
              playClickSfx();
            }}
          >
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;