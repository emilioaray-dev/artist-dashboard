import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  AnimatedElement,
  FadeInAnimation,
  SlideInAnimation,
  ScaleInAnimation,
  StaggerAnimation,
} from "@/components/motion/AnimationUtils";

describe("AnimationUtils", () => {
  it("renders children with fadeIn animation by default", () => {
    const { getByText } = render(
      <AnimatedElement>
        <span>Hello</span>
      </AnimatedElement>,
    );
    expect(getByText("Hello")).toBeInTheDocument();
  });

  it("renders with slideIn animation type", () => {
    const { getByText } = render(
      <AnimatedElement animationType="slideIn">
        <span>Slide content</span>
      </AnimatedElement>,
    );
    expect(getByText("Slide content")).toBeInTheDocument();
  });

  it("renders with scaleIn animation type", () => {
    const { getByText } = render(
      <AnimatedElement animationType="scaleIn">
        <span>Scale content</span>
      </AnimatedElement>,
    );
    expect(getByText("Scale content")).toBeInTheDocument();
  });

  it("renders with stagger animation type", () => {
    const { getByText } = render(
      <AnimatedElement animationType="stagger">
        <span>Stagger content</span>
      </AnimatedElement>,
    );
    expect(getByText("Stagger content")).toBeInTheDocument();
  });

  it("FadeInAnimation renders correctly", () => {
    const { getByText } = render(
      <FadeInAnimation>
        <span>Fade</span>
      </FadeInAnimation>,
    );
    expect(getByText("Fade")).toBeInTheDocument();
  });

  it("SlideInAnimation renders correctly", () => {
    const { getByText } = render(
      <SlideInAnimation>
        <span>Slide</span>
      </SlideInAnimation>,
    );
    expect(getByText("Slide")).toBeInTheDocument();
  });

  it("ScaleInAnimation renders correctly", () => {
    const { getByText } = render(
      <ScaleInAnimation>
        <span>Scale</span>
      </ScaleInAnimation>,
    );
    expect(getByText("Scale")).toBeInTheDocument();
  });

  it("StaggerAnimation renders correctly", () => {
    const { getByText } = render(
      <StaggerAnimation>
        <span>Stagger</span>
      </StaggerAnimation>,
    );
    expect(getByText("Stagger")).toBeInTheDocument();
  });
});
