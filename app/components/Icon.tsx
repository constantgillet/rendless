import { RecipeVariantProps, css, cva, cx } from "styled-system/css";
import { SVGProps } from "react";

export type IconName =
  | "text"
  | "shape"
  | "cursor"
  | "lock-open"
  | "corner-top-left"
  | "corner-top-right"
  | "corner-bottom-left"
  | "corner-bottom-right"
  | "text-align-center"
  | "text-align-left"
  | "text-align-right"
  | "chevron-down"
  | "chevron-left"
  | "settings"
  | "home"
  | "templates"
  | "data-bar-horizontal"
  | "settings"
  | "info"
  | "checkmark-circle"
  | "braces-variable"
  | "copy"
  | "rendless"
  | "rotate-left"
  | "text-align-justify"
  | "text-case-uppercase"
  | "text-case-title"
  | "text-case-lowercase";

export const iconStyle = cva({
  base: {
    display: "inline-flex",
  },
  variants: {
    size: {
      "2xs": { width: "10px", height: "10px" },
      xs: { width: "12px", height: "12px" },
      sm: { width: "14px", height: "14px" },
      md: { width: "16px", height: "16px" },
      lg: { width: "18px", height: "18px" },
      xl: { width: "20px", height: "20px" },
      "2xl": { width: "24px", height: "24px" },
      "3xl": { width: "28px", height: "28px" },
      "4xl": { width: "32px", height: "32px" },
      "5xl": { width: "40px", height: "40px" },
      "6xl": { width: "48px", height: "48px" },
      "7xl": { width: "56px", height: "56px" },
      "8xl": { width: "64px", height: "64px" },
    },
    spin: {
      true: {
        animation: "spin 1.3s linear infinite",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ButtonVariants = RecipeVariantProps<typeof iconStyle>;

export type IconProps = SVGProps<SVGSVGElement> &
  ButtonVariants & { name: IconName };

export const Icon = (props: IconProps) => {
  return (
    <svg
      {...props}
      className={cx(
        iconStyle(props),
        css({ color: "currentcolor" }),
        props.className
      )}
    >
      <use href={`/images/icons-sprite.svg#${props.name}`}></use>
    </svg>
  );
};
