import { Suspense } from "react";
import BerkantDuralPage from "@/components/BerkantDuralPage";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BerkantDuralPage />
        </Suspense>
    );
}
