import { ReactNode } from "react";
import { css, cva, RecipeVariantProps } from "styled-system/css";

const style = cva({
  base: {
    display: "flex",
    gap: "1",
    justifyContent: "space-between",
  },
  variants: {
    direction: {
      row: { flexDirection: "row", alignItems: "center" },
      column: { flexDirection: "column", alignItems: "flex-start" },
    },
  },
  defaultVariants: {
    direction: "row",
  },
});

type PropertyLineProps = RecipeVariantProps<typeof style> & {
  label: string;
  direction?: "row" | "column";
  children: ReactNode;
};
export const PropertyLine = (props: PropertyLineProps) => {
  const { direction } = props;

  return (
    <div className={style({ direction })}>
      <label className={css({ color: "var(--gray-a11)", fontSize: "14px" })}>
        {props.label}
      </label>
      <div>{props.children}</div>
    </div>
  );
};
