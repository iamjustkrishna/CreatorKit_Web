// Starts the show: 3D particles fly in from dust and the hero entrance plays.
// Called once — from the intro gate, or straight away for returning visitors.

import gsap from "gsap";
import { playHeroIntro } from "../motion/choreo";
import { getBoot, setBoot } from "./boot";
import { scroll } from "./scroll";
import { story } from "./story";

export function startExperience() {
  if (getBoot().entered) return;
  setBoot({ entered: true, gateOpen: false });
  try {
    sessionStorage.setItem("ck-entered", "1");
  } catch {
    /* storage blocked */
  }
  scroll.lenis?.start();
  document.documentElement.classList.remove("gate-open");
  gsap.to(story, { intro: 1, duration: 2.8, ease: "power3.out" });
  playHeroIntro();
}
