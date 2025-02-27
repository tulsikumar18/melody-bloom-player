
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "@/context/PlayerContext";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Playlist from "./pages/Playlist";
import Library from "./pages/Library";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Upload from "./pages/Upload";
import Auth from "./pages/Auth";

// Components
import Sidebar from "./components/layout/Sidebar";
import MobileNavbar from "./components/layout/MobileNavbar";
import NowPlaying from "./components/music/NowPlaying";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PlayerProvider>
          <BrowserRouter>
            <div className="flex h-full dark">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/playlist/:id" element={<Playlist />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <NowPlaying />
                <MobileNavbar />
              </div>
            </div>
          </BrowserRouter>
        </PlayerProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
