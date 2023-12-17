import type { RecipeVariantProps } from "~/styled-system/css";
import { css, cva, cx } from "styled-system/css";
import { SVGAttributes, SVGProps } from "react";

export type IconName =
  | "lock"
  | "github"
  | "chevron-down"
  | "chevron-up"
  | "chevron-right"
  | "chevron-left"
  | "refresh-ccw"
  | "loader"
  | "git-branch"
  | "git-commit"
  | "user"
  | "code"
  | "check"
  | "plus"
  | "alert-circle"
  | "alert-triangle"
  | "alert-octagon"
  | "book-open";

export const iconStyle = cva({
  base: {
    display: "inline-flex",
  },
  variants: {
    size: {
      sm: { width: "12px", height: "12px" },
      md: { width: "14px", height: "14px" },
      lg: { width: "16px", height: "16px" },
      xl: { width: "18px", height: "18px" },
      "2xl": { width: "20px", height: "20px" },
      "3xl": { width: "24px", height: "24px" },
      "4xl": { width: "28px", height: "28px" },
      "5xl": { width: "32px", height: "32px" },
      "6xl": { width: "36px", height: "36px" },
      "7xl": { width: "40px", height: "40px" },
      "8xl": { width: "44px", height: "44px" },
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

export type IconProps = ButtonVariants;

export const Icon = (props: ButtonVariants) => {
  return (
    <svg
      {...props}
      className={cx(
        iconStyle({ size: props.size, spin: props.spin }),
        css({ color: "currentcolor" }),
        props.className
      )}
    >
      <use href={`/images/icons-sprite.svg#${name}`}></use>
    </svg>
  );
};
