import type { ComponentType } from "react";
import Intro from "@/app/photo/cases/_intro/_intro";
import Case1 from "@/app/photo/cases/case1/case1";

export type CaseProps = {
    width: number;
    height: number;
};

export const CASES: ComponentType<CaseProps>[] = [
    Intro,
    Case1
];

export const CASES_COUNT = CASES.length;