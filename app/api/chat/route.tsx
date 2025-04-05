import { LanguageModel, LanguageModelV1, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { TEMPLATE } from "@/lib/chatData";
import { generateText, generateObject } from "ai";
import { getCvText, getHtmlContent } from "@/lib/utils/api-utils";
import { links } from "@/lib/clientData";
import { z } from "zod";
import { NextResponse } from "next/server";
import { BsDot } from "react-icons/bs";
import { abort } from "process";

const htmlEvidenceSchema = z.object({
  canUseHtml: z.boolean(),
  infoToUse: z.string().optional(),
});

type htmlEvidenceType = z.infer<typeof htmlEvidenceSchema> | null;

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

type sectionSourceType = z.infer<typeof sectionSourceSchema> | null;

const cvEvidenceSchema = z.object({
  canUseCV: z.boolean(),
  infoToUse: z.string().optional(),
});

type cvEvidenceType = z.infer<typeof cvEvidenceSchema> | null;

async function generateHtmlEvidence({
  model,
  messages,
  abortSignal,
}: {
  messages: UIMessage[];
  model: LanguageModelV1;
  abortSignal: AbortSignal;
}) {
  let htmlEvidenceObject: htmlEvidenceType;
  let sectionSourceObject: sectionSourceType;

  const htmlContent = await getHtmlContent();

  try {
    const { object } = await generateObject({
      model,
      abortSignal,
      messages,
      schema: htmlEvidenceSchema,
      system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
      The chatbot UI is found on the website.
      Evaluate whether or not (true or false) you can use information found in Tighe Clough's website html below to answer the most recent user query. 
      
      Answer false if this most recent user query is not about Tighe Clough or his website.

      If true, state the information from the website html (or lack of information in the website html) in terms of how it answers the query. 
      
      entire website html: ${htmlContent}

      END OF HTML

      Here are some examples for you to follow:

      START OF EXAMPLES

      User: "Where can I find more details about Tighe's background?"
      Assistant: { canUseHtml: true, infoToUse: "Tighe's resume and CV are available for download in the Home section. Links to his linkedin and github are also included in the Home section." }

      User: "Where is Tighe's blog?"
      Assistant: { canUseHtml: true, infoToUse: "No blog appears on Tighe Clough's website according to the website html" }

      END OF EXAMPLES

      Your answer:
      `,
    });
    htmlEvidenceObject = object;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw error;
      }
    }
    htmlEvidenceObject = null;
  }

  if (
    htmlEvidenceObject &&
    htmlEvidenceObject.canUseHtml &&
    typeof htmlEvidenceObject.infoToUse === "string" &&
    htmlEvidenceObject.infoToUse.length > 0
  ) {
    try {
      const { object } = await generateObject({
        model,
        abortSignal,
        messages,
        schema: sectionSourceSchema,
        system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
      The chatbot UI is found on the website.

      Below is the Tighe Clough website html and information based on the html that can be used to answer the visitor's most recent query.

      If the information to answer the query mostly comes from one and only one specific html section with section tag, state the html section in mainInfoSection (do not answer if part of website is not an html section with section tag)
      If the html information cannot be mainly attributed to one section, do not provide an answer for mainInfoSection.

      You can only answer with ONE section if you decide to attribute the information to a section.

      You must answer with one of ${sectionNames}. Choose null if the main sections do not apply.

      website html: ${htmlContent}
      
      information based on html to answer query: ${htmlEvidenceObject.infoToUse}`,
      });
      sectionSourceObject = object;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw error;
        }
      }
      sectionSourceObject = null;
    }
  } else {
    sectionSourceObject = null;
  }

  return { htmlEvidenceObject, sectionSourceObject };
}

async function generateCvEvidence({
  model,
  messages,
  abortSignal,
}: {
  messages: UIMessage[];
  model: LanguageModelV1;
  abortSignal: AbortSignal;
}) {
  let cvEvidenceObject: cvEvidenceType;

  try {
    const cvText = await getCvText();

    const { object } = await generateObject({
      model,
      abortSignal,
      messages,
      schema: cvEvidenceSchema,
      system: `You are the digital version of Tighe Clough named /taɪɡ/ on Tighe Clough's website answering visitor questions as a chatbot. 
    The chatbot UI is found on the website. Tighe Clough's CV is available for download on the website but not directly viewable.
    Evaluate whether or not material from Tighe Clough's pdf CV text found below can be used to answer the most recent user query.

    If you can use information from the below CV to answer the question WITHOUT INFERRING, state the information in infoToUse.
    Do not provided information if it is not valuable or you are unsure.
    
    The CV text is separate from the website. The tigheclough.com link in the CV is just a link to his website.
    The CV is not a website but a pdf file.

    START OF PDF CV TO EVALUATE: 
    ${cvText}
    END OF PDF CV TO EVALUATE`,
    });

    cvEvidenceObject = object;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw error;
      }
    }
    cvEvidenceObject = null;
  }

  return cvEvidenceObject;
}

