"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, redirects to login if not authenticated
  redirectTo?: string; // Where to redirect if not authenticated
}

/**
 * Higher-order component that protects routes based on authentication status
 */
export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    // If authentication is required and user is not authenticated
    if (requireAuth && !token) {
      router.push(redirectTo);
    }
    
    // If authentication is NOT required but user IS authenticated (e.g., login page)
    if (!requireAuth && token) {
      router.push('/tasks'); // Redirect authenticated users away from login/signup
    }
  }, [requireAuth, redirectTo, router]);
  
  const token = localStorage.getItem('access_token');
  
  // If user is unauthenticated and auth is required, don't render children
  if (requireAuth && !token) {
    return null; // The redirect effect will handle navigation
  }
  
  // If user is authenticated and auth is not required, don't render children
  if (!requireAuth && token) {
    return null; // The redirect effect will handle navigation
  }
  
  // Render children if all conditions are met
  return <>{children}</>;
}