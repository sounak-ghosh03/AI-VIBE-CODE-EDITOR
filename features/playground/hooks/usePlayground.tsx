import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TemplateFolder } from "../lib/path-to-json";
import { getPlaygroundById, SaveUpdatedCode } from "../actions";

interface PlaygroundData {
   id: string;
   title?: string;
   [key: string]: any;
}

interface UsePlaygroundReturn {
   playgroundData: PlaygroundData | null;
   templateData: TemplateFolder | null;
   isLoading: boolean;
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
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string[] | null>(null);

   const loadPlayground = useCallback(async () => {
      if (!id) return;
      try {
         setIsLoading(true);
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
         if (
            templateData.templateJson &&
            Array.isArray(templateData.templateJson)
         ) {
            setTemplateData({
               folderName: "Root",
               items: templateData.templateJson,
            });
         } else {
            setTemplateData(
               templateData.templateJson || {
                  folderName: "Root",
                  items: [],
               },
            );
         }
         toast.success("Template loaded successfully");
      } catch (error) {
         console.error("Error fetching playground data:", error);
         setError(["Failed to fetch playground data"]);
      } finally {
         setIsLoading(false);
      }
   }, [id]);
   const saveTemplateData = useCallback(
      async (data: TemplateFolder) => {
         try {
            await SaveUpdatedCode(id, data);
            toast.success("Template saved successfully");
            setIsLoading(true);
            setError(null);
         } catch (error) {
            console.error("Error saving template data:", error);
            toast.error("Failed to save template data");
            throw error;
         }
      },
      [id],
   );

   useEffect(() => {
      loadPlayground();
   }, [loadPlayground]);

   return {
      playgroundData,
      templateData,
      isLoading,
      error,
      loadPlayground,
      saveTemplateData,
   };
};