function createSystemAddition({
  cvEvidenceObject,
  htmlEvidenceObject,
  sectionSourceObject,
}: {
  cvEvidenceObject: cvEvidenceType;
  htmlEvidenceObject: htmlEvidenceType;
  sectionSourceObject: sectionSourceType;
}): string {
  let systemAddition: string;
  let cvPart: string;
  let htmlPart: string;

  if (cvEvidenceObject) {
    if (cvEvidenceObject.canUseCV && cvEvidenceObject.infoToUse) {
      cvPart = `The following information gained from looking at Tighe's pdf CV can help you answer the most recent query:
      START OF CV INFORMATION
      ${cvEvidenceObject.infoToUse}
      END OF CV INFORMATION`;
    } else {
      cvPart =
        "You have access to information from Tighe's CV, but no information from the CV can be used to answer the most recent visitor query";
    }
  } else {
    cvPart =
      "If there is a question specifically asking about Tighe's CV, respond that have trouble accessing it currently";
  }

  if (htmlEvidenceObject) {
    if (htmlEvidenceObject.canUseHtml && htmlEvidenceObject.infoToUse) {
      htmlPart = `The following information gained from looking at Tighe's website html can help you answer the most recent query:
      START OF WEBSITE HTML INFORMATION
      ${htmlEvidenceObject.infoToUse}
      END OF WEBSITE HTML INFORMATION`;
    } else {
      htmlPart =
        "You have access to html information from Tighe's website, but no information from the website html can be used to answer the most recent visitor query";
    }
  } else {
    htmlPart =
      "If there is a question specifically asking about the content on Tighe's website, respond that have trouble accessing the website html currently";
  }

  // if (sectionSourceObject && sectionSourceObject.mainSectionWhereInfoComesFrom !== "null") {
  //     sourcePart = `You can tell the user that this html website information mainly comes from the ${sectionSourceObject.mainSectionWhereInfoComesFrom} section of the website if helpful.`
  // } else {
  //   sourcePart = ''
  // }

  systemAddition = cvPart + "\n" + htmlPart;

  return systemAddition;
}

function createErrorStream(errorMessage: string, status = 500) {
  const encoder = new TextEncoder(); // For encoding strings to bytes
  return new Response(
    new ReadableStream({
      start(controller) {
        const message = JSON.stringify({ error: errorMessage });
        const data = `data: ${message}\n\n`;
        controller.enqueue(encoder.encode(data)); // Encode to Uint8Array
        controller.close();
      },
    }),
    {
      headers: { "Content-Type": "text/event-stream" },
      status,
    }
  );
}

const abortControllers = new Map();
const earlyReqIds = new Map();

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  console.log("Receiving body", body);
  console.log("current map", abortControllers);

  if (earlyReqIds.has(body.reqId)) {
    earlyReqIds.get(body.reqId).saved();
    return createErrorStream("Aborted on arrival");
    // return NextResponse.json({ status: 500, message: "aborted on arrival" });
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

    // setTimeout(() => controller.abort(), 1000);
    req.signal?.addEventListener("abort", () => {
      console.log("aborting");
      controller.abort();
    });

    // if you can't get either one, insert something in template

    try {
      const initialModel = groq("llama-3.1-8b-instant");

      const [cvEvidenceObject, htmlEvidence] = await Promise.all([
        generateCvEvidence({
          model: initialModel,
          messages,
          abortSignal: signal,
        }),
        generateHtmlEvidence({
          model: initialModel,
          messages,
          abortSignal: signal,
        }),
      ]);

      const { htmlEvidenceObject, sectionSourceObject } = htmlEvidence;

      console.log(cvEvidenceObject);
      console.log(htmlEvidenceObject);

      const systemString = createSystemAddition({
        cvEvidenceObject,
        htmlEvidenceObject,
        sectionSourceObject,
      });

      console.log(systemString);

      const result = streamText({
        model: initialModel,
        system: TEMPLATE + "\n" + systemString,
        abortSignal: signal,
        messages,
      });

      return result.toDataStreamResponse();
    } catch (error) {
      return createErrorStream("Something went wrong on the server");
      // if (error instanceof Error) {
      //   if (error.name === "AbortError") {
      //     return NextResponse.json({
      //       error: "Aborted the server stuff",
      //     });
      //   }
      // }
      // console.log("Fatal error on this", error);
      // return NextResponse.json({
      //   error,
      // });
    }
  }

  if (body.action === "abort") {
    const { reqId }: { reqId: string } = body;

    if (abortControllers.has(reqId)) {
      const controller = abortControllers.get(reqId);
      controller.abort();
      abortControllers.delete(reqId);
      console.log("sending abort response");
      return NextResponse.json({
        coolcat: 200,
        message: "aborted successfully",
      });
      // abort possibly made it before the message
    } else {
      const result = await new Promise((resolve) => {
        // set a grace period for corresponding message to cancel to arrive
        const earlyTimer = setTimeout(() => {
          earlyReqIds.delete(reqId);
          resolve({
            status: 500,
            message: "Early reqId did not match incoming message reqId",
          });
        }, 10000);

        earlyReqIds.set(reqId, {
          saved: () => {
            clearTimeout(earlyTimer);
            earlyReqIds.delete(reqId);
            resolve({
              status: 200,
              message: "Early reqId aborted incoming message",
            });
          },
        });
      });

      return NextResponse.json(result);
    }
  }
}
