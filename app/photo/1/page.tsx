import CasePageShell from "@/components/casePageShell";
import Case1Bento from "@/components/case1Bento";

export default function Case1Page() {
    return (
        <CasePageShell
            title="Северные горы"
            description="Экспедиция в Хибины, зима 2024. Съёмка на рассвете, минус 27."
            sharedPhotos={["mountains", "forest", "desert"]}
        >
            <Case1Bento />
        </CasePageShell>
    );
}