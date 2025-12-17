"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useUIStore } from "@/hooks/use-ui-store";

export function WelcomeToast() {
  const { isReducedMotion } = useUIStore();
  const hasShownToast = useRef(false);
  const prevReducedMotion = useRef<boolean | null>(null);

  useEffect(() => {
    if (hasShownToast.current) return;
    hasShownToast.current = true;
    
    setTimeout(() => {
      const shouldShowReducedMessage = isReducedMotion;

      const hasVisited = localStorage.getItem("has-visited-portfolio");
      
      let title = "Welcome!";
      let message = "Hello! Greetings on my portfolio. Feel free to explore and welcome to contact me.";

      if (hasVisited) {
          title = "Welcome back!";
          message = "Hello, you visited us again! I'm happy to see you.";
      } else {
          localStorage.setItem("has-visited-portfolio", "true");
      }
      
      if (shouldShowReducedMessage) {
        toast.info(title, {
          description: `${message} I noticed you prefer reduced motion. You can enable animations by clicking the lightning icon in the navbar.`,
          duration: 8000,
        });
      } else {
        toast.success(title, {
          description: message,
          duration: 5000,
        });
      }
    }, 100);
  }, []); 

  useEffect(() => {
    if (prevReducedMotion.current === null) {
      prevReducedMotion.current = isReducedMotion;
      return;
    }
    if (prevReducedMotion.current === true && isReducedMotion === false) {
      const duration =  1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
      }, 250);
      
      toast.success("Animations Enabled!", {
        description: "Enjoy the experience! Page will reload in 3 seconds...",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    prevReducedMotion.current = isReducedMotion;
  }, [isReducedMotion]);

  return null;
}
