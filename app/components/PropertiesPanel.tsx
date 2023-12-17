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
        padding: "var(--space-3)",
        borderLeft: "1px solid var(--gray-a5)",
        position: "absolute",
        bottom: 0,
        right: 0,
        height: "calc(100vh - 48px)",
      })}
    >
      <PanelGroup title="Position">
        <Grid columns="2" gap="2" width="auto">
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
        <Flex gap={"2"}>
          <Grid columns="2" gap="2" width="auto">
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
          <IconButton variant="soft" highContrast>
            v
          </IconButton>
        </Flex>
      </PanelGroup>
      <Separator className={css({ w: "100%" })} />
      <PanelGroup title="Fill">
        <Grid columns="2" gap="2" width="auto">
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
        <Flex gap={"2"}>
          <Grid columns="2" gap="2" width="auto">
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
          <IconButton variant="soft" highContrast>
            v
          </IconButton>
        </Flex>
      </PanelGroup>
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
        py: "24px",
      })}
    >
      <Text size="3" weight="medium">
        {props.title}
      </Text>
      <Grid columns="1" gap="2" width="auto">
        {props.children}
      </Grid>
    </div>
  );
};
