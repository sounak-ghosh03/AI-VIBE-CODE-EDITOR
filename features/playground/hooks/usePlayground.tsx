import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TemplateFolder } from "../lib/path-to-json";
import { getPlaygroundById } from "../actions";

interface PlaygroundData {
   id: string;
   name?: string;
   [key: string]: any;
}

interface UsePlaygroundReturn {
   playgroundData: PlaygroundData | null;
   templateData: TemplateFolder | null;
   isloading: boolean;
   error: string[] | null;
   loadPlayground: () => Promise<void>;
   saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
   const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(
      null,
   );
   const [templateData, setTemplateData] = useState<TemplateFolder | null>(
      null,
   );
   const [isloading, setIsloading] = useState<boolean>(false);
   const [error, setError] = useState<string[] | null>(null);

   const loadPlayground = useCallback(async () => {
      if (!id) return;
      try {
         setIsloading(true);
         setError(null);

         const data = await getPlaygroundById(id);
         //  @ts-ignore
         setPlaygroundData(data);
         const rawContent = data?.templateFiles?.[0]?.content;

         if (typeof rawContent === "string") {
            const parsedContent = JSON.parse(rawContent);
            setTemplateData(parsedContent);
            toast.success("Template loaded successfully");
            return;
         }
         // load template dataform api if not present in saved content
         const res = await fetch(`/api/template/${id}`);
         if (!res.ok)
            throw new Error(`Failed to fetch template data: ${res.statusText}`);

         const templateData = await res.json();
          if (templateData.templateJson && Array.isArray(templateData.templateJson)) {
        setTemplateData({
          folderName: "Root",
          items: templateData.templateJson,
        });
      } else {
        setTemplateData(templateData.templateJson || {
          folderName: "Root",
          items: [],
        });
      }
      toast.success("Template loaded successfully");
      } catch (error) {
         console.error("Error fetching playground data:", error);
         setError(["Failed to fetch playground data"]);

      } finally {
         setIsloading(false);
      }

   }, [id]);
   const saveTemplateData = useCallback(async (data: TemplateFolder) => {
      
      try {
        await SaveUpdatedCode(id, data);
        toast.success("Template saved successfully");
         setIsloading(true);
         setError(null);
   }, [id])
   
};
