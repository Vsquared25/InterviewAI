import mammoth from "mammoth";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export async function extractResumeText(file: File) {
  if (file.name.toLowerCase().endsWith(".pdf")) {
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocument({ data }).promise;

    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, pageIndex) => {
        const page = await pdf.getPage(pageIndex + 1);
        const content = await page.getTextContent();

        return content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
      }),
    );

    return pages.join("\n\n").trim();
  }

  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });

  return result.value.trim();
}