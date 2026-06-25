"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingState from "@/app/components/LoadingState";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Cast for Clerk's metadata structure containing 'roles'
  const publicMetadata = user?.publicMetadata as { roles?: string | string[] } | undefined;
  const roles = publicMetadata?.roles;

  // Verify if ADMIN is in the roles array or is equal to the roles string
  const isAdmin = Array.isArray(roles)
    ? roles.some((r) => r.toUpperCase() === "ADMIN")
    : roles?.toUpperCase() === "ADMIN";

  useEffect(() => {
    // If Clerk is done loading and the user is not logged in, redirect them
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <LoadingState />;
  }

  // If user is not logged in or doesn't have the ADMIN role, block dashboard render
  if (!isSignedIn || !isAdmin) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-brand-beige/30 p-8 min-h-[calc(100vh-4rem)] select-none">
        <div className="bg-white/80 border border-brand-sand/50 shadow-xs rounded-xl p-8 max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-brand-forest">Acceso Restringido</h2>
            <p className="text-sm text-zinc-500 leading-relaxed text-balance">
              No tienes permisos de administración para visualizar este panel. Esta sección está reservada para administradores de ReadCycle.
            </p>
          </div>
          
          <button
            onClick={() => router.push("/")}
            className="w-full inline-flex items-center justify-center bg-brand-forest hover:bg-brand-sage text-brand-beige rounded-full font-semibold text-sm h-11 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
