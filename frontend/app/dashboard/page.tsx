import { DashboardUtils } from "@/components/dashboard-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategories } from "@/hooks";

export default async function DashboardPage() {
  const categories = (await getCategories()).data['categories'];
  return (
    <ScrollArea className="h-[calc(100dvh-52px)]">  
        <section className="container grid items-center gap-6 pb-6 pt-12">
          <div className="flex max-w-[980px] flex-col items-start gap-2 mx-auto">
            <h1 className="text-xl font-semibold text-purple text-center">
              Dashboard
            </h1>
          </div>
        </section>
        <hr className="max-w-x" /> 
        <DashboardUtils categories={categories}/>
    </ScrollArea>


  )
}