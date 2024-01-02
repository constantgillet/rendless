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
  | "corner-bottom-right";

export const iconStyle = cva({
  base: {
    display: "inline-flex",
  },
  variants: {
    size: {
      xs: { width: "12px", height: "12px" },
      sm: { width: "14px", height: "14px" },
      md: { width: "16px", height: "16px" },
      lg: { width: "18px", height: "18px" },
      xl: { width: "20px", height: "20px" },
      "2xl": { width: "24px", height: "24px" },
      "3xl": { width: "28px", height: "28px" },
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
