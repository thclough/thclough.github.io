import { LanguageModelV1, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { generateText, generateObject } from "ai";
import { getCvText, getHtmlContent } from "@/lib/utils/api-utils";
import { links } from "@/lib/clientData";
import { z } from "zod";
import { NextResponse } from "next/server";
import { HtmlContext } from "next/dist/shared/lib/html-context";

var sectionNames = links.map((link) => link.name) as string[];
sectionNames = [...sectionNames, "null"];

const sectionSourceSchema = z.object({
  mainSectionWhereInfoComesFrom: z
    .enum(sectionNames as [string, ...string[]])
    .optional()
    .describe(
      "Main section where information comes from in the website (if there is one)"
    ),
});

function createSystemAddition({
  cvText,
  htmlContent,
}: {
  cvText: string;
  htmlContent: string;
}) {
  let cvPart: string;
  let htmlPart: string;

  if (cvText) {
    cvPart = `You have access to Tighe's pdf CV text found below to help answer user queries. The CV text is separate from the website. The tigheclough.com link in the CV is just a link to his website.
    The CV is not the website but a pdf file that can be downloaded on the website. The CV text is NOT found on the website.
    
    START OF CV TEXT
    ${cvText}
    END OF CV TEXT
    `;
  } else {
    cvPart =
      "If there is a question specifically asking about Tighe's CV, respond that have trouble accessing it currently";
  }

  if (htmlContent) {
    htmlPart = `You have access to the tigheclough.com website html to help answer user queries. Your UI is located on this website. 

    START OF ENTIRE WEBSITE HTML
    ${htmlContent}
    END OF ENTIRE WEBSITE HTML
    
    You can use the html to answer questions as the below examples do:
    START OF WEBSITE HTML QUESTION EXAMPLES
    
    User: "Where can I find more details about Tighe's background?"
    Your Response: "Tighe's resume and CV are available for download in the Home section. Links to his linkedin and github are also included in the Home section." 

    User: "Where is Tighe's blog?"
    Your Response: "No blog appears on Tighe Clough's website according to the website html"
    
    END OF WEBSITE HTML QUESTION EXAMPLES
    `;
  } else {
    htmlPart =
      "If there is a question specifically asking about the content on Tighe's website, respond that have trouble accessing the website html currently";
  }

  return cvPart + "\n" + htmlPart;
}

const abortControllers = new Map();
const earlyReqIds = new Map();

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  if (earlyReqIds.has(body.reqId)) {
    // clear the timeout and get rid of the req id
    earlyReqIds.get(body.reqId).saved();

    return NextResponse.json(
      { message: "Message aborted on arrival successfully", abortError: true },
      { status: 500 }
    );
  }

  if (body.action === "start") {
    const {
      messages,
      activeSection,
      reqId,
    }: { messages: UIMessage[]; activeSection: string; reqId: string } = body;

    const controller = new AbortController();
    abortControllers.set(reqId, controller);
    const signal = controller.signal;

    try {
      const cvText = await getCvText();
      const htmlContent = await getHtmlContent();

      const systemString = createSystemAddition({ cvText, htmlContent });

      const result = streamText({
        model: groq("llama-3.1-8b-instant"),
        system: TEMPLATE + "\n" + systemString,
        abortSignal: signal,
        messages,
      });

      return result.toDataStreamResponse();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return NextResponse.json(
            {
              message: "response cancelled, aborted successfully",
              abortError: true,
            },
            { status: 500 }
          );
        }
        // log the error message here
      }
      return NextResponse.json(
        { message: "Something went wrong on the server", abortError: false },
        { status: 500 }
      );
    }
  }

  if (body.action === "abort") {
    const { reqId }: { reqId: string } = body;

    if (abortControllers.has(reqId)) {
      const controller = abortControllers.get(reqId);
      controller.abort();
      abortControllers.delete(reqId);
      return NextResponse.json(
        { message: "aborted successfully" },
        { status: 200 }
      );
      // abort possibly made it before the message
    } else {
      const result = await new Promise((resolve) => {
        // set a grace period for corresponding message-to-cancel to arrive
        const earlyTimer = setTimeout(() => {
          earlyReqIds.delete(reqId);
          resolve(
            NextResponse.json(
              { message: "Early reqId did not match incoming message reqId" },
              { status: 500 }
            )
          );
        }, 5000);

        earlyReqIds.set(reqId, {
          saved: () => {
            clearTimeout(earlyTimer);
            earlyReqIds.delete(reqId);
            resolve(
              NextResponse.json(
                { message: "Early reqId aborted incoming message" },
                { status: 200 }
              )
            );
          },
        });
      });
      // just resolve to a next response
      return result;
    }
  }

  if (body.action === "clearAbort") {
    const { reqId }: { reqId: string } = body;
    try {
      if (abortControllers.has(reqId)) {
        abortControllers.delete(reqId);
      }
      return NextResponse.json(
        { message: "Cleared ReqId or already cleared" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong on the server", abortError: false },
        { status: 500 }
      );
    }
  }
}
