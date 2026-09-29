import type { ComponentType } from "react";
import Intro from "./_intro/_intro";
import Case1 from "./case1/case1";
import Case2 from "./case2/case2";
import Case3 from "./case3/case3";
import Case4 from "./case4/case4";


export type CaseProps = {
    width: number;
    height: number;
};

export const CASES: ComponentType<CaseProps>[] = [
    Intro,
    Case1,
    Case2,
    Case3,
    Case4
];

export const CASES_COUNT = CASES.length;