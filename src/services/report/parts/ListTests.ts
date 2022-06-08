import { PartOfReport } from "../getAutomatePart";
export class ListTests extends PartOfReport{
    name : string = "ListTests"
    tests : string[] = ["Animals","ACT ACT9 ACT18 ACT36","BAI", "BDI-II","BNT", "Booklet","BTest", "CPT3","DCT","MMSE","Grooved", "Hooper","MMPI","FAS",
                        "RAVLTT1 RAVLTT2 RAVLTT3 RAVLTT4 RAVLTT5 RAVLTT1to5 RAVLTTB RAVLTShortDelay RAVLTLongDelay RAVLTRec", "ROCFIR ROCFDR ROCFRec ROCFCopy", "RFFTSD RFFTER",
                        "SCT", "StroopColor StroopWords StroopColorWords","TONI4","TOMM", "TrialsA TrialsB", "WAIS", "WMS4", "WMS4LM1 WMS4LM2 WMS4LMRec",
                        "WMS4VR1 WMS4VR2 WMS4VRRec", "WCST"]

    arraySkip: number[]= [2]
    text : string[] = [ "Animal Naming Test",
    "Auditory Consonant Trigrams (ACT)",
    "Beck Anxiety Inventory (BAI)",
    "Beck Depression Inventory – Second Edition (BDI-II)",
    "Boston Naming Test (BNT)",
    "Booklet Category Test",
    "B-Test",
    "Conners Continuous Performance Test-3rd Edition (Conners CPT-3)",
    "Dot Counting Test",
    "Folstein Mini-Mental Status Exam [MMSE]",
    "Grooved Pegboard",
    "Hooper Visual Organization Test",
    "Minnesota Multiphasic Personality Inventory-2 (MMPI-2)",
    "Phonemic Fluency (FAS)",
    "Rey Auditory Verbal Learning Test (RAVLT)",
    "Rey-Osterrieth Complex Figure [copy, 3’ immediate recall, 30’ delayed recall, and recognition]",
    "Ruff Figural Fluency Test",
    "Short Category Test",
    "Stroop Color Word Test (Golden Version)",
    "Test of Nonverbal Intelligence (TONI-4)",
    "Test of Memory Malingering (TOMM)",
    "Trail Making Test [Parts A & B]",
    "Wechsler Adult Intelligence Scale-IV (WAIS-IV)",
    "Wechsler Memory Scale-Fourth Edition (WMS-IV)",
    "	Logical Memory I, II, and recognition",
    "	Visual Reproduction I, II, and recognition",
    "Wisconsin Card Sorting Test (WCST)"]
    textID: string="-"

    public Constructor(): Promise<void> {
        return;
    }

    protected getNameInRes(name:string, results:any[]){
        for(const i of results){
            if(i.name.indexOf(name)){
                return true
            }
        }
        return false
    }

    public getFilledText(name: string, gender: boolean, results: any[]): string {
        let str = "NEUROPSYCHOLOGICAL MEASURES ADMINISTERED: (see Appendix A)"
        let i=0
        for(const test of this.tests){
            const testsArr = test.split(" ")
            let isInResults = false
            for(const sub of testsArr){
                if(this.getNameInRes(sub,results)){
                    isInResults = true
                    break
                }
            }
            if(isInResults){
                str+="\n"+this.text[i]
            }
            i++
        }
        return str
    }
}
