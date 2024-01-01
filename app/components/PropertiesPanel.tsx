import {
  Box,
  IconButton,
  TextField,
  Text,
  Grid,
  Flex,
  Separator,
} from "@radix-ui/themes";
import { css } from "styled-system/css";

export const PropertiesPanel = () => {
  return (
    <aside
      className={css({
        w: 244,
        backgroundColor: "var(--color-panel)",
        borderColor: "var(--global-color-border, currentColor)",
        padding: "var(--space-4)",
        borderLeft: "1px solid var(--gray-a5)",
      })}
    >
      <PanelGroup title="Position & size">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot
                className={css({
                  color: "var(--color-text-muted)",
                  display: "flex",
                  alignItems: "center",
                })}
              >
                <div>x</div>
              </TextField.Slot>
              <TextField.Input placeholder="Horizontal" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>y</TextField.Slot>
              <TextField.Input placeholder="Vertical" />
            </TextField.Root>
          </Box>
        </Grid>
        <Flex gap="4">
          <Grid columns="2" gap="4" width="auto">
            <Box>
              <TextField.Root>
                <TextField.Slot>w</TextField.Slot>
                <TextField.Input placeholder="width" />
              </TextField.Root>
            </Box>
            <Box>
              <TextField.Root>
                <TextField.Slot>h</TextField.Slot>
                <TextField.Input placeholder="height" />
              </TextField.Root>
            </Box>
          </Grid>
        </Flex>
      </PanelGroup>
      <Separator
        className={css({ w: "100%!important", marginY: "20px", mx: "-16px" })}
      />
      <PanelGroup title="Background">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>x</TextField.Slot>
              <TextField.Input placeholder="Horizontal" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>y</TextField.Slot>
              <TextField.Input placeholder="Vertical" />
            </TextField.Root>
          </Box>
        </Grid>
      </PanelGroup>
      <Separator
        className={css({ w: "100%!important", marginY: "20px", mx: "-16px" })}
      />
      <PanelGroup title="Borders">
        <Grid columns="2" gap="4" width="auto">
          <Box>
            <TextField.Root>
              <TextField.Slot>x</TextField.Slot>
              <TextField.Input placeholder="Horizontal" />
            </TextField.Root>
          </Box>
          <Box>
            <TextField.Root>
              <TextField.Slot>y</TextField.Slot>
              <TextField.Input placeholder="Vertical" />
            </TextField.Root>
          </Box>
        </Grid>
      </PanelGroup>
      <Separator
        className={css({ w: "100%!important", marginY: "20px", mx: "-16px" })}
      />
    </aside>
  );
};

type PanelGroupProps = {
  title: string;
  children: React.ReactNode;
};

const PanelGroup = (props: PanelGroupProps) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      })}
    >
      <Text size="2" className={css({})}>
        {props.title}
      </Text>
      <Grid columns="1" gap="4" width="auto">
        {props.children}
      </Grid>
    </div>
  );
};
