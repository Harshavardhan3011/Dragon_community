"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformanceStore } from "@/store/performance-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const quality = usePerformanceStore((state) => state.quality);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Detect mobile touch devices to disable custom cursor
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || prefersReducedMotion || quality === "low") {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Instantly position the primary cursor dot
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track when hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button";
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    // Setup Canvas Loop for Trail
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize tail coordinates
    const maxTrailPoints = quality === "high" ? 18 : 8;

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Interpolate points towards mouse position
      const head = mouseRef.current;
      pointsRef.current.unshift({ ...head });

      if (pointsRef.current.length > maxTrailPoints) {
        pointsRef.current.pop();
      }

      const points = pointsRef.current;
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          // Smooth bezier curve coordinates
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }

        // Style the trail
        ctx.strokeStyle = "rgba(0, 255, 102, 0.4)";
        ctx.lineWidth = isHovered ? 8 : 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      animId = requestAnimationFrame(drawTrail);
    };
    drawTrail();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [quality, prefersReducedMotion, isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* Background Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[190] w-full h-full"
      />

      {/* Target Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-dragon-neon z-[200] pointer-events-none transition-all duration-150 ${
          isHovered ? "scale-[2.5] bg-dragon-light-green shadow-lg shadow-dragon-neon/30" : ""
        } ${isClicking ? "scale-[0.8]" : ""}`}
      />
    </>
  );
}
