import { useEffect } from "react";
import { useAnimationStore } from "@/store/animation-store";

export function useScrollProgress() {
  const setScrollProgress = useAnimationStore((state) => state.setScrollProgress);
  const setActiveSection = useAnimationStore((state) => state.setActiveSection);

  useEffect(() => {
    const sections = ["hero", "stats", "video", "categories", "community", "cta"];

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(progress);

      // Determine which section is currently active
      let active = "hero";
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            active = id;
            break;
          }
        }
      }
      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress, setActiveSection]);
}
