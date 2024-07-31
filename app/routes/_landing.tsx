import { Badge, Button, SegmentedControl } from "@radix-ui/themes";
import {
	type LoaderFunctionArgs,
	type MetaFunction,
	redirect,
} from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import { css } from "styled-system/css";
import { container, grid, gridItem } from "styled-system/patterns";
import CookieBanner from "~/components/CookieBanner";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import * as m from "~/paraglide/messages";

export default function LandingLayout() {
	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
}
