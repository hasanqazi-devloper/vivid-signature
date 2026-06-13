import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LandingPage from "./LandingPage.jsx";
import AdminPortal from "./AdminPortal.jsx";
import SecureLoginPortal from "./SecureLoginPortal.jsx";
import StripeSuccessScreen from "./StripeSuccessScreen.jsx";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { LayoutGrid, Lock, PenTool, ShieldCheck, User } from "lucide-react";

function SuiteNavigation({ currentView, onNavigate }) {
  const { currentUser, hasPaidSubscription } = useAuth();

  const tabs = [
    { id: "landing", label: "Origin", icon: LayoutGrid, locked: false },
    // Admin Portal only visible to paid subscribers / owner / privileged
    ...(hasPaidSubscription ? [{ id: "admin", label: "Admin Portal", icon: ShieldCheck, locked: false }] : []),
    { id: "builder", label: "Builder", icon: PenTool, locked: !currentUser },
  ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-auto px-2 max-w-[calc(100vw-16px)]">
      <div className="glass-panel-strong bg-[#051429]/60 backdrop-blur-2xl border border-[#dcc49b]/30 rounded-2xl p-1.5 sm:p-2 flex items-center gap-2 sm:gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-[#dcc49b]/20">
        <div className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300 whitespace-nowrap min-w-0 sm:min-w-[110px] justify-center ${
                  isActive
                    ? "bg-[#dcc49b] text-[#051429] shadow-[0_0_20px_rgba(220,196,155,0.4)] scale-105"
                    : "text-[#869399] hover:text-[#dcc49b] hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? "text-[#051429]" : "text-[#dcc49b]/60"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.locked && (
                  <Lock className="w-3 h-3 flex-shrink-0 opacity-60" />
                )}
              </button>
            );
          })}
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-2 pl-3 border-l border-white/10 pr-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#dcc49b] to-[#b8965a] flex items-center justify-center shadow border border-[#dcc49b]/30">
              <User className="w-3 h-3 text-[#051429]" />
            </div>
            <div className="hidden md:block">
              <div className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Secured</div>
              <div className="text-[9px] text-white/80 font-bold max-w-[160px]">{currentUser.email.split('@')[0]}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppRouter() {
  // Detect Stripe redirect params on load
  const params = new URLSearchParams(window.location.search);
  const stripeSuccess = params.get("success") === "true";
  const stripeCanceled = params.get("canceled") === "true";

  const hasBypass = !!localStorage.getItem('wcs_secure_bypass');
  const [view, setView] = useState(
    stripeSuccess ? "stripe-success" : hasBypass ? "builder" : "landing"
  ); // 'landing' | 'builder' | 'admin' | 'secure-login' | 'stripe-success'
  const [intendedView, setIntendedView] = useState("landing");
  const { currentUser, hasPaidSubscription } = useAuth();

  const handleGoto = (targetView) => {
    console.log("Navigating to:", targetView);
    setView(targetView);
  };

  const renderContent = () => {
    if (view === "secure-login") {
      if (currentUser) {
        // If auth resolves while on this page, redirect automatically
        setTimeout(() => setView(intendedView || "landing"), 0);
        return null;
      }
      return <SecureLoginPortal onBack={() => setView("landing")} />;
    }

    if (view === "admin") {
      if (!currentUser) {
        setTimeout(() => {
          setIntendedView("admin");
          setView("secure-login");
        }, 0);
        return null;
      }
      if (!hasPaidSubscription) {
        // No paid subscription — redirect back to landing
        setTimeout(() => setView("landing"), 0);
        return null;
      }
      return <AdminPortal onBack={() => handleGoto("landing")} />;
    }

    if (view === "stripe-success") {
      // Clear the URL params so a refresh doesn't re-trigger
      window.history.replaceState({}, document.title, window.location.pathname);
      return (
        <StripeSuccessScreen onContinue={() => handleGoto("builder")} />
      );
    }

    if (view === "builder") {
      return (
        <App
          onBackToLanding={() => handleGoto("landing")}
          onRequestLogin={() => {
            setIntendedView("builder");
            setView("secure-login");
          }}
        />
      );
    }

    return (
      <LandingPage
        onEnterBuilder={() => handleGoto("builder")}
        onOpenAdmin={() => handleGoto("admin")}
        onNeedLogin={() => {
          setIntendedView("landing");
          setView("secure-login");
        }}
      />
    );
  };

  return (
    <>
      {view !== "stripe-success" && (
        <SuiteNavigation currentView={view} onNavigate={handleGoto} />
      )}
      {renderContent()}
    </>
  );
}

function Root() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
